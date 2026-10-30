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

set -e

# 프로젝트 루트 디렉터리 설정 (스크립트 위치 기준 상위 디렉터리)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -f "${SCRIPT_DIR}/../package.json" ]; then
  ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
else
  ROOT_DIR="${SCRIPT_DIR}"
fi
cd "$ROOT_DIR"

TARGET_MODE="${1:-${NODE_ENV:-dev}}"
if [ "$TARGET_MODE" = "dev" ] || [ "$TARGET_MODE" = "development" ]; then
  IS_PROD=false
  echo "⚙️  [개발 모드 (development)] 각 폴더에 .env 파일을 생성합니다..."
else
  IS_PROD=true
  echo "⚙️  [운영 모드 (production)] 각 폴더에 .env 파일을 생성합니다..."
fi

# 1. 수강생 웹 (frontend_user/.env)
if [ "$IS_PROD" = true ]; then
  cat << 'EOF' > frontend_user/.env
NEXT_PUBLIC_API_BASE_URL=https://mars.axfoundly.com/api/v1
INTERNAL_BACKEND_URL=https://mars.axfoundly.com
NEXT_PUBLIC_ADMIN_PORTAL_URL=https://second.axfoundly.com
NEXT_PUBLIC_APP_NAME=한국돌봄종사자양성교육원
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=KgTNvVcnPFFvdnNY3GZs6oQ1svmQ0FoAtbKowfAARvM=
EOF
else
  cat << 'EOF' > frontend_user/.env
NEXT_PUBLIC_API_BASE_URL=http://localhost:30014/api/v1
INTERNAL_BACKEND_URL=http://127.0.0.1:30014
NEXT_PUBLIC_ADMIN_PORTAL_URL=http://localhost:30011
NEXT_PUBLIC_APP_NAME=한국돌봄종사자양성교육원 (개발)
NEXT_SERVER_ACTIONS_ENCRYPTION_KEY=KgTNvVcnPFFvdnNY3GZs6oQ1svmQ0FoAtbKowfAARvM=
EOF
fi
echo "✓ frontend_user/.env 생성 완료"

# 2. 관리자 웹 (frontend_admin/.env)
if [ "$IS_PROD" = true ]; then
  cat << 'EOF' > frontend_admin/.env
VITE_API_BASE_URL=https://mars.axfoundly.com/api/v1
VITE_API_DOCS_URL=https://mars.axfoundly.com/api/docs
VITE_USER_PORTAL_URL=https://first.axfoundly.com
VITE_APP_NAME=eCare24 콜센터 & 통합 관리자
EOF
else
  cat << 'EOF' > frontend_admin/.env
VITE_API_BASE_URL=http://localhost:30014/api/v1
VITE_API_DOCS_URL=http://localhost:30014/api/docs
VITE_USER_PORTAL_URL=http://localhost:30010
VITE_APP_NAME=eCare24 콜센터 & 통합 관리자 (개발)
EOF
fi
echo "✓ frontend_admin/.env 생성 완료"

# 3. 모바일 앱 (mobileApp/.env)
if [ "$IS_PROD" = true ]; then
  cat << 'EOF' > mobileApp/.env
VITE_API_BASE_URL=https://mars.axfoundly.com/api/v1
EXPO_PUBLIC_API_URL=https://mars.axfoundly.com/api/v1
VITE_USER_PORTAL_URL=https://first.axfoundly.com
EXPO_PUBLIC_USER_PORTAL_URL=https://first.axfoundly.com
VITE_CERT_VERIFY_URL=https://first.axfoundly.com/verify
EXPO_PUBLIC_CERT_VERIFY_URL=https://first.axfoundly.com/verify
EXPO_PUBLIC_APP_ENV=production
EOF
else
  cat << 'EOF' > mobileApp/.env
VITE_API_BASE_URL=http://localhost:30014/api/v1
EXPO_PUBLIC_API_URL=http://localhost:30014/api/v1
VITE_USER_PORTAL_URL=http://localhost:30010
EXPO_PUBLIC_USER_PORTAL_URL=http://localhost:30010
VITE_CERT_VERIFY_URL=http://localhost:30010/verify
EXPO_PUBLIC_CERT_VERIFY_URL=http://localhost:30010/verify
EXPO_PUBLIC_APP_ENV=development
EOF
fi
echo "✓ mobileApp/.env 생성 완료"

# 4. 백엔드 (backend/.env)
if [ "$IS_PROD" = true ]; then
  GEN_NODE_ENV="production"
  GEN_DB_HOST="${DB_HOST:-external_project_db_postgres}"
  GEN_DB_PORT="${DB_PORT:-5432}"
  GEN_DB_NAME="${DB_NAME:-ecare24}"
  GEN_DB_USER="${DB_USER:-ecare24_app}"
  GEN_DB_PASSWORD="${DB_PASSWORD:-ecare24_secret_2026}"
  GEN_DB_ADMIN_USER="${DB_ADMIN_USER:-admin}"
  GEN_DB_ADMIN_PASSWORD="${DB_ADMIN_PASSWORD:-admin123}"
  GEN_DB_ADMIN_NAME="${DB_ADMIN_NAME:-db_graphrag_agent}"
  GEN_CORS_ORIGINS="https://first.axfoundly.com,https://second.axfoundly.com,https://third.axfoundly.com,https://mars.axfoundly.com,*"
  GEN_CERT_QR_URL="https://first.axfoundly.com/verify"
else
  GEN_NODE_ENV="development"
  GEN_DB_HOST="${DB_HOST:-graphrag_agent_db_postgres}"
  GEN_DB_PORT="${DB_PORT:-5432}"
  GEN_DB_NAME="${DB_NAME:-ecare24}"
  GEN_DB_USER="${DB_USER:-ecare24_app}"
  GEN_DB_PASSWORD="${DB_PASSWORD:-ecare24_secret_2026}"
  GEN_DB_ADMIN_USER="${DB_ADMIN_USER:-admin}"
  GEN_DB_ADMIN_PASSWORD="${DB_ADMIN_PASSWORD:-admin123}"
  GEN_DB_ADMIN_NAME="${DB_ADMIN_NAME:-db_graphrag_agent}"
  GEN_CORS_ORIGINS="*"
  GEN_CERT_QR_URL="http://localhost:30010/verify"
fi

cat << 'EOF' > backend/.env
NODE_ENV=__NODE_ENV__
PORT=30014
API_PREFIX=/api/v1
CORS_ORIGINS=__CORS_ORIGINS__

# Database (PostgreSQL 16+ / Apache AGE Container)
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
CERT_QR_BASE_URL=__CERT_QR_URL__

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
  -e "s|__NODE_ENV__|$(_esc "$GEN_NODE_ENV")|" \
  -e "s|__CORS_ORIGINS__|$(_esc "$GEN_CORS_ORIGINS")|" \
  -e "s|__CERT_QR_URL__|$(_esc "$GEN_CERT_QR_URL")|" \
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
echo "✓ backend/.env 생성 완료 (NODE_ENV=${GEN_NODE_ENV}, DB_HOST=${GEN_DB_HOST}, DB_ADMIN_USER=${GEN_DB_ADMIN_USER})"

echo "🎉 모든 폴더의 .env 생성이 완료되었습니다! (대상: ${TARGET_MODE})"
