// Admin Bookings Types
export interface AdminBookingsState {
  // Data
  bookings: any[];
  selectedBooking: any | null;
  
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
