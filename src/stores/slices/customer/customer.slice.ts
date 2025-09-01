import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Booking, Review, Favorite } from '@/types';

// Customer state interface
export interface CustomerState {
  // Customer profile
  profile: User | null;
  
  // Customer-specific data
  bookings: Booking[];
  reviews: Review[];
  favorites: Favorite[];
  
  // Booking management
  currentBooking: Booking | null;
  isCreatingBooking: boolean;
  
  // Review management
  isSubmittingReview: boolean;
  
  // Loading states
  isLoading: boolean;
  isLoadingBookings: boolean;
  isLoadingReviews: boolean;
  isLoadingFavorites: boolean;
  
  // Error handling
  error: string | null;
  
  // Pagination
  bookingsPage: number;
  reviewsPage: number;
  totalBookingsPages: number;
  totalReviewsPages: number;
}

const initialState: CustomerState = {
  profile: null,
  bookings: [],
  reviews: [],
  favorites: [],
  currentBooking: null,
  isCreatingBooking: false,
  isSubmittingReview: false,
  isLoading: false,
  isLoadingBookings: false,
  isLoadingReviews: false,
  isLoadingFavorites: false,
  error: null,
  bookingsPage: 1,
  reviewsPage: 1,
  totalBookingsPages: 1,
  totalReviewsPages: 1,
};

// Async thunks for customer operations
export const fetchCustomerProfile = createAsyncThunk(
  'customer/fetchProfile',
  async () => {
    const response = await fetch('/api/customer/profile');
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  }
);

export const updateCustomerProfile = createAsyncThunk(
  'customer/updateProfile',
  async (updates: Partial<User>) => {
    const response = await fetch('/api/customer/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }
);

export const fetchCustomerBookings = createAsyncThunk(
  'customer/fetchBookings',
  async (params: { page?: number; status?: string }) => {
    const response = await fetch(`/api/customer/bookings?${new URLSearchParams(params as any)}`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  }
);

export const createBooking = createAsyncThunk(
  'customer/createBooking',
  async (bookingData: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    const response = await fetch('/api/customer/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return response.json();
  }
);

export const cancelBooking = createAsyncThunk(
  'customer/cancelBooking',
  async (bookingId: string) => {
    const response = await fetch(`/api/customer/bookings/${bookingId}/cancel`, {
      method: 'PUT',
    });
    if (!response.ok) throw new Error('Failed to cancel booking');
    return response.json();
  }
);

export const fetchCustomerReviews = createAsyncThunk(
  'customer/fetchReviews',
  async (params: { page?: number }) => {
    const response = await fetch(`/api/customer/reviews?${new URLSearchParams(params as any)}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  }
);

export const submitReview = createAsyncThunk(
  'customer/submitReview',
  async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const response = await fetch('/api/customer/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
    if (!response.ok) throw new Error('Failed to submit review');
    return response.json();
  }
);

export const fetchCustomerFavorites = createAsyncThunk(
  'customer/fetchFavorites',
  async () => {
    const response = await fetch('/api/customer/favorites');
    if (!response.ok) throw new Error('Failed to fetch favorites');
    return response.json();
  }
);

export const addToFavorites = createAsyncThunk(
  'customer/addToFavorites',
  async (businessId: string) => {
    const response = await fetch('/api/customer/favorites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId }),
    });
    if (!response.ok) throw new Error('Failed to add to favorites');
    return response.json();
  }
);

export const removeFromFavorites = createAsyncThunk(
  'customer/removeFromFavorites',
  async (businessId: string) => {
    const response = await fetch(`/api/customer/favorites/${businessId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to remove from favorites');
    return { businessId };
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    // Local state management
    setCurrentBooking: (state, action: PayloadAction<Booking | null>) => {
      state.currentBooking = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetCustomerState: (state) => {
      state.profile = null;
      state.bookings = [];
      state.reviews = [];
      state.favorites = [];
      state.currentBooking = null;
      state.error = null;
      state.bookingsPage = 1;
      state.reviewsPage = 1;
    },
  },
  extraReducers: (builder) => {
    // Profile management
    builder
      .addCase(fetchCustomerProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchCustomerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      .addCase(updateCustomerProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
    
    // Bookings management
    builder
      .addCase(fetchCustomerBookings.pending, (state) => {
        state.isLoadingBookings = true;
        state.error = null;
      })
      .addCase(fetchCustomerBookings.fulfilled, (state, action) => {
        state.isLoadingBookings = false;
        state.bookings = action.payload.bookings;
        state.totalBookingsPages = action.payload.totalPages;
        state.bookingsPage = action.payload.currentPage;
      })
      .addCase(fetchCustomerBookings.rejected, (state, action) => {
        state.isLoadingBookings = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      })
      .addCase(createBooking.pending, (state) => {
        state.isCreatingBooking = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.isCreatingBooking = false;
        state.bookings.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.isCreatingBooking = false;
        state.error = action.error.message || 'Failed to create booking';
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
    
    // Reviews management
    builder
      .addCase(fetchCustomerReviews.pending, (state) => {
        state.isLoadingReviews = true;
        state.error = null;
      })
      .addCase(fetchCustomerReviews.fulfilled, (state, action) => {
        state.isLoadingReviews = false;
        state.reviews = action.payload.reviews;
        state.totalReviewsPages = action.payload.totalPages;
        state.reviewsPage = action.payload.currentPage;
      })
      .addCase(fetchCustomerReviews.rejected, (state, action) => {
        state.isLoadingReviews = false;
        state.error = action.error.message || 'Failed to fetch reviews';
      })
      .addCase(submitReview.pending, (state) => {
        state.isSubmittingReview = true;
        state.error = null;
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        state.isSubmittingReview = false;
        state.reviews.unshift(action.payload);
      })
      .addCase(submitReview.rejected, (state, action) => {
        state.isSubmittingReview = false;
        state.error = action.error.message || 'Failed to submit review';
      });
    
    // Favorites management
    builder
      .addCase(fetchCustomerFavorites.pending, (state) => {
        state.isLoadingFavorites = true;
        state.error = null;
      })
      .addCase(fetchCustomerFavorites.fulfilled, (state, action) => {
        state.isLoadingFavorites = false;
        state.favorites = action.payload;
      })
      .addCase(fetchCustomerFavorites.rejected, (state, action) => {
        state.isLoadingFavorites = false;
        state.error = action.error.message || 'Failed to fetch favorites';
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.favorites.push(action.payload);
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(f => f.businessId !== action.payload.businessId);
      });
  },
});

export const {
  setCurrentBooking,
  clearError,
  resetCustomerState,
} = customerSlice.actions;

export default customerSlice.reducer;
