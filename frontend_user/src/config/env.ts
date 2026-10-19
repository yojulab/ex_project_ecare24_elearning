/**
 * frontend_user 환경 변수 통합 관리 모듈
 * 모든 외부 연동 URL 및 REST API URI는 이 모듈을 통해 참조합니다.
 */
export const ENV = {
  // 백엔드 REST API URI 엔드포인트
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:30014/api/v1',
  // 관리자 / CS 포털 URL
  ADMIN_PORTAL_URL: process.env.NEXT_PUBLIC_ADMIN_PORTAL_URL || 'http://localhost:30011',
  // 서비스 공식 명칭
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || '한국돌봄종사자양성교육원',
} as const;

export default ENV;
