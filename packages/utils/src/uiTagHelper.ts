// ============================================================================
// uiTagHelper.ts — 의뢰자 소통용 UI 일련번호 인스펙션 엔진 및 유틸리티
// 단축키: Alt + I (또는 Ctrl + Shift + T)
// 동작: 뱃지 표시 토글, 뱃지 클릭 시 클립보드에 상세 정보 복사 (Copied! ✓)
// 복사 정보: 일련번호, 페이지명, URI, 항목명
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
  uri?: string;
  label?: string;
  targetElement?: HTMLElement | null;
  durationMs?: number;
}

/**
 * 경로(pathname)에 따른 기본 페이지명 매핑 테이블
 */
const ROUTE_PAGE_NAME_MAP: Record<string, string> = {
  '/': '메인 홈',
  '/about': '교육원 소개',
  '/curriculum': '교육 체계 / 커리큘럼',
  '/apply': '수강신청',
  '/exam': '디지털 CBT 자격시험',
  '/course': '과정 상세 / 학습',
  '/shorts': '간병24TV 숏폼 러닝',
  '/mypage': '나의 강의실 / 수료증',
  '/admin': '관리자 포털',
  '/admin/dashboard': '관리자 대시보드',
  '/admin/callcenter': '콜센터 CS 원스크린 포털',
  '/admin/cert': '민간자격증 대장 관리',
  '/admin/exam': 'CBT 출제 및 채점 엔진',
};

/**
 * DOM 또는 라우트 정보로부터 페이지명 자동 추출
 */
export function extractPageName(targetElement?: HTMLElement | null): string {
  if (typeof document === 'undefined') return '페이지';

  // 1. targetElement 또는 조상의 data-page-name 속성
  if (targetElement) {
    const elWithPageName = targetElement.closest('[data-page-name]');
    if (elWithPageName) {
      const pageNameAttr = elWithPageName.getAttribute('data-page-name');
      if (pageNameAttr && pageNameAttr.trim()) return pageNameAttr.trim();
    }
  }

  // 2. meta[name="page-name"] 태그
  const metaPage = document.querySelector('meta[name="page-name"]');
  if (metaPage) {
    const content = metaPage.getAttribute('content');
    if (content && content.trim()) return content.trim();
  }

  // 3. document.title 활용 (브라우저 표준 타이틀)
  if (document.title && document.title.trim()) {
    const title = document.title.replace(/\s+/g, ' ').trim();
    return title;
  }

  // 4. 페이지 최상단 h1 또는 주요 헤더
  const h1 = document.querySelector('main h1, header h1, h1');
  if (h1 && h1.textContent && h1.textContent.trim()) {
    return h1.textContent.replace(/\s+/g, ' ').trim();
  }

  // 5. pathname 기반 매핑 fallback
  if (typeof window !== 'undefined' && window.location) {
    const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
    if (ROUTE_PAGE_NAME_MAP[pathname]) {
      return ROUTE_PAGE_NAME_MAP[pathname];
    }
  }

  return '페이지';
}

/**
 * 브라우저 환경에서 현재 URI 추출 (전체 URL 또는 상대 경로)
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
  if (!targetElement) return fallbackLabel || serialId || '미지정 항목';

  // 1. data-item-name 속성 (자신 또는 부모)
  const itemNameAttr =
    targetElement.getAttribute('data-item-name') ||
    targetElement.closest('[data-item-name]')?.getAttribute('data-item-name');
  if (itemNameAttr && itemNameAttr.trim()) {
    return itemNameAttr.trim();
  }

  // 2. 뱃지 컴포넌트의 부모 래퍼 컨테이너 기준 탐색
  const container = targetElement.classList.contains('ui-serial-badge')
    ? targetElement.parentElement
    : targetElement;

  if (container) {
    // 2-1. aria-label, title (피드백 안내용 제외)
    const aria = container.getAttribute('aria-label');
    if (aria && aria.trim()) return aria.trim();

    const title = container.getAttribute('title');
    if (title && !title.includes('피드백') && !title.includes('복사') && title.trim()) {
      return title.trim();
    }

    // 2-2. 폼 요소 (input, textarea, select) 처리
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

    // 2-3. 뱃지 태그를 제외한 순수 텍스트 추출
    try {
      const clone = container.cloneNode(true) as HTMLElement;
      clone.querySelectorAll('.ui-serial-badge').forEach((b) => b.remove());
      const rawText = (clone.textContent || '').replace(/\s+/g, ' ').trim();
      if (rawText) {
        return rawText.length > 40 ? rawText.substring(0, 40) + '...' : rawText;
      }
    } catch {
      // ignore
    }
  }

  // 3. fallback label
  if (fallbackLabel && fallbackLabel.trim()) return fallbackLabel.trim();

  // 4. serialId 약어 기반 친화적 레이블
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
 * - 일련번호
 * - 페이지명
 * - URI
 * - 항목명
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
    } else if (optionsOrElement && typeof optionsOrElement === 'object' && !('nodeType' in optionsOrElement)) {
      options = optionsOrElement as CopyTagOptions;
    }

    const pageName = options.pageName || extractPageName(options.targetElement);
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
        `📋 [${serialId}] 정보 복사 완료! (일련번호/페이지/URI/항목명)`,
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
          ? '🔍 UI 일련번호 뱃지 활성화 (Alt+I로 닫기)'
          : 'UI 일련번호 뱃지 숨김'
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
