"use client";

import React from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { type User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UsersTableProps {
  users: User[];
  isLoading: boolean;
  onUpdateRole: (userId: string, role: User["role"]) => void;
  onDelete: (userId: string) => void;
}

export function UsersTable({ users, isLoading, onUpdateRole, onDelete }: UsersTableProps) {
  return (
    <AdminDataTable<User>
      items={users}
      isLoading={isLoading}
      loadingContent={<div className="text-center py-8">Loading users...</div>}
      emptyContent={<div className="text-center py-8 text-muted-foreground">No users found</div>}
      keyExtractor={(u) => u.id}
      columns={[
        {
          header: "Name",
          className: "font-medium",
          accessor: (u) => u.name,
        },
        { header: "Email", accessor: (u) => u.email },
        {
          header: "Role",
          cell: (u) => (
            <Badge variant={u.role === "BUSINESS_OWNER" ? "default" : "secondary"}>
              {u.role === "BUSINESS_OWNER" ? "Business Owner" : "Customer"}
            </Badge>
          ),
        },
        {
          header: "Created",
          accessor: (u) => new Date(u.createdAt).toLocaleDateString(),
        },
      ]}
      renderActions={(u) => (
        <div className="flex space-x-2">
          <Select
            value={u.role}
            onValueChange={(newRole) => onUpdateRole(u.id, newRole as User["role"])}
            disabled={isLoading}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
              <SelectItem value="BUSINESS_OWNER">Business Owner</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(u.id)}
            disabled={isLoading}
          >
            Delete
          </Button>
        </div>
      )}
    />
  );
}


