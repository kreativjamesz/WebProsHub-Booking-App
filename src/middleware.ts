import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/', 
    '/auth/login', 
    '/auth/register', 
    '/businesses', 
    '/about',
    '/contact',
    '/terms',
    '/privacy'
  ];
  
  // Check if the current route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Handle auth redirect routes - redirect authenticated users away
  if (pathname === '/admin-login') {
    const adminToken = request.cookies.get('adminToken')?.value;
    if (adminToken) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }
  
  if (pathname === '/auth/login' || pathname === '/auth/register') {
    const authToken = request.cookies.get('authToken')?.value;
    if (authToken) {
      return NextResponse.redirect(new URL('/user', request.url));
    }
    return NextResponse.next();
  }
  
  // Protected routes that require authentication
  if (pathname.startsWith('/admin')) {
    // Admin routes - check for admin token cookie
    const adminToken = request.cookies.get('adminToken')?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin-login', request.url));
    }
    return NextResponse.next();
  }
  
  if (pathname.startsWith('/business/dashboard')) {
    // Business dashboard routes - check for regular user token cookie
    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }
  
  if (pathname.startsWith('/user')) {
    // User dashboard routes - check for regular user token cookie
    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    return NextResponse.next();
  }
  
  // For any other routes, check if they might be protected
  // This catches any new protected routes we add later
  if (pathname.startsWith('/business') || pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin-login',
    '/auth/:path*',
    '/business/:path*',
    '/user/:path*',
    '/dashboard/:path*',
  ],
};
