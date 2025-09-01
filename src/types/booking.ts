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
  // Relations
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  business?: {
    id: string;
    name: string;
    email: string;
  };
  service?: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
}

export interface BookingsState {
  bookings: Booking[];
  userBookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}
