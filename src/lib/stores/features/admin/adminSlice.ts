import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { User, Business } from '@/lib/types';
import { ID, Query } from 'appwrite';

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
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.USERS
            );
            return response.documents as unknown as User[];
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
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.BUSINESSES
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

export const updateUserRole = createAsyncThunk(
    'admin/updateUserRole',
    async ({ userId, role }: { userId: string; role: User['role'] }, { rejectWithValue }) => {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                userId,
                {
                    role,
                    updatedAt: new Date().toISOString()
                }
            );
            return response as unknown as User;
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
            // First find the user by email
            const userResponse = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.USERS,
                [Query.equal('email', ownerEmail)]
            );
            
            if (userResponse.documents.length === 0) {
                throw new Error('User not found with this email');
            }
            
            const user = userResponse.documents[0]  as unknown as User;
            
            // Update user role to business_owner
            await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                user.$id as string,
                {
                    role: 'business_owner',
                    updatedAt: new Date().toISOString()
                }
            );
            
            // Update business with new owner
            const businessResponse = await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.BUSINESSES,
                businessId,
                {
                    ownerId: user.$id as string,
                    updatedAt: new Date().toISOString()
                }
            );
            
            return businessResponse as unknown as Business;
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
            const response = await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.BUSINESSES,
                businessId,
                {
                    isActive,
                    updatedAt: new Date().toISOString()
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

export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (userId: string, { rejectWithValue }) => {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.USERS,
                userId
            );
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
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.BUSINESSES,
                businessId
            );
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
                const index = state.users.findIndex(u => u.$id === action.payload.$id);
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
                const index = state.allBusinesses.findIndex(b => b.$id === action.payload.$id);
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
                const index = state.allBusinesses.findIndex(b => b.$id === action.payload.$id);
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
                state.users = state.users.filter(u => u.$id !== action.payload);
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
                state.allBusinesses = state.allBusinesses.filter(b => b.$id !== action.payload);
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
