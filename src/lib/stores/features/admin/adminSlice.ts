import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, Business } from '@/lib/types';

interface AdminState {
    users: User[];
    allBusinesses: Business[];
    isLoading: boolean;
    error: string | null;
}

// Async thunks
export const fetchAllUsers = createAsyncThunk(
    'admin/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database?action=list&model=users');
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            return data.data || [];
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const fetchAllBusinesses = createAsyncThunk(
    'admin/fetchAllBusinesses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database?action=list&model=businesses');
            if (!response.ok) {
                throw new Error('Failed to fetch businesses');
            }
            const data = await response.json();
            return data.data || [];
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const updateUserRole = createAsyncThunk(
    'admin/updateUserRole',
    async ({ userId, role }: { userId: string; role: User['role'] }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'update',
                    model: 'users',
                    id: userId,
                    data: { role },
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update user role');
            }
            const data = await response.json();
            return data.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const assignBusinessOwner = createAsyncThunk(
    'admin/assignBusinessOwner',
    async ({ businessId, ownerEmail }: { businessId: string; ownerEmail: string }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'assignBusinessOwner',
                    businessId,
                    ownerEmail,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to assign business owner');
            }
            const data = await response.json();
            return data.business;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const toggleBusinessStatus = createAsyncThunk(
    'admin/toggleBusinessStatus',
    async ({ businessId, isActive }: { businessId: string; isActive: boolean }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'update',
                    model: 'businesses',
                    id: businessId,
                    data: { isActive },
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to toggle business status');
            }
            const data = await response.json();
            return data.data;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'delete',
                    model: 'users',
                    id: userId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete user');
            }
            return userId;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const deleteBusiness = createAsyncThunk(
    'admin/deleteBusiness',
    async (businessId: string, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'delete',
                    model: 'businesses',
                    id: businessId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete business');
            }
            return businessId;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

const initialState: AdminState = {
    users: [],
    allBusinesses: [],
    isLoading: false,
    error: null
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearAdminData: (state) => {
            state.users = [];
            state.allBusinesses = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all users
            .addCase(fetchAllUsers.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = action.payload;
                state.error = null;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch all businesses
            .addCase(fetchAllBusinesses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllBusinesses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allBusinesses = action.payload;
                state.error = null;
            })
            .addCase(fetchAllBusinesses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update user role
            .addCase(updateUserRole.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateUserRole.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.users.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Assign business owner
            .addCase(assignBusinessOwner.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(assignBusinessOwner.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.allBusinesses.findIndex(b => b.id === action.payload.id);
                if (index !== -1) {
                    state.allBusinesses[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(assignBusinessOwner.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Toggle business status
            .addCase(toggleBusinessStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(toggleBusinessStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.allBusinesses.findIndex(b => b.id === action.payload.id);
                if (index !== -1) {
                    state.allBusinesses[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(toggleBusinessStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete user
            .addCase(deleteUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.users = state.users.filter(u => u.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete business
            .addCase(deleteBusiness.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteBusiness.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allBusinesses = state.allBusinesses.filter(b => b.id !== action.payload);
                state.error = null;
            })
            .addCase(deleteBusiness.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError, clearAdminData } = adminSlice.actions;
export default adminSlice.reducer;
