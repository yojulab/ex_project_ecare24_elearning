/// <reference types="vite/client" />

/**
 * frontend_admin 환경 변수 통합 관리 모듈
 * 브라우저 런타임 호스트(localhost/IP)를 스마트하게 감지하여
 * 항상 활성 백엔드(:30014)와 완벽히 통신하도록 지원합니다.
 */

function resolveApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api/v1';
  }
  return import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:30014/api/v1';
}

function resolveApiDocsUrl(): string {
  if (typeof window !== 'undefined') {
    return '/api/docs';
  }
  return import.meta.env.VITE_API_DOCS_URL || 'http://127.0.0.1:30014/api/docs';
}

export const ENV = {
  // 백엔드 REST API URI 엔드포인트
  get API_BASE_URL(): string {
    return resolveApiBaseUrl();
  },
  // 백엔드 Swagger API 문서 URL
  get API_DOCS_URL(): string {
    return resolveApiDocsUrl();
  },
  // 수강생 포털 URL
  USER_PORTAL_URL: import.meta.env.VITE_USER_PORTAL_URL || 'http://localhost:30010',
  // 관리자 서비스명
  APP_NAME: import.meta.env.VITE_APP_NAME || 'eCare24 콜센터 & 통합 관리자',
} as const;

export default ENV;
