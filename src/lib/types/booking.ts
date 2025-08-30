export interface Booking {
  id: string;
  userId: string;
  businessId: string;
  serviceId: string;
  date: Date;
  time: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingsState {
  bookings: Booking[];
  userBookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}
