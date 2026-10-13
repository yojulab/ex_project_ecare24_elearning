#!/usr/bin/env bash

# ==============================================================================
# eCare24 이러닝 플랫폼 - 3대 통합 서비스 중지 스크립트 (stop_server.sh)
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

echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
echo -e "${COLOR_CYAN} 🛑 eCare24 서비스 종료 절차 시작...${COLOR_RESET}"
echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"

# 포트 기반 프로세스 종료 함수
stop_port() {
  local port=$1
  local service_name=$2
  local pids=""

  echo -n -e "▶ [:${port}] ${service_name} 점검 중... "

  # 1. fuser로 PID 조회
  if command -v fuser >/dev/null 2>&1; then
    pids=$(fuser "${port}/tcp" 2>/dev/null || true)
  fi

  # 2. lsof fallback
  if [ -z "$pids" ] && command -v lsof >/dev/null 2>&1; then
    pids=$(lsof -ti ":${port}" 2>/dev/null || true)
  fi

  # 3. ss fallback
  if [ -z "$pids" ] && command -v ss >/dev/null 2>&1; then
    pids=$(ss -tlpn 2>/dev/null | grep ":${port} " | grep -o 'pid=[0-9]*' | cut -d= -f2 || true)
  fi

  # 4. netstat fallback
  if [ -z "$pids" ] && command -v netstat >/dev/null 2>&1; then
    pids=$(netstat -tlpn 2>/dev/null | grep ":${port} " | awk '{print $7}' | cut -d'/' -f1 || true)
  fi

  # PID 정리 (중복 제거 및 공백 정렬)
  pids=$(echo "$pids" | tr '\n' ' ' | xargs)

  if [ -n "$pids" ]; then
    echo -e "${COLOR_YELLOW}실행 중 (PID: ${pids})${COLOR_RESET}"
    echo -e "   -> SIGTERM (kill -15) 신호 전송..."
    for pid in $pids; do
      kill -15 "$pid" 2>/dev/null || true
    done
    sleep 1

    # 잔존 여부 확인 후 강제 종료
    local remaining=""
    for pid in $pids; do
      if kill -0 "$pid" 2>/dev/null; then
        remaining="${remaining} ${pid}"
      fi
    done
    remaining=$(echo "$remaining" | xargs)

    if [ -n "$remaining" ]; then
      echo -e "   -> ${COLOR_RED}강제 종료 진행 (kill -9: ${remaining})${COLOR_RESET}"
      for pid in $remaining; do
        kill -9 "$pid" 2>/dev/null || true
      done
      sleep 1
    fi

    # fuser 강제 해제 보조
    if command -v fuser >/dev/null 2>&1; then
      fuser -k -9 "${port}/tcp" >/dev/null 2>&1 || true
    fi

    echo -e "   -> ${COLOR_GREEN}종료 완료 ✓${COLOR_RESET}"
  else
    # 혹시 모를 잔존 프로세스 fuser 강제 해제
    if command -v fuser >/dev/null 2>&1; then
      fuser -k -9 "${port}/tcp" >/dev/null 2>&1 || true
    fi
    echo -e "${COLOR_GREEN}실행 중이지 않음 (미점유) ✓${COLOR_RESET}"
  fi
}

# 1. 3대 포트 프로세스 종료
stop_port 30010 "frontend_user (수강생 포털)"
stop_port 30011 "frontend_admin (관리자/콜센터 CS)"
stop_port 30012 "mobileApp (모바일 웹 시뮬레이터)"

# 2. 프로세스명 패턴 기반 보조 정리 (혹시 고아 프로세스가 남은 경우)
pkill -f "next dev -p 30010" >/dev/null 2>&1 || true
pkill -f "vite --port 30011" >/dev/null 2>&1 || true
pkill -f "vite --port 30012" >/dev/null 2>&1 || true

# 3. 로그 기록
if [ -d "$LOG_DIR" ]; then
  TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[${TIMESTAMP}] [eCare24] 모든 서비스 정상 종료 완료" >> "${LOG_DIR}/server_lifecycle_${TODAY}.log"
fi

echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
echo -e "${COLOR_GREEN} ✅ eCare24 3대 서비스가 안전하게 중지되었습니다.${COLOR_RESET}"
echo -e "${COLOR_CYAN}=================================================================${COLOR_RESET}"
