/**
 * mobileApp 환경 변수 통합 관리 모듈
 * Vite 및 Expo React Native 환경 변수를 일관되게 지원하며,
 * 브라우저 런타임 호스트(localhost/IP)를 스마트하게 감지하여
 * 항상 활성 백엔드(:30014)와 완벽히 통신하도록 지원합니다.
 */
const getEnvVar = (viteKey: string, expoKey: string, fallback: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[viteKey]) {
    return (import.meta as any).env[viteKey];
  }
  if (typeof process !== 'undefined' && process.env && process.env[expoKey]) {
    return process.env[expoKey];
  }
  return fallback;
};

function resolveApiBaseUrl(): string {
  const envUrl = getEnvVar('VITE_API_BASE_URL', 'EXPO_PUBLIC_API_URL', '');

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

export const ENV = {
  // 백엔드 REST API URI 엔드포인트
  get API_BASE_URL(): string {
    return resolveApiBaseUrl();
  },
  // 수강생 포털 URL
  USER_PORTAL_URL: getEnvVar('VITE_USER_PORTAL_URL', 'EXPO_PUBLIC_USER_PORTAL_URL', 'http://localhost:30010'),
  // 자격증 진위확인 URL
  CERT_VERIFY_URL: getEnvVar('VITE_CERT_VERIFY_URL', 'EXPO_PUBLIC_CERT_VERIFY_URL', 'http://localhost:30010/verify'),
  // 서비스 공식 명칭
  APP_NAME: 'eCare24 모바일',
} as const;

export default ENV;
