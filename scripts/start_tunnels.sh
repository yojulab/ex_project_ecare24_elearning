#!/usr/bin/env bash
# source/dot(.) 실행 시 현재 대화형 터미널 닫힘 방지 가드
if [ "$0" != "${BASH_SOURCE[0]}" ]; then
  bash "${BASH_SOURCE[0]}" "$@"
  return $? 2>/dev/null || true
fi

set -e

mkdir -p /tmp/tunnels

# 기존 터널 프로세스 종료
pkill -f "cloudflared tunnel" 2>/dev/null || true
sleep 1

echo "==> eCare24 3대 서비스 Cloudflare 터널 생성 시작..."

# 30010: frontend_user (Next.js)
cloudflared tunnel --url http://127.0.0.1:30010 --http-host-header localhost:30010 > /tmp/tunnels/tunnel_30010.log 2>&1 &
echo $! > /tmp/tunnels/pid_30010.txt

# 30011: frontend_admin (Vite CS)
cloudflared tunnel --url http://127.0.0.1:30011 --http-host-header localhost:30011 > /tmp/tunnels/tunnel_30011.log 2>&1 &
echo $! > /tmp/tunnels/pid_30011.txt

# 30012: mobileApp (Vite Mobile)
cloudflared tunnel --url http://127.0.0.1:30012 --http-host-header localhost:30012 > /tmp/tunnels/tunnel_30012.log 2>&1 &
echo $! > /tmp/tunnels/pid_30012.txt

echo "==> 터널 초기화 대기 중 (5초)..."
sleep 5

get_url() {
  local log_file=$1
  grep -o 'https://[a-zA-Z0-9.-]*\.trycloudflare\.com' "$log_file" | head -n 1
}

URL_USER=$(get_url /tmp/tunnels/tunnel_30010.log)
URL_ADMIN=$(get_url /tmp/tunnels/tunnel_30011.log)
URL_MOBILE=$(get_url /tmp/tunnels/tunnel_30012.log)

cat <<EOF > /tmp/tunnels/urls.json
{
  "frontend_user": {
    "port": 30010,
    "name": "수강생 포털 (Next.js)",
    "url": "${URL_USER}"
  },
  "frontend_admin": {
    "port": 30011,
    "name": "관리자 & 콜센터 CS (Vite)",
    "url": "${URL_ADMIN}"
  },
  "mobileApp": {
    "port": 30012,
    "name": "모바일 웹 시뮬레이터 (Vite)",
    "url": "${URL_MOBILE}"
  }
}
EOF

echo ""
echo "================================================================="
echo " 🎉 eCare24 외부 공개 접속 URI 발급 완료 (HTTPS)"
echo "================================================================="
echo " [1] 수강생 포털 (30010)      : ${URL_USER}"
echo " [2] 관리자/콜센터 CS (30011) : ${URL_ADMIN}"
echo " [3] 모바일 웹 앱 (30012)     : ${URL_MOBILE}"
echo "================================================================="
echo " ※ 의뢰자 피드백 단축키: 브라우저 접속 후 [Alt + I]로 일련번호 확인"
echo "================================================================="
