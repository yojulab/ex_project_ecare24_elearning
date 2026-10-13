#!/usr/bin/env bash

# ==============================================================================
# eCare24 이러닝 플랫폼 - 포트별 개별/일괄 컴파일 & 기동 제어 스크립트 (run_port.sh)
#
# 지원 기능:
#   1. 개별 포트/서비스 개발 서버 기동 (포그라운드 또는 백그라운드)
#   2. 모든 포트(30010, 30011, 30012) 일괄 백그라운드 기동
#   3. 개별 또는 일괄 정적 빌드/컴파일 검증 (Next.js build, Vite build)
#   4. 포트별 또는 전체 프로세스 안전 종료 (stop) 및 상태 점검 (status)
#   5. 인자 없이 실행 시 대화형 선택 메뉴(Interactive CLI) 제공
#
# 대상 서비스 매핑:
#   - [30010] frontend_user  : 수강생 웹 포털 (Next.js 14)
#   - [30011] frontend_admin : 관리자 & 콜센터 CS 포털 (Vite + React)
#   - [30012] mobileApp      : 모바일 웹 시뮬레이터 (Vite + React)
#
# 사용 예시:
#   • HOSTNAME=0.0.0.0 PORT=30010 ./run_port.sh 30010
#   • ./run_port.sh all                      (3개 포트 일괄 dev 기동)
#   • ./run_port.sh 30010                    (30010 포그라운드 실시간 콘솔 기동)
#   • ./run_port.sh 30010 -d                 (30010 백그라운드 데몬 기동)
#   • ./run_port.sh compile all              (또는 ./compile.sh all : 전체 일괄 컴파일)
#   • ./run_port.sh compile 30010            (30010 개별 컴파일)
#   • ./run_port.sh stop all                 (전체 프로세스 중지)
#   • ./run_port.sh status                   (포트 점유 상태 확인)
# ==============================================================================

set -uo pipefail

# 프로젝트 루트 경로 산출
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${PROJECT_DIR}/logs"
TODAY=$(date +"%Y%m%d")
mkdir -p "$LOG_DIR"

# 기본 호스트 및 포트 설정 (0.0.0.0 바인딩 우선)
if [ -n "${HOST:-}" ]; then
  DEFAULT_HOST="$HOST"
elif [ -n "${BIND_HOST:-}" ]; then
  DEFAULT_HOST="$BIND_HOST"
elif [ -n "${HOSTNAME:-}" ] && [ "${HOSTNAME:-}" != "$(hostname 2>/dev/null)" ]; then
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
  echo -e "${COLOR_CYAN} 🏥 eCare24 통합 포트 제어 및 컴파일 매니저 (run_port.sh)${COLOR_RESET}"
  echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
}

# 포트 활성 여부 확인 (도커 최소 환경 호환 6중 안전망)
is_port_in_use() {
  local port=$1

  # 1. bash 내장 /dev/tcp 소켓 검사 (외부 패키지 전혀 불필요, 100% 호환)
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

# 특정 포트 점유 PID 획득 (fuser/lsof 없는 도커 환경에서도 pgrep/ps fallback)
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

  # fuser/lsof/ss가 없을 경우 프로세스 이름 및 커맨드라인 패턴 기반 조회
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
      # 사용자 정의 포트 번호일 경우
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

# 1. 개별 서비스 개발 서버 기동 (dev)
run_dev_single() {
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

  # PORT 환경변수가 설정되어 있으면 해당 포트 사용, 없으면 기본 포트
  local run_port=${custom_port:-$default_port}
  local run_host="${DEFAULT_HOST}"
  local clean_name="${name//_/ }"

  echo -e "${COLOR_CYAN}-----------------------------------------------------------------${COLOR_RESET}"
  echo -e "🚀 [기동 요청] ${COLOR_BOLD}${clean_name}${COLOR_RESET}"
  echo -e "   • 디렉터리 : ${PROJECT_DIR}/${dir}"
  echo -e "   • 호스트   : ${run_host}"
  echo -e "   • 포트     : :${run_port}"
  echo -e "   • 방식     : $([ "$daemon_mode" = true ] && echo "백그라운드(Daemon)" || echo "포그라운드(Interactive 실시간 콘솔)")"
  echo -e "${COLOR_CYAN}-----------------------------------------------------------------${COLOR_RESET}"

  # 이미 포트 사용 중인지 점검
  if is_port_in_use "$run_port"; then
    echo -e "${COLOR_YELLOW}⚠️  포트 :${run_port}가 이미 사용 중입니다. 기존 프로세스를 종료하고 재시작합니다...${COLOR_RESET}"
    stop_port "$run_port" "$clean_name"
    sleep 1
  fi

  cd "${PROJECT_DIR}/${dir}" || exit 1

  if [ "$daemon_mode" = true ]; then
    # 백그라운드 데몬 기동
    local log_file="${LOG_DIR}/ecare24_${dir}_${TODAY}.log"
    echo -e "▶ 백그라운드 기동 시작... 로그 파일: ${log_file}"

    export HOSTNAME="$run_host"
    export PORT="$run_port"

    if [ "$type" = "next" ]; then
      if [ "$run_port" = "30010" ] && [ "$run_host" = "0.0.0.0" ]; then
        nohup npm run dev > "$log_file" 2>&1 &
      else
        nohup npx next dev -p "$run_port" -H "$run_host" > "$log_file" 2>&1 &
      fi
    else
      if ([ "$run_port" = "30011" ] || [ "$run_port" = "30012" ]) && [ "$run_host" = "0.0.0.0" ]; then
        nohup npm run dev > "$log_file" 2>&1 &
      else
        nohup npx vite --port "$run_port" --host "$run_host" > "$log_file" 2>&1 &
      fi
    fi

    local pid=$!
    echo -e "${COLOR_GREEN}✓ 백그라운드 프로세스 등록 완료 (PID: ${pid})${COLOR_RESET}"
    echo -n "⏳ 포트 바인딩 대기 중"
    for i in {1..8}; do
      if is_port_in_use "$run_port"; then
        break
      fi
      echo -n "."
      sleep 1
    done
    echo ""

    if is_port_in_use "$run_port"; then
      echo -e "${COLOR_GREEN}🎉 서비스가 포트 :${run_port}에 정상 바인딩되었습니다!${COLOR_RESET}"
      echo -e "   접속 주소: ${COLOR_CYAN}http://${run_host}:${run_port}${COLOR_RESET}"
    else
      echo -e "${COLOR_YELLOW}⏳ 서비스 초기화 중입니다. 'tail -f ${log_file}' 로 상태를 확인하세요.${COLOR_RESET}"
    fi
  else
    # 포그라운드 인터랙티브 기동 (사용자가 요청한 형태: HOSTNAME=0.0.0.0 PORT=30010 npm run dev)
    echo -e "${COLOR_GREEN}▶ 터미널 포그라운드 기동 (종료하려면 Ctrl + C 를 누르세요)...${COLOR_RESET}"
    echo ""
    export HOSTNAME="$run_host"
    export PORT="$run_port"

    if [ "$type" = "next" ]; then
      if [ "$run_port" = "30010" ] && [ "$run_host" = "0.0.0.0" ]; then
        exec npm run dev
      else
        exec npx next dev -p "$run_port" -H "$run_host"
      fi
    else
      if ([ "$run_port" = "30011" ] || [ "$run_port" = "30012" ]) && [ "$run_host" = "0.0.0.0" ]; then
        exec npm run dev
      else
        exec npx vite --port "$run_port" --host "$run_host"
      fi
    fi
  fi
}

# 2. 모든 포트 일괄 개발 서버 기동 (dev all)
run_dev_all() {
  print_header
  echo -e "${COLOR_BOLD}🚀 모든 포트(30010, 30011, 30012) 일괄 백그라운드 기동 시작...${COLOR_RESET}"
  echo ""

  # 포트 충돌 여부 점검
  for p in 30010 30011 30012; do
    if is_port_in_use "$p"; then
      echo -e "${COLOR_YELLOW}⚠️  기존 포트 :${p} 점유 감지. 안전하게 재할당합니다.${COLOR_RESET}"
      stop_port "$p" "서비스"
    fi
  done
  sleep 1

  local run_host="${DEFAULT_HOST}"
  export HOSTNAME="$run_host"

  # 1) 수강생 포털
  local user_log="${LOG_DIR}/ecare24_frontend_user_${TODAY}.log"
  echo -e "▶ [1/3] 수강생 웹 포털 (:30010, Next.js) 백그라운드 기동..."
  cd "${PROJECT_DIR}/frontend_user"
  nohup env HOSTNAME="$run_host" PORT=30010 npm run dev > "$user_log" 2>&1 &
  echo -e "      로그: ${user_log}"

  # 2) 관리자/콜센터 CS
  local admin_log="${LOG_DIR}/ecare24_frontend_admin_${TODAY}.log"
  echo -e "▶ [2/3] 관리자 & CS 포털 (:30011, Vite) 백그라운드 기동..."
  cd "${PROJECT_DIR}/frontend_admin"
  nohup env HOSTNAME="$run_host" PORT=30011 npm run dev > "$admin_log" 2>&1 &
  echo -e "      로그: ${admin_log}"

  # 3) 모바일 시뮬레이터
  local mobile_log="${LOG_DIR}/ecare24_mobileApp_${TODAY}.log"
  echo -e "▶ [3/3] 모바일 웹 시뮬레이터 (:30012, Vite) 백그라운드 기동..."
  cd "${PROJECT_DIR}/mobileApp"
  nohup env HOSTNAME="$run_host" PORT=30012 npm run dev > "$mobile_log" 2>&1 &
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
  echo -e "${COLOR_GREEN} 🎉 3대 서비스 일괄 기동 현황${COLOR_RESET}"
  echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
  check_health 30010 "수강생 포털 (Next.js)"
  check_health 30011 "관리자 & 콜센터 CS (Vite)"
  check_health 30012 "모바일 웹 앱 (Vite)"
  echo ""
  echo -e " 🌐 로컬 접속 주소:"
  echo -e "    • 수강생 웹 포털      : ${COLOR_CYAN}http://${run_host}:30010${COLOR_RESET}"
  echo -e "    • 관리자 & 콜센터 CS  : ${COLOR_CYAN}http://${run_host}:30011${COLOR_RESET}"
  echo -e "    • 모바일 웹 시뮬레이터 : ${COLOR_CYAN}http://${run_host}:30012${COLOR_RESET}"
  echo ""
  echo -e " 💡 백그라운드 로그 모니터링: tail -f logs/*.log"
  echo -e " 🛑 서비스 일괄 종료 명령  : ./run_port.sh stop all"
  echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
}

# 3. 개별 또는 일괄 빌드/컴파일 (build / compile)
run_build() {
  local target_key=$1

  print_header
  echo -e "${COLOR_MAGENTA}📦 [컴파일 / 빌드 모드] 프로덕션 빌드 및 타입체크 검증 시작${COLOR_RESET}"
  echo ""

  # Next.js와 Vite는 dev 서버와 build가 .next 및 dist 캐시를 공유하므로 충돌 방지
  if is_port_in_use 30010; then
    echo -e "${COLOR_YELLOW}⚠️  기동 중인 dev 서버와의 캐시 충돌 방지를 위해 기존 프로세스를 일시 정리합니다.${COLOR_RESET}"
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
    if (cd "${PROJECT_DIR}/frontend_admin" && npm run build); then
      echo -e "${COLOR_GREEN}✓ frontend_admin 컴파일 성공!${COLOR_RESET}\n"
      ((success_count++))
    else
      echo -e "${COLOR_RED}✕ frontend_admin 컴파일 실패!${COLOR_RESET}\n"
      ((fail_count++))
    fi

    # 3. mobileApp
    echo -e "▶ [3/3] mobileApp (모바일 웹, Vite build) 컴파일 중..."
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

# 4. 일괄 또는 개별 서비스 중지 (stop)
run_stop() {
  local target_key=${1:-all}

  print_header
  echo -e "${COLOR_YELLOW}🛑 [프로세스 종료] 포트 해제 작업 시작...${COLOR_RESET}"
  echo ""

  if [ "$target_key" = "all" ]; then
    if [ -f "${PROJECT_DIR}/stop_server.sh" ]; then
      bash "${PROJECT_DIR}/stop_server.sh"
    else
      stop_port 30010 "frontend_user"
      stop_port 30011 "frontend_admin"
      stop_port 30012 "mobileApp"
    fi
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

# 대화형 메뉴 (Interactive Mode)
run_interactive_menu() {
  print_header
  echo -e "${COLOR_BOLD}원하시는 작업을 번호로 선택하세요:${COLOR_RESET}"
  echo ""
  echo -e " ${COLOR_CYAN}[개발 서버 실행 (dev)]${COLOR_RESET}"
  echo -e "   1) 🚀 모든 포트 일괄 기동 (30010, 30011, 30012 백그라운드)"
  echo -e "   2) 💻 수강생 웹 포털 개별 기동 (:30010 Next.js, 실시간 콘솔)"
  echo -e "   3) 💻 관리자 & CS 개별 기동 (:30011 Vite, 실시간 콘솔)"
  echo -e "   4) 💻 모바일 웹 시뮬레이터 개별 기동 (:30012 Vite, 실시간 콘솔)"
  echo ""
  echo -e " ${COLOR_MAGENTA}[컴파일 및 빌드 검증 (build)]${COLOR_RESET}"
  echo -e "   5) 📦 모든 포트 일괄 컴파일 (Build All: Next.js + Vite 2종)"
  echo -e "   6) 📦 수강생 웹 포털 개별 컴파일 (Build :30010)"
  echo -e "   7) 📦 관리자 & CS 포털 개별 컴파일 (Build :30011)"
  echo -e "   8) 📦 모바일 웹 시뮬레이터 개별 컴파일 (Build :30012)"
  echo ""
  echo -e " ${COLOR_YELLOW}[관리 및 진단]${COLOR_RESET}"
  echo -e "   9) 🔍 현재 포트 점유 상태 및 헬스체크 (Status)"
  echo -e "  10) 🛑 모든 포트 서비스 일괄 종료 (Stop All)"
  echo -e "   0) 🚪 종료 (Exit)"
  echo ""
  echo -n -e "${COLOR_BOLD}선택 번호 입력 [0-10]: ${COLOR_RESET}"

  read -r choice
  echo ""

  case "$choice" in
    1) run_dev_all ;;
    2) run_dev_single 30010 false ;;
    3) run_dev_single 30011 false ;;
    4) run_dev_single 30012 false ;;
    5) run_build all ;;
    6) run_build 30010 ;;
    7) run_build 30011 ;;
    8) run_build 30012 ;;
    9) show_status ;;
    10) run_stop all ;;
    0) echo "종료합니다."; exit 0 ;;
    *) echo -e "${COLOR_RED}올바른 번호를 선택해주세요.${COLOR_RESET}"; exit 1 ;;
  esac
}

# CLI 파라미터 파싱 및 라우팅
main() {
  # 인자가 전혀 없는 경우 -> 대화형 메뉴 (터미널이 연결되어 있을 때)
  if [ $# -eq 0 ]; then
    if [ -t 0 ]; then
      run_interactive_menu
    else
      # 파이프 또는 비대화형 환경인 경우 사용법 출력
      print_header
      echo -e "${COLOR_BOLD}사용법:${COLOR_RESET}"
      echo -e "  $0 all                       : 모든 포트 일괄 기동"
      echo -e "  $0 <30010|30011|30012>       : 해당 포트 개별 실시간 콘솔 기동"
      echo -e "  $0 <30010|30011|30012> -d    : 해당 포트 백그라운드(데몬) 기동"
      echo -e "  $0 compile [all|포트]        : 빌드/컴파일 검증"
      echo -e "  $0 stop [all|포트]           : 프로세스 중지"
      echo -e "  $0 status                    : 상태 점검"
    fi
    exit 0
  fi

  local script_invoked
  script_invoked=$(basename "${BASH_SOURCE[0]:-$0}")

  local action="dev"
  if [[ "$script_invoked" =~ compile ]]; then
    action="build"
  fi

  local target=""
  local daemon=false

  # 첫 번째 인자 검사
  case "$1" in
    compile|build)
      action="build"
      shift
      target="${1:-all}"
      ;;
    dev|run|start)
      action="dev"
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
        run_dev_all
      else
        run_dev_single "$target" true
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

  # 추가 옵션 파싱 (-d, --daemon, -b, --bg 등)
  while [ $# -gt 0 ]; do
    case "$1" in
      -d|--daemon|-b|--bg|--background)
        daemon=true
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
  esac
}

main "$@"
