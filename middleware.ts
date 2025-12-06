import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip API routes and static files
  if (
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    path.includes('.')
  ) {
    return NextResponse.next();
  }

  // Let client-side handle most auth logic
  // Just redirect root to login
  if (path === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};