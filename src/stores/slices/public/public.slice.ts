import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Business, Service, Category, Booking, Promo } from '@/types';

// Public data state interface
export interface PublicState {
  // Business listings (public view)
  businesses: Business[];
  featuredBusinesses: Business[];
  selectedBusiness: Business | null;
  
  // Services and categories
  services: Service[];
  categories: Category[];
  
  // Bookings (public view)
  bookings: Booking[];
  
  // Promos and offers
  promos: Promo[];
  featuredPromos: Promo[];
  
  // Search and filtering
  searchQuery: string;
  selectedCategory: string | null;
  selectedLocation: string | null;
  selectedService: string | null;
  
  // Loading states
  isLoading: boolean;
  isSearching: boolean;
  isLoadingBusiness: boolean;
  isLoadingServices: boolean;
  isLoadingCategories: boolean;
  isLoadingBookings: boolean;
  isLoadingPromos: boolean;
  
  // Error handling
  error: string | null;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

const initialState: PublicState = {
  businesses: [],
  featuredBusinesses: [],
  selectedBusiness: null,
  services: [],
  categories: [],
  bookings: [],
  promos: [],
  featuredPromos: [],
  searchQuery: '',
  selectedCategory: null,
  selectedLocation: null,
  selectedService: null,
  isLoading: false,
  isSearching: false,
  isLoadingBusiness: false,
  isLoadingServices: false,
  isLoadingCategories: false,
  isLoadingBookings: false,
  isLoadingPromos: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 12,
};

// Async thunks for public data
export const fetchPublicBusinesses = createAsyncThunk(
  'public/fetchBusinesses',
  async (params: { page?: number; category?: string; location?: string; search?: string }) => {
    // This would call your API endpoint for public business data
    const response = await fetch(`/api/public/businesses?${new URLSearchParams(params as unknown as Record<string, string>)}`);
    if (!response.ok) throw new Error('Failed to fetch businesses');
    return response.json();
  }
);

export const fetchFeaturedBusinesses = createAsyncThunk(
  'public/fetchFeaturedBusinesses',
  async () => {
    const response = await fetch('/api/public/businesses/featured');
    if (!response.ok) throw new Error('Failed to fetch featured businesses');
    return response.json();
  }
);

export const fetchPublicCategories = createAsyncThunk(
  'public/fetchCategories',
  async () => {
    const response = await fetch('/api/public/categories');
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  }
);

export const fetchPublicServices = createAsyncThunk(
  'public/fetchServices',
  async (params: { category?: string; businessId?: string }) => {
    const response = await fetch(`/api/public/services?${new URLSearchParams(params as unknown as Record<string, string>)}`);
    if (!response.ok) throw new Error('Failed to fetch services');
    return response.json();
  }
);

// Business APIs
export const fetchBusinessById = createAsyncThunk(
  'public/fetchBusinessById',
  async (businessId: string) => {
    const response = await fetch(`/api/public/businesses/${businessId}`);
    if (!response.ok) throw new Error('Failed to fetch business');
    return response.json();
  }
);

export const searchBusinesses = createAsyncThunk(
  'public/searchBusinesses',
  async (params: { query: string; category?: string; location?: string; page?: number }) => {
    const response = await fetch(`/api/public/businesses/search?${new URLSearchParams(params as unknown as Record<string, string>)}`);
    if (!response.ok) throw new Error('Failed to search businesses');
    return response.json();
  }
);

// Category APIs
export const fetchCategoriesWithCounts = createAsyncThunk(
  'public/fetchCategoriesWithCounts',
  async () => {
    const response = await fetch('/api/public/categories/with-counts');
    if (!response.ok) throw new Error('Failed to fetch categories with counts');
    return response.json();
  }
);

// Service APIs
export const fetchServicesByBusiness = createAsyncThunk(
  'public/fetchServicesByBusiness',
  async (businessId: string) => {
    const response = await fetch(`/api/public/businesses/${businessId}/services`);
    if (!response.ok) throw new Error('Failed to fetch business services');
    return response.json();
  }
);

export const searchServices = createAsyncThunk(
  'public/searchServices',
  async (params: { query: string; category?: string; location?: string; page?: number }) => {
    const response = await fetch(`/api/public/services/search?${new URLSearchParams(params as unknown as Record<string, string>)}`);
    if (!response.ok) throw new Error('Failed to search services');
    return response.json();
  }
);

// Booking APIs
export const fetchPublicBookings = createAsyncThunk(
  'public/fetchBookings',
  async (params: { businessId?: string; status?: string; page?: number }) => {
    const response = await fetch(`/api/public/bookings?${new URLSearchParams(params as unknown as Record<string, string>)}`);
    if (!response.ok) throw new Error('Failed to fetch bookings');
    return response.json();
  }
);

export const createPublicBooking = createAsyncThunk(
  'public/createBooking',
  async (bookingData: { serviceId: string; businessId: string; date: string; time: string; notes?: string }) => {
    const response = await fetch('/api/public/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) throw new Error('Failed to create booking');
    return response.json();
  }
);
// Promo APIs
export const fetchPublicPromos = createAsyncThunk(
  'public/fetchPromos',
  async (params: { businessId?: string; category?: string; active?: boolean }) => {
    const response = await fetch(`/api/public/promos?${new URLSearchParams(params as unknown as Record<string, string>)}`);
    if (!response.ok) throw new Error('Failed to fetch promos');
    return response.json();
  }
);

export const fetchFeaturedPromos = createAsyncThunk(
  'public/fetchFeaturedPromos',
  async () => {
    const response = await fetch('/api/public/promos/featured');
    if (!response.ok) throw new Error('Failed to fetch featured promos');
    return response.json();
  }
);

const publicSlice = createSlice({
  name: 'public',
  initialState,
  reducers: {
    // Search and filtering actions
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page on new search
    },
    
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
    
    setSelectedLocation: (state, action: PayloadAction<string | null>) => {
      state.selectedLocation = action.payload;
      state.currentPage = 1;
    },
    
    setSelectedService: (state, action: PayloadAction<string | null>) => {
      state.selectedService = action.payload;
    },
    
    setSelectedBusiness: (state, action: PayloadAction<Business | null>) => {
      state.selectedBusiness = action.payload;
    },
    
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = null;
      state.selectedLocation = null;
      state.selectedService = null;
      state.currentPage = 1;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetPublicState: (state) => {
      state.businesses = [];
      state.featuredBusinesses = [];
      state.selectedBusiness = null;
      state.services = [];
      state.categories = [];
      state.bookings = [];
      state.promos = [];
      state.featuredPromos = [];
      state.searchQuery = '';
      state.selectedCategory = null;
      state.selectedLocation = null;
      state.selectedService = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch public businesses
    builder
      .addCase(fetchPublicBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicBusinesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = action.payload.businesses;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchPublicBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch businesses';
      });
    
    // Fetch featured businesses
    builder
      .addCase(fetchFeaturedBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedBusinesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredBusinesses = action.payload;
      })
      .addCase(fetchFeaturedBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch featured businesses';
      });
    
    // Fetch categories
    builder
      .addCase(fetchPublicCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPublicCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchPublicCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      });
    
    // Fetch services
    builder
      .addCase(fetchPublicServices.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(fetchPublicServices.fulfilled, (state, action) => {
        state.isSearching = false;
        state.services = action.payload;
      })
      .addCase(fetchPublicServices.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.error.message || 'Failed to fetch services';
      });
    
    // Fetch business by ID
    builder
      .addCase(fetchBusinessById.pending, (state) => {
        state.isLoadingBusiness = true;
        state.error = null;
      })
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        state.isLoadingBusiness = false;
        state.selectedBusiness = action.payload;
      })
      .addCase(fetchBusinessById.rejected, (state, action) => {
        state.isLoadingBusiness = false;
        state.error = action.error.message || 'Failed to fetch business';
      });
    
    // Search businesses
    builder
      .addCase(searchBusinesses.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchBusinesses.fulfilled, (state, action) => {
        state.isSearching = false;
        state.businesses = action.payload.businesses;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(searchBusinesses.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.error.message || 'Failed to search businesses';
      });
    
    // Fetch categories with counts
    builder
      .addCase(fetchCategoriesWithCounts.pending, (state) => {
        state.isLoadingCategories = true;
        state.error = null;
      })
      .addCase(fetchCategoriesWithCounts.fulfilled, (state, action) => {
        state.isLoadingCategories = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesWithCounts.rejected, (state, action) => {
        state.isLoadingCategories = false;
        state.error = action.error.message || 'Failed to fetch categories with counts';
      });
    
    // Fetch services by business
    builder
      .addCase(fetchServicesByBusiness.pending, (state) => {
        state.isLoadingServices = true;
        state.error = null;
      })
      .addCase(fetchServicesByBusiness.fulfilled, (state, action) => {
        state.isLoadingServices = false;
        state.services = action.payload;
      })
      .addCase(fetchServicesByBusiness.rejected, (state, action) => {
        state.isLoadingServices = false;
        state.error = action.error.message || 'Failed to fetch business services';
      });
    
    // Search services
    builder
      .addCase(searchServices.pending, (state) => {
        state.isSearching = true;
        state.error = null;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.isSearching = false;
        state.services = action.payload.services;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.isSearching = false;
        state.error = action.error.message || 'Failed to search services';
      });
    
    // Fetch public bookings
    builder
      .addCase(fetchPublicBookings.pending, (state) => {
        state.isLoadingBookings = true;
        state.error = null;
      })
      .addCase(fetchPublicBookings.fulfilled, (state, action) => {
        state.isLoadingBookings = false;
        state.bookings = action.payload.bookings;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchPublicBookings.rejected, (state, action) => {
        state.isLoadingBookings = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      });
    
    // Create public booking
    builder
      .addCase(createPublicBooking.pending, (state) => {
        state.isLoadingBookings = true;
        state.error = null;
      })
      .addCase(createPublicBooking.fulfilled, (state, action) => {
        state.isLoadingBookings = false;
        state.bookings.push(action.payload);
      })
      .addCase(createPublicBooking.rejected, (state, action) => {
        state.isLoadingBookings = false;
        state.error = action.error.message || 'Failed to create booking';
      });
    
    // Fetch public promos
    builder
      .addCase(fetchPublicPromos.pending, (state) => {
        state.isLoadingPromos = true;
        state.error = null;
      })
      .addCase(fetchPublicPromos.fulfilled, (state, action) => {
        state.isLoadingPromos = false;
        state.promos = action.payload;
      })
      .addCase(fetchPublicPromos.rejected, (state, action) => {
        state.isLoadingPromos = false;
        state.error = action.error.message || 'Failed to fetch promos';
      });
    
    // Fetch featured promos
    builder
      .addCase(fetchFeaturedPromos.pending, (state) => {
        state.isLoadingPromos = true;
        state.error = null;
      })
      .addCase(fetchFeaturedPromos.fulfilled, (state, action) => {
        state.isLoadingPromos = false;
        state.featuredPromos = action.payload;
      })
      .addCase(fetchFeaturedPromos.rejected, (state, action) => {
        state.isLoadingPromos = false;
        state.error = action.error.message || 'Failed to fetch featured promos';
      });
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedLocation,
  setSelectedService,
  setSelectedBusiness,
  setCurrentPage,
  clearFilters,
  clearError,
  resetPublicState,
} = publicSlice.actions;

export default publicSlice.reducer;
