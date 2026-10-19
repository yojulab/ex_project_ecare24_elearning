/// <reference types="vite/client" />

/**
 * frontend_admin 환경 변수 통합 관리 모듈
 * 모든 외부 연동 URL 및 REST API URI는 이 모듈을 통해 참조합니다.
 */
export const ENV = {
  // 백엔드 REST API URI 엔드포인트
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:30014/api/v1',
  // 백엔드 Swagger API 문서 URL
  API_DOCS_URL: import.meta.env.VITE_API_DOCS_URL || 'http://localhost:30014/api/docs',
  // 수강생 포털 URL
  USER_PORTAL_URL: import.meta.env.VITE_USER_PORTAL_URL || 'http://localhost:30010',
  // 관리자 서비스명
  APP_NAME: import.meta.env.VITE_APP_NAME || 'eCare24 콜센터 & 통합 관리자',
} as const;

export default ENV;
