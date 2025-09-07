"use client";

import React, { ReactNode } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { type AdminUser } from "@/stores/slices/private/admin.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/admin/Pagination";

interface AdminsTableProps {
  admins: AdminUser[];
  isLoading: boolean;
  onEdit: (admin: AdminUser) => void;
  onDelete: (adminId: string) => void;
  title?: string;
  description?: string;
  titleIcon?: ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
  onPageChange?: (page: number) => void;
  containerClassName?: string;
}

const RoleBadge = ({ role }: { role: string }) => {
  switch (role) {
    case "SUPER_ADMIN":
      return (
        <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
          <Crown className="h-3 w-3" /> Super Admin
        </Badge>
      );
    case "MODERATOR":
      return <Badge className="bg-blue-100 text-blue-800">Moderator</Badge>;
    case "SUPPORT":
      return <Badge className="bg-green-100 text-green-800">Support</Badge>;
    default:
      return <Badge variant="secondary">{role}</Badge>;
  }
};

const StatusBadge = ({ isActive }: { isActive: boolean }) =>
  isActive ? (
    <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
      <CheckCircle className="h-3 w-3" /> Active
    </Badge>
  ) : (
    <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
      <XCircle className="h-3 w-3" /> Inactive
    </Badge>
  );

export function AdminsTable({
  admins,
  isLoading,
  onEdit,
  onDelete,
  title,
  description,
  titleIcon,
  pagination,
  onPageChange,
  containerClassName,
}: AdminsTableProps) {
  return (
    <Card className={containerClassName || "admins-table"}>
      {(title || description) && (
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {titleIcon}
            <span>{title}</span>
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">Loading admins...</div>
        ) : (
          <div className="overflow-x-auto">
            <AdminDataTable<AdminUser>
              items={admins}
              isLoading={false}
              loadingContent={<div className="text-center py-8">Loading admins...</div>}
              emptyContent={
                <div className="text-center py-8 text-muted-foreground">No admins found</div>
              }
              keyExtractor={(a) => a.id}
              columns={[
                {
                  header: "Name",
                  cell: (a) => (
                    <div>
                      <p className="font-medium">{a.name}</p>
                      <p className="text-sm text-muted-foreground">{a.email}</p>
                      <p className="text-xs text-muted-foreground">ID: {a.employeeId || "N/A"}</p>
                    </div>
                  ),
                },
                { header: "Role", cell: (a) => <RoleBadge role={a.role} /> },
                { header: "Department", cell: (a) => <Badge variant="outline">{a.department || "N/A"}</Badge> },
                { header: "Status", cell: (a) => <StatusBadge isActive={a.isActive} /> },
                {
                  header: "Last Login",
                  cell: (a) =>
                    a.lastLoginAt
                      ? new Date(a.lastLoginAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Never",
                },
              ]}
              renderActions={(a) => (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(a)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(a.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            />

            {pagination && onPageChange && (
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                  onPageChange={onPageChange}
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
