import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { databases, DATABASE_ID, COLLECTIONS } from "../../../appwrite";
import { BusinessesState, Business } from "../../../types";
import { ID, Query } from "appwrite";

// Async thunks
export const fetchBusinesses = createAsyncThunk(
  "businesses/fetchBusinesses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BUSINESSES,
        [Query.equal("isActive", true)]
      );
      return response.documents as unknown as Business[];
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchFeaturedBusinesses = createAsyncThunk(
  "businesses/fetchFeaturedBusinesses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BUSINESSES,
        [Query.equal("isActive", true), Query.orderDesc("rating")]
      );
      return response.documents as unknown as Business[];
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchBusinessById = createAsyncThunk(
  "businesses/fetchBusinessById",
  async (businessId: string, { rejectWithValue }) => {
    try {
      const response = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.BUSINESSES,
        businessId
      );
      return response as unknown as Business;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const createBusiness = createAsyncThunk(
  "businesses/createBusiness",
  async (
    businessData: Omit<Business, "$id" | "createdAt" | "updatedAt">,
    { rejectWithValue }
  ) => {
    try {
      const response = await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.BUSINESSES,
        ID.unique(),
        {
          ...businessData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      );
      return response as unknown as Business;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateBusiness = createAsyncThunk(
  "businesses/updateBusiness",
  async (
    {
      businessId,
      businessData,
    }: { businessId: string; businessData: Partial<Business> },
    { rejectWithValue }
  ) => {
    try {
      const response = await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.BUSINESSES,
        businessId,
        {
          ...businessData,
          updatedAt: new Date().toISOString(),
        }
      );
      return response as unknown as Business;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const searchBusinesses = createAsyncThunk(
  "businesses/searchBusinesses",
  async (
    { query, categoryId }: { query?: string; categoryId?: string },
    { rejectWithValue }
  ) => {
    try {
      const queries = [Query.equal("isActive", true)];

      if (query) {
        queries.push(Query.search("name", query));
      }

      if (categoryId) {
        queries.push(Query.equal("categoryId", categoryId));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.BUSINESSES,
        queries
      );
      return response.documents as unknown as Business[];
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

const initialState: BusinessesState = {
  businesses: [],
  featuredBusinesses: [],
  selectedBusiness: null,
  isLoading: false,
  error: null,
};

const businessesSlice = createSlice({
  name: "businesses",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedBusiness: (state, action: PayloadAction<Business | null>) => {
      state.selectedBusiness = action.payload;
    },
    clearBusinesses: (state) => {
      state.businesses = [];
      state.featuredBusinesses = [];
      state.selectedBusiness = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch businesses
      .addCase(fetchBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = action.payload;
        state.error = null;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch featured businesses
      .addCase(fetchFeaturedBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedBusinesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featuredBusinesses = action.payload;
        state.error = null;
      })
      .addCase(fetchFeaturedBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch business by ID
      .addCase(fetchBusinessById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBusinessById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBusiness = action.payload;
        state.error = null;
      })
      .addCase(fetchBusinessById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create business
      .addCase(createBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses.push(action.payload);
        state.error = null;
      })
      .addCase(createBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update business
      .addCase(updateBusiness.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateBusiness.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.businesses.findIndex(
          (b) => b.$id === action.payload.$id
        );
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
        if (state.selectedBusiness?.$id === action.payload.$id) {
          state.selectedBusiness = action.payload;
        }
        state.error = null;
      })
      .addCase(updateBusiness.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search businesses
      .addCase(searchBusinesses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchBusinesses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.businesses = action.payload;
        state.error = null;
      })
      .addCase(searchBusinesses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setSelectedBusiness, clearBusinesses } =
  businessesSlice.actions;
export default businessesSlice.reducer;
