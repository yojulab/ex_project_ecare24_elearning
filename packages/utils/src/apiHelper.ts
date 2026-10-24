/**
 * eCare24 안전한 API 통신 및 JSON 파싱 헬퍼
 * - 서버(Next.js rewrites, Vite proxy, Nginx 등)가 500/502/503 오류나
 *   HTML, 0바이트 빈 응답을 반환할 때 발생할 수 있는
 *   SyntaxError: Unexpected token 'I'... 및 Unexpected end of JSON input 을
 *   100% 원천 방어하고 안전하게 오류 메시지를 추출합니다.
 */

export interface SafeFetchResult<T = any> {
  ok: boolean;
  status: number;
  data: T;
  error?: string;
}

export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<SafeFetchResult<T>> {
  try {
    const res = await fetch(input, init);
    const contentType = res.headers.get('content-type') || '';
    let parsedData: any = null;

    // 1. Content-Type이 JSON인 경우 JSON 파싱 시도
    if (contentType.includes('application/json')) {
      try {
        parsedData = await res.json();
      } catch {
        parsedData = null;
      }
    }

    // 2. JSON 파싱이 안 되었거나 헤더가 text/plain, text/html 등인 경우 텍스트로 안전하게 수신
    if (!parsedData) {
      const rawText = await res.text().catch(() => '');
      if (rawText && rawText.trim().length > 0) {
        try {
          parsedData = JSON.parse(rawText);
        } catch {
          // JSON이 아닌 일반 문자열 (예: "Internal Server Error", HTML 등)
          const cleanText = rawText.replace(/<[^>]*>/g, '').trim();
          parsedData = {
            message: cleanText.length > 0 && cleanText.length < 200
              ? cleanText
              : `서버 오류가 발생했습니다 (HTTP ${res.status})`,
          };
        }
      } else {
        // 0바이트 빈 본문 응답 (Empty response body)
        parsedData = {
          message: res.ok
            ? ''
            : `서버 응답이 비어 있습니다. 백엔드 가동 상태를 확인해 주세요 (HTTP ${res.status})`,
        };
      }
    }

    // 3. HTTP 응답 상태 코드 검사
    if (!res.ok) {
      const errorMsg =
        parsedData?.message ||
        parsedData?.error ||
        `요청 처리 실패 (HTTP ${res.status} ${res.statusText || ''})`.trim();
      return {
        ok: false,
        status: res.status,
        data: parsedData,
        error: errorMsg,
      };
    }

    return {
      ok: true,
      status: res.status,
      data: parsedData as T,
    };
  } catch (netErr: any) {
    return {
      ok: false,
      status: 0,
      data: null as any,
      error: netErr?.message || '네트워크 연결에 실패했습니다. 서버 상태를 확인해 주세요.',
    };
  }
}
