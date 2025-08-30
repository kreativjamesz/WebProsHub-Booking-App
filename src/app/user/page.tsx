"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { fetchUserBookings } from "@/lib/stores/features/bookings/bookingsSlice";
import { fetchBusinesses } from "@/lib/stores/features/businesses/businessesSlice";
import { fetchServices } from "@/lib/stores/features/services/servicesSlice";
import { fetchCategories } from "@/lib/stores/features/categories/categoriesSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Star,
  Loader2,
  Plus,
  Edit,
  Trash2,
  User,
  Building,
  CreditCard,
} from "lucide-react";
import { Booking, Business, Service, Category } from "@/lib/types";

export default function UserDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { userBookings, isLoading: bookingsLoading } = useAppSelector(
    (state) => state.bookings
  );
  const { businesses } = useAppSelector((state) => state.businesses);
  const { services } = useAppSelector((state) => state.services);
  const { categories } = useAppSelector((state) => state.categories);

  const [isNewBookingDialogOpen, setIsNewBookingDialogOpen] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState<string>("");

  useEffect(() => {
    if (user) {
      dispatch(fetchUserBookings(user.id));
      dispatch(fetchBusinesses());
      dispatch(fetchServices());
      dispatch(fetchCategories());
    }
  }, [dispatch, user]);

  const handleCreateBooking = async () => {
    if (
      !user ||
      !selectedBusiness ||
      !selectedService ||
      !selectedDate ||
      !selectedTime
    ) {
      return;
    }

    try {
      const response = await fetch("/api/database", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          model: "booking",
          data: {
            userId: user.id,
            businessId: selectedBusiness,
            serviceId: selectedService,
            date: new Date(selectedDate),
            time: selectedTime,
            notes,
            status: "PENDING",
          },
        }),
      });

      if (response.ok) {
        setIsNewBookingDialogOpen(false);
        // Reset form
        setSelectedBusiness("");
        setSelectedService("");
        setSelectedDate("");
        setSelectedTime("");
        setNotes("");
        // Refresh bookings
        dispatch(fetchUserBookings(user.id));
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
    }
  };

  const getStatusBadge = (status: Booking["status"]) => {
    const statusConfig = {
      PENDING: { color: "bg-yellow-100 text-yellow-800", text: "Pending" },
      CONFIRMED: { color: "bg-blue-100 text-blue-800", text: "Confirmed" },
      COMPLETED: { color: "bg-green-100 text-green-800", text: "Completed" },
      CANCELLED: { color: "bg-red-100 text-red-800", text: "Cancelled" },
    };

    const config = statusConfig[status];
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const formatDate = (date: Date | string) => {
    if (typeof date === "string") {
      return new Date(date).toLocaleDateString();
    }
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading user dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-gray-600">
          Manage your bookings and discover new services
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">My Bookings</TabsTrigger>
          <TabsTrigger value="new-booking">New Booking</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Bookings
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userBookings.length}</div>
                <p className="text-xs text-muted-foreground">
                  {userBookings.filter((b) => b.status === "COMPLETED").length}{" "}
                  completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Bookings
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {
                    userBookings.filter(
                      (b) => b.status === "PENDING" || b.status === "CONFIRMED"
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">
                  Pending or confirmed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Favorite Businesses
                </CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Set(userBookings.map((b) => b.businessId)).size}
                </div>
                <p className="text-xs text-muted-foreground">
                  Unique businesses
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
              <CardDescription>Your latest service bookings</CardDescription>
            </CardHeader>
            <CardContent>
              {userBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings yet</p>
                  <Button
                    onClick={() => setIsNewBookingDialogOpen(true)}
                    className="mt-4"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Book Your First Service
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <Building className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {businesses.find((b) => b.id === booking.businessId)
                              ?.name || "Unknown Business"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {services.find((s) => s.id === booking.serviceId)
                              ?.name || "Unknown Service"}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatDate(booking.date)} at {booking.time}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(booking.status)}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Tab */}
        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Bookings</CardTitle>
              <CardDescription>
                View and manage all your service bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {bookingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading bookings...
                </div>
              ) : userBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Business</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userBookings.map((booking) => {
                      const business = businesses.find(
                        (b) => b.id === booking.businessId
                      );
                      const service = services.find(
                        (s) => s.id === booking.serviceId
                      );

                      return (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {business?.name || "Unknown"}
                              </p>
                              <p className="text-sm text-gray-500">
                                {business?.address}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {service?.name || "Unknown"}
                              </p>
                              <p className="text-sm text-gray-500">
                                ${service?.price}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {formatDate(booking.date)}
                              </p>
                              <p className="text-sm text-gray-500">
                                {booking.time}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell>
                            {booking.notes ? (
                              <p className="text-sm text-gray-600">
                                {booking.notes}
                              </p>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Booking Tab */}
        <TabsContent value="new-booking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book a New Service</CardTitle>
              <CardDescription>
                Schedule an appointment with a local business
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="business">Select Business</Label>
                    <Select
                      value={selectedBusiness}
                      onValueChange={setSelectedBusiness}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a business" />
                      </SelectTrigger>
                      <SelectContent>
                        {businesses
                          .filter((b) => b.isActive)
                          .map((business) => (
                            <SelectItem key={business.id} value={business.id}>
                              <div className="flex items-center space-x-2">
                                <Building className="h-4 w-4" />
                                <span>{business.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="service">Select Service</Label>
                    <Select
                      value={selectedService}
                      onValueChange={setSelectedService}
                      disabled={!selectedBusiness}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a service" />
                      </SelectTrigger>
                      <SelectContent>
                        {services
                          .filter(
                            (s) =>
                              s.businessId === selectedBusiness && s.isActive
                          )
                          .map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              <div className="flex items-center justify-between">
                                <span>{service.name}</span>
                                <span className="text-sm text-gray-500">
                                  ${service.price}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="date">Select Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  <div>
                    <Label htmlFor="time">Select Time</Label>
                    <Select
                      value={selectedTime}
                      onValueChange={setSelectedTime}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a time" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => {
                          const hour = i + 8; // 8 AM to 8 PM
                          return (
                            <SelectItem key={hour} value={`${hour}:00`}>
                              {hour > 12
                                ? `${hour - 12}:00 PM`
                                : `${hour}:00 AM`}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Any special requests or notes..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    onClick={handleCreateBooking}
                    disabled={
                      !selectedBusiness ||
                      !selectedService ||
                      !selectedDate ||
                      !selectedTime
                    }
                    className="w-full"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Appointment
                  </Button>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Booking Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedBusiness && (
                        <div className="flex items-center space-x-3">
                          <Building className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium">
                              {
                                businesses.find(
                                  (b) => b.id === selectedBusiness
                                )?.name
                              }
                            </p>
                            <p className="text-sm text-gray-500">
                              {
                                businesses.find(
                                  (b) => b.id === selectedBusiness
                                )?.address
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedService && (
                        <div className="flex items-center space-x-3">
                          <CreditCard className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">
                              {
                                services.find((s) => s.id === selectedService)
                                  ?.name
                              }
                            </p>
                            <p className="text-sm text-gray-500">
                              $
                              {
                                services.find((s) => s.id === selectedService)
                                  ?.price
                              }{" "}
                              •
                              {
                                services.find((s) => s.id === selectedService)
                                  ?.duration
                              }{" "}
                              min
                            </p>
                          </div>
                        </div>
                      )}

                      {selectedDate && (
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-purple-600" />
                          <div>
                            <p className="font-medium">
                              {new Date(selectedDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                            {selectedTime && (
                              <p className="text-sm text-gray-500">
                                at {selectedTime}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {notes && (
                        <div className="flex items-start space-x-3">
                          <div className="h-5 w-5 text-orange-600 mt-0.5">
                            📝
                          </div>
                          <div>
                            <p className="font-medium">Notes</p>
                            <p className="text-sm text-gray-500">{notes}</p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Your account details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge variant="outline" className="mt-1">
                      {user.role.replace("_", " ")}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Member Since
                    </Label>
                    <p className="text-sm text-gray-600">
                      {user.createdAt ? formatDate(user.createdAt) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Account Type
                    </Label>
                    <p className="text-sm text-gray-600 capitalize">
                      {user.role.toLowerCase().replace("_", " ")}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
