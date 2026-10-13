#!/usr/bin/env bash

# ==============================================================================
# eCare24 이러닝 플랫폼 - 3대 통합 서비스 재시작 스크립트 (restart_server.sh)
#
# 수행 절차:
#   1. stop_server.sh  : 기존 프로세스 (Port 30010, 30011, 30012) 안전 종료
#   2. 대기 (1초)
#   3. start_server.sh : 3대 서비스 신규 백그라운드 기동 및 헬스체크
# ==============================================================================

set -uo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# 색상 코드
COLOR_CYAN='\033[0;36m'
COLOR_RESET='\033[0m'

echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
echo -e "${COLOR_CYAN} 🔄 eCare24 3대 통합 서비스 재시작(Restart) 절차 시작...${COLOR_RESET}"
echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"

# 1. 기존 서버 종료
if [ -f "${PROJECT_DIR}/stop_server.sh" ]; then
  bash "${PROJECT_DIR}/stop_server.sh"
else
  echo "⚠️  stop_server.sh 스크립트를 찾을 수 없습니다."
fi

# 2. 포트 정리 대기
sleep 1

# 3. 신규 서버 기동
if [ -f "${PROJECT_DIR}/start_server.sh" ]; then
  bash "${PROJECT_DIR}/start_server.sh"
else
  echo "❌ start_server.sh 스크립트를 찾을 수 없어 기동하지 못했습니다."
  exit 1
fi