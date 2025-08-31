"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie, removeCookie } from "@/lib/utils/cookies";
import { Loader2 } from "lucide-react";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateAdminToken = async () => {
      const adminToken = getCookie("adminToken");
      
      if (!adminToken) {
        router.push('/admin-login');
        return;
      }

      try {
        // Validate token by calling the admin-auth API
        const response = await fetch('/api/admin-auth', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Token is invalid or expired
          console.log('Admin token validation failed, clearing session...');
          removeCookie("adminToken");
          router.push('/admin-login');
          return;
        }

        // Token is valid
        setIsLoading(false);
      } catch (error) {
        console.error('Error validating admin token:', error);
        // On any error, clear the token and redirect
        removeCookie("adminToken");
        router.push('/admin-login');
      }
    };

    validateAdminToken();
  }, [router]);

  // Global error handler for authentication failures
  useEffect(() => {
    const handleGlobalAuthError = (event: CustomEvent) => {
      if (event.detail?.error?.includes('Admin authentication failed')) {
        console.log('Global auth error detected, redirecting to login...');
        removeCookie("adminToken");
        router.push('/admin-login');
      }
    };

    // Listen for global authentication errors
    window.addEventListener('admin-auth-error', handleGlobalAuthError as EventListener);
    
    return () => {
      window.removeEventListener('admin-auth-error', handleGlobalAuthError as EventListener);
    };
  }, [router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Validating admin access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
