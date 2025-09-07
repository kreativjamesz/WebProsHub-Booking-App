"use client";

import { useState } from "react";
import { useAdminHeader } from "@/lib/hooks";

import {
  useGetBookingsQuery,
  useUpdateBookingStatusMutation,
  useDeleteBookingMutation,
} from "@/stores/slices/private/admin.api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  User,
  Building,
  CheckCircle,
  Filter,
} from "lucide-react";
import { getCookie } from "@/lib/utils/cookies";
import { toast } from "sonner";
import { Booking } from "@/types/booking";
import { Pagination } from "@/components/admin/Pagination";
import { AdminCardGrid } from "@/components/admin/AdminCardGrid";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { AdminFilterCard } from "@/components/admin/AdminFilterCard";

export default function AdminBookingsPage() {
  useAdminHeader("Booking Management", [
    { label: "Dashboard", href: "/admin" },
    { label: "Bookings" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Debug selectedBooking state
  console.log("Selected booking state:", selectedBooking);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter] = useState<string>("all");

  // Check admin token
  const adminToken = getCookie("adminToken");
  console.log("Admin Token:", adminToken ? "Exists" : "Missing");

  // RTK Query hooks
  const [updateBookingStatus] = useUpdateBookingStatusMutation();
  const [deleteBooking] = useDeleteBookingMutation();

  const {
    data: bookingsData,
    isLoading: isLoadingBookings,
    error: bookingsError,
    refetch: refetchBookings,
  } = useGetBookingsQuery({
    page: currentPage,
    search: searchTerm,
    status: statusFilter,
    date: dateFilter,
  });

  // Extract data from API response
  const bookings = bookingsData?.bookings || [];
  const pagination = bookingsData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalBookings: 0,
    bookingsPerPage: 12,
  };

  // Stats (counts derived from current page data; total from pagination)
  const totalBookingsCount = pagination.totalBookings;
  const pendingCount = bookings.filter(
    (b: Booking) => b.status === "PENDING"
  ).length;
  const confirmedCount = bookings.filter(
    (b: Booking) => b.status === "CONFIRMED"
  ).length;
  const completedCount = bookings.filter(
    (b: Booking) => b.status === "COMPLETED"
  ).length;

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatus({ bookingId, status: newStatus }).unwrap();
      toast.success("Booking status updated successfully");
      refetchBookings();
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Failed to update booking status";
      toast.error(errorMessage);
      console.error("Status update error:", error);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        await deleteBooking(bookingId).unwrap();
        toast.success("Booking deleted successfully");
        refetchBookings();
      } catch (error: unknown) {
        const errorMessage =
          (error as { data?: { error?: string } })?.data?.error ||
          "Failed to delete booking";
        toast.error(errorMessage);
        console.error("Delete error:", error);
      }
    }
  };

  if (bookingsError) {
    return (
      <AdminPageContainer>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading bookings:{" "}
              {(
                bookingsError as { data?: { error?: string; message?: string } }
              )?.data?.error ||
                (
                  bookingsError as {
                    data?: { error?: string; message?: string };
                  }
                )?.data?.message ||
                (typeof bookingsError === "string"
                  ? bookingsError
                  : "Unknown error")}
            </div>
          </CardContent>
        </Card>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer className="space-y-6">
      {/* Header now global in layout */}
      {/* Statistics Cards */}
      <AdminCardGrid
        cols={{ base: 1, md: 4, lg: 4 }}
        gapClassName="gap-4"
        items={[
          {
            type: "stat",
            title: "Total Bookings",
            value: totalBookingsCount,
            icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
          },
          {
            type: "stat",
            title: "Pending",
            value: pendingCount,
            icon: <Clock className="h-4 w-4 text-muted-foreground" />,
          },
          {
            type: "stat",
            title: "Confirmed",
            value: confirmedCount,
            icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
          },
          {
            type: "stat",
            title: "Completed",
            value: completedCount,
            icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
          },
        ]}
      />

      {/* Filters and Search */}
      <AdminFilterCard
        className="bookings-filters-search mb-8"
        icon={<Filter className="h-5 w-5" />}
        title="Filters & Search"
        search={{
          placeholder: "Search bookings...",
          value: searchTerm,
          onChange: setSearchTerm,
          delay: 500,
        }}
        selects={[
          {
            id: "status",
            label: undefined,
            value: statusFilter,
            onValueChange: setStatusFilter,
            options: [
              { label: "All Status", value: "all" },
              { label: "Pending", value: "PENDING" },
              { label: "Confirmed", value: "CONFIRMED" },
              { label: "Completed", value: "COMPLETED" },
              { label: "Cancelled", value: "CANCELLED" },
            ],
            triggerClassName: "w-full md:w-48",
          },
        ]}
        actions={
          <div className="flex gap-2">
            <Button onClick={() => refetchBookings()} variant="outline">
              Refresh
            </Button>
            <Button
              onClick={() => {
                console.log("Test button clicked");
                setSelectedBooking({
                  id: "test",
                  userId: "test",
                  businessId: "test",
                  serviceId: "test",
                  date: new Date(),
                  time: "10:00 AM",
                  status: "PENDING",
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  user: {
                    id: "test",
                    name: "Test User",
                    email: "test@test.com",
                    role: "CUSTOMER",
                  },
                  business: {
                    id: "test",
                    name: "Test Business",
                    email: "business@test.com",
                  },
                  service: {
                    id: "test",
                    name: "Test Service",
                    price: 100,
                    duration: 60,
                  },
                });
              }}
              variant="outline"
            >
              Test Dialog
            </Button>
          </div>
        }
      />

      {/* Bookings Table */}
      <Card className="bookings-table-container mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Bookings</span>
          </CardTitle>
          <CardDescription>
            Manage and monitor all system bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BookingsTable
            bookings={bookings}
            isLoading={isLoadingBookings}
            onRowClick={(b) => setSelectedBooking(b)}
            onView={(b) => setSelectedBooking(b)}
            onDelete={(id) => handleDeleteBooking(id)}
            onStatusChange={(id, status) => handleStatusUpdate(id, status)}
          />

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalBookings}
              itemsPerPage={pagination.bookingsPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* Booking Details Dialog */}
      <Dialog
        open={!!selectedBooking}
        onOpenChange={(open) => {
          console.log("Dialog open state changed:", open);
          if (!open) setSelectedBooking(null);
        }}
      >
        <DialogContent className="max-w-7xl">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              View detailed information about this booking
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {selectedBooking.user?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">
                      {selectedBooking.user?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium">
                      {selectedBooking.user?.role || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Business Information
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Business Name
                    </p>
                    <p className="font-medium">
                      {selectedBooking.business?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Business Email
                    </p>
                    <p className="font-medium">
                      {selectedBooking.business?.email || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Service Information
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Service Name
                    </p>
                    <p className="font-medium">
                      {selectedBooking.service?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-medium">
                      ${selectedBooking.service?.price || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {selectedBooking.service?.duration || "N/A"} minutes
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Booking Details
                </h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(selectedBooking.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{selectedBooking.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge
                      variant={
                        selectedBooking.status === "CONFIRMED"
                          ? "default"
                          : selectedBooking.status === "COMPLETED"
                          ? "default"
                          : selectedBooking.status === "PENDING"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {selectedBooking.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Created</p>
                    <p className="font-medium">
                      {new Date(selectedBooking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Notes</h3>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setSelectedBooking(null)}
                >
                  Close
                </Button>
                <Select
                  value={selectedBooking.status}
                  onValueChange={(value) => {
                    handleStatusUpdate(selectedBooking.id, value);
                    setSelectedBooking(null);
                  }}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminPageContainer>
  );
}
