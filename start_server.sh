#!/usr/bin/env bash

# ==============================================================================
# eCare24 이러닝 플랫폼 - 3대 통합 서비스 기동 스크립트 (start_server.sh)
#
# 대상 서비스:
#   - [1] frontend_user  : 수강생 웹 포털 (Next.js, Port 30010)
#   - [2] frontend_admin : 관리자 & 콜센터 CS 포털 (Vite, Port 30011)
#   - [3] mobileApp      : 모바일 웹 시뮬레이터 (Vite, Port 30012)
# ==============================================================================

set -uo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_DIR="${PROJECT_DIR}/logs"
TODAY=$(date +"%Y%m%d")

# 색상 코드
COLOR_RED='\033[0;31m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_BLUE='\033[0;34m'
COLOR_CYAN='\033[0;36m'
COLOR_RESET='\033[0m'

mkdir -p "$LOG_DIR"

PROJECT_NAME="ecare24"
USER_LOG="${LOG_DIR}/${PROJECT_NAME}_frontend_user_${TODAY}.log"
ADMIN_LOG="${LOG_DIR}/${PROJECT_NAME}_frontend_admin_${TODAY}.log"
MOBILE_LOG="${LOG_DIR}/${PROJECT_NAME}_mobileApp_${TODAY}.log"
LIFECYCLE_LOG="${LOG_DIR}/${PROJECT_NAME}_server_lifecycle_${TODAY}.log"

echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
echo -e "${COLOR_CYAN} 🚀 eCare24 3대 통합 서비스 백그라운드 기동 시작...${COLOR_RESET}"
echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"

# 포트 활성 여부 확인 함수
is_port_in_use() {
  local port=$1
  if command -v fuser >/dev/null 2>&1; then
    fuser "${port}/tcp" >/dev/null 2>&1 && return 0
  fi
  if command -v lsof >/dev/null 2>&1; then
    lsof -ti ":${port}" >/dev/null 2>&1 && return 0
  fi
  return 1
}

# 1. 포트 기사용 여부 사전 점검
CONFLICT=false
for p in 30010 30011 30012; do
  if is_port_in_use "$p"; then
    echo -e "${COLOR_YELLOW}⚠️  포트 :${p}가 이미 사용 중입니다. 기존 프로세스를 종료 후 다시 시작하려면 'bash restart_server.sh'를 실행하세요.${COLOR_RESET}"
    CONFLICT=true
  fi
done

if [ "$CONFLICT" = true ]; then
  echo -e "${COLOR_RED}기동이 중단되었습니다. 충돌 포트를 정리한 후 다시 시도하십시오.${COLOR_RESET}"
  exit 1
fi

TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
echo "[${TIMESTAMP}] [eCare24] 서비스 기동 시작" >> "$LIFECYCLE_LOG"

# 2. 각 서비스 백그라운드 실행
echo -e "▶ [1/3] 수강생 포털 (frontend_user, :30010) 기동 중..."
cd "${PROJECT_DIR}/frontend_user"
nohup npm run dev > "$USER_LOG" 2>&1 &
PID_USER=$!
echo -e "      로그: ${USER_LOG} (PID: ${PID_USER})"

echo -e "▶ [2/3] 관리자/콜센터 CS (frontend_admin, :30011) 기동 중..."
cd "${PROJECT_DIR}/frontend_admin"
nohup npm run dev > "$ADMIN_LOG" 2>&1 &
PID_ADMIN=$!
echo -e "      로그: ${ADMIN_LOG} (PID: ${PID_ADMIN})"

echo -e "▶ [3/3] 모바일 웹 시뮬레이터 (mobileApp, :30012) 기동 중..."
cd "${PROJECT_DIR}/mobileApp"
nohup npm run dev > "$MOBILE_LOG" 2>&1 &
PID_MOBILE=$!
echo -e "      로그: ${MOBILE_LOG} (PID: ${PID_MOBILE})"

cd "${PROJECT_DIR}"

# 3. 서비스 초기화 대기 (3초)
echo ""
echo -e "⏳ 서비스 초기화 및 포트 바인딩 대기 중 (3초)..."
sleep 3

# 4. 헬스체크
check_service_health() {
  local port=$1
  local name=$2
  if is_port_in_use "$port"; then
    echo -e "  - [:${port}] ${name} : ${COLOR_GREEN}정상 가동 중 (ONLINE) ✓${COLOR_RESET}"
  else
    echo -e "  - [:${port}] ${name} : ${COLOR_YELLOW}초기화 진행 중 (로그 확인 권장) ⋯${COLOR_RESET}"
  fi
}

echo ""
echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
echo -e "${COLOR_GREEN} 🎉 eCare24 서비스 기동 현황${COLOR_RESET}"
echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
check_service_health 30010 "수강생 포털 (Next.js)"
check_service_health 30011 "관리자 & 콜센터 CS (Vite)"
check_service_health 30012 "모바일 웹 앱 (Vite)"

echo ""
echo -e " 🌐 로컬 접속 주소:"
echo -e "    • 수강생 웹 포털      : ${COLOR_CYAN}http://localhost:30010${COLOR_RESET}"
echo -e "    • 관리자 & 콜센터 CS  : ${COLOR_CYAN}http://localhost:30011${COLOR_RESET}"
echo -e "    • 모바일 웹 시뮬레이터 : ${COLOR_CYAN}http://localhost:30012${COLOR_RESET}"
echo ""
echo -e " 🌍 외부 접속용 Cloudflare 터널 생성:"
echo -e "    • bash scripts/start_tunnels.sh (또는 npm run tunnel:share)"
echo ""
echo -e " 🔎 의뢰자 피드백 단축키:"
echo -e "    • 브라우저 접속 후 ${COLOR_YELLOW}[Alt + I]${COLOR_RESET} 키로 컴포넌트 일련번호 확인 및 클릭 복사"
echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
