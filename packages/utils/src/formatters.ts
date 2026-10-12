// ============================================================================
// formatters.ts — 임상 포맷터 및 유틸리티 함수
// ============================================================================

export function maskPhoneNumber(phone: string): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-****-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-***-$3');
  }
  return phone;
}

export function formatSecondsToMinutes(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}분 ${secs > 0 ? `${secs}초` : ''}`.trim();
}

export function formatHours(hours: number): string {
  return `${hours}시간`;
}

export function formatPriceKRW(price: number): string {
  return `${price.toLocaleString('ko-KR')}원`;
}

export function checkExamPassing(score: number, passScore = 60): { isPassed: boolean; message: string } {
  if (score >= passScore) {
    return { isPassed: true, message: `축하합니다! ${score}점으로 합격 기준(${passScore}점)을 통과했습니다.` };
  }
  return { isPassed: false, message: `아쉽습니다. ${score}점으로 합격 기준(${passScore}점)에 미달하였습니다.` };
}
