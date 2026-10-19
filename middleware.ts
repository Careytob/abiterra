// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// /admin (and /api/admin) is ADMIN-only — full moderation & catalog access.
// /agent (and /api/agent) is for self-service listers — AGENT or ADMIN.
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
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
