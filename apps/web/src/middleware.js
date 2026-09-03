/**
 * File: apps/web/src/middleware.js
 * Yegna AI - Next.js Middleware
 * 
 * Route protection middleware.
 */

import { NextResponse } from 'next/server';

/**
 * Middleware function for route protection
 * 
 * @param {object} request - Next.js request object
 * @returns {NextResponse} Response object
 */
export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Check if path requires authentication
  const protectedPaths = ['/dashboard', '/tasks', '/team', '/levels', '/wallet'];
  const isProtectedPath = protectedPaths.some((path) => pathname.startsWith(path));
  
  if (isProtectedPath) {
    const token = request.cookies.get('yegna_access_token');
    
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Check if path requires admin authentication
  const adminPaths = ['/admin'];
  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));
  
  if (isAdminPath) {
    const token = request.cookies.get('yegna_access_token');
    const role = request.cookies.get('yegna_user_role');
    
    if (!token || role?.value !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // Redirect authenticated users away from auth pages
  const authPaths = ['/login', '/register', '/forgot-password'];
  const isAuthPath = authPaths.some((path) => pathname.startsWith(path));
  
  if (isAuthPath) {
    const token = request.cookies.get('yegna_access_token');
    
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  return NextResponse.next();
}

/**
 * Middleware configuration
 */
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tasks/:path*',
    '/team/:path*',
    '/levels/:path*',
    '/wallet/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/forgot-password'
  ]
};