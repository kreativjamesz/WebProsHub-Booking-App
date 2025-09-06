"use client";
import { AdminSidebar } from "@/components/admin-sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAppSelector } from "@/lib/hooks";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { title, breadcrumbs } = useAppSelector((s) => s.adminHeader);
  const { adminUser } = useAppSelector((s) => s.adminAuth);
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="admin-main flex-1">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <AdminHeader
            title={title || ""}
            adminName={adminUser?.name}
            adminRole={adminUser?.role}
            breadcrumbs={breadcrumbs}
          />
        </div>
        {children}
      </main>
    </div>
  );
}
