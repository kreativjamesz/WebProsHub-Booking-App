"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  Eye,
  XCircle,
  CheckCircle,
  Filter,
} from "lucide-react";
import { getCookie } from "@/lib/utils/cookies";
import { toast } from "sonner";
import { Booking } from "@/types/booking";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { useAdminHeader } from "@/lib/hooks";
import { StatCard } from "@/components/admin/StatCard";

export default function AdminBookingsPage() {
  const { adminUser } = useAppSelector((state) => state.adminAuth);
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
  const [dateFilter, setDateFilter] = useState<string>("all");

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
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading bookings:{" "}
              {(bookingsError as string) || "Unknown error"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header now global in layout */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Bookings"
            value={totalBookingsCount}
            icon={<Calendar className="h-5 w-5 text-blue-600" />}
          />
          <StatCard
            title="Pending"
            value={pendingCount}
            icon={<Clock className="h-5 w-5 text-yellow-600" />}
          />
          <StatCard
            title="Confirmed"
            value={confirmedCount}
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
          />
          <StatCard
            title="Completed"
            value={completedCount}
            icon={<CheckCircle className="h-5 w-5 text-green-600" />}
          />
        </div>

        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  placeholder="Search bookings..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  delay={500}
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>

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
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card className="mb-8">
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
            {isLoadingBookings ? (
              <div className="text-center py-8">Loading bookings...</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Business</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings?.map((booking: Booking) => (
                      <TableRow
                        key={booking.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => {
                          console.log("Row clicked, setting booking:", booking);
                          setSelectedBooking(booking);
                        }}
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {booking.user?.name || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.user?.email || "N/A"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {booking.business?.name || "N/A"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {booking.service?.name || "N/A"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ${booking.service?.price || "N/A"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">
                              {new Date(booking.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {booking.time}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "CONFIRMED"
                                ? "default"
                                : booking.status === "COMPLETED"
                                ? "default"
                                : booking.status === "PENDING"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Select
                              value={booking.status}
                              onValueChange={(value) =>
                                handleStatusUpdate(booking.id, value)
                              }
                            >
                              <SelectTrigger
                                className="w-32"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="PENDING">Pending</SelectItem>
                                <SelectItem value="CONFIRMED">
                                  Confirmed
                                </SelectItem>
                                <SelectItem value="COMPLETED">
                                  Completed
                                </SelectItem>
                                <SelectItem value="CANCELLED">
                                  Cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                console.log(
                                  "View button clicked, setting booking:",
                                  booking
                                );
                                setSelectedBooking(booking);
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBooking(booking.id);
                              }}
                              className="text-red-600 hover:text-red-900"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

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
              </>
            )}
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
          <DialogContent className="max-w-2xl">
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
                        {new Date(
                          selectedBooking.createdAt
                        ).toLocaleDateString()}
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
      </div>
    </div>
  );
}
