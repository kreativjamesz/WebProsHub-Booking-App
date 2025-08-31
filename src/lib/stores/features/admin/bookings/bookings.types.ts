import { Booking } from "@/lib/types";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

// Admin bookings management state interface
export interface BookingsState {
  // Data
  bookings: Booking[];
  selectedBooking: Booking | null;
  
  // Loading states
  isLoadingBookings: boolean;
  isLoadingBooking: boolean;
  isUpdatingBooking: boolean;
  isDeletingBooking: boolean;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalBookings: number;
  bookingsPerPage: number;
  
  // Filters and search
  searchTerm: string;
  statusFilter: string;
  dateFilter: string;
  businessFilter: string;
  customerFilter: string;
  
  // Error handling
  error: string | null;
  
  // Success messages
  successMessage: string | null;
}

