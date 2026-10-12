#!/usr/bin/env bash

set -e

mkdir -p /tmp/tunnels

# 기존 터널 프로세스 종료
pkill -f "cloudflared tunnel" 2>/dev/null || true
sleep 1

echo "==> eCare24 3대 서비스 Cloudflare 터널 생성 시작..."

# 3000: frontend_user (Next.js)
cloudflared tunnel --url http://127.0.0.1:3000 --http-host-header localhost:3000 > /tmp/tunnels/tunnel_3000.log 2>&1 &
echo $! > /tmp/tunnels/pid_3000.txt

# 3001: frontend_admin (Vite CS)
cloudflared tunnel --url http://127.0.0.1:3001 --http-host-header localhost:3001 > /tmp/tunnels/tunnel_3001.log 2>&1 &
echo $! > /tmp/tunnels/pid_3001.txt

# 3002: mobileApp (Vite Mobile)
cloudflared tunnel --url http://127.0.0.1:3002 --http-host-header localhost:3002 > /tmp/tunnels/tunnel_3002.log 2>&1 &
echo $! > /tmp/tunnels/pid_3002.txt

echo "==> 터널 초기화 대기 중 (5초)..."
sleep 5

get_url() {
  local log_file=$1
  grep -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' "$log_file" | head -n 1
}

URL_USER=$(get_url /tmp/tunnels/tunnel_3000.log)
URL_ADMIN=$(get_url /tmp/tunnels/tunnel_3001.log)
URL_MOBILE=$(get_url /tmp/tunnels/tunnel_3002.log)

cat <<EOF > /tmp/tunnels/urls.json
{
  "frontend_user": {
    "port": 3000,
    "name": "수강생 포털 (Next.js)",
    "url": "${URL_USER}"
  },
  "frontend_admin": {
    "port": 3001,
    "name": "관리자 & 콜센터 CS (Vite)",
    "url": "${URL_ADMIN}"
  },
  "mobileApp": {
    "port": 3002,
    "name": "모바일 웹 시뮬레이터 (Vite)",
    "url": "${URL_MOBILE}"
  }
}
EOF

echo ""
echo "================================================================="
echo " 🎉 eCare24 외부 공개 접속 URI 발급 완료 (HTTPS)"
echo "================================================================="
echo " [1] 수강생 포털 (3000)      : ${URL_USER}"
echo " [2] 관리자/콜센터 CS (3001) : ${URL_ADMIN}"
echo " [3] 모바일 웹 앱 (3002)     : ${URL_MOBILE}"
echo "================================================================="
echo " ※ 의뢰자 피드백 단축키: 브라우저 접속 후 [Alt + I]로 일련번호 확인"
echo "================================================================="
