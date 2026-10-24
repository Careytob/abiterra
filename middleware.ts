// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// NextAuth names its session cookie differently over HTTPS ("__Secure-next-auth.session-token")
// than over HTTP ("next-auth.session-token"), and getToken() guesses which one to read from
// NEXTAUTH_URL. If NEXTAUTH_URL is http:// but the site is served over https (or the reverse),
// the guess is wrong and logged-in users get bounced to /login. Checking both makes route
// protection work regardless of how NEXTAUTH_URL is set.
async function readToken(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;
  return (
    (await getToken({ req: request, secret, secureCookie: true })) ??
    (await getToken({ req: request, secret, secureCookie: false }))
  );
}

// /admin (and /api/admin) is ADMIN-only — full moderation & catalog access.
// /agent (and /api/agent) is for self-service listers — AGENT or ADMIN.
export async function middleware(request: NextRequest) {
  const token = await readToken(request);
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith('/api/');

  if (!token) {
    if (isApi) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  const isAgentRoute = pathname.startsWith('/agent') || pathname.startsWith('/api/agent');

  const allowed =
    (isAdminRoute && token.role === 'ADMIN') ||
    (isAgentRoute && (token.role === 'AGENT' || token.role === 'ADMIN'));

  if (!allowed) {
    if (isApi) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*', '/agent/:path*', '/api/agent/:path*'],
};
