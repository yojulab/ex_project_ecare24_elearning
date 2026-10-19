// ============================================================================
// uiTagHelper.ts — 의뢰자 소통용 UI 일련번호 인스펙션 엔진 및 유틸리티
// 단축키: Alt + I (또는 Ctrl + Shift + T)
// 동작: 뱃지 표시 토글, 뱃지 클릭 시 클립보드에 4대 핵심 정보 복사 (Copied! ✓)
// 복사 정보 포맷:
//   - 일련번호: {serialId}
//   - 페이지명: {화면명} ({화면코드}) - {서비스명}
//   - URI: {URL}
//   - 항목명: {항목명}
// ============================================================================

export interface CopyToastOptions {
  durationMs?: number;
}

export interface UiInspectData {
  serialId: string;
  pageName: string;
  uri: string;
  itemName: string;
}

export interface CopyTagOptions {
  itemName?: string;
  pageName?: string;
  serviceName?: string;
  uri?: string;
  label?: string;
  targetElement?: HTMLElement | null;
  durationMs?: number;
}

/**
 * 화면코드(접두사) 기준 화면 메타데이터 매핑 테이블
 */
export const SCREEN_META_MAP: Record<
  string,
  { pageName: string; serviceName: string }
> = {
  // 웹 포털 (frontend_user / 30010)
  P00: { pageName: '공통 상단 네비게이션', serviceName: '한국돌봄종사자양성교육원' },
  P01: { pageName: '메인 홈', serviceName: '한국돌봄종사자양성교육원' },
  P02: { pageName: '교육원 소개', serviceName: '한국돌봄종사자양성교육원' },
  P03: { pageName: '교육 체계 / 커리큘럼', serviceName: '한국돌봄종사자양성교육원' },
  P04: { pageName: '수강신청', serviceName: '한국돌봄종사자양성교육원' },
  P05: { pageName: '자격증 발급 신청 / 검증', serviceName: '한국돌봄종사자양성교육원' },
  P06: { pageName: '디지털 CBT 자격시험', serviceName: '한국돌봄종사자양성교육원' },
  P07: { pageName: '간병24TV 숏폼 러닝', serviceName: '한국돌봄종사자양성교육원' },
  P08: { pageName: '나의 강의실 / 수료증', serviceName: '한국돌봄종사자양성교육원' },
  P10: { pageName: '마이페이지 현황 요약', serviceName: '한국돌봄종사자양성교육원' },
  P11: { pageName: '수강 진행 상황', serviceName: '한국돌봄종사자양성교육원' },
  P12: { pageName: '수강료 납부 상황', serviceName: '한국돌봄종사자양성교육원' },
  P13: { pageName: '자격증 발급 상황', serviceName: '한국돌봄종사자양성교육원' },
  P14: { pageName: '1:1 상담 / 문의 내역', serviceName: '한국돌봄종사자양성교육원' },
  P15: { pageName: '회원정보 관리', serviceName: '한국돌봄종사자양성교육원' },

  // 관리자 & 콜센터 CS 포털 (frontend_admin / 30011)
  P20: { pageName: '관리자 통합 내비게이션', serviceName: 'eCare24 관리자' },
  P50: { pageName: '관리자 대시보드', serviceName: 'eCare24 관리자' },
  P51: { pageName: '16대 질환 커리큘럼 관리', serviceName: 'eCare24 관리자' },
  P52: { pageName: '콜센터 CS 원스크린 포털', serviceName: 'eCare24 관리자' },
  P53: { pageName: '직능원 자격증 발급 대장', serviceName: 'eCare24 관리자' },
  P54: { pageName: 'CBT 출제 및 채점 엔진', serviceName: 'eCare24 관리자' },
  P55: { pageName: '수강생 관리', serviceName: 'eCare24 관리자' },
  P56: { pageName: '수강료 납부 및 입금확인', serviceName: 'eCare24 관리자' },
  P57: { pageName: '실습 및 간호사 평가', serviceName: 'eCare24 관리자' },
  P58: { pageName: '팝업 공지 관리', serviceName: 'eCare24 관리자' },
  P59: { pageName: '권한 매트릭스 관리', serviceName: 'eCare24 관리자' },

  // 모바일 앱 (mobileApp / 30012)
  P40: { pageName: '모바일 헤더 / 탭바', serviceName: 'eCare24 스마트러닝' },
  P41: { pageName: '홈 대시보드', serviceName: 'eCare24 스마트러닝' },
  P42: { pageName: '과정 상세 / 학습', serviceName: 'eCare24 스마트러닝' },
  P43: { pageName: '동영상 강의 플레이어', serviceName: 'eCare24 스마트러닝' },
  P44: { pageName: '디지털 CBT 모의시험', serviceName: 'eCare24 스마트러닝' },
  P45: { pageName: '모바일 자격증 지갑', serviceName: 'eCare24 스마트러닝' },
  P46: { pageName: '간병24TV 숏폼 러닝', serviceName: 'eCare24 스마트러닝' },
  P47: { pageName: '돌봄 교안 / 지침서', serviceName: 'eCare24 스마트러닝' },
  P48: { pageName: '모바일 마이페이지', serviceName: 'eCare24 스마트러닝' },

  // 표준 범용 예시 호환
  S03: { pageName: '홈 대시보드', serviceName: 'WorkshopSync' },
};

/**
 * 경로(pathname)에 따른 기본 페이지명 매핑 테이블
 */
const ROUTE_PAGE_NAME_MAP: Record<string, string> = {
  '/': '메인 홈',
  '/about': '교육원 소개',
  '/curriculum': '교육 체계 / 커리큘럼',
  '/apply': '수강신청',
  '/mypage': '마이페이지 / 수강생 포털',
  '/exam': '디지털 CBT 자격시험',
  '/course': '과정 상세 / 학습',
  '/courses': '과정 목록',
  '/shorts': '간병24TV 숏폼 러닝',
  '/tv24': '간병24TV 숏폼 러닝',
  '/admin': '관리자 포털',
  '/admin/dashboard': '관리자 대시보드',
  '/admin/callcenter': '콜센터 CS 원스크린 포털',
  '/admin/cert': '직능원 자격증 발급 대장',
  '/admin/exam': 'CBT 출제 및 채점 엔진',
};

/**
 * SPA 탭 해시(#tab=...)에 따른 기본 페이지명 매핑
 */
const HASH_PAGE_NAME_MAP: Record<string, string> = {
  home: '홈 대시보드',
  about: '교육원 소개',
  curriculum: '교육 체계 / 커리큘럼',
  course: '과정 상세 / 학습',
  apply: '수강신청',
  guide: '돌봄 교안 / 지침서',
  practice: '디지털 CBT 모의시험',
  exam: '디지털 CBT 모의시험',
  cert: '모바일 자격증 지갑',
  wallet: '모바일 자격증 지갑',
  tv24: '간병24TV 숏폼 러닝',
  callcenter: '콜센터 CS 원스크린 포털',
  my: '마이페이지 / 수강생 포털',
  mypage: '마이페이지 / 수강생 포털',
  dashboard: '관리자 대시보드',
  students: '수강생 관리',
  courses: '교육과정 관리',
  payments: '수강료 수납 / 무통장 입금관리',
  permissions: '권한 매트릭스 관리',
  popups: '팝업 / 배너 공지 관리',
  notices: '공지사항 관리',
  settings: '시스템 환경설정',
  logs: '접근 및 작업 로그',
};

/**
 * 주요 일련번호별 정밀 항목명 사전 (REVISED_IA 및 도메인 명세 일치)
 */
export const KNOWN_SERIAL_ITEM_MAP: Record<string, string> = {
  // 웹 네비게이션 / 상단바
  'P00-SEC00-BTN01': '글자크기 3단계 조절기',
  'P00-SEC00-BTN02': '고대비 모드 토글 버튼',
  'P00-SEC01-LOG01': '교육원 공식 로고 링크',
  'P00-SEC01-LNK01': '교육원소개 메뉴 링크',
  'P00-SEC01-LNK02': '수강신청 메뉴 링크',
  'P00-SEC01-LNK03': '교육체계 (16대 트랙) 링크',
  'P00-SEC01-LNK04': '돌봄 지침서 링크',
  'P00-SEC01-LNK05': '자격증 신청/검증 링크',
  'P00-SEC01-LNK06': '나의 강의실 링크',

  // 웹 메인 홈
  'P01-SEC01-BTN01': '메인 수강신청 바로가기 버튼',
  'P01-SEC01-BTN02': '입학 전화상담 바로걸기 버튼',
  'P05-SEC01-BTN01': '자격증 발급 신청 버튼',

  // 모바일 헤더 및 공통 버튼
  'P40-HDR-LOGO': '모바일 로고',
  'P40-HDR-OFFLINE': '오프라인 캐시 모드 토글 버튼',
  'P40-HDR-FONT_DEC': '글자 크기 축소 버튼',
  'P40-HDR-FONT_RESET': '글자 크기 기본 버튼',
  'P40-HDR-FONT_INC': '글자 크기 확대 버튼',
  'P40-HDR-CONTRAST': '고대비 모드 전환 버튼',
  'P40-HDR-INSPECT': 'UI inspect 토글 버튼',
  'P40-HDR-FRAME': '디바이스 프레임 토글 버튼',

  // 모바일 탭바
  'P40-TAB-HOME': '홈 탭 버튼',
  'P40-TAB-APPLY': '수강신청 탭 버튼',
  'P40-TAB-GUIDE': '돌봄지침서 탭 버튼',
  'P40-TAB-PRACTICE': '현장실습 탭 버튼',
  'P40-TAB-CERT': '자격증 탭 버튼',

  // 모바일 홈 화면
  'P41-SEC01-RESUME': '모바일 강의 이어보기 카드',
  'P41-SEC02-APPLY': '돌봄종사자 수강신청 카드',
  'P41-SEC02-ABOUT': '한국돌봄종사자양성교육원 소개 배너',
  'P41-RULE-CRD01': '임상 10대 골든룰 1번 카드',

  // 모바일 강의 플레이어
  'P43-HDR-BACK': '강의 플레이어 뒤로가기 버튼',
  'P43-SEC01-VPLAYER': '비디오 플레이어 영역',
  'P43-SEC02-SPEED': '배속 조절 버튼',
  'P43-SEC03-CAPTIONS': '자막 토글 버튼',
  'P43-SEC04-COMPLETE': '학습 완료 및 수강 확인 버튼',

  // 모바일 CBT 시험
  'P44-SEC01-QTEXT': 'CBT 문제 본문 영역',
  'P44-SEC02-OMR': 'CBT 실시간 OMR 카드',
  'P44-SEC03-SUBMIT': 'CBT 최종 답안 제출 버튼',
  'P44-SEC04-RESULT': 'CBT 시험 결과 카드',

  // 모바일 자격증 지갑
  'P45-SEC01-CARD': '디지털 자격증 카드',
  'P45-SEC02-QR': '자격증 위변조 검증 QR코드',
  'P45-SEC03-DOWNLOAD': '자격증 PDF 다운로드 버튼',
  'P45-SEC03-WALLET': '국민비서 모바일 지갑 담기 버튼',

  // 모바일 숏폼 & 교안
  'P46-SEC01-SHORTS': '간병24TV 숏폼 비디오 플레이어',
  'P46-SEC02-HEART': '숏폼 좋아요 버튼',
  'P46-SEC02-BOOKMARK': '숏폼 북마크 저장 버튼',
  'P46-SEC03-COURSE_LINK': '숏폼 연계 정규 교육과정 바로가기',
  'P47-HDR-BACK': '지침서 뒤로가기 버튼',
  'P47-SEC01-TTS': '음성 TTS 읽어주기 플레이어',
  'P47-SEC02-CONTENT': '돌봄 표준 교안 본문',
  'P47-SEC03-OFFLINE_SAVE': '교안 오프라인 저장 버튼',

  // 관리자 포털
  'P20-NAV01-BTN01': '콜센터 CS 3분할 대시보드 탭',
  'P20-NAV01-BTN02': '16대 질환 커리큘럼 탭',
  'P20-NAV01-BTN03': '직능원 자격증 발급 대장 탭',
  'P52-CS-ALT1': '초기상담 단축키(Alt+1) 버튼',
  'P52-CS-ALT2': '심층상담 단축키(Alt+2) 버튼',
  'P52-CS-ALT3': '민원접수 단축키(Alt+3) 버튼',
  'P52-CS-SAVE': '상담일지 즉시저장 단축키(Alt+S) 버튼',
  'P52-CS-INBOUND': '인바운드 CTI 콜 수신 팝업',

  // 예시 호환
  'S03-SEC03-CRD01': '내 미션 현황 카드',
};

/**
 * serialId로부터 화면 접두사(예: 'P01', 'P41', 'S03') 추출
 */
export function extractScreenPrefix(serialId?: string): string {
  if (!serialId) return '';
  const match = serialId.match(/^([A-Za-z]+)(\d+)/);
  if (match) {
    return `${match[1].toUpperCase()}${match[2]}`;
  }
  const firstSegment = serialId.split('-')[0];
  return firstSegment ? firstSegment.toUpperCase() : '';
}

/**
 * serialId로부터 화면 일련코드 포맷 생성 (예: 'P41' -> '(P-41)', 'S03' -> '(S-03)')
 */
export function formatScreenCode(serialId?: string): string {
  if (!serialId) return '';
  const prefix = extractScreenPrefix(serialId);
  const match = prefix.match(/^([A-Za-z]+)(\d+)$/);
  if (match) {
    return `(${match[1]}-${match[2]})`;
  }
  return prefix ? `(${prefix})` : '';
}

/**
 * 현재 환경 또는 DOM으로부터 서비스/플랫폼 명칭 감지
 */
export function detectServiceName(
  targetElement?: HTMLElement | null,
  overrideService?: string,
  serialId?: string
): string {
  if (overrideService && overrideService.trim()) return overrideService.trim();

  // 1. targetElement 또는 조상의 data-service-name 속성
  if (targetElement) {
    const elWithService = targetElement.closest('[data-service-name]');
    if (elWithService) {
      const s = elWithService.getAttribute('data-service-name');
      if (s && s.trim()) return s.trim();
    }
  }

  // 2. serialId 매핑 기준 서비스명
  if (serialId) {
    const prefix = extractScreenPrefix(serialId);
    if (SCREEN_META_MAP[prefix]?.serviceName) {
      return SCREEN_META_MAP[prefix].serviceName;
    }
  }

  // 3. 브라우저 환경 (포트 / 타이틀 / 메타 태그)
  if (typeof window !== 'undefined') {
    const port = window.location.port;
    if (port === '30012') return 'eCare24 스마트러닝';
    if (port === '30011') return 'eCare24 관리자';
    if (port === '30010') return '한국돌봄종사자양성교육원';

    if (typeof document !== 'undefined') {
      const title = document.title || '';
      if (title.includes('스마트러닝') || title.includes('모바일') || title.includes('📱')) {
        return 'eCare24 스마트러닝';
      }
      if (title.includes('관리자') || title.includes('콜센터')) {
        return 'eCare24 관리자';
      }
      if (title.includes('한국돌봄종사자') || title.includes('교육원')) {
        return '한국돌봄종사자양성교육원';
      }
      if (title.includes('WorkshopSync')) {
        return 'WorkshopSync';
      }
    }
  }

  return '한국돌봄종사자양성교육원';
}

/**
 * DOM 또는 라우트 정보로부터 순수 페이지명 자동 추출
 */
export function extractPageName(
  targetElement?: HTMLElement | null,
  serialId?: string
): string {
  // 1. targetElement 또는 조상의 data-page-name 속성
  if (targetElement) {
    const elWithPageName = targetElement.closest('[data-page-name]');
    if (elWithPageName) {
      const pageNameAttr = elWithPageName.getAttribute('data-page-name');
      if (pageNameAttr && pageNameAttr.trim()) return pageNameAttr.trim();
    }
  }

  // 2. serialId 기준 기본 페이지명 매핑
  if (serialId) {
    const prefix = extractScreenPrefix(serialId);
    if (SCREEN_META_MAP[prefix]?.pageName) {
      return SCREEN_META_MAP[prefix].pageName;
    }
  }

  // 3. SPA 탭 해시(#tab=...) 기반 매핑
  if (typeof window !== 'undefined' && window.location?.hash) {
    const hash = window.location.hash.toLowerCase();
    for (const [key, name] of Object.entries(HASH_PAGE_NAME_MAP)) {
      if (hash.includes(`tab=${key}`) || hash.includes(key)) {
        return name;
      }
    }
  }

  if (typeof document === 'undefined') return '메인 홈';

  // 4. meta[name="page-name"] 태그
  const metaPage = document.querySelector('meta[name="page-name"]');
  if (metaPage) {
    const content = metaPage.getAttribute('content');
    if (content && content.trim()) return content.trim();
  }

  // 5. pathname 기반 매핑 fallback
  if (typeof window !== 'undefined' && window.location) {
    const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
    if (ROUTE_PAGE_NAME_MAP[pathname]) {
      return ROUTE_PAGE_NAME_MAP[pathname];
    }
  }

  // 6. 페이지 최상단 h1 또는 주요 헤더 (사이트 공통 타이틀 제외)
  const h1 = document.querySelector('main h1, header h1, h1');
  if (h1 && h1.textContent && h1.textContent.trim()) {
    const text = h1.textContent.replace(/\s+/g, ' ').trim();
    if (
      !text.includes('한국돌봄종사자양성교육원') &&
      !text.includes('eCare24') &&
      text.length < 30
    ) {
      return text;
    }
  }

  return '메인 홈';
}

/**
 * 4대 정보 규격에 맞춘 완전한 페이지명 포맷 조립
 * 형식: {페이지명} ({화면코드}) - {서비스명}
 * 예: 홈 대시보드 (S-03) - WorkshopSync
 * 예: 메인 홈 (P-01) - 한국돌봄종사자양성교육원
 * 예: 홈 대시보드 (P-41) - eCare24 스마트러닝
 */
export function formatFullPageName(
  rawPageName: string,
  serialId: string,
  serviceName?: string
): string {
  const cleanPageName = (rawPageName || '').trim();
  const screenCode = formatScreenCode(serialId);
  const service = (serviceName || '').trim();

  // 이미 완성형 포맷인 경우 (예: "홈 대시보드 (S-03) - WorkshopSync") 그대로 반환
  if (cleanPageName.includes('(') && cleanPageName.includes(')') && cleanPageName.includes('-')) {
    return cleanPageName;
  }

  let baseTitle = cleanPageName;
  // 기존 사이트/서비스명 분리
  if (baseTitle.includes(' - ')) {
    baseTitle = baseTitle.split(' - ')[0].trim();
  }

  let result = baseTitle || '홈 대시보드';

  // 화면코드 추가 (중복 방지)
  if (screenCode && !result.includes(screenCode)) {
    result = `${result} ${screenCode}`;
  }

  // 서비스명 추가 (중복 방지)
  if (service && !result.includes(service)) {
    result = `${result} - ${service}`;
  }

  return result;
}

/**
 * 브라우저 환경에서 현재 URI 추출 (전체 URL 또는 상대 경로)
 * SPA 해시(#tab=...)가 존재하는 경우 반드시 보존
 */
export function extractUri(customUri?: string): string {
  if (customUri && customUri.trim()) return customUri.trim();
  if (typeof window === 'undefined' || !window.location) return '';

  return window.location.href;
}

/**
 * 뱃지 대상 요소에서 항목명(Item Name) 자동 추출
 */
export function extractItemName(
  targetElement?: HTMLElement | null,
  fallbackLabel?: string,
  serialId?: string
): string {
  // 1. data-item-name 속성 (자신 또는 부모)
  if (targetElement) {
    const itemNameAttr =
      targetElement.getAttribute('data-item-name') ||
      targetElement.closest('[data-item-name]')?.getAttribute('data-item-name');
    if (itemNameAttr && itemNameAttr.trim()) {
      return itemNameAttr.trim();
    }
  }

  // 2. 사전에 정의된 정밀 일련번호 사전 매핑
  if (serialId && KNOWN_SERIAL_ITEM_MAP[serialId]) {
    return KNOWN_SERIAL_ITEM_MAP[serialId];
  }

  // 3. 뱃지 컴포넌트의 부모 래퍼 컨테이너 기준 탐색
  const container = targetElement?.classList?.contains('ui-serial-badge')
    ? targetElement.parentElement
    : targetElement;

  if (container) {
    // 3-1. aria-label, title (시스템 안내문 제외)
    const aria = container.getAttribute('aria-label');
    if (aria && aria.trim()) return aria.trim();

    const title = container.getAttribute('title');
    if (title && !title.includes('피드백') && !title.includes('복사') && !title.includes('Alt+I') && title.trim()) {
      return title.trim();
    }

    // 3-2. 폼 요소 (input, textarea, select) 처리
    const input = container.querySelector('input, textarea, select') as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
      | null;
    if (input) {
      const label = container.querySelector('label')?.textContent?.trim();
      if (label) return label;
      if ('placeholder' in input && input.placeholder) return input.placeholder.trim();
      if (input.name) return input.name.trim();
    }

    // 3-3. 주요 자식 헤더/버튼 텍스트 우선 추출
    const heading = container.querySelector('h1, h2, h3, h4, h5, [class*="title"], [class*="name"]');
    if (heading && heading.textContent && heading.textContent.trim()) {
      const hText = heading.textContent.replace(/\s+/g, ' ').trim();
      if (hText.length > 0 && hText.length <= 40) return hText;
    }

    // 3-4. 뱃지 태그를 제외한 순수 텍스트 추출
    try {
      const clone = container.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('.ui-serial-badge').forEach((b) => b.remove());
      const rawText = (clone.textContent || '').replace(/\s+/g, ' ').trim();
      if (rawText) {
        return rawText.length > 30 ? rawText.substring(0, 30) + '...' : rawText;
      }
    } catch {
      // ignore
    }
  }

  // 4. fallback label
  if (fallbackLabel && fallbackLabel.trim()) return fallbackLabel.trim();

  // 5. serialId 약어 기반 친화적 레이블
  if (serialId) {
    if (serialId.includes('BTN')) return `${serialId} 버튼`;
    if (serialId.includes('INP')) return `${serialId} 입력창`;
    if (serialId.includes('CRD')) return `${serialId} 카드`;
    if (serialId.includes('TAB')) return `${serialId} 탭`;
    if (serialId.includes('MOD')) return `${serialId} 모달`;
    if (serialId.includes('HDR')) return `${serialId} 헤더 영역`;
    return serialId;
  }

  return '미지정 항목';
}

/**
 * 4대 UI 인스펙션 정보 포맷터
 * 
 * 출력 예시:
 * - 일련번호: S03-SEC03-CRD01
 * - 페이지명: 홈 대시보드 (S-03) - WorkshopSync
 * - URI: https://venus.axfoundly.com/#tab=home
 * - 항목명: 내 미션 현황 카드
 */
export function formatInspectData(data: UiInspectData): string {
  return [
    `- 일련번호: ${data.serialId}`,
    `- 페이지명: ${data.pageName}`,
    `- URI: ${data.uri}`,
    `- 항목명: ${data.itemName}`,
  ].join('\n');
}

function isHTMLElement(val: unknown): val is HTMLElement {
  return typeof HTMLElement !== 'undefined' && val instanceof HTMLElement;
}

/**
 * 뱃지 클릭 시 클립보드에 상세 정보(일련번호, 페이지명, URI, 항목명) 복사 및 토스트 알림
 */
export async function copyTagIdToClipboard(
  serialId: string,
  optionsOrElement?: CopyTagOptions | HTMLElement | null
): Promise<boolean> {
  try {
    let options: CopyTagOptions = {};
    if (isHTMLElement(optionsOrElement)) {
      options = { targetElement: optionsOrElement };
    } else if (
      optionsOrElement &&
      typeof optionsOrElement === 'object' &&
      !('nodeType' in optionsOrElement)
    ) {
      options = optionsOrElement as CopyTagOptions;
    }

    const serviceName = detectServiceName(
      options.targetElement,
      options.serviceName,
      serialId
    );
    const rawPageName =
      options.pageName || extractPageName(options.targetElement, serialId);
    const pageName = formatFullPageName(rawPageName, serialId, serviceName);
    const uri = options.uri || extractUri();
    const itemName =
      options.itemName ||
      extractItemName(options.targetElement, options.label, serialId);

    const inspectData: UiInspectData = {
      serialId,
      pageName,
      uri,
      itemName,
    };

    const copyText = formatInspectData(inspectData);

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(copyText);
      showUiInspectorToast(
        `📋 [${serialId}] 4대 정보 복사 완료! (일련번호/페이지/URI/항목명)`,
        options.durationMs || 2200
      );
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to copy serial ID and inspect data to clipboard:', err);
    return false;
  }
}

/**
 * 전역 토스트 팝업 표시
 */
export function showUiInspectorToast(message: string, durationMs = 2200): void {
  if (typeof document === 'undefined') return;

  let toast = document.getElementById('ui-tagger-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ui-tagger-toast';
    document.body.appendChild(toast);
  }

  toast.innerText = message;
  toast.className = 'ui-toast-show';

  // 기존 타이머 취소 및 신규 등록
  const existingTimer = (toast as any)._toastTimer;
  if (existingTimer) clearTimeout(existingTimer);

  (toast as any)._toastTimer = setTimeout(() => {
    if (toast) toast.className = '';
  }, durationMs);
}

/**
 * 브라우저 환경에서 Alt + I 단축키 리스너 초기화 (순수 JS 환경 또는 리액트 마운트 시 호출)
 */
export function initUiInspectorGlobalListener(): () => void {
  if (typeof window === 'undefined') return () => {};

  let isInspectMode = false;

  const keyHandler = (e: KeyboardEvent) => {
    if (
      (e.altKey && e.key.toLowerCase() === 'i') ||
      (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't')
    ) {
      e.preventDefault();
      isInspectMode = !isInspectMode;
      document.body.classList.toggle('ui-inspect-active', isInspectMode);
      showUiInspectorToast(
        isInspectMode
          ? '🔍 UI inspect 활성화 (클릭 시 4대 정보 복사)'
          : 'UI inspect 비활성화 (숨김)'
      );
    }
  };

  const clickHandler = (e: MouseEvent) => {
    const target = e.target as HTMLElement | null;
    if (!target) return;
    const badge = target.closest('.ui-serial-badge') as HTMLElement | null;
    if (!badge) return;

    e.preventDefault();
    e.stopPropagation();

    const serialId = badge.getAttribute('data-serial-id') || badge.innerText;
    copyTagIdToClipboard(serialId, { targetElement: badge }).then(() => {
      const originalText = badge.innerText;
      badge.innerText = 'Copied! ✓';
      badge.classList.add('copied');
      setTimeout(() => {
        badge.innerText = originalText;
        badge.classList.remove('copied');
      }, 1200);
    });
  };

  window.addEventListener('keydown', keyHandler);
  document.addEventListener('click', clickHandler);

  return () => {
    window.removeEventListener('keydown', keyHandler);
    document.removeEventListener('click', clickHandler);
  };
}

