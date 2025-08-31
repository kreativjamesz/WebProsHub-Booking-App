"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/utils/cookies";
import { Loader2 } from "lucide-react";

interface AdminLoginGuardProps {
  children: React.ReactNode;
}

export function AdminLoginGuard({ children }: AdminLoginGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin token exists in cookies
    const adminToken = getCookie("adminToken");
    
    if (adminToken) {
      // If admin token exists, redirect to admin dashboard
      router.push('/admin');
      return;
    }

    setIsLoading(false);
  }, [router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If already authenticated as admin, don't render login form
  const adminToken = getCookie("adminToken");
  if (adminToken) {
    return null;
  }

  return <>{children}</>;
}
