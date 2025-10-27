import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/profile/:path*', '/notes/:path*', '/sign-in', '/sign-up'],
};

const PRIVATE_PREFIX = /^\/(profile|notes)(\/|$)/;
const AUTH_PREFIX = /^\/(sign-in|sign-up)(\/|$)/;

export default async function middleware(req: NextRequest) {
  const { pathname, origin } = new URL(req.url);

  const access = req.cookies.get('accessToken')?.value;
  const refresh = req.cookies.get('refreshToken')?.value;

  if (!access && refresh) {
    try {
      const sessionRes = await fetch(`${origin}/api/auth/session`, {
        method: 'GET',
        headers: { cookie: req.headers.get('cookie') || '' },
      });
      const setCookie = sessionRes.headers.get('set-cookie');
      if (setCookie) {
        const next = NextResponse.next();
        next.headers.append('set-cookie', setCookie);
        return next;
      }
    } catch {
    }
  }

  const hasAccess = Boolean(access || req.cookies.get('accessToken')?.value);

  if (PRIVATE_PREFIX.test(pathname) && !hasAccess) {
    const url = new URL('/sign-in', req.url);
    url.searchParams.set('from', pathname);
    return NextResponse.redirect(url);
  }

  if (AUTH_PREFIX.test(pathname) && hasAccess) {
    return NextResponse.redirect(new URL('/profile', req.url));
  }

  return NextResponse.next();
}