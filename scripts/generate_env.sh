#!/usr/bin/env bash
# ==============================================================================
# eCare24 운영 환경 .env 일괄 생성 스크립트
#
# 웹 (사용자) : https://first.axfoundly.com
# 웹 (관리자) : https://second.axfoundly.com
# 앱          : https://third.axfoundly.com
# 백엔드      : https://mars.axfoundly.com
# DB          : external_project_db_postgres (localhost:5432)
# ==============================================================================

# source/dot(.) 실행 시 현재 대화형 터미널 닫힘 방지 가드
if [ "$0" != "${BASH_SOURCE[0]}" ]; then
  bash "${BASH_SOURCE[0]}" "$@"
  return $? 2>/dev/null || true
fi

set -e

# 프로젝트 루트 디렉터리 설정 (스크립트 위치 기준 상위 디렉터리)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "${SCRIPT_DIR}/../package.json" ]; then
  ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
else
  ROOT_DIR="${SCRIPT_DIR}"
fi
cd "$ROOT_DIR"

echo "⚙️  각 폴더에 .env 파일을 생성합니다..."

# 1. 수강생 웹 (frontend_user/.env)
cat << 'EOF' > frontend_user/.env
NEXT_PUBLIC_API_BASE_URL=https://mars.axfoundly.com/api/v1
NEXT_PUBLIC_ADMIN_PORTAL_URL=https://second.axfoundly.com
NEXT_PUBLIC_APP_NAME=한국돌봄종사자양성교육원
EOF
echo "✓ frontend_user/.env 생성 완료"

# 2. 관리자 웹 (frontend_admin/.env)
cat << 'EOF' > frontend_admin/.env
VITE_API_BASE_URL=https://mars.axfoundly.com/api/v1
VITE_API_DOCS_URL=https://mars.axfoundly.com/api/docs
VITE_USER_PORTAL_URL=https://first.axfoundly.com
VITE_APP_NAME=eCare24 콜센터 & 통합 관리자
EOF
echo "✓ frontend_admin/.env 생성 완료"

# 3. 모바일 앱 (mobileApp/.env)
cat << 'EOF' > mobileApp/.env
VITE_API_BASE_URL=https://mars.axfoundly.com/api/v1
EXPO_PUBLIC_API_URL=https://mars.axfoundly.com/api/v1
VITE_USER_PORTAL_URL=https://first.axfoundly.com
EXPO_PUBLIC_USER_PORTAL_URL=https://first.axfoundly.com
VITE_CERT_VERIFY_URL=https://first.axfoundly.com/verify
EXPO_PUBLIC_CERT_VERIFY_URL=https://first.axfoundly.com/verify
EXPO_PUBLIC_APP_ENV=production
EOF
echo "✓ mobileApp/.env 생성 완료"

# 4. 백엔드 (backend/.env)
#    운영 서버: 앱 컨테이너(external_project_app_fullstack)와 DB 컨테이너(external_project_db_postgres)는
#    같은 도커 네트워크에 있으므로 DB_HOST 는 컨테이너 이름을 사용합니다 (localhost 는 앱 컨테이너 자신을 가리킴).
#    값은 실행 시 환경 변수로 덮어쓸 수 있습니다. 예)
#      DB_ADMIN_PASSWORD='실제_admin_비밀번호' bash generate_env.sh
GEN_DB_HOST="${DB_HOST:-external_project_db_postgres}"
GEN_DB_PORT="${DB_PORT:-5432}"
GEN_DB_NAME="${DB_NAME:-ecare24}"
GEN_DB_USER="${DB_USER:-ecare24_app}"
GEN_DB_PASSWORD="${DB_PASSWORD:-ecare24_secret_2026}"
GEN_DB_ADMIN_USER="${DB_ADMIN_USER:-admin}"
GEN_DB_ADMIN_PASSWORD="${DB_ADMIN_PASSWORD:-admin123}"
GEN_DB_ADMIN_NAME="${DB_ADMIN_NAME:-db_graphrag_agent}"

cat << 'EOF' > backend/.env
NODE_ENV=production
PORT=30014
API_PREFIX=/api/v1
CORS_ORIGINS=https://first.axfoundly.com,https://second.axfoundly.com,https://third.axfoundly.com,https://mars.axfoundly.com,*

# Database (PostgreSQL 16+ / Apache AGE Container: external_project_db_postgres)
DB_HOST=__DB_HOST__
DB_PORT=__DB_PORT__
DB_NAME=__DB_NAME__
DB_USER=__DB_USER__
DB_PASSWORD=__DB_PASSWORD__
DB_SSL=false
DB_SYNCHRONIZE=false

# Database Admin (자동 프로비저닝용 슈퍼유저 - 계정/DB/비밀번호 불일치 시 자동 생성·동기화)
DB_ADMIN_USER=__DB_ADMIN_USER__
DB_ADMIN_PASSWORD=__DB_ADMIN_PASSWORD__
DB_ADMIN_NAME=__DB_ADMIN_NAME__

# Authentication & Security
JWT_ACCESS_SECRET=ecare24_super_secure_access_token_secret_key_2026_at_least_64_characters_long_now
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=ecare24_super_secure_refresh_token_secret_key_2026_at_least_64_characters_long_now
JWT_REFRESH_EXPIRES_IN=14d
BCRYPT_COST=10

# PII & Crypto Keys (AES-256-GCM / HMAC)
PII_ENCRYPTION_KEY=dGhpcy1pcy1hLXNhbXBsZS0zMmJ5dGUtZW5jcnlwdGlvbi1rZXk=
HMAC_SECRET=ecare24_hmac_secret_key_for_qr_verification_2026
CERT_QR_BASE_URL=https://first.axfoundly.com/verify

# Super Admin Seed
SEED_SUPER_ADMIN_LOGIN_ID=admin
SEED_SUPER_ADMIN_PASSWORD=admin1234!
SEED_SUPER_ADMIN_NAME=시스템관리자
SEED_SUPER_ADMIN_PHONE=010-0000-0000
SEED_DEMO_DATA=false

# Storage & Third-Party
FILE_STORAGE_DRIVER=local
FILE_STORAGE_PATH=./storage
SWAGGER_ENABLED=true
EOF

# placeholder 치환 (구분자 | 사용, 값 내 특수문자 이스케이프)
_esc() { printf '%s' "$1" | sed -e 's/[\\&|]/\\&/g'; }
sed -i \
  -e "s|__DB_HOST__|$(_esc "$GEN_DB_HOST")|" \
  -e "s|__DB_PORT__|$(_esc "$GEN_DB_PORT")|" \
  -e "s|__DB_NAME__|$(_esc "$GEN_DB_NAME")|" \
  -e "s|__DB_USER__|$(_esc "$GEN_DB_USER")|" \
  -e "s|__DB_PASSWORD__|$(_esc "$GEN_DB_PASSWORD")|" \
  -e "s|__DB_ADMIN_USER__|$(_esc "$GEN_DB_ADMIN_USER")|" \
  -e "s|__DB_ADMIN_PASSWORD__|$(_esc "$GEN_DB_ADMIN_PASSWORD")|" \
  -e "s|__DB_ADMIN_NAME__|$(_esc "$GEN_DB_ADMIN_NAME")|" \
  backend/.env
chmod 600 backend/.env 2>/dev/null || true
echo "✓ backend/.env 생성 완료 (DB_HOST=${GEN_DB_HOST}, DB_ADMIN_USER=${GEN_DB_ADMIN_USER})"

echo "🎉 모든 폴더의 .env 생성이 완료되었습니다!"
