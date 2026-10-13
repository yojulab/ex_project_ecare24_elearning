#!/usr/bin/env bash

# ==============================================================================
# eCare24 이러닝 플랫폼 - 운영/개발 포트별 개별 및 일괄 제어 매니저 (run_port.sh)
#
# 지원 모드:
#   1. [운영 모드 - 기본값] Production Start (NODE_ENV=production)
#      - 빌드 산출물(.next, dist) 부재 시 자동 사전 컴파일(Build) 수행
#      - Next.js : next start -p 30010 -H 0.0.0.0 (사전 번들 SSR/Static 고속 서빙)
#      - Vite    : vite preview --port 3001X --host 0.0.0.0 (최적화 정적 번들 서빙)
#      - 메모리 최적화, HMR 부하 제거, 엔터프라이즈 운영 안정성 보장
#
#   2. [개발 모드] Development Dev (NODE_ENV=development)
#      - 'dev' 키워드 또는 --dev 옵션 지정 시 실행
#      - npm run dev 실시간 소스코드 HMR 핫 리로딩 지원
#
#   3. [컴파일 모드] Build / Compile (npm run build)
#      - 'compile.sh' 호출 또는 'compile'/'build' 키워드 시 전체/개별 빌드 검증
#
# 대상 서비스 매핑:
#   - [30010] frontend_user  : 수강생 웹 포털 (Next.js 14)
#   - [30011] frontend_admin : 관리자 & 콜센터 CS 포털 (Vite + React)
#   - [30012] mobileApp      : 모바일 웹 시뮬레이터 (Vite + React)
#
# 사용 예시:
#   • ./run_port.sh all              (운영 모드 3개 포트 일괄 백그라운드 기동)
#   • ./run_port.sh 30010            (30010 운영 모드 실시간 콘솔 기동)
#   • ./run_port.sh 30010 -d         (30010 운영 모드 백그라운드 데몬 기동)
#   • ./run_port.sh dev all          (개발 모드 3개 포트 일괄 기동)
#   • ./compile.sh all               (전체 3개 서비스 일괄 컴파일 / 빌드)
#   • ./run_port.sh stop all         (전체 프로세스 안전 종료)
#   • ./run_port.sh status           (포트 점유 상태 및 헬스체크)
# ==============================================================================

set -uo pipefail

# 프로젝트 루트 경로 산출
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${PROJECT_DIR}/logs"
TODAY=$(date +"%Y%m%d")
mkdir -p "$LOG_DIR"

# 모노레포 하위 워크스페이스 .bin 심볼릭 링크 자동 점검 및 복원 안전망
ensure_workspace_bin_links() {
  local root_bin="${PROJECT_DIR}/node_modules/.bin"
  if [ -d "$root_bin" ]; then
    for sub in frontend_user frontend_admin mobileApp; do
      local sub_dir="${PROJECT_DIR}/${sub}"
      if [ -d "$sub_dir" ]; then
        mkdir -p "${sub_dir}/node_modules"
        if [ ! -e "${sub_dir}/node_modules/.bin" ]; then
          ln -s "../../node_modules/.bin" "${sub_dir}/node_modules/.bin" 2>/dev/null || true
        fi
      fi
    done
  fi
}
ensure_workspace_bin_links

# 기본 호스트 및 포트 설정 (0.0.0.0 바인딩 우선)
if [ -n "${HOST:-}" ]; then
  DEFAULT_HOST="$HOST"
elif [ -n "${BIND_HOST:-}" ]; then
  DEFAULT_HOST="$BIND_HOST"
elif [ -n "${HOSTNAME:-}" ] && [ "${HOSTNAME:-}" != "$(hostname 2>/dev/null)" ] && [ "${HOSTNAME:-}" != "$(uname -n 2>/dev/null)" ]; then
  DEFAULT_HOST="$HOSTNAME"
else
  DEFAULT_HOST="0.0.0.0"
fi
PORT_USER="${PORT_USER:-30010}"
PORT_ADMIN="${PORT_ADMIN:-30011}"
PORT_MOBILE="${PORT_MOBILE:-30012}"

# 색상 코드
COLOR_RED='\033[0;31m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_BLUE='\033[0;34m'
COLOR_MAGENTA='\033[0;35m'
COLOR_CYAN='\033[0;36m'
COLOR_BOLD='\033[1m'
COLOR_RESET='\033[0m'

# 헤더 출력
print_header() {
  echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
  echo -e "${COLOR_CYAN} 🏥 eCare24 통합 운영/개발 포트 매니저 (run_port.sh)${COLOR_RESET}"
  echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
}

# 포트 활성 여부 확인 (도커 최소 환경 호환 6중 안전망)
is_port_in_use() {
  local port=$1

  # 1. bash 내장 /dev/tcp 소켓 검사 (외부 패키지 불필요, 100% 호환)
  if (bash -c "(echo > /dev/tcp/127.0.0.1/${port}) >/dev/null 2>&1" 2>/dev/null); then
    return 0
  fi

  # 2. python3 소켓 검사
  if command -v python3 >/dev/null 2>&1; then
    if python3 -c "import socket; s=socket.socket(); s.settimeout(0.3); exit(0 if s.connect_ex(('127.0.0.1', ${port}))==0 else 1)" 2>/dev/null; then
      return 0
    fi
  fi

  # 3. fuser 점검
  if command -v fuser >/dev/null 2>&1; then
    fuser "${port}/tcp" >/dev/null 2>&1 && return 0
  fi

  # 4. lsof 점검
  if command -v lsof >/dev/null 2>&1; then
    lsof -ti ":${port}" >/dev/null 2>&1 && return 0
  fi

  # 5. ss 점검
  if command -v ss >/dev/null 2>&1; then
    ss -tlpn 2>/dev/null | grep -q ":${port} " && return 0
  fi

  # 6. /proc/net/tcp 16진수 포트 점검
  local hex_port
  hex_port=$(printf "%04X" "$port")
  if [ -f /proc/net/tcp ] && grep -qi ":${hex_port} " /proc/net/tcp 2>/dev/null; then
    return 0
  fi

  return 1
}

# 특정 포트 점유 PID 획득 (fuser/lsof 없는 환경에서도 pgrep fallback)
get_port_pids() {
  local port=$1
  local pids=""

  if command -v fuser >/dev/null 2>&1; then
    pids=$(fuser "${port}/tcp" 2>/dev/null || true)
  fi
  if [ -z "$pids" ] && command -v lsof >/dev/null 2>&1; then
    pids=$(lsof -ti ":${port}" 2>/dev/null || true)
  fi
  if [ -z "$pids" ] && command -v ss >/dev/null 2>&1; then
    pids=$(ss -tlpn 2>/dev/null | grep ":${port} " | grep -o 'pid=[0-9]*' | cut -d= -f2 || true)
  fi

  # fallback: 포트 번호 기반 프로세스 조회
  if [ -z "$pids" ]; then
    case "$port" in
      30010)
        pids=$(pgrep -f "(next.*30010|next-server.*14|frontend_user)" 2>/dev/null || true)
        ;;
      30011)
        pids=$(pgrep -f "(vite.*30011|frontend_admin)" 2>/dev/null || true)
        ;;
      30012)
        pids=$(pgrep -f "(vite.*30012|mobileApp)" 2>/dev/null || true)
        ;;
      *)
        pids=$(pgrep -f "${port}" 2>/dev/null || true)
        ;;
    esac
  fi

  echo "$pids" | tr '\n' ' ' | xargs
}

# 특정 포트 프로세스 종료
stop_port() {
  local port=$1
  local name=$2
  local pids
  pids=$(get_port_pids "$port")

  echo -n -e "▶ [:${port}] ${name} 점검: "
  if [ -n "$pids" ]; then
    echo -e "${COLOR_YELLOW}실행 중 (PID: ${pids})${COLOR_RESET}"
    echo -e "   -> 종료 신호(kill -15) 전송..."
    for pid in $pids; do
      kill -15 "$pid" 2>/dev/null || true
    done
    sleep 1

    # 잔존 시 강제 종료
    local remaining=""
    for pid in $pids; do
      if kill -0 "$pid" 2>/dev/null; then
        remaining="${remaining} ${pid}"
      fi
    done
    remaining=$(echo "$remaining" | xargs)

    if [ -n "$remaining" ]; then
      echo -e "   -> ${COLOR_RED}강제 종료(kill -9: ${remaining})${COLOR_RESET}"
      for pid in $remaining; do
        kill -9 "$pid" 2>/dev/null || true
      done
      sleep 1
    fi

    if command -v fuser >/dev/null 2>&1; then
      fuser -k -9 "${port}/tcp" >/dev/null 2>&1 || true
    fi
    echo -e "   -> ${COLOR_GREEN}종료 완료 ✓${COLOR_RESET}"
  else
    if command -v fuser >/dev/null 2>&1; then
      fuser -k -9 "${port}/tcp" >/dev/null 2>&1 || true
    fi
    echo -e "${COLOR_GREEN}미점유 상태 ✓${COLOR_RESET}"
  fi
}

# 포트 및 서비스 매핑 정보 변환
resolve_target() {
  local input=$1
  case "$input" in
    30010|user|frontend_user)
      echo "frontend_user 30010 next 수강생_웹_포털"
      ;;
    30011|admin|frontend_admin)
      echo "frontend_admin 30011 vite 관리자_및_콜센터_CS"
      ;;
    30012|mobile|mobileApp)
      echo "mobileApp 30012 vite 모바일_웹_시뮬레이터"
      ;;
    *)
      if [[ "$input" =~ ^[0-9]+$ ]]; then
        echo "unknown $input unknown 사용자정의_포트"
      else
        echo "invalid"
      fi
      ;;
  esac
}

# 헬스체크 출력
check_health() {
  local port=$1
  local label=$2
  if is_port_in_use "$port"; then
    local pids
    pids=$(get_port_pids "$port")
    echo -e "  • [:${port}] ${label} : ${COLOR_GREEN}ONLINE (PID: ${pids}) ✓${COLOR_RESET}"
  else
    echo -e "  • [:${port}] ${label} : ${COLOR_RED}OFFLINE ✕${COLOR_RESET}"
  fi
}

# 현재 포트 전체 상태 점검
show_status() {
  print_header
  echo -e "${COLOR_BOLD}🔍 eCare24 서비스 포트 가동 현황:${COLOR_RESET}"
  echo ""
  check_health 30010 "frontend_user (수강생 포털, Next.js)"
  check_health 30011 "frontend_admin (관리자/콜센터 CS, Vite)"
  check_health 30012 "mobileApp (모바일 시뮬레이터, Vite)"
  echo ""
  echo -e "🌐 접속 정보:"
  echo -e "   - 수강생 포털 : http://${DEFAULT_HOST}:30010"
  echo -e "   - 관리자 포털 : http://${DEFAULT_HOST}:30011"
  echo -e "   - 모바일 포털 : http://${DEFAULT_HOST}:30012"
  echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
}

# 운영 기동 전 빌드 산출물 사전 검증 및 자동 빌드
ensure_built() {
  local target_key=$1

  if [ "$target_key" = "all" ]; then
    local need_build=false
    if [ ! -f "${PROJECT_DIR}/frontend_user/.next/BUILD_ID" ]; then need_build=true; fi
    if [ ! -d "${PROJECT_DIR}/frontend_admin/dist" ] || [ ! -f "${PROJECT_DIR}/frontend_admin/dist/index.html" ]; then need_build=true; fi
    if [ ! -d "${PROJECT_DIR}/mobileApp/dist" ] || [ ! -f "${PROJECT_DIR}/mobileApp/dist/index.html" ]; then need_build=true; fi

    if [ "$need_build" = true ]; then
      echo -e "${COLOR_YELLOW}📦 운영 서빙용 정적 번들/BUILD_ID가 없어 사전 컴파일(Build)을 자동 수행합니다...${COLOR_RESET}"
      run_build all
    fi
  else
    local target_info
    target_info=$(resolve_target "$target_key")
    if [ "$target_info" != "invalid" ]; then
      read -r dir default_port type name <<< "$target_info"
      local is_valid_build=true
      if [ "$type" = "next" ]; then
        if [ ! -f "${PROJECT_DIR}/${dir}/.next/BUILD_ID" ]; then is_valid_build=false; fi
      else
        if [ ! -f "${PROJECT_DIR}/${dir}/dist/index.html" ]; then is_valid_build=false; fi
      fi
      if [ "$is_valid_build" = false ]; then
        echo -e "${COLOR_YELLOW}📦 [${name//_/ }] 운영 빌드 산출물이 없어 사전 컴파일을 자동 수행합니다...${COLOR_RESET}"
        run_build "$target_key"
      fi
    fi
  fi
}

# ==============================================================================
# 1. [운영 모드] 개별 서비스 프로덕션 기동 (NODE_ENV=production, npm run start)
# ==============================================================================
run_prod_single() {
  local target_key=$1
  local daemon_mode=${2:-false}
  local custom_port=${PORT:-}

  local target_info
  target_info=$(resolve_target "$target_key")

  if [ "$target_info" = "invalid" ]; then
    echo -e "${COLOR_RED}❌ 알 수 없는 대상입니다: '${target_key}'${COLOR_RESET}"
    echo "사용 가능한 대상: 30010, 30011, 30012, user, admin, mobile, all"
    exit 1
  fi

  read -r dir default_port type name <<< "$target_info"
  local run_port=${custom_port:-$default_port}
  local run_host="${DEFAULT_HOST}"
  local clean_name="${name//_/ }"

  # 빌드 산출물 확인
  ensure_built "$target_key"

  echo -e "${COLOR_CYAN}-----------------------------------------------------------------${COLOR_RESET}"
  echo -e "🚀 [운영 서버 기동] ${COLOR_BOLD}${clean_name}${COLOR_RESET} (Production Mode)"
  echo -e "   • 디렉터리 : ${PROJECT_DIR}/${dir}"
  echo -e "   • 호스트   : ${run_host}"
  echo -e "   • 포트     : :${run_port}"
  echo -e "   • 환경변수 : NODE_ENV=production"
  echo -e "   • 방식     : $([ "$daemon_mode" = true ] && echo "백그라운드(Daemon)" || echo "포그라운드(Interactive)")"
  echo -e "${COLOR_CYAN}-----------------------------------------------------------------${COLOR_RESET}"

  # 포트 충돌 점검
  if is_port_in_use "$run_port"; then
    echo -e "${COLOR_YELLOW}⚠️  포트 :${run_port} 점유 감지. 기존 프로세스를 종료하고 재시작합니다...${COLOR_RESET}"
    stop_port "$run_port" "$clean_name"
    sleep 1
  fi

  cd "${PROJECT_DIR}/${dir}" || exit 1
  export NODE_ENV=production
  export HOSTNAME="$run_host"
  export PORT="$run_port"

  if [ "$daemon_mode" = true ]; then
    local log_file="${LOG_DIR}/ecare24_${dir}_${TODAY}.log"
    echo -e "▶ 운영 백그라운드 기동 시작... 로그 파일: ${log_file}"

    if [ "$type" = "next" ]; then
      if [ "$run_port" = "30010" ] && [ "$run_host" = "0.0.0.0" ]; then
        nohup npm run start > "$log_file" 2>&1 &
      else
        nohup npx next start -p "$run_port" -H "$run_host" > "$log_file" 2>&1 &
      fi
    else
      if [ "$run_host" = "0.0.0.0" ]; then
        nohup npm run start > "$log_file" 2>&1 &
      else
        nohup npx vite preview --port "$run_port" --host "$run_host" > "$log_file" 2>&1 &
      fi
    fi

    local pid=$!
    echo -e "${COLOR_GREEN}✓ 백그라운드 프로세스 등록 완료 (PID: ${pid})${COLOR_RESET}"

    echo -n "⏳ 포트 바인딩 대기 중"
    for i in {1..8}; do
      if is_port_in_use "$run_port"; then break; fi
      echo -n "."
      sleep 1
    done
    echo ""

    if is_port_in_use "$run_port"; then
      echo -e "${COLOR_GREEN}🎉 서비스가 포트 :${run_port}에 정상 바인딩되었습니다!${COLOR_RESET}"
      echo -e "   접속 주소: ${COLOR_CYAN}http://${run_host}:${run_port}${COLOR_RESET}"
    else
      echo -e "${COLOR_YELLOW}⏳ 서비스 초기화 중입니다. 'tail -n 20 ${log_file}' 로 상태를 확인하세요.${COLOR_RESET}"
    fi
  else
    echo -e "${COLOR_GREEN}▶ 터미널 포그라운드 기동 (종료하려면 Ctrl + C 를 누르세요)...${COLOR_RESET}"
    echo ""
    if [ "$type" = "next" ]; then
      if [ "$run_port" = "30010" ] && [ "$run_host" = "0.0.0.0" ]; then
        exec npm run start
      else
        exec npx next start -p "$run_port" -H "$run_host"
      fi
    else
      if [ "$run_host" = "0.0.0.0" ]; then
        exec npm run start
      else
        exec npx vite preview --port "$run_port" --host "$run_host"
      fi
    fi
  fi
}

# ==============================================================================
# 2. [운영 모드] 모든 포트 일괄 프로덕션 기동 (NODE_ENV=production)
# ==============================================================================
run_prod_all() {
  print_header
  echo -e "${COLOR_BOLD}🚀 모든 포트(30010, 30011, 30012) [운영 모드] 일괄 백그라운드 기동 시작...${COLOR_RESET}"
  echo -e "   (NODE_ENV=production, 사전 번들 고속 서빙 모드)"
  echo ""

  # 빌드 산출물 사전 점검 및 필요시 자동 빌드
  ensure_built all

  # 포트 충돌 여부 점검 및 정리
  for p in 30010 30011 30012; do
    if is_port_in_use "$p"; then
      echo -e "${COLOR_YELLOW}⚠️  기존 포트 :${p} 점유 감지. 안전하게 재할당합니다.${COLOR_RESET}"
      stop_port "$p" "서비스"
    fi
  done
  sleep 1

  local run_host="${DEFAULT_HOST}"
  export HOSTNAME="$run_host"
  export NODE_ENV=production

  # 1) 수강생 포털 (Next.js start)
  local user_log="${LOG_DIR}/ecare24_frontend_user_${TODAY}.log"
  echo -e "▶ [1/3] 수강생 웹 포털 (:30010, Next.js start) 운영 기동..."
  cd "${PROJECT_DIR}/frontend_user"
  nohup env NODE_ENV=production HOSTNAME="$run_host" PORT=30010 npm run start > "$user_log" 2>&1 &
  echo -e "      로그: ${user_log}"

  # 2) 관리자/콜센터 CS (Vite preview)
  local admin_log="${LOG_DIR}/ecare24_frontend_admin_${TODAY}.log"
  echo -e "▶ [2/3] 관리자 & CS 포털 (:30011, Vite preview) 운영 기동..."
  cd "${PROJECT_DIR}/frontend_admin"
  nohup env NODE_ENV=production HOSTNAME="$run_host" PORT=30011 npm run start > "$admin_log" 2>&1 &
  echo -e "      로그: ${admin_log}"

  # 3) 모바일 시뮬레이터 (Vite preview)
  local mobile_log="${LOG_DIR}/ecare24_mobileApp_${TODAY}.log"
  echo -e "▶ [3/3] 모바일 웹 시뮬레이터 (:30012, Vite preview) 운영 기동..."
  cd "${PROJECT_DIR}/mobileApp"
  nohup env NODE_ENV=production HOSTNAME="$run_host" PORT=30012 npm run start > "$mobile_log" 2>&1 &
  echo -e "      로그: ${mobile_log}"

  cd "${PROJECT_DIR}"

  echo ""
  echo -n -e "⏳ 서비스 초기화 및 포트 바인딩 대기 중"
  for i in {1..8}; do
    if is_port_in_use 30010 && is_port_in_use 30011 && is_port_in_use 30012; then
      break
    fi
    echo -n "."
    sleep 1
  done
  echo ""

  echo ""
  echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
  echo -e "${COLOR_GREEN} 🎉 3대 서비스 [운영 모드] 일괄 가동 현황${COLOR_RESET}"
  echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
  check_health 30010 "수강생 포털 (Next.js 14 Production)"
  check_health 30011 "관리자 & CS 포털 (Vite Preview)"
  check_health 30012 "모바일 웹 앱 (Vite Preview)"
  echo ""
  echo -e " 🌐 운영 접속 주소:"
  echo -e "    • 수강생 웹 포털      : ${COLOR_CYAN}http://${run_host}:30010${COLOR_RESET}"
  echo -e "    • 관리자 & 콜센터 CS  : ${COLOR_CYAN}http://${run_host}:30011${COLOR_RESET}"
  echo -e "    • 모바일 웹 시뮬레이터 : ${COLOR_CYAN}http://${run_host}:30012${COLOR_RESET}"
  echo ""
  echo -e " 💡 백그라운드 로그 모니터링: tail -f logs/*.log"
  echo -e " 🛑 서비스 일괄 종료 명령  : ./run_port.sh stop all"
  echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
}

# ==============================================================================
# 3. [개발 모드] 개별/일괄 개발 서버 기동 (NODE_ENV=development, npm run dev)
# ==============================================================================
run_dev_single() {
  local target_key=$1
  local daemon_mode=${2:-false}
  local custom_port=${PORT:-}

  local target_info
  target_info=$(resolve_target "$target_key")

  if [ "$target_info" = "invalid" ]; then
    echo -e "${COLOR_RED}❌ 알 수 없는 대상입니다: '${target_key}'${COLOR_RESET}"
    exit 1
  fi

  read -r dir default_port type name <<< "$target_info"
  local run_port=${custom_port:-$default_port}
  local run_host="${DEFAULT_HOST}"
  local clean_name="${name//_/ }"

  echo -e "${COLOR_CYAN}-----------------------------------------------------------------${COLOR_RESET}"
  echo -e "💻 [개발 모드 기동] ${COLOR_BOLD}${clean_name}${COLOR_RESET} (Development Dev)"
  echo -e "   • 디렉터리 : ${PROJECT_DIR}/${dir}"
  echo -e "   • 포트     : :${run_port}"
  echo -e "${COLOR_CYAN}-----------------------------------------------------------------${COLOR_RESET}"

  if is_port_in_use "$run_port"; then
    stop_port "$run_port" "$clean_name"
    sleep 1
  fi

  cd "${PROJECT_DIR}/${dir}" || exit 1
  export NODE_ENV=development
  export HOSTNAME="$run_host"
  export PORT="$run_port"

  if [ "$daemon_mode" = true ]; then
    local log_file="${LOG_DIR}/ecare24_${dir}_${TODAY}.log"
    nohup npm run dev > "$log_file" 2>&1 &
    local pid=$!
    echo -e "${COLOR_GREEN}✓ 백그라운드 등록 완료 (PID: ${pid})${COLOR_RESET}"
    sleep 2
    check_health "$run_port" "$clean_name"
  else
    exec npm run dev
  fi
}

run_dev_all() {
  print_header
  echo -e "${COLOR_BOLD}💻 모든 포트 [개발 모드(dev)] 일괄 백그라운드 기동 시작...${COLOR_RESET}"
  echo ""

  for p in 30010 30011 30012; do
    if is_port_in_use "$p"; then stop_port "$p" "서비스"; fi
  done
  sleep 1

  local run_host="${DEFAULT_HOST}"
  export HOSTNAME="$run_host"
  export NODE_ENV=development

  cd "${PROJECT_DIR}/frontend_user"
  nohup env HOSTNAME="$run_host" PORT=30010 npm run dev > "${LOG_DIR}/ecare24_frontend_user_${TODAY}.log" 2>&1 &
  cd "${PROJECT_DIR}/frontend_admin"
  nohup env HOSTNAME="$run_host" PORT=30011 npm run dev > "${LOG_DIR}/ecare24_frontend_admin_${TODAY}.log" 2>&1 &
  cd "${PROJECT_DIR}/mobileApp"
  nohup env HOSTNAME="$run_host" PORT=30012 npm run dev > "${LOG_DIR}/ecare24_mobileApp_${TODAY}.log" 2>&1 &
  cd "${PROJECT_DIR}"

  echo -n "⏳ 개발 서버 초기화 대기 중"
  for i in {1..8}; do
    if is_port_in_use 30010 && is_port_in_use 30011 && is_port_in_use 30012; then break; fi
    echo -n "."
    sleep 1
  done
  echo ""
  show_status
}

# ==============================================================================
# 4. [컴파일 모드] 개별 또는 일괄 빌드/컴파일 (build / compile)
# ==============================================================================
run_build() {
  local target_key=$1

  print_header
  echo -e "${COLOR_MAGENTA}📦 [컴파일 / 빌드 모드] 프로덕션 번들 생성 및 타입체크 검증 시작${COLOR_RESET}"
  echo ""

  # 기동 중인 프로세스와의 .next/dist 파일 잠금 충돌 방지
  if is_port_in_use 30010 || is_port_in_use 30011 || is_port_in_use 30012; then
    echo -e "${COLOR_YELLOW}⚠️  빌드 캐시 충돌 방지를 위해 기존 프로세스를 일시 정리합니다.${COLOR_RESET}"
    stop_port 30010 "frontend_user" >/dev/null 2>&1 || true
    stop_port 30011 "frontend_admin" >/dev/null 2>&1 || true
    stop_port 30012 "mobileApp" >/dev/null 2>&1 || true
    sleep 1
  fi

  if [ "$target_key" = "all" ]; then
    echo -e "${COLOR_BOLD}전체 3개 서비스 일괄 컴파일 수행...${COLOR_RESET}"
    echo ""

    local success_count=0
    local fail_count=0

    # 1. frontend_user
    echo -e "▶ [1/3] frontend_user (수강생 포털, Next.js build) 컴파일 중..."
    rm -rf "${PROJECT_DIR}/frontend_user/.next"
    if (cd "${PROJECT_DIR}/frontend_user" && npm run build); then
      echo -e "${COLOR_GREEN}✓ frontend_user 컴파일 성공!${COLOR_RESET}\n"
      ((success_count++))
    else
      echo -e "${COLOR_RED}✕ frontend_user 컴파일 실패!${COLOR_RESET}\n"
      ((fail_count++))
    fi

    # 2. frontend_admin
    echo -e "▶ [2/3] frontend_admin (관리자/CS, Vite build) 컴파일 중..."
    rm -rf "${PROJECT_DIR}/frontend_admin/dist"
    if (cd "${PROJECT_DIR}/frontend_admin" && npm run build); then
      echo -e "${COLOR_GREEN}✓ frontend_admin 컴파일 성공!${COLOR_RESET}\n"
      ((success_count++))
    else
      echo -e "${COLOR_RED}✕ frontend_admin 컴파일 실패!${COLOR_RESET}\n"
      ((fail_count++))
    fi

    # 3. mobileApp
    echo -e "▶ [3/3] mobileApp (모바일 웹, Vite build) 컴파일 중..."
    rm -rf "${PROJECT_DIR}/mobileApp/dist"
    if (cd "${PROJECT_DIR}/mobileApp" && npm run build); then
      echo -e "${COLOR_GREEN}✓ mobileApp 컴파일 성공!${COLOR_RESET}\n"
      ((success_count++))
    else
      echo -e "${COLOR_RED}✕ mobileApp 컴파일 실패!${COLOR_RESET}\n"
      ((fail_count++))
    fi

    echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
    if [ "$fail_count" -eq 0 ]; then
      echo -e "${COLOR_GREEN} 🎉 모든 서비스(${success_count}/3) 컴파일/빌드 검증 완료!${COLOR_RESET}"
    else
      echo -e "${COLOR_RED} ⚠️  컴파일 결과: 성공 ${success_count}건, 실패 ${fail_count}건${COLOR_RESET}"
      exit 1
    fi
    echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
  else
    local target_info
    target_info=$(resolve_target "$target_key")

    if [ "$target_info" = "invalid" ]; then
      echo -e "${COLOR_RED}❌ 컴파일 대상을 알 수 없습니다: '${target_key}'${COLOR_RESET}"
      exit 1
    fi

    read -r dir default_port type name <<< "$target_info"
    local clean_name="${name//_/ }"

    echo -e "▶ [${clean_name}] 디렉터리: ${dir} 컴파일 중..."
    cd "${PROJECT_DIR}/${dir}" || exit 1
    rm -rf .next dist 2>/dev/null || true

    if npm run build; then
      echo ""
      echo -e "${COLOR_GREEN}🎉 [${clean_name}] 컴파일/빌드 성공! ✓${COLOR_RESET}"
    else
      echo ""
      echo -e "${COLOR_RED}❌ [${clean_name}] 컴파일/빌드 실패! ✕${COLOR_RESET}"
      exit 1
    fi
  fi
}

# ==============================================================================
# 5. [서비스 중지] (stop)
# ==============================================================================
run_stop() {
  local target_key=${1:-all}

  print_header
  echo -e "${COLOR_YELLOW}🛑 [프로세스 종료] 포트 해제 작업 시작...${COLOR_RESET}"
  echo ""

  if [ "$target_key" = "all" ]; then
    stop_port 30010 "frontend_user (수강생 포털)"
    stop_port 30011 "frontend_admin (관리자/CS 포털)"
    stop_port 30012 "mobileApp (모바일 시뮬레이터)"
  else
    local target_info
    target_info=$(resolve_target "$target_key")
    if [ "$target_info" = "invalid" ]; then
      if [[ "$target_key" =~ ^[0-9]+$ ]]; then
        stop_port "$target_key" "포트_${target_key}"
      else
        echo -e "${COLOR_RED}❌ 종료할 수 없는 대상입니다: '${target_key}'${COLOR_RESET}"
        exit 1
      fi
    else
      read -r dir default_port type name <<< "$target_info"
      local clean_name="${name//_/ }"
      stop_port "$default_port" "$clean_name"
    fi
  fi
}

# ==============================================================================
# 대화형 메뉴 (Interactive Mode)
# ==============================================================================
run_interactive_menu() {
  print_header
  echo -e "${COLOR_BOLD}원하시는 작업을 번호로 선택하세요:${COLOR_RESET}"
  echo ""
  echo -e " ${COLOR_GREEN}[운영 서버 모드 (Production - 권장)]${COLOR_RESET}"
  echo -e "   1) 🚀 모든 포트 일괄 운영 기동 (30010, 30011, 30012 Production Start)"
  echo -e "   2) 🌐 수강생 웹 포털 운영 기동 (:30010 Next.js start)"
  echo -e "   3) 🌐 관리자 & CS 운영 기동 (:30011 Vite preview)"
  echo -e "   4) 🌐 모바일 웹 시뮬레이터 운영 기동 (:30012 Vite preview)"
  echo ""
  echo -e " ${COLOR_CYAN}[개발 모드 (Development)]${COLOR_RESET}"
  echo -e "   5) 💻 모든 포트 일괄 개발 서버 기동 (Dev All, HMR 지원)"
  echo -e "   6) 💻 수강생 웹 포털 개발 기동 (:30010 dev)"
  echo -e "   7) 💻 관리자 & CS 포털 개발 기동 (:30011 dev)"
  echo -e "   8) 💻 모바일 웹 시뮬레이터 개발 기동 (:30012 dev)"
  echo ""
  echo -e " ${COLOR_MAGENTA}[컴파일 및 빌드 검증]${COLOR_RESET}"
  echo -e "   9) 📦 모든 서비스 일괄 컴파일 / 빌드 (Build All)"
  echo ""
  echo -e " ${COLOR_YELLOW}[관리 및 진단]${COLOR_RESET}"
  echo -e "  10) 🔍 현재 포트 점유 상태 및 헬스체크 (Status)"
  echo -e "  11) 🛑 모든 포트 서비스 일괄 종료 (Stop All)"
  echo -e "   0) 🚪 종료 (Exit)"
  echo ""
  echo -n -e "${COLOR_BOLD}선택 번호 입력 [0-11]: ${COLOR_RESET}"

  read -r choice
  echo ""

  case "$choice" in
    1) run_prod_all ;;
    2) run_prod_single 30010 false ;;
    3) run_prod_single 30011 false ;;
    4) run_prod_single 30012 false ;;
    5) run_dev_all ;;
    6) run_dev_single 30010 false ;;
    7) run_dev_single 30011 false ;;
    8) run_dev_single 30012 false ;;
    9) run_build all ;;
    10) show_status ;;
    11) run_stop all ;;
    0) echo "종료합니다."; exit 0 ;;
    *) echo -e "${COLOR_RED}올바른 번호를 선택해주세요.${COLOR_RESET}"; exit 1 ;;
  esac
}

# ==============================================================================
# CLI 파라미터 파싱 및 라우팅
# ==============================================================================
main() {
  local script_invoked
  script_invoked=$(basename "${BASH_SOURCE[0]:-$0}")

  # 기본 모드는 운영(prod) 모드!
  local action="prod"
  if [[ "$script_invoked" =~ compile ]]; then
    action="build"
  fi

  # 인자가 전혀 없는 경우 -> 대화형 메뉴 (터미널이 연결되어 있을 때)
  if [ $# -eq 0 ]; then
    if [ -t 0 ]; then
      run_interactive_menu
    else
      # 비대화형 환경에서 인자 없이 실행 시 운영 일괄 기동
      run_prod_all
    fi
    exit 0
  fi

  local target="all"
  local daemon=false

  # 첫 번째 인자 검사
  case "$1" in
    compile|build)
      action="build"
      shift
      target="${1:-all}"
      ;;
    dev)
      action="dev"
      shift
      target="${1:-all}"
      ;;
    prod|production|start)
      action="prod"
      shift
      target="${1:-all}"
      ;;
    stop|kill)
      action="stop"
      shift
      target="${1:-all}"
      ;;
    status|ps)
      show_status
      exit 0
      ;;
    restart)
      shift
      target="${1:-all}"
      run_stop "$target"
      sleep 1
      if [ "$target" = "all" ]; then
        run_prod_all
      else
        run_prod_single "$target" true
      fi
      exit 0
      ;;
    all|--all)
      target="all"
      shift
      ;;
    *)
      # 포트 번호 또는 서비스 이름인 경우
      target="$1"
      shift
      ;;
  esac

  # 추가 옵션 파싱 (-d, --daemon, --dev 등)
  while [ $# -gt 0 ]; do
    case "$1" in
      -d|--daemon|-b|--bg|--background)
        daemon=true
        shift
        ;;
      --dev|-dev)
        action="dev"
        shift
        ;;
      --prod|-prod)
        action="prod"
        shift
        ;;
      *)
        shift
        ;;
    esac
  done

  # 최종 실행 분기
  case "$action" in
    build)
      run_build "$target"
      ;;
    stop)
      run_stop "$target"
      ;;
    dev)
      if [ "$target" = "all" ]; then
        run_dev_all
      else
        run_dev_single "$target" "$daemon"
      fi
      ;;
    prod)
      if [ "$target" = "all" ]; then
        run_prod_all
      else
        run_prod_single "$target" "$daemon"
      fi
      ;;
  esac
}

main "$@"
