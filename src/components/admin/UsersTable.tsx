"use client";

import React, { ReactNode } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { type User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/admin/Pagination";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onUpdateRole: (userId: string, role: User["role"]) => void;
  onDelete: (userId: string) => void;
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

export function UsersTable({
  users,
  isLoading,
  onUpdateRole,
  onDelete,
  title,
  description,
  titleIcon,
  pagination,
  onPageChange,
  containerClassName,
}: UsersTableProps) {
  return (
    <Card className={containerClassName || "users-table"}>
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
          <div className="text-center py-8">Loading users...</div>
        ) : (
          <>
            <AdminDataTable<User>
              items={users}
              isLoading={false}
              emptyContent={<div className="text-center py-8 text-muted-foreground">No users found</div>}
              keyExtractor={(u) => u.id}
              columns={[
                { header: "Name", className: "font-medium", accessor: (u) => u.name },
                { header: "Email", accessor: (u) => u.email },
                {
                  header: "Role",
                  cell: (u) => (
                    <Badge variant={u.role === "BUSINESS_OWNER" ? "default" : "secondary"}>
                      {u.role === "BUSINESS_OWNER" ? "Business Owner" : "Customer"}
                    </Badge>
                  ),
                },
                { header: "Created", accessor: (u) => new Date(u.createdAt).toLocaleDateString() },
              ]}
              renderActions={(u) => (
                <div className="flex space-x-2">
                  <Select value={u.role} onValueChange={(newRole) => onUpdateRole(u.id, newRole as User["role"]) } disabled={isLoading}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CUSTOMER">Customer</SelectItem>
                      <SelectItem value="BUSINESS_OWNER">Business Owner</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(u.id)} disabled={isLoading}>
                    Delete
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
          </>
        )}
      </CardContent>
    </Card>
  );
}


