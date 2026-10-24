/// <reference types="vite/client" />

/**
 * frontend_admin 환경 변수 통합 관리 모듈
 * 브라우저 런타임 호스트(localhost/IP)를 스마트하게 감지하여
 * 항상 활성 백엔드(:30014)와 완벽히 통신하도록 지원합니다.
 */

function resolveApiBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  if (typeof window !== 'undefined') {
    // 1. 프로덕션 외부 HTTPS API가 설정되어 있는 경우 직접 통신
    if (envUrl && envUrl.startsWith('https://')) {
      return envUrl;
    }
    // 2. 상대 경로로 명시된 경우
    if (envUrl && envUrl.startsWith('/')) {
      return envUrl;
    }
    // 3. 로컬 호스트(localhost, 127.0.0.1)인 경우
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return envUrl || '/api/v1';
    }
    // 4. 기타 원격 환경: Vite 프록시(/api/v1) 사용
    return '/api/v1';
  }

  return envUrl || 'http://127.0.0.1:30014/api/v1';
}

function resolveApiDocsUrl(): string {
  const envDocs = import.meta.env.VITE_API_DOCS_URL;
  if (typeof window !== 'undefined') {
    if (envDocs && envDocs.startsWith('https://')) {
      return envDocs;
    }
    if (envDocs && envDocs.startsWith('/')) {
      return envDocs;
    }
    return '/api/docs';
  }
  return envDocs || 'http://127.0.0.1:30014/api/docs';
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
