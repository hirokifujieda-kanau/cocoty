import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // 環境変数でBasic認証を有効化するか判定
  const basicAuthEnabled = process.env.BASIC_AUTH_ENABLED === 'true';
  
  if (!basicAuthEnabled) {
    return NextResponse.next();
  }

  const basicAuth = request.headers.get('authorization');
  const url = request.nextUrl;

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const [user, pwd] = atob(authValue).split(':');

    const validUser = process.env.BASIC_AUTH_USER || 'admin';
    const validPassword = process.env.BASIC_AUTH_PASSWORD || 'password';

    if (user === validUser && pwd === validPassword) {
      return NextResponse.next();
    }
  }

  url.pathname = '/api/auth/basic';

  return NextResponse.rewrite(url);
}

// Basic認証を適用しないパス（静的ファイルなど）
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth/basic (Basic認証エンドポイント)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth/basic|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
};
