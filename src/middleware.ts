import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/register', '/businesses'];
  
  // Check if the current route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Protected routes that require authentication
  if (pathname.startsWith('/admin')) {
    // Admin routes - check for admin role
    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    // Note: In a real app, you'd verify the JWT token and check the role
    // For now, we'll let the component handle role checking
  }
  
  if (pathname.startsWith('/business/dashboard')) {
    // Business dashboard routes - check for business owner role
    const token = request.cookies.get('authToken')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }
  
  if (pathname.startsWith('/user')) {
    // User dashboard routes - check for authentication
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
    '/business/dashboard/:path*',
    '/user/:path*',
  ],
};
