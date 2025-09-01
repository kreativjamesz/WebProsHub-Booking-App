import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import { getCookie } from '@/lib/utils/cookies';

// Admin users management state interface
export interface AdminUsersState {
  // Data
  users: User[];
  selectedUser: User | null;
  
  // Loading states
  isLoadingUsers: boolean;
  isLoadingUser: boolean;
  isUpdatingUser: boolean;
  isDeletingUser: boolean;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  usersPerPage: number;
  
  // Filters and search
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  
  // Error handling
  error: string | null;
  
  // Success messages
  successMessage: string | null;
}

const initialState: AdminUsersState = {
  users: [],
  selectedUser: null,
  isLoadingUsers: false,
  isLoadingUser: false,
  isUpdatingUser: false,
  isDeletingUser: false,
  currentPage: 1,
  totalPages: 1,
  totalUsers: 0,
  usersPerPage: 20,
  searchTerm: '',
  roleFilter: 'all',
  statusFilter: 'all',
  error: null,
  successMessage: null,
};

// Async thunks
export const fetchUsers = createAsyncThunk(
  'adminUsers/fetchUsers',
  async ({ page = 1, search = '', role = 'all', status = 'all' }: {
    page?: number;
    search?: string;
    role?: string;
    status?: string;
  }) => {
    const adminToken = getCookie('adminToken');
    
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    const response = await fetch(`/api/admin/users?page=${page}&search=${search}&role=${role}&status=${status}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.status === 401) {
      throw new Error('Admin authentication failed');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch users');
    }
    
    return {
      users: data.users,
      totalPages: data.pagination.totalPages,
      totalUsers: data.pagination.totalUsers,
      currentPage: data.pagination.currentPage,
    };
  }
);

export const fetchUserById = createAsyncThunk(
  'adminUsers/fetchUserById',
  async (userId: string) => {
    const adminToken = getCookie('adminToken');
    
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    const response = await fetch(`/api/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return data;
  }
);

export const updateUserRole = createAsyncThunk(
  'adminUsers/updateUserRole',
  async ({ userId, role }: { userId: string; role: User['role'] }) => {
    const adminToken = getCookie('adminToken');
    
    if (!adminToken) {
      throw new Error('Admin authentication required');
    }
    
    const response = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({ role }),
    });
    
    const data = await response.json();
    return data;
  }
);

export const updateUserStatus = createAsyncThunk(
  'adminUsers/updateUserStatus',
  async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
    // TODO: Replace with actual API call
    const response = await fetch(`/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive }),
    });
    const data = await response.json();
    return data;
  }
);

export const deleteUser = createAsyncThunk(
  'adminUsers/deleteUser',
  async (userId: string) => {
    // TODO: Replace with actual API call
    await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
    });
    return userId;
  }
);

export const bulkUpdateUsers = createAsyncThunk(
  'adminUsers/bulkUpdateUsers',
  async ({ userIds, updates }: { userIds: string[]; updates: Partial<User> }) => {
    // TODO: Replace with actual API call
    const response = await fetch('/api/admin/users/bulk-update', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds, updates }),
    });
    const data = await response.json();
    return data;
  }
);

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {
    // Clear messages
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    
    // Set selected user
    setSelectedUser: (state, action: PayloadAction<User | null>) => {
      state.selectedUser = action.payload;
    },
    
    // Update filters
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setRoleFilter: (state, action: PayloadAction<string>) => {
      state.roleFilter = action.payload;
      state.currentPage = 1;
    },
    setStatusFilter: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      state.currentPage = 1;
    },
    
    // Pagination
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setUsersPerPage: (state, action: PayloadAction<number>) => {
      state.usersPerPage = action.payload;
      state.currentPage = 1;
    },
    
    // Reset state
    resetUsersState: (state) => {
      state.users = [];
      state.selectedUser = null;
      state.currentPage = 1;
      state.totalPages = 1;
      state.totalUsers = 0;
      state.searchTerm = '';
      state.roleFilter = 'all';
      state.statusFilter = 'all';
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoadingUsers = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoadingUsers = false;
        state.users = action.payload.users;
        state.totalPages = action.payload.totalPages;
        state.totalUsers = action.payload.totalUsers;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoadingUsers = false;
        state.error = action.error.message || 'Failed to fetch users';
      });
    
    // Fetch user by ID
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.isLoadingUser = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isLoadingUser = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.isLoadingUser = false;
        state.error = action.error.message || 'Failed to fetch user';
      });
    
    // Update user role
    builder
      .addCase(updateUserRole.pending, (state) => {
        state.isUpdatingUser = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isUpdatingUser = false;
        // Update user in the list
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.successMessage = 'User role updated successfully';
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isUpdatingUser = false;
        state.error = action.error.message || 'Failed to update user role';
      });
    
    // Update user status
    builder
      .addCase(updateUserStatus.pending, (state) => {
        state.isUpdatingUser = true;
        state.error = null;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.isUpdatingUser = false;
        // Update user in the list
        const index = state.users.findIndex(user => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.successMessage = 'User status updated successfully';
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.isUpdatingUser = false;
        state.error = action.error.message || 'Failed to update user status';
      });
    
    // Delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.isDeletingUser = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isDeletingUser = false;
        // Remove user from the list
        state.users = state.users.filter(user => user.id !== action.payload);
        state.totalUsers -= 1;
        state.successMessage = 'User deleted successfully';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isDeletingUser = false;
        state.error = action.error.message || 'Failed to delete user';
      });
    
    // Bulk update users
    builder
      .addCase(bulkUpdateUsers.pending, (state) => {
        state.isUpdatingUser = true;
        state.error = null;
      })
      .addCase(bulkUpdateUsers.fulfilled, (state, action) => {
        state.isUpdatingUser = false;
        // Update users in the list
        action.payload.users.forEach((updatedUser: User) => {
          const index = state.users.findIndex(user => user.id === updatedUser.id);
          if (index !== -1) {
            state.users[index] = updatedUser;
          }
        });
        state.successMessage = 'Users updated successfully';
      })
      .addCase(bulkUpdateUsers.rejected, (state, action) => {
        state.isUpdatingUser = false;
        state.error = action.error.message || 'Failed to update users';
      });
  },
});

export const {
  clearError,
  clearSuccessMessage,
  setSelectedUser,
  setSearchTerm,
  setRoleFilter,
  setStatusFilter,
  setCurrentPage,
  setUsersPerPage,
  resetUsersState,
} = adminUsersSlice.actions;

export default adminUsersSlice.reducer;
