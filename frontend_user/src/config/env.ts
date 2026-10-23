/**
 * frontend_user 환경 변수 통합 관리 모듈
 * 브라우저 런타임 호스트(localhost/IP)를 스마트하게 감지하여
 * 원격 도메인 설정과 관계없이 항상 활성 백엔드(:30014)와 완벽히 통신하도록 지원합니다.
 */

function resolveApiBaseUrl(): string {
  // 브라우저 클라이언트 환경:
  // Next.js rewrites(/api/v1 -> :30014)를 통해 Same-Origin으로 통신하여
  // Mixed Content 차단, CORS, 포트포워딩 누락을 100% 원천 방지합니다.
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }

  // Node.js SSR 환경: 백엔드 직접 통신
  return process.env.INTERNAL_BACKEND_URL
    ? `${process.env.INTERNAL_BACKEND_URL}/api/v1`
    : (process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:30014/api/v1');
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

