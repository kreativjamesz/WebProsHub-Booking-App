"use client";

import React, { ReactNode } from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { type Business } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Eye, Settings, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/admin/Pagination";

interface BusinessesTableProps {
  businesses: Business[];
  isLoading: boolean;
  onView: (b: Business) => void;
  onToggleStatus: (businessId: string) => void;
  onDelete: (businessId: string) => void;
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

export function BusinessesTable({
  businesses,
  isLoading,
  onView,
  onToggleStatus,
  onDelete,
  title,
  description,
  titleIcon,
  pagination,
  onPageChange,
  containerClassName,
}: BusinessesTableProps) {
  return (
    <Card className={containerClassName || "businesses-table"}>
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
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <AdminDataTable<Business>
              items={businesses}
              isLoading={false}
              emptyContent={<div className="text-center py-8 text-muted-foreground">No businesses found</div>}
              keyExtractor={(b) => b.id}
              columns={[
                {
                  header: "Business",
                  cell: (b) => (
                    <div className="space-y-1">
                      <p className="font-medium">{b.name}</p>
                      <p className="text-sm text-muted-foreground line-clamp-1">{b.description}</p>
                    </div>
                  ),
                },
                {
                  header: "Location",
                  cell: (b) => (
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {b.city}, {b.state}
                      </span>
                    </div>
                  ),
                },
                {
                  header: "Owner",
                  cell: (b) => (
                    <span className="text-sm text-muted-foreground">{b.ownerId || "Unassigned"}</span>
                  ),
                },
                {
                  header: "Status",
                  cell: (b) => (
                    <Badge
                      variant={b.isActive ? "default" : "secondary"}
                      className={b.isActive ? "bg-green-100 text-green-800" : ""}
                    >
                      {b.isActive ? "Active" : "Inactive"}
                    </Badge>
                  ),
                },
              ]}
              renderActions={(b) => (
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onView(b)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => onToggleStatus(b.id)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(b.id)}
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


