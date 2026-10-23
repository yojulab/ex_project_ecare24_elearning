#!/usr/bin/env bash
# eCare24 - 서비스 재시작 스크립트 (run_port.sh로 통합 위임)

# source/dot(.) 실행 시 현재 터미널 닫힘 방지 가드
if [ "$0" != "${BASH_SOURCE[0]}" ]; then
  bash "${BASH_SOURCE[0]}" "$@"
  return $? 2>/dev/null || true
fi

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
bash "${PROJECT_DIR}/run_port.sh" restart "${1:-all}"