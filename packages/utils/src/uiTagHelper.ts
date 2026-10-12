// ============================================================================
// uiTagHelper.ts — 의뢰자 소통용 UI 일련번호 인스펙션 엔진 및 유틸리티
// 단축키: Alt + I (또는 Ctrl + Shift + T)
// 동작: 뱃지 표시 토글, 뱃지 클릭 시 클립보드에 일련번호 복사 (Copied! ✓)
// ============================================================================

export interface CopyToastOptions {
  durationMs?: number;
}

/**
 * 뱃지 클릭 시 클립보드에 serialId 복사 및 토스트 알림
 */
export async function copyTagIdToClipboard(serialId: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(serialId);
      showUiInspectorToast(`📋 [${serialId}] 복사 완료! 피드백에 붙여넣으세요.`);
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to copy serial ID to clipboard:', err);
    return false;
  }
}

/**
 * 전역 토스트 팝업 표시
 */
export function showUiInspectorToast(message: string, durationMs = 2000): void {
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
    copyTagIdToClipboard(serialId).then(() => {
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
