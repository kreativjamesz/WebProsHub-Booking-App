"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { getCookie } from "@/lib/utils/cookies";
import { userStorage, adminStorage } from "@/lib/utils/storage";
import {
  isRouteProtected,
  shouldRedirectAuthenticated,
  getRedirectUrl,
  hasRequiredRole,
  getRouteConfig,
} from "@/lib/utils/route-guards";
import { Loader2 } from "lucide-react";

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, adminUser, isAuthenticated, isAdminAuthenticated } =
    useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log("⏰ RouteGuard timeout fallback - forcing loading to false");
      setIsLoading(false);
    }, 5000); // 5 seconds timeout

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const checkAccess = async () => {
      console.log("🔍 RouteGuard checking access for:", pathname);

      // Check cookies for authentication tokens
      const authToken = getCookie("authToken");
      const adminToken = getCookie("adminToken");

      console.log("🍪 Cookies found:", {
        authToken: !!authToken,
        adminToken: !!adminToken,
      });

      const hasAuthToken = !!authToken;
      const hasAdminToken = !!adminToken;

      // If we have tokens but Redux state is empty, initialize from localStorage
      if ((hasAuthToken || hasAdminToken) && (!user && !adminUser)) {
        console.log("🔄 Tokens found but Redux state empty, checking localStorage...");
        
        try {
          // Check if user data exists in localStorage
          const storedUserData = userStorage.getUser();
          const storedAdminData = adminStorage.getAdmin();
          
          if (storedUserData) {
            console.log("📱 Found user data in localStorage:", storedUserData.name);
            // You could dispatch an action here to restore user state
          }
          
          if (storedAdminData) {
            console.log("👑 Found admin data in localStorage:", storedAdminData.name);
            // You could dispatch an action here to restore admin state
          }
        } catch (error) {
          console.log("❌ Error reading localStorage:", error);
        }
      }

      // Determine current authentication state
      const isUserAuthenticated = hasAuthToken && (isAuthenticated || !!userStorage.getUser());
      const isAdminAuthenticatedLocal = hasAdminToken && (isAdminAuthenticated || !!adminStorage.getAdmin());
      const isAnyAuthenticated =
        isUserAuthenticated || isAdminAuthenticatedLocal;

      console.log("🔐 Auth state:", {
        isUserAuthenticated,
        isAdminAuthenticatedLocal,
        isAnyAuthenticated,
        isAuthenticated,
        isAdminAuthenticated,
      });

      // Get user role
      const userRole = adminUser?.role || user?.role;
      console.log("👤 User role:", userRole);

      // Check if this route should redirect authenticated users away
      if (shouldRedirectAuthenticated(pathname)) {
        console.log("🔄 Route requires redirect for authenticated users");
        if (isAnyAuthenticated) {
          console.log("✅ User is authenticated, redirecting...");
          // Redirect authenticated users away from login/register pages
          if (hasAdminToken) {
            console.log("🚀 Redirecting admin to /admin");
            router.replace("/admin");
          } else if (hasAuthToken) {
            console.log("👤 Redirecting user to /user");
            router.replace("/user");
          }
          return;
        }
        console.log("❌ User not authenticated, allowing access to login page");
        setIsLoading(false);
        return;
      }

      // Check if route is protected
      if (isRouteProtected(pathname)) {
        console.log("🛡️ Route is protected");
        const routeConfig = getRouteConfig(pathname);

        if (!routeConfig) {
          // Generic protected route
          if (!isAnyAuthenticated) {
            console.log("❌ No auth, redirecting to login");
            router.replace("/auth/login");
            return;
          }
        } else {
          // Route with specific requirements
          if (!isAnyAuthenticated) {
            console.log("❌ No auth, redirecting to:", routeConfig.redirectTo);
            router.replace(routeConfig.redirectTo || "/auth/login");
            return;
          }

          // Check role requirements
          if (routeConfig.requiredRole && userRole) {
            if (!hasRequiredRole(userRole, routeConfig.requiredRole)) {
              console.log("❌ Insufficient role, redirecting to home");
              // Insufficient permissions
              router.replace("/");
              return;
            }
          }
        }
      }

      console.log("✅ Access granted, setting loading to false");
      setIsLoading(false);
    };

    checkAccess();
  }, [
    pathname,
    router,
    isAuthenticated,
    isAdminAuthenticated,
    user,
    adminUser,
  ]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
