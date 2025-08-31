"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { clearAdminUser } from "@/lib/stores/features/admin/auth/adminAuthSlice";
import { removeCookie } from "@/lib/utils/cookies";
import { adminStorage } from "@/lib/utils/storage";
import { useAdminLogoutMutation } from "@/lib/stores/features/admin/adminApi";
import { fetchBookings, updateBookingStatus, deleteBooking } from "@/lib/stores/features/admin/adminBookingsSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  User,
  Building,
  Search,
  Filter,
  LogOut,
  Eye,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { getCookie } from "@/lib/utils/cookies";
import { toast } from "sonner";
import { Booking } from "@/lib/types/booking";

export default function AdminBookingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { adminUser } = useAppSelector((state) => state.adminAuth);

  // Check admin token
  const adminToken = getCookie('adminToken');
  console.log('Admin Token:', adminToken ? 'Exists' : 'Missing');

  // Use Redux slice instead of mock data
  const {
    bookings,
    isLoadingBookings,
    error: bookingsError,
  } = useAppSelector((state) => state.adminBookings);

  // RTK Query hook for logout
  const [adminLogout] = useAdminLogoutMutation();

  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // Fetch bookings when component mounts or filters change
  useEffect(() => {
    if (adminToken) {
      console.log('Fetching bookings with Redux slice...');
      dispatch(fetchBookings({
        page: 1,
        search: searchTerm,
        status: statusFilter,
        date: dateFilter,
      }));
    }
  }, [dispatch, adminToken, searchTerm, statusFilter, dateFilter]);

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

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    try {
      await dispatch(updateBookingStatus({ bookingId, status: newStatus })).unwrap();
      toast.success("Booking status updated successfully");
      // Refresh the data
      dispatch(fetchBookings({
        page: 1,
        search: searchTerm,
        status: statusFilter,
        date: dateFilter,
      }));
    } catch (error) {
      toast.error("Failed to update booking status");
      console.error("Status update error:", error);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to delete this booking?")) {
      try {
        await dispatch(deleteBooking(bookingId)).unwrap();
        toast.success("Booking deleted successfully");
        // Refresh the data
        dispatch(fetchBookings({
          page: 1,
          search: searchTerm,
          status: statusFilter,
          date: dateFilter,
        }));
      } catch (error) {
        toast.error("Failed to delete booking");
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
              {bookingsError || "Unknown error"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Booking Management
                </h1>
                <p className="text-muted-foreground">
                  Manage and monitor all system bookings
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <p className="font-semibold">{adminUser?.name}</p>
                <Badge variant="outline" className="mt-1">
                  {adminUser?.role.replace("_", " ")}
                </Badge>
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
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
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

              <Button onClick={() => dispatch(fetchBookings({
                page: 1,
                search: searchTerm,
                status: statusFilter,
                date: dateFilter,
              }))} variant="outline">
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
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
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{booking.user?.name || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">{booking.user?.email || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{booking.business?.name || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{booking.service?.name || 'N/A'}</p>
                            <p className="text-sm text-muted-foreground">${booking.service?.price || 'N/A'}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium">{new Date(booking.date).toLocaleDateString()}</p>
                            <p className="text-sm text-muted-foreground">{booking.time}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              booking.status === "CONFIRMED" ? "default" :
                              booking.status === "COMPLETED" ? "default" :
                              booking.status === "PENDING" ? "secondary" :
                              "destructive"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Select
                              value={booking.status}
                              onValueChange={(value) => handleStatusUpdate(booking.id, value)}
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
                              onClick={() => handleDeleteBooking(booking.id)}
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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
