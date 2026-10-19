/**
 * mobileApp 환경 변수 통합 관리 모듈
 * Vite 및 Expo React Native 환경 변수를 일관되게 지원합니다.
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

export const ENV = {
  // 백엔드 REST API URI 엔드포인트
  API_BASE_URL: getEnvVar('VITE_API_BASE_URL', 'EXPO_PUBLIC_API_URL', 'http://localhost:30014/api/v1'),
  // 수강생 포털 URL
  USER_PORTAL_URL: getEnvVar('VITE_USER_PORTAL_URL', 'EXPO_PUBLIC_USER_PORTAL_URL', 'http://localhost:30010'),
  // 자격증 진위확인 URL
  CERT_VERIFY_URL: getEnvVar('VITE_CERT_VERIFY_URL', 'EXPO_PUBLIC_CERT_VERIFY_URL', 'http://localhost:30010/verify'),
  // 서비스 공식 명칭
  APP_NAME: 'eCare24 모바일',
} as const;

export default ENV;
