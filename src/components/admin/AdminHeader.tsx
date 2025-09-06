"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { clearAdminUser } from "@/stores/slices/private/auth/adminAuth.slice";
import { removeCookie } from "@/lib/utils/cookies";
import { adminStorage } from "@/lib/utils/storage";
import { useAdminLogoutMutation } from "@/stores/slices/private/auth/adminAuth.api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Crumb = { label: string; href?: string };

interface AdminHeaderProps {
  title?: string;
  adminName?: string;
  adminRole?: string | null;
  breadcrumbs?: Crumb[] | null;
}

export function AdminHeader({
  title,
  adminName,
  adminRole,
  breadcrumbs,
}: AdminHeaderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [adminLogout] = useAdminLogoutMutation();

  const handleLogout = async () => {
    try {
      await adminLogout().unwrap();
      dispatch(clearAdminUser());
      removeCookie("adminToken");
      adminStorage.clearAdmin();
      router.push("/admin-login");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(clearAdminUser());
      removeCookie("adminToken");
      adminStorage.clearAdmin();
      router.push("/admin-login");
    }
  };

  return (
    <section id="admin-header" className="flex items-center justify-between">
      <div className="flex flex-col">
        <div className="flex items-center space-x-2">
          {breadcrumbs && breadcrumbs.length > 0 && (
            <div className="mb-2">
              <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((c, i) => (
                    <React.Fragment key={i}>
                      <BreadcrumbItem>
                        {c.href ? (
                          <BreadcrumbLink href={c.href}>
                            {c.label}
                          </BreadcrumbLink>
                        ) : (
                          <span className="text-muted-foreground">
                            {c.label}
                          </span>
                        )}
                      </BreadcrumbItem>
                      {i < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}
        </div>
        <h1 className="text-3xl font-bold">{title || "Admin"}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Welcome back,</p>
          <p className="font-semibold">{adminName || "Admin User"}</p>
          {adminRole && (
            <p className="text-xs text-muted-foreground">
              {adminRole.replace("_", " ")}
            </p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="text-destructive hover:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </section>
  );
}
