import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Business, Service, Category } from '@/lib/types';

// Public data state interface
export interface PublicState {
  // Business listings (public view)
  businesses: Business[];
  featuredBusinesses: Business[];
  
  // Services and categories
  services: Service[];
  categories: Category[];
  
  // Search and filtering
  searchQuery: string;
  selectedCategory: string | null;
  selectedLocation: string | null;
  
  // Loading states
  isLoading: boolean;
  isSearching: boolean;
  
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
  services: [],
  categories: [],
  searchQuery: '',
  selectedCategory: null,
  selectedLocation: null,
  isLoading: false,
  isSearching: false,
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
    const response = await fetch(`/api/public/businesses?${new URLSearchParams(params as any)}`);
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
    const response = await fetch(`/api/public/services?${new URLSearchParams(params as any)}`);
    if (!response.ok) throw new Error('Failed to fetch services');
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
    
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    
    clearFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = null;
      state.selectedLocation = null;
      state.currentPage = 1;
    },
    
    clearError: (state) => {
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
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSelectedLocation,
  setCurrentPage,
  clearFilters,
  clearError,
} = publicSlice.actions;

export default publicSlice.reducer;
