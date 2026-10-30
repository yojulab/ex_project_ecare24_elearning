import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * eCare24 수강생 포털(Next.js) 보안 및 라우팅 미들웨어
 *
 * 1. Server Action 프로빙 공격 및 유효하지 않은 액션 헤더 차단:
 *    - 본 서비스는 백엔드 REST API(/api/v1) 기반 순수 클라이언트 SPA 아키텍처로 Server Actions를 사용하지 않습니다.
 *    - 외부 봇/보안 스캐너가 전송하는 'Next-Action: x' 등의 임의 프로빙 요청이 감지되면
 *      Next.js 내부 unhandled exception(Failed to find Server Action)이 발생하지 않도록
 *      미들웨어 단계에서 400 Bad Request로 안전하게 선제 차단합니다.
 */
export function middleware(request: NextRequest) {
  const nextActionHeader = request.headers.get('next-action');

  if (nextActionHeader !== null) {
    return new NextResponse(
      JSON.stringify({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Server Actions are not supported or invalid action requested.',
      }),
      {
        status: 400,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (.svg, .png, .jpg 등)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

