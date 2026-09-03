/**
 * File: apps/web/src/middleware.js
 * Yegna AI - Next.js Middleware
 */
import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  const protectedPaths = ['/dashboard', '/tasks', '/team', '/levels', '/wallet'];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  
  if (isProtectedPath) {
    const session = request.cookies.get('yegna_session');
    
    if (!session || session.value !== 'active') {
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  const adminPaths = ['/admin'];
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
  
  if (isAdminPath) {
    const session = request.cookies.get('yegna_session');
    const role = request.cookies.get('yegna_user_role');
    
    if (!session || session.value !== 'active' || role?.value !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  const authPaths = ['/auth/login', '/auth/register', '/auth/forgot-password'];
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
  
  if (isAuthPath) {
    const session = request.cookies.get('yegna_session');
    
    if (session && session.value === 'active') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tasks/:path*',
    '/team/:path*',
    '/levels/:path*',
    '/wallet/:path*',
    '/admin/:path*',
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password'
  ]
};