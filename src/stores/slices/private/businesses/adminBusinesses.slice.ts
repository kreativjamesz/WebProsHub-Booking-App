import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Business } from "@/types";
import { getCookie } from "@/lib/utils/cookies";
import { AdminBusinessesState } from "./adminBusinesses.types";

const initialState: AdminBusinessesState = {
  businesses: [],
  selectedBusiness: null,
  isLoadingBusinesses: false,
  isLoadingBusiness: false,
  isUpdatingBusiness: false,
  isDeletingBusiness: false,
  isAssigningOwner: false,
  currentPage: 1,
  totalPages: 1,
  totalBusinesses: 0,
  businessesPerPage: 20,
  searchTerm: "",
  statusFilter: "all",
  categoryFilter: "all",
  cityFilter: "all",
  ratingFilter: "all",
  error: null,
  successMessage: null,
};

// Async thunks
export const fetchBusinesses = createAsyncThunk(
  "adminBusinesses/fetchBusinesses",
  async ({
    page = 1,
    search = "",
    status = "all",
    category = "all",
    city = "all",
  }: {
    page?: number;
    search?: string;
    status?: string;
    category?: string;
    city?: string;
  }) => {
    const adminToken = getCookie("adminToken");

    if (!adminToken) {
      throw new Error("Admin authentication required");
    }

    const response = await fetch(
      `/api/admin/businesses?page=${page}&search=${search}&status=${status}&category=${category}&city=${city}`,
      {
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 401) {
      throw new Error("Admin authentication failed");
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || "Failed to fetch businesses");
    }

    return {
      businesses: data.businesses,
      totalPages: data.pagination.totalPages,
      totalBusinesses: data.pagination.totalBusinesses,
      currentPage: data.pagination.currentPage,
    };
  }
);

export const fetchBusinessById = createAsyncThunk(
  "adminBusinesses/fetchBusinessById",
  async (businessId: string) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/admin/businesses/${businessId}`);
    const data = await response.json();
    return data;
  }
);

export const updateBusinessStatus = createAsyncThunk(
  "adminBusinesses/updateBusinessStatus",
  async ({
    businessId,
    isActive,
  }: {
    businessId: string;
    isActive: boolean;
  }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/admin/businesses/${businessId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });
    const data = await response.json();
    return data;
  }
);

export const assignBusinessOwner = createAsyncThunk(
  "adminBusinesses/assignBusinessOwner",
  async ({
    businessId,
    ownerEmail,
  }: {
    businessId: string;
    ownerEmail: string;
  }) => {
    // TODO: Replace with actual API call
    const response = await fetch(
      `/api/admin/businesses/${businessId}/assign-owner`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ownerEmail }),
      }
    );
    const data = await response.json();
    return data;
  }
);

export const updateBusinessDetails = createAsyncThunk(
  "adminBusinesses/updateBusinessDetails",
  async ({
    businessId,
    updates,
  }: {
    businessId: string;
    updates: Partial<Business>;
  }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/admin/businesses/${businessId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const data = await response.json();
    return data;
  }
);

export const deleteBusiness = createAsyncThunk(
  "adminBusinesses/deleteBusiness",
  async (businessId: string) => {
    // TODO: Replace with actual API call
    await fetch(`/api/admin/businesses/${businessId}`, {
      method: "DELETE",
    });
    return businessId;
  }
);

export const bulkUpdateBusinesses = createAsyncThunk(
  "adminBusinesses/bulkUpdateBusinesses",
  async ({
    businessIds,
    updates,
  }: {
    businessIds: string[];
    updates: Partial<Business>;
  }) => {
    // TODO: Replace with actual API call
    const response = await fetch("/api/admin/businesses/bulk-update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ businessIds, updates }),
    });
    const data = await response.json();
    return data;
  }
);

const adminBusinessesSlice = createSlice({
  name: "adminBusinesses",
  initialState,
  reducers: {
    // Clear messages
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },

    // Set selected business
    setSelectedBusiness: (state, action: PayloadAction<Business | null>) => {
      state.selectedBusiness = action.payload;
    },

    // Update filters
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter: (
      state,
      action: PayloadAction<"all" | "active" | "inactive">
    ) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.categoryFilter = action.payload;
      state.currentPage = 1;
    },
    setCityFilter: (state, action: PayloadAction<string>) => {
      state.cityFilter = action.payload;
      state.currentPage = 1;
    },

    // Pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setBusinessesPerPage: (state, action: PayloadAction<number>) => {
      state.businessesPerPage = action.payload;
      state.currentPage = 1;
    },

    // Reset state
    resetBusinessesState: (state) => {
      state.businesses = [];
      state.selectedBusiness = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalBusinesses = 0;
      state.searchTerm = "";
      state.statusFilter = "all";
      state.categoryFilter = "all";
      state.cityFilter = "all";
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch businesses
    builder
      .addCase(fetchBusinesses.pending, (state) => {
        state.isLoadingBusinesses = true;
        state.error = null;
      })
      .addCase(fetchBusinesses.fulfilled, (state, action) => {
        state.isLoadingBusinesses = false;
        state.businesses = action.payload.businesses;
        state.totalPages = action.payload.totalPages;
        state.totalBusinesses = action.payload.totalBusinesses;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchBusinesses.rejected, (state, action) => {
        state.isLoadingBusinesses = false;
        const errorMessage =
          action.error.message || "Failed to fetch businesses";
        state.error = errorMessage;

        // Global auth error handling
        if (errorMessage.includes("Admin authentication failed")) {
          // Dispatch global auth error event
          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("admin-auth-error", {
                detail: { error: errorMessage },
              })
            );
          }
        }
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
        state.error = action.error.message || "Failed to fetch business";
      });

    // Update business status
    builder
      .addCase(updateBusinessStatus.pending, (state) => {
        state.isUpdatingBusiness = true;
        state.error = null;
      })
      .addCase(updateBusinessStatus.fulfilled, (state, action) => {
        state.isUpdatingBusiness = false;
        // Update business in the list
        const index = state.businesses.findIndex(
          (business) => business.id === action.payload.id
        );
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
        state.successMessage = "Business status updated successfully";
      })
      .addCase(updateBusinessStatus.rejected, (state, action) => {
        state.isUpdatingBusiness = false;
        state.error =
          action.error.message || "Failed to update business status";
      });

    // Assign business owner
    builder
      .addCase(assignBusinessOwner.pending, (state) => {
        state.isAssigningOwner = true;
        state.error = null;
      })
      .addCase(assignBusinessOwner.fulfilled, (state, action) => {
        state.isAssigningOwner = false;
        // Update business in the list
        const index = state.businesses.findIndex(
          (business) => business.id === action.payload.id
        );
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
        state.successMessage = "Business owner assigned successfully";
      })
      .addCase(assignBusinessOwner.rejected, (state, action) => {
        state.isAssigningOwner = false;
        state.error = action.error.message || "Failed to assign business owner";
      });

    // Update business details
    builder
      .addCase(updateBusinessDetails.pending, (state) => {
        state.isUpdatingBusiness = true;
        state.error = null;
      })
      .addCase(updateBusinessDetails.fulfilled, (state, action) => {
        state.isUpdatingBusiness = false;
        // Update business in the list
        const index = state.businesses.findIndex(
          (business) => business.id === action.payload.id
        );
        if (index !== -1) {
          state.businesses[index] = action.payload;
        }
        state.successMessage = "Business details updated successfully";
      })
      .addCase(updateBusinessDetails.rejected, (state, action) => {
        state.isUpdatingBusiness = false;
        state.error =
          action.error.message || "Failed to update business details";
      });

    // Delete business
    builder
      .addCase(deleteBusiness.pending, (state) => {
        state.isDeletingBusiness = true;
        state.error = null;
      })
      .addCase(deleteBusiness.fulfilled, (state, action) => {
        state.isDeletingBusiness = false;
        // Remove business from the list
        state.businesses = state.businesses.filter(
          (business) => business.id !== action.payload
        );
        state.totalBusinesses -= 1;
        state.successMessage = "Business deleted successfully";
      })
      .addCase(deleteBusiness.rejected, (state, action) => {
        state.isDeletingBusiness = false;
        state.error = action.error.message || "Failed to delete business";
      });

    // Bulk update businesses
    builder
      .addCase(bulkUpdateBusinesses.pending, (state) => {
        state.isUpdatingBusiness = true;
        state.error = null;
      })
      .addCase(bulkUpdateBusinesses.fulfilled, (state, action) => {
        state.isUpdatingBusiness = false;
        // Update businesses in the list
        action.payload.businesses.forEach((updatedBusiness: Business) => {
          const index = state.businesses.findIndex(
            (business) => business.id === updatedBusiness.id
          );
          if (index !== -1) {
            state.businesses[index] = updatedBusiness;
          }
        });
        state.successMessage = "Businesses updated successfully";
      })
      .addCase(bulkUpdateBusinesses.rejected, (state, action) => {
        state.isUpdatingBusiness = false;
        state.error = action.error.message || "Failed to update businesses";
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setSelectedBusiness,
  setSearchTerm,
  setStatusFilter,
  setCategoryFilter,
  setCityFilter,
  setCurrentPage,
  setBusinessesPerPage,
  resetBusinessesState,
} = adminBusinessesSlice.actions;

export default adminBusinessesSlice.reducer;
