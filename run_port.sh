#!/usr/bin/env bash
# ==============================================================================
# eCare24 이러닝 플랫폼 - 포트 관리 및 컴파일 통합 스크립트 (run_port.sh)
#
# [사용법]
#   ./run_port.sh [명령어] [대상]
#   ./compile.sh  [대상]             (컴파일 단축 실행)
#
# [주요 명령어]
#   • start (또는 prod) [all|30010|30011|30012] : 운영 모드 기동 (기본값)
#   • dev               [all|30010|30011|30012] : 개발 모드(HMR) 기동
#   • build (또는 compile) [all|30010|30011|30012] : 컴파일 / 빌드
#   • stop              [all|30010|30011|30012] : 서비스 종료
#   • restart           [all|30010|30011|30012] : 재시작
#   • status                                    : 포트 가동 상태 점검
#
# [간편 축약 실행 예시]
#   • ./run_port.sh all             -> 전체 서비스 운영 모드 기동
#   • ./run_port.sh 30010           -> 30010 단일 운영 모드 기동
#   • ./compile.sh all              -> 전체 서비스 일괄 컴파일
#   • ./run_port.sh stop all        -> 전체 서비스 일괄 중지
#   • ./run_port.sh status          -> 현재 포트 및 PID 점검
# ==============================================================================

set -uo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${PROJECT_DIR}/logs"
TODAY=$(date +"%Y%m%d")
mkdir -p "$LOG_DIR"

# 터미널 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# 하위 워크스페이스 .bin 심볼릭 링크 자동 점검 및 복원 (vite/nest: not found 영구 방지)
ensure_bin_links() {
  local root_bin="${PROJECT_DIR}/node_modules/.bin"
  if [ -d "$root_bin" ]; then
    for sub in frontend_user frontend_admin mobileApp backend; do
      if [ -d "${PROJECT_DIR}/${sub}" ]; then
        mkdir -p "${PROJECT_DIR}/${sub}/node_modules"
        if [ ! -e "${PROJECT_DIR}/${sub}/node_modules/.bin" ]; then
          ln -s "../../node_modules/.bin" "${PROJECT_DIR}/${sub}/node_modules/.bin" 2>/dev/null || true
        fi
      fi
    done
  fi
}
ensure_bin_links

# 포트 활성 여부 점검 (도커 최소 환경 호환 3중 안전망)
is_port_in_use() {
  local port=$1
  if command -v python3 >/dev/null 2>&1; then
    if python3 -c "import socket; s=socket.socket(); s.settimeout(0.3); exit(0 if s.connect_ex(('127.0.0.1', ${port}))==0 else 1)" 2>/dev/null; then
      return 0
    fi
  fi
  if command -v timeout >/dev/null 2>&1; then
    if timeout 0.3 bash -c "(: > /dev/tcp/127.0.0.1/${port}) >/dev/null 2>&1" 2>/dev/null; then
      return 0
    fi
  fi
  return 1
}

# 포트 점유 PID 획득 (pgrep 우선 -> timeout fuser 보조)
get_port_pids() {
  local port=$1
  local pids=""

  case "$port" in
    30010) pids=$(pgrep -f "(next.*30010|next-server.*14|frontend_user)" 2>/dev/null || true) ;;
    30011) pids=$(pgrep -f "(vite.*30011|frontend_admin)" 2>/dev/null || true) ;;
    30012) pids=$(pgrep -f "(vite.*30012|mobileApp)" 2>/dev/null || true) ;;
    30014) pids=$(pgrep -f "(dist/main|backend)" 2>/dev/null || true) ;;
  esac

  if [ -z "$pids" ] && command -v timeout >/dev/null 2>&1 && command -v fuser >/dev/null 2>&1; then
    pids=$(timeout 0.5 fuser "${port}/tcp" 2>/dev/null || true)
  fi

  echo "$pids" | tr '\n' ' ' | xargs
}

# 서비스 메타데이터 조회: 이름, 워크스페이스명, 빌드산출물 파일
get_service_meta() {
  local port=$1
  case "$port" in
    30010) echo "frontend_user:수강생 포털 (Next.js):.next/BUILD_ID" ;;
    30011) echo "frontend_admin:관리자/CS 포털 (Vite):dist/index.html" ;;
    30012) echo "mobileApp:모바일 시뮬레이터 (Vite):dist/index.html" ;;
    30014) echo "backend:엔터프라이즈 REST API (NestJS):dist/main.js" ;;
    *)     echo "unknown:알 수 없음:" ;;
  esac
}

# ------------------------------------------------------------------------------
# 1. 컴파일 (Build / Compile)
# ------------------------------------------------------------------------------
# 빌드 도구(tsc, vite, next, nest) 누락 시 devDependencies 포함 재설치
# (NODE_ENV=production 환경에서 npm install 시 devDependencies가 생략되어 'tsc: not found' 발생 방지)
ensure_build_deps() {
  local root="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  if [ ! -e "$root/node_modules/typescript/bin/tsc" ] || [ ! -e "$root/node_modules/vite/bin/vite.js" ] || [ ! -e "$root/node_modules/.bin/nest" ]; then
    echo -e "${YELLOW}⚠ 빌드 도구(typescript/vite/nest) 누락 감지 → devDependencies 포함 설치 진행...${NC}"
    (cd "$root" && NODE_ENV=development npm install --include=dev) || return 1
  fi
}

build_service() {
  local port=$1
  local meta
  meta=$(get_service_meta "$port")
  local ws_name=$(echo "$meta" | cut -d: -f1)
  local title=$(echo "$meta" | cut -d: -f2)

  ensure_build_deps || { echo -e "   ${RED}✗ 의존성 설치 실패${NC}"; return 1; }
  echo -e "🔨 [:${port}] ${BOLD}${title}${NC} 컴파일 시작..."
  if npm run build --workspace="${ws_name}"; then
    echo -e "   ${GREEN}✓ [:${port}] 컴파일 완료${NC}\n"
    return 0
  else
    echo -e "   ${RED}✗ [:${port}] 컴파일 실패!${NC}\n"
    return 1
  fi
}

cmd_build() {
  local target=${1:-all}
  echo -e "${CYAN}=================================================================${NC}"
  echo -e "${CYAN} 📦 eCare24 컴파일 매니저 (대상: ${target})${NC}"
  echo -e "${CYAN}=================================================================${NC}"

  case "$target" in
    30010|user)    build_service 30010 ;;
    30011|admin)   build_service 30011 ;;
    30012|mobile)  build_service 30012 ;;
    30014|api|backend) build_service 30014 ;;
    all)
      build_service 30010
      build_service 30011
      build_service 30012
      build_service 30014
      echo -e "${GREEN}${BOLD}🎉 모든 서비스 컴파일 완료!${NC}"
      ;;
    *)
      echo -e "${RED}잘못된 대상입니다: ${target} (사용 가능: all, 30010, 30011, 30012, 30014)${NC}"
      exit 1
      ;;
  esac
}

# ------------------------------------------------------------------------------
# 2. 프로세스 종료 (Stop)
# ------------------------------------------------------------------------------
stop_service() {
  local port=$1
  local meta
  meta=$(get_service_meta "$port")
  local title=$(echo "$meta" | cut -d: -f2)
  local pids
  pids=$(get_port_pids "$port")

  echo -n -e "🛑 [:${port}] ${title} 중지 중... "
  if [ -n "$pids" ]; then
    kill -15 $pids 2>/dev/null || true
    sleep 1
    local remain_pids
    remain_pids=$(get_port_pids "$port")
    if [ -n "$remain_pids" ]; then
      kill -9 $remain_pids 2>/dev/null || true
    fi
    echo -e "${YELLOW}종료 완료 (PID: ${pids})${NC}"
  else
    echo -e "${NC}실행 중인 프로세스 없음${NC}"
  fi
}

cmd_stop() {
  local target=${1:-all}
  case "$target" in
    30010|user)    stop_service 30010 ;;
    30011|admin)   stop_service 30011 ;;
    30012|mobile)  stop_service 30012 ;;
    30014|api|backend) stop_service 30014 ;;
    all)
      stop_service 30010
      stop_service 30011
      stop_service 30012
      stop_service 30014
      ;;
    *)
      echo -e "${RED}잘못된 대상입니다: ${target}${NC}"
      exit 1
      ;;
  esac
}

# ------------------------------------------------------------------------------
# 3. 서비스 기동 (Start / Prod / Dev)
# ------------------------------------------------------------------------------
start_service() {
  local port=$1
  local mode=$2 # prod | dev
  local meta
  meta=$(get_service_meta "$port")
  local ws_name=$(echo "$meta" | cut -d: -f1)
  local title=$(echo "$meta" | cut -d: -f2)
  local build_file=$(echo "$meta" | cut -d: -f3)
  local log_file="${LOG_DIR}/ecare24_${ws_name}_${TODAY}.log"

  # 운영 모드인데 빌드 산출물이 없으면 자동 컴파일 선행
  if [ "$mode" = "prod" ] && [ -n "$build_file" ] && [ ! -f "${PROJECT_DIR}/${ws_name}/${build_file}" ]; then
    echo -e "⚠️ [:${port}] 빌드 산출물이 없어 사전 컴파일을 자동 실행합니다..."
    build_service "$port" || return 1
  fi

  # 기존 점유 프로세스 정리
  stop_service "$port" >/dev/null 2>&1

  echo -e "🚀 [:${port}] ${BOLD}${title}${NC} 기동 중 (${mode} 모드)..."
  cd "${PROJECT_DIR}/${ws_name}"

  if [ "$mode" = "prod" ]; then
    nohup env NODE_ENV=production HOSTNAME="0.0.0.0" PORT="$port" npm run start > "$log_file" 2>&1 &
  else
    if [ "$port" = "30014" ]; then
      nohup env NODE_ENV=development PORT="$port" npm run start:dev > "$log_file" 2>&1 &
    else
      nohup env NODE_ENV=development HOSTNAME="0.0.0.0" PORT="$port" npm run dev > "$log_file" 2>&1 &
    fi
  fi

  cd "${PROJECT_DIR}"
  echo -e "   로그: ${log_file}"

  # 포트 바인딩 확인 (최대 5초 대기)
  for i in {1..5}; do
    if is_port_in_use "$port"; then
      echo -e "   ${GREEN}✓ [:${port}] ONLINE 기동 성공 (PID: $(get_port_pids "$port"))${NC}\n"
      return 0
    fi
    sleep 1
  done

  echo -e "   ${YELLOW}⏳ [:${port}] 초기화 진행 중 (상태 확인: ./run_port.sh status)${NC}\n"
}

cmd_start() {
  local mode=$1
  local target=${2:-all}

  echo -e "${CYAN}=================================================================${NC}"
  echo -e "${CYAN} 🏥 eCare24 서비스 기동 매니저 (모드: ${mode}, 대상: ${target})${NC}"
  echo -e "${CYAN}=================================================================${NC}"

  case "$target" in
    30010|user)    start_service 30010 "$mode" ;;
    30011|admin)   start_service 30011 "$mode" ;;
    30012|mobile)  start_service 30012 "$mode" ;;
    30014|api|backend) start_service 30014 "$mode" ;;
    all)
      start_service 30014 "$mode" # 백엔드 우선 기동
      start_service 30010 "$mode"
      start_service 30011 "$mode"
      start_service 30012 "$mode"
      ;;
    *)
      echo -e "${RED}잘못된 대상입니다: ${target}${NC}"
      exit 1
      ;;
  esac
}

# ------------------------------------------------------------------------------
# 4. 상태 점검 (Status)
# ------------------------------------------------------------------------------
cmd_status() {
  echo -e "${CYAN}=================================================================${NC}"
  echo -e "${CYAN} 🏥 eCare24 통합 서비스 상태 점검 (status)${NC}"
  echo -e "${CYAN}=================================================================${NC}"

  for port in 30014 30010 30011 30012; do
    local meta
    meta=$(get_service_meta "$port")
    local title=$(echo "$meta" | cut -d: -f2)
    local pids
    pids=$(get_port_pids "$port")

    if is_port_in_use "$port" || [ -n "$pids" ]; then
      echo -e "  • [:${port}] ${BOLD}${title}${NC} : ${GREEN}ONLINE${NC} (PID: ${pids:-확인중}) ✓"
    else
      echo -e "  • [:${port}] ${BOLD}${title}${NC} : ${RED}STOPPED${NC}"
    fi
  done

  echo -e "\n🌐 접속 URL:"
  echo -e "   - 백엔드 REST API : http://0.0.0.0:30014/api/v1 (문서: /api/docs)"
  echo -e "   - 수강생 포털     : http://0.0.0.0:30010"
  echo -e "   - 관리자 포털     : http://0.0.0.0:30011"
  echo -e "   - 모바일 포털     : http://0.0.0.0:30012"
  echo -e "${CYAN}=================================================================${NC}"
}

# ------------------------------------------------------------------------------
# 메인 CLI 라우팅
# ------------------------------------------------------------------------------
MAIN_ARG="${1:-}"
SCRIPT_BASE=$(basename "$0")

# compile.sh로 직접 호출된 경우 compile 모드로 자동 라우팅
if [ "$SCRIPT_BASE" = "compile.sh" ]; then
  cmd_build "${MAIN_ARG:-all}"
  exit $?
fi

case "$MAIN_ARG" in
  build|compile)
    cmd_build "${2:-all}"
    ;;
  start|prod)
    cmd_start "prod" "${2:-all}"
    ;;
  dev)
    cmd_start "dev" "${2:-all}"
    ;;
  stop)
    cmd_stop "${2:-all}"
    ;;
  restart)
    cmd_stop "${2:-all}"
    sleep 1
    cmd_start "prod" "${2:-all}"
    ;;
  status)
    cmd_status
    ;;
  30010|30011|30012|30014|all)
    # 인자로 포트나 all만 넘긴 경우 운영 모드 start 기본 실행
    cmd_start "prod" "$MAIN_ARG"
    ;;
  "")
    cmd_status
    echo -e "\n💡 ${BOLD}간편 사용 가이드:${NC}"
    echo -e "   • ./run_port.sh all              (운영 모드 전체 기동)"
    echo -e "   • ./run_port.sh dev all          (개발 모드 전체 기동)"
    echo -e "   • ./run_port.sh compile all      (전체 컴파일 / 빌드, 또는 ./compile.sh all)"
    echo -e "   • ./run_port.sh stop all         (전체 프로세스 종료)"
    echo -e "   • ./run_port.sh restart all      (전체 재시작)"
    echo -e "   • ./run_port.sh status           (가동 상태 점검)"
    echo -e "   ※ 대상 자리에 30010, 30011, 30012, 30014를 지정하여 개별 제어 가능\n"
    ;;
  *)
    echo -e "${RED}알 수 없는 명령어: ${MAIN_ARG}${NC}"
    echo -e "사용법: ./run_port.sh [start|dev|build|stop|restart|status] [all|30010|30011|30012|30014]"
    exit 1
    ;;
esac
