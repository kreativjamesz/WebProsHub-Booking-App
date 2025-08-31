import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Business, Service, Booking, Review, User } from '@/lib/types';

// Business owner state interface
export interface BusinessOwnerState {
  // Business owner profile
  profile: User | null;
  
  // Business management
  businesses: Business[];
  currentBusiness: Business | null;
  
  // Service management
  services: Service[];
  isCreatingService: boolean;
  isUpdatingService: boolean;
  
  // Booking management
  bookings: Booking[];
  isUpdatingBooking: boolean;
  
  // Reviews management
  reviews: Review[];
  
  // Analytics and reports
  analytics: {
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    monthlyBookings: Array<{ month: string; count: number }>;
    monthlyRevenue: Array<{ month: string; amount: number }>;
  };
  
  // Loading states
  isLoading: boolean;
  isLoadingBusinesses: boolean;
  isLoadingServices: boolean;
  isLoadingBookings: boolean;
  isLoadingReviews: boolean;
  isLoadingAnalytics: boolean;
  
  // Error handling
  error: string | null;
  
  // Pagination
  businessesPage: number;
  servicesPage: number;
  bookingsPage: number;
  reviewsPage: number;
  totalBusinessesPages: number;
  totalServicesPages: number;
  totalBookingsPages: number;
  totalReviewsPages: number;
}

const initialState: BusinessOwnerState = {
  profile: null,
  businesses: [],
  currentBusiness: null,
  services: [],
  isCreatingService: false,
  isUpdatingService: false,
  bookings: [],
  isUpdatingBooking: false,
  reviews: [],
  analytics: {
    totalBookings: 0,
    totalRevenue: 0,
    averageRating: 0,
    monthlyBookings: [],
    monthlyRevenue: [],
  },
  isLoading: false,
  isLoadingBusinesses: false,
  isLoadingServices: false,
  isLoadingBookings: false,
  isLoadingReviews: false,
  isLoadingAnalytics: false,
  error: null,
  businessesPage: 1,
  servicesPage: 1,
  bookingsPage: 1,
  reviewsPage: 1,
  totalBusinessesPages: 1,
  totalServicesPages: 1,
  totalBookingsPages: 1,
  totalReviewsPages: 1,
};

// Async thunks for business owner operations
export const fetchBusinessOwnerProfile = createAsyncThunk(
  'businessOwner/fetchProfile',
  async () => {
    const response = await fetch('/api/business-owner/profile');
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  }
);

export const updateBusinessOwnerProfile = createAsyncThunk(
  'businessOwner/updateProfile',
  async (updates: Partial<User>) => {
    const response = await fetch('/api/business-owner/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  }
);

export const fetchBusinessOwnerBusinesses = createAsyncThunk(
  'businessOwner/fetchBusinesses',
  async (params: { page?: number }) => {
    const response = await fetch(`/api/business-owner/businesses?${new URLSearchParams(params as any)}`);
    if (!response.ok) throw new Error('Failed to fetch businesses');
    return response.json();
  }
);

export const updateBusiness = createAsyncThunk(
  'businessOwner/updateBusiness',
  async ({ businessId, updates }: { businessId: string; updates: Partial<Business> }) => {
    const response = await fetch(`/api/business-owner/businesses/${businessId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update business');
    return response.json();
  }
);

export const fetchBusinessOwnerServices = createAsyncThunk(
  'businessOwner/fetchServices',
  async (params: { businessId: string; page?: number }) => {
    const response = await fetch(`/api/business-owner/businesses/${params.businessId}/services?${new URLSearchParams({ page: params.page?.toString() || '1' })}`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
  }
);

export const createService = createAsyncThunk(
  'businessOwner/createService',
  async ({ businessId, serviceData }: { businessId: string; serviceData: Omit<Service, 'id' | 'createdAt'> }) => {
    const response = await fetch(`/api/business-owner/businesses/${businessId}/services`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(serviceData),
    });
    if (!response.ok) throw new Error('Failed to create service');
    return response.json();
  }
);

export const updateService = createAsyncThunk(
  'businessOwner/updateService',
  async ({ businessId, serviceId, updates }: { businessId: string; serviceId: string; updates: Partial<Service> }) => {
    const response = await fetch(`/api/business-owner/businesses/${businessId}/services/${serviceId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update service');
    return response.json();
  }
);

export const deleteService = createAsyncThunk(
  'businessOwner/deleteService',
  async ({ businessId, serviceId }: { businessId: string; serviceId: string }) => {
    const response = await fetch(`/api/business-owner/businesses/${businessId}/services/${serviceId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete service');
    return { serviceId };
  }
);

export const fetchBusinessOwnerBookings = createAsyncThunk(
  'businessOwner/fetchBookings',
  async (params: { businessId: string; page?: number; status?: string }) => {
    const response = await fetch(`/api/business-owner/businesses/${params.businessId}/bookings?${new URLSearchParams(params as any)}`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  }
);

export const updateBookingStatus = createAsyncThunk(
  'businessOwner/updateBookingStatus',
  async ({ businessId, bookingId, status }: { businessId: string; bookingId: string; status: string }) => {
    const response = await fetch(`/api/business-owner/businesses/${businessId}/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update booking status');
    return response.json();
  }
);

export const fetchBusinessOwnerReviews = createAsyncThunk(
  'businessOwner/fetchReviews',
  async (params: { businessId: string; page?: number }) => {
    const response = await fetch(`/api/business-owner/businesses/${params.businessId}/reviews?${new URLSearchParams(params as any)}`);
    if (!response.ok) throw new Error('Failed to fetch reviews');
    return response.json();
  }
);

export const fetchBusinessOwnerAnalytics = createAsyncThunk(
  'businessOwner/fetchAnalytics',
  async (params: { businessId: string; period?: string }) => {
    const response = await fetch(`/api/business-owner/businesses/${params.businessId}/analytics?${new URLSearchParams(params as any)}`);
    if (!response.ok) throw new Error('Failed to fetch analytics');
    return response.json();
  }
);

const businessOwnerSlice = createSlice({
  name: 'businessOwner',
  initialState,
  reducers: {
    // Local state management
    setCurrentBusiness: (state, action: PayloadAction<Business | null>) => {
      state.currentBusiness = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetBusinessOwnerState: (state) => {
      state.profile = null;
      state.businesses = [];
      state.currentBusiness = null;
      state.services = [];
      state.bookings = [];
      state.reviews = [];
      state.analytics = initialState.analytics;
      state.error = null;
      state.businessesPage = 1;
      state.servicesPage = 1;
      state.bookingsPage = 1;
      state.reviewsPage = 1;
    },
  },
  extraReducers: (builder) => {
    // Profile management
    builder
      .addCase(fetchBusinessOwnerProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessOwnerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchBusinessOwnerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      })
      .addCase(updateBusinessOwnerProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      });
    
    // Business management
    builder
      .addCase(fetchBusinessOwnerBusinesses.pending, (state) => {
        state.isLoadingBusinesses = true;
        state.error = null;
      })
      .addCase(fetchBusinessOwnerBusinesses.fulfilled, (state, action) => {
        state.isLoadingBusinesses = false;
        state.businesses = action.payload.businesses;
        state.totalBusinessesPages = action.payload.totalPages;
        state.businessesPage = action.payload.currentPage;
      })
      .addCase(fetchBusinessOwnerBusinesses.rejected, (state, action) => {
        state.isLoadingBusinesses = false;
        state.error = action.error.message || 'Failed to fetch businesses';
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        const index = state.businesses.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
        if (state.currentBusiness?.id === action.payload.id) {
          state.currentBusiness = action.payload;
        }
      });
    
    // Service management
    builder
      .addCase(fetchBusinessOwnerServices.pending, (state) => {
        state.isLoadingServices = true;
        state.error = null;
      })
      .addCase(fetchBusinessOwnerServices.fulfilled, (state, action) => {
        state.isLoadingServices = false;
        state.services = action.payload.services;
        state.totalServicesPages = action.payload.totalPages;
        state.servicesPage = action.payload.currentPage;
      })
      .addCase(fetchBusinessOwnerServices.rejected, (state, action) => {
        state.isLoadingServices = false;
        state.error = action.error.message || 'Failed to fetch services';
      })
      .addCase(createService.pending, (state) => {
        state.isCreatingService = true;
        state.error = null;
      })
      .addCase(createService.fulfilled, (state, action) => {
        state.isCreatingService = false;
        state.services.unshift(action.payload);
      })
      .addCase(createService.rejected, (state, action) => {
        state.isCreatingService = false;
        state.error = action.error.message || 'Failed to create service';
      })
      .addCase(updateService.pending, (state) => {
        state.isUpdatingService = true;
        state.error = null;
      })
      .addCase(updateService.fulfilled, (state, action) => {
        state.isUpdatingService = false;
        const index = state.services.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.services[index] = action.payload;
        }
      })
      .addCase(updateService.rejected, (state, action) => {
        state.isUpdatingService = false;
        state.error = action.error.message || 'Failed to update service';
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.services = state.services.filter(s => s.id !== action.payload.serviceId);
      });
    
    // Booking management
    builder
      .addCase(fetchBusinessOwnerBookings.pending, (state) => {
        state.isLoadingBookings = true;
        state.error = null;
      })
      .addCase(fetchBusinessOwnerBookings.fulfilled, (state, action) => {
        state.isLoadingBookings = false;
        state.bookings = action.payload.bookings;
        state.totalBookingsPages = action.payload.totalPages;
        state.bookingsPage = action.payload.currentPage;
      })
      .addCase(fetchBusinessOwnerBookings.rejected, (state, action) => {
        state.isLoadingBookings = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      })
      .addCase(updateBookingStatus.pending, (state) => {
        state.isUpdatingBooking = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.isUpdatingBooking = false;
        const index = state.bookings.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.isUpdatingBooking = false;
        state.error = action.error.message || 'Failed to update booking status';
      });
    
    // Reviews management
    builder
      .addCase(fetchBusinessOwnerReviews.pending, (state) => {
        state.isLoadingReviews = true;
        state.error = null;
      })
      .addCase(fetchBusinessOwnerReviews.fulfilled, (state, action) => {
        state.isLoadingReviews = false;
        state.reviews = action.payload.reviews;
        state.totalReviewsPages = action.payload.totalPages;
        state.reviewsPage = action.payload.currentPage;
      })
      .addCase(fetchBusinessOwnerReviews.rejected, (state, action) => {
        state.isLoadingReviews = false;
        state.error = action.error.message || 'Failed to fetch reviews';
      });
    
    // Analytics
    builder
      .addCase(fetchBusinessOwnerAnalytics.pending, (state) => {
        state.isLoadingAnalytics = true;
        state.error = null;
      })
      .addCase(fetchBusinessOwnerAnalytics.fulfilled, (state, action) => {
        state.isLoadingAnalytics = false;
        state.analytics = action.payload;
      })
      .addCase(fetchBusinessOwnerAnalytics.rejected, (state, action) => {
        state.isLoadingAnalytics = false;
        state.error = action.error.message || 'Failed to fetch analytics';
      });
  },
});

export const {
  setCurrentBusiness,
  clearError,
  resetBusinessOwnerState,
} = businessOwnerSlice.actions;

export default businessOwnerSlice.reducer;
