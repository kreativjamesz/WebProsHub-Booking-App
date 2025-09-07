"use client";

import React from "react";
import { AdminDataTable } from "@/components/admin/AdminDataTable";
import { type Booking } from "@/types/booking";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, XCircle } from "lucide-react";

interface BookingsTableProps {
  bookings: Booking[];
  isLoading: boolean;
  onRowClick?: (b: Booking) => void;
  onView: (b: Booking) => void;
  onDelete: (bookingId: string) => void;
  onStatusChange: (bookingId: string, status: string) => void;
}

export function BookingsTable({
  bookings,
  isLoading,
  onRowClick,
  onView,
  onDelete,
  onStatusChange,
}: BookingsTableProps) {
  return (
    <AdminDataTable<Booking>
      items={bookings}
      isLoading={isLoading}
      loadingContent={
        <div className="text-center py-8">Loading bookings...</div>
      }
      emptyContent={
        <div className="text-center py-8 text-muted-foreground">
          No bookings found
        </div>
      }
      keyExtractor={(b) => b.id}
      onRowClick={onRowClick}
      columns={[
        {
          header: "Customer",
          cell: (b) => (
            <div className="space-y-1">
              <p className="font-medium">{b.user?.name || "N/A"}</p>
              <p className="text-sm text-muted-foreground">
                {b.user?.email || "N/A"}
              </p>
            </div>
          ),
        },
        {
          header: "Business",
          accessor: (b) => b.business?.name || "N/A",
        },
        {
          header: "Service",
          cell: (b) => (
            <div className="space-y-1">
              <p className="font-medium">{b.service?.name || "N/A"}</p>
              <p className="text-sm text-muted-foreground">
                ${b.service?.price || "N/A"}
              </p>
            </div>
          ),
        },
        {
          header: "Date & Time",
          cell: (b) => (
            <div className="space-y-1">
              <p className="font-medium">
                {new Date(b.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-muted-foreground">{b.time}</p>
            </div>
          ),
        },
        {
          header: "Status",
          cell: (b) => (
            <Badge
              variant={
                b.status === "CONFIRMED"
                  ? "default"
                  : b.status === "COMPLETED"
                  ? "default"
                  : b.status === "PENDING"
                  ? "secondary"
                  : "destructive"
              }
            >
              {b.status}
            </Badge>
          ),
        },
      ]}
      renderActions={(b) => (
        <div
          className="flex items-center space-x-2"
          onClick={(e) => e.stopPropagation()}
        >
          <Select
            value={b.status}
            onValueChange={(value) => onStatusChange(b.id, value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onView(b);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(b.id);
            }}
            className="text-red-600 hover:text-red-900"
          >
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
    />
  );
}
