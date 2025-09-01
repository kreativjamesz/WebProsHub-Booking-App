import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Booking } from '@/types';
import { AdminBookingsState } from './adminBookings.types';

const initialState: AdminBookingsState = {
  bookings: [],
  selectedBooking: null,
  isLoadingBookings: false,
  isLoadingBooking: false,
  isUpdatingBooking: false,
  isDeletingBooking: false,
  currentPage: 1,
  totalPages: 1,
  totalBookings: 0,
  bookingsPerPage: 20,
  searchTerm: '',
  statusFilter: 'all',
  dateFilter: 'all',
  businessFilter: 'all',
  customerFilter: 'all',
  error: null,
  successMessage: null,
};

// Async thunks
export const fetchBookings = createAsyncThunk(
  'adminBookings/fetchBookings',
  async ({ page = 1, search = '', status = 'all', date = 'all', business = 'all', customer = 'all' }: {
    page?: number;
    search?: string;
    status?: string;
    date?: string;
    business?: string;
    customer?: string;
  }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/admin/bookings?page=${page}&search=${search}&status=${status}&date=${date}&business=${business}&customer=${customer}`);
    const data = await response.json();
    return data;
  }
);

export const fetchBookingById = createAsyncThunk(
  'adminBookings/fetchBookingById',
  async (bookingId: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/admin/bookings/${bookingId}`);
    const data = await response.json();
    return data;
  }
);

export const updateBookingStatus = createAsyncThunk(
  'adminBookings/updateBookingStatus',
  async ({ bookingId, status }: { bookingId: string; status: string }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await response.json();
    return data;
  }
);

export const updateBookingDetails = createAsyncThunk(
  'adminBookings/updateBookingDetails',
  async ({ bookingId, updates }: { bookingId: string; updates: Partial<Booking> }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/admin/bookings/${bookingId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    return data;
  }
);

export const deleteBooking = createAsyncThunk(
  'adminBookings/deleteBooking',
  async (bookingId: string) => {
    // TODO: Replace with actual API call
    await fetch(`/api/admin/bookings/${bookingId}`, {
      method: 'DELETE',
    });
    return bookingId;
  }
);

export const bulkUpdateBookings = createAsyncThunk(
  'adminBookings/bulkUpdateBookings',
  async ({ bookingIds, updates }: { bookingIds: string[]; updates: Partial<Booking> }) => {
    // TODO: Replace with actual API call
    const response = await fetch('/api/admin/bookings/bulk-update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingIds, updates }),
    });
    const data = await response.json();
    return data;
  }
);

export const getBookingsAnalytics = createAsyncThunk(
  'adminBookings/getBookingsAnalytics',
  async ({ startDate, endDate }: { startDate: string; endDate: string }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/admin/bookings/analytics?startDate=${startDate}&endDate=${endDate}`);
    const data = await response.json();
    return data;
  }
);

const adminBookingsSlice = createSlice({
  name: 'adminBookings',
  initialState,
  reducers: {
    // Clear messages
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    
    // Set selected booking
    setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
      state.selectedBooking = action.payload;
    },
    
    // Update filters
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setDateFilter: (state, action: PayloadAction<string>) => {
      state.dateFilter = action.payload;
      state.currentPage = 1;
    },
    setBusinessFilter: (state, action: PayloadAction<string>) => {
      state.businessFilter = action.payload;
      state.currentPage = 1;
    },
    setCustomerFilter: (state, action: PayloadAction<string>) => {
      state.customerFilter = action.payload;
      state.currentPage = 1;
    },
    
    // Pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setBookingsPerPage: (state, action: PayloadAction<number>) => {
      state.bookingsPerPage = action.payload;
      state.currentPage = 1;
    },
    
    // Reset state
    resetBookingsState: (state) => {
      state.bookings = [];
      state.selectedBooking = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalBookings = 0;
      state.searchTerm = '';
      state.statusFilter = 'all';
      state.dateFilter = 'all';
      state.businessFilter = 'all';
      state.customerFilter = 'all';
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch bookings
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.isLoadingBookings = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.isLoadingBookings = false;
        state.bookings = action.payload.bookings;
        state.totalPages = action.payload.totalPages;
        state.totalBookings = action.payload.totalBookings;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.isLoadingBookings = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      });
    
    // Fetch booking by ID
    builder
      .addCase(fetchBookingById.pending, (state) => {
        state.isLoadingBooking = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.isLoadingBooking = false;
        state.selectedBooking = action.payload;
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.isLoadingBooking = false;
        state.error = action.error.message || 'Failed to fetch booking';
      });
    
    // Update booking status
    builder
      .addCase(updateBookingStatus.pending, (state) => {
        state.isUpdatingBooking = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.isUpdatingBooking = false;
        // Update booking in the list
        const index = state.bookings.findIndex((booking: Booking) => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.successMessage = 'Booking status updated successfully';
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.isUpdatingBooking = false;
        state.error = action.error.message || 'Failed to update booking status';
      });
    
    // Update booking details
    builder
      .addCase(updateBookingDetails.pending, (state) => {
        state.isUpdatingBooking = true;
        state.error = null;
      })
      .addCase(updateBookingDetails.fulfilled, (state, action) => {
        state.isUpdatingBooking = false;
        // Update booking in the list
        const index = state.bookings.findIndex((booking: Booking) => booking.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
        state.successMessage = 'Booking details updated successfully';
      })
      .addCase(updateBookingDetails.rejected, (state, action) => {
        state.isUpdatingBooking = false;
        state.error = action.error.message || 'Failed to update booking details';
      });
    
    // Delete booking
    builder
      .addCase(deleteBooking.pending, (state) => {
        state.isDeletingBooking = true;
        state.error = null;
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.isDeletingBooking = false;
        // Remove booking from the list
        state.bookings = state.bookings.filter((booking: Booking) => booking.id !== action.payload);
        state.totalBookings -= 1;
        state.successMessage = 'Booking deleted successfully';
      })
      .addCase(deleteBooking.rejected, (state, action) => {
        state.isDeletingBooking = false;
        state.error = action.error.message || 'Failed to delete booking';
      });
    
    // Bulk update bookings
    builder
      .addCase(bulkUpdateBookings.pending, (state) => {
        state.isUpdatingBooking = true;
        state.error = null;
      })
      .addCase(bulkUpdateBookings.fulfilled, (state, action) => {
        state.isUpdatingBooking = false;
        // Update bookings in the list
        action.payload.bookings.forEach((updatedBooking: Booking) => {
          const index = state.bookings.findIndex((booking: Booking) => booking.id === updatedBooking.id);
          if (index !== -1) {
            state.bookings[index] = updatedBooking;
          }
        });
        state.successMessage = 'Bookings updated successfully';
      })
      .addCase(bulkUpdateBookings.rejected, (state, action) => {
        state.isUpdatingBooking = false;
        state.error = action.error.message || 'Failed to update bookings';
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setSelectedBooking,
  setSearchTerm,
  setStatusFilter,
  setDateFilter,
  setBusinessFilter,
  setCustomerFilter,
  setCurrentPage,
  setBookingsPerPage,
  resetBookingsState,
} = adminBookingsSlice.actions;

export default adminBookingsSlice.reducer;
