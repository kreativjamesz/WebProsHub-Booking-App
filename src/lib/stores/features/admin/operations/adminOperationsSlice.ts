import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Business } from '@/lib/types';

// Admin operations state interface
export interface AdminOperationsState {
  // User management
  users: User[];
  isLoadingUsers: boolean;
  
  // Business management
  allBusinesses: Business[];
  isLoadingBusinesses: boolean;
  
  // General loading and error states
  isLoading: boolean;
  error: string | null;
  
  // Pagination
  usersPage: number;
  businessesPage: number;
  totalUsersPages: number;
  totalBusinessesPages: number;
}

const initialState: AdminOperationsState = {
  users: [],
  isLoadingUsers: false,
  allBusinesses: [],
  isLoadingBusinesses: false,
  isLoading: false,
  error: null,
  usersPage: 1,
  businessesPage: 1,
  totalUsersPages: 1,
  totalBusinessesPages: 1,
};

// Async thunks for admin operations
export const fetchAllUsers = createAsyncThunk(
  'adminOperations/fetchAllUsers',
  async (params: { page?: number; role?: string }) => {
    const response = await fetch(`/api/admin/users?${new URLSearchParams(params as Record<string, string>)}`);
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  }
);

export const fetchAllBusinesses = createAsyncThunk(
  'adminOperations/fetchAllBusinesses',
  async (params: { page?: number; status?: string }) => {
    const response = await fetch(`/api/admin/businesses?${new URLSearchParams(params as Record<string, string>)}`);
    if (!response.ok) throw new Error('Failed to fetch businesses');
    return response.json();
  }
);

export const updateUserRole = createAsyncThunk(
  'adminOperations/updateUserRole',
  async ({ userId, role }: { userId: string; role: string }) => {
    const response = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) throw new Error('Failed to update user role');
    return response.json();
  }
);

export const deleteUser = createAsyncThunk(
  'adminOperations/deleteUser',
  async (userId: string) => {
    const response = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete user');
    return { userId };
  }
);

export const deleteBusiness = createAsyncThunk(
  'adminOperations/deleteBusiness',
  async (businessId: string) => {
    const response = await fetch(`/api/admin/businesses/${businessId}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete business');
    return { businessId };
  }
);

export const assignBusinessOwner = createAsyncThunk(
  'adminOperations/assignBusinessOwner',
  async ({ businessId, ownerEmail }: { businessId: string; ownerEmail: string }) => {
    const response = await fetch(`/api/admin/businesses/${businessId}/assign-owner`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ownerEmail }),
    });
    if (!response.ok) throw new Error('Failed to assign business owner');
    return response.json();
  }
);

export const toggleBusinessStatus = createAsyncThunk(
  'adminOperations/toggleBusinessStatus',
  async ({ businessId, isActive }: { businessId: string; isActive: boolean }) => {
    const response = await fetch(`/api/admin/businesses/${businessId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    });
    if (!response.ok) throw new Error('Failed to toggle business status');
    return response.json();
  }
);

const adminOperationsSlice = createSlice({
  name: 'adminOperations',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    
    resetAdminOperationsState: (state) => {
      state.users = [];
      state.allBusinesses = [];
      state.error = null;
      state.usersPage = 1;
      state.businessesPage = 1;
    },
  },
  extraReducers: (builder) => {
    // User management
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoadingUsers = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoadingUsers = false;
        state.users = action.payload.users;
        state.totalUsersPages = action.payload.totalPages;
        state.usersPage = action.payload.currentPage;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload.userId);
      });
    
    // Business management
    builder
      .addCase(fetchAllBusinesses.pending, (state) => {
        state.isLoadingBusinesses = true;
        state.error = null;
      })
      .addCase(fetchAllBusinesses.fulfilled, (state, action) => {
        state.isLoadingBusinesses = false;
        state.allBusinesses = action.payload.businesses;
        state.totalBusinessesPages = action.payload.totalPages;
        state.businessesPage = action.payload.currentPage;
      })
      .addCase(fetchAllBusinesses.rejected, (state, action) => {
        state.isLoadingBusinesses = false;
        state.error = action.error.message || 'Failed to fetch businesses';
      })
      .addCase(deleteBusiness.fulfilled, (state, action) => {
        state.allBusinesses = state.allBusinesses.filter(b => b.id !== action.payload.businessId);
      })
      .addCase(assignBusinessOwner.fulfilled, (state, action) => {
        const index = state.allBusinesses.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.allBusinesses[index] = action.payload;
        }
      })
      .addCase(toggleBusinessStatus.fulfilled, (state, action) => {
        const index = state.allBusinesses.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.allBusinesses[index] = action.payload;
        }
      });
  },
});

export const {
  clearError,
  resetAdminOperationsState,
} = adminOperationsSlice.actions;

export default adminOperationsSlice.reducer;
