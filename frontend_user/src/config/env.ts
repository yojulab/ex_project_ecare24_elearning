/**
 * frontend_user 환경 변수 통합 관리 모듈
 * 브라우저 런타임 호스트(localhost/IP)를 스마트하게 감지하여
 * 원격 도메인 설정과 관계없이 항상 활성 백엔드(:30014)와 완벽히 통신하도록 지원합니다.
 */

function resolveApiBaseUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // 브라우저 클라이언트 환경
  if (typeof window !== 'undefined') {
    // 1. 프로덕션 외부 HTTPS API(예: https://mars.axfoundly.com/api/v1)가 명시되어 있으면 최우선 사용
    if (envUrl && envUrl.startsWith('https://')) {
      return envUrl;
    }
    // 2. 상대 경로(/api/v1 등)로 명시된 경우
    if (envUrl && envUrl.startsWith('/')) {
      return envUrl;
    }
    // 3. 로컬 호스트(localhost, 127.0.0.1)인 경우
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return envUrl || '/api/v1';
    }
    // 4. 기타 터널 및 원격 환경: Next.js Same-Origin rewrites 프록시(/api/v1) 사용
    return '/api/v1';
  }

  // Node.js SSR 환경: 백엔드 직접 통신
  return process.env.INTERNAL_BACKEND_URL
    ? `${process.env.INTERNAL_BACKEND_URL}/api/v1`
    : (envUrl || 'http://127.0.0.1:30014/api/v1');
}

export const ENV = {
  // 백엔드 REST API URI 엔드포인트 (동적 getter로 런타임 환경 적응)
  get API_BASE_URL(): string {
    return resolveApiBaseUrl();
  },
  // 관리자 / CS 포털 URL
  ADMIN_PORTAL_URL: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:30011',
  // 서비스 공식 명칭
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || '한국돌봄종사자양성교육원',
} as const;

export default ENV;

