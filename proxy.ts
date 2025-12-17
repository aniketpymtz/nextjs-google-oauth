import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key');

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get('session')?.value;

  // Check if user has valid session
  let isAuthenticated = false;
  if (sessionToken) {
    try {
      await jwtVerify(sessionToken, secret);
      isAuthenticated = true;
    } catch {
      // Invalid or expired token
      isAuthenticated = false;
    }
  }

  // Redirect authenticated users away from login page
  if (isAuthenticated && pathname === '/login') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && pathname === '/home') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect root to appropriate page
  if (pathname === '/') {
    const destination = isAuthenticated ? '/home' : '/login';
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/home', '/login'],
};
