#!/usr/bin/env bash

# ==============================================================================
# eCare24 이러닝 플랫폼 - 3대 통합 서비스 운영 기동 스크립트 (start_server.sh)
#
# run_port.sh의 운영 모드(Production Start)를 일괄 호출합니다.
# ==============================================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec bash "${PROJECT_DIR}/run_port.sh" all "$@"
