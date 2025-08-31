"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/lib/utils/cookies";
import { Loader2 } from "lucide-react";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if admin token exists in cookies
    const adminToken = getCookie("adminToken");
    
    if (!adminToken) {
      router.push('/admin-login');
      return;
    }

    // For now, we'll trust the token exists
    // In a real app, you'd validate the token here
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

  // If not authenticated, don't render children
  const adminToken = getCookie("adminToken");
  if (!adminToken) {
    return null;
  }

  return <>{children}</>;
}
