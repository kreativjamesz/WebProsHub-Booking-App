// Route protection utilities for secure navigation
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { config } from "@/lib/config";
import { prisma } from "@/lib/database";

const ADMIN_JWT_SECRET = config.adminJwt.secret;

export interface RouteConfig {
  path: string;
  requiresAuth: boolean;
  requiredRole?: 'USER' | 'BUSINESS_OWNER' | 'ADMIN' | 'SUPER_ADMIN' | 'MODERATOR' | 'SUPPORT';
  redirectTo?: string;
}

// Define all protected routes and their requirements
export const PROTECTED_ROUTES: RouteConfig[] = [
  // Admin routes
  { path: '/admin', requiresAuth: true, requiredRole: 'ADMIN', redirectTo: '/admin-login' },
  { path: '/admin/users', requiresAuth: true, requiredRole: 'ADMIN', redirectTo: '/admin-login' },
  { path: '/admin/businesses', requiresAuth: true, requiredRole: 'ADMIN', redirectTo: '/admin-login' },
  { path: '/admin/bookings', requiresAuth: true, requiredRole: 'ADMIN', redirectTo: '/admin-login' },
  { path: '/admin/settings', requiresAuth: true, requiredRole: 'ADMIN', redirectTo: '/admin-login' },
  { path: '/admin/admins', requiresAuth: true, requiredRole: 'SUPER_ADMIN', redirectTo: '/admin-login' },
  
  // Business dashboard routes
  { path: '/business/dashboard', requiresAuth: true, requiredRole: 'BUSINESS_OWNER', redirectTo: '/auth/login' },
  { path: '/business/profile', requiresAuth: true, requiredRole: 'BUSINESS_OWNER', redirectTo: '/auth/login' },
  { path: '/business/services', requiresAuth: true, requiredRole: 'BUSINESS_OWNER', redirectTo: '/auth/login' },
  { path: '/business/bookings', requiresAuth: true, requiredRole: 'BUSINESS_OWNER', redirectTo: '/auth/login' },
  
  // User dashboard routes
  { path: '/user', requiresAuth: true, requiredRole: 'USER', redirectTo: '/auth/login' },
  { path: '/user/profile', requiresAuth: true, requiredRole: 'USER', redirectTo: '/auth/login' },
  { path: '/user/bookings', requiresAuth: true, requiredRole: 'USER', redirectTo: '/auth/login' },
  { path: '/user/favorites', requiresAuth: true, requiredRole: 'USER', redirectTo: '/auth/login' },
];

// Public routes that don't require authentication
export const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/businesses',
  '/admin-login',
  '/about',
  '/contact',
  '/terms',
  '/privacy'
];

// Routes that should redirect authenticated users away
export const AUTH_REDIRECT_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/admin-login'
];

// Check if a route requires authentication
export function isRouteProtected(pathname: string): boolean {
  return PROTECTED_ROUTES.some(route => pathname.startsWith(route.path));
}

// Check if a route is public
export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route));
}

// Check if authenticated users should be redirected from this route
export function shouldRedirectAuthenticated(pathname: string): boolean {
  return AUTH_REDIRECT_ROUTES.some(route => pathname === route);
}

// Get route configuration for a specific path
export function getRouteConfig(pathname: string): RouteConfig | null {
  return PROTECTED_ROUTES.find(route => pathname.startsWith(route.path)) || null;
}

// Check if user has required role for a route
export function hasRequiredRole(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    'USER': 1,
    'BUSINESS_OWNER': 2,
    'SUPPORT': 3,
    'MODERATOR': 4,
    'ADMIN': 5,
    'SUPER_ADMIN': 6
  };
  
  const userLevel = roleHierarchy[userRole as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
  
  return userLevel >= requiredLevel;
}

// Get redirect URL for unauthorized access
export function getRedirectUrl(pathname: string, isAuthenticated: boolean, userRole?: string): string {
  const routeConfig = getRouteConfig(pathname);
  
  if (!routeConfig) {
    // If no specific config, check if it's a protected route
    if (isRouteProtected(pathname)) {
      return isAuthenticated ? '/' : '/auth/login';
    }
    return '/';
  }
  
  if (!isAuthenticated) {
    return routeConfig.redirectTo || '/auth/login';
    }
  
  if (routeConfig.requiredRole && userRole && !hasRequiredRole(userRole, routeConfig.requiredRole)) {
    return '/'; // Redirect to home if insufficient permissions
  }
  
  return pathname; // Allow access
}

// Verify admin token from request headers
export async function verifyAdminToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7);
    
    // Verify JWT token
    const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as {
      adminId: string;
      role: string;
    };

    // Verify that the admin user exists and is active
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: decoded.adminId },
      select: { 
        id: true, 
        name: true,
        email: true,
        role: true, 
        isActive: true 
      }
    });

    if (!adminUser || !adminUser.isActive) {
      return null;
    }

    return adminUser;
  } catch (error) {
    console.error("Admin token verification failed:", error);
    return null;
  }
}
