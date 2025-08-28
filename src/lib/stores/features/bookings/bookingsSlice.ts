import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { BookingsState, Booking } from '@/lib/types';
import { ID, Query } from 'appwrite';

// Async thunks
export const fetchBookings = createAsyncThunk(
    'bookings/fetchBookings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.BOOKINGS
            );
            return response.documents as unknown as Booking[];
            } catch (error: unknown) {
                if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const fetchUserBookings = createAsyncThunk(
    'bookings/fetchUserBookings',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.BOOKINGS,
                [Query.equal('customerId', userId)]
            );
            return response.documents as unknown as Booking[];
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const fetchBusinessBookings = createAsyncThunk(
    'bookings/fetchBusinessBookings',
    async (businessId: string, { rejectWithValue }) => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.BOOKINGS,
                [Query.equal('businessId', businessId)]
            );
            return response.documents as unknown as Booking[];
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const createBooking = createAsyncThunk(
    'bookings/createBooking',
    async (bookingData: Omit<Booking, '$id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.BOOKINGS,
                ID.unique(),
                {
                    ...bookingData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            );
            return response as unknown as Booking;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const updateBookingStatus = createAsyncThunk(
    'bookings/updateBookingStatus',
    async ({ bookingId, status }: { bookingId: string; status: Booking['status'] }, { rejectWithValue }) => {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.BOOKINGS,
                bookingId,
                {
                    status,
                    updatedAt: new Date().toISOString()
                }
            );
            return response as unknown as Booking;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const cancelBooking = createAsyncThunk(
    'bookings/cancelBooking',
    async (bookingId: string, { rejectWithValue }) => {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.BOOKINGS,
                bookingId,
                {
                    status: 'cancelled',
                    updatedAt: new Date().toISOString()
                }
            );
            return response as unknown as Booking;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

const initialState: BookingsState = {
    bookings: [],
    userBookings: [],
    selectedBooking: null,
    isLoading: false,
    error: null
};

const bookingsSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSelectedBooking: (state, action: PayloadAction<Booking | null>) => {
            state.selectedBooking = action.payload;
        },
        clearBookings: (state) => {
            state.bookings = [];
            state.userBookings = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all bookings
            .addCase(fetchBookings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBookings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bookings = action.payload;
                state.error = null;
            })
            .addCase(fetchBookings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch user bookings
            .addCase(fetchUserBookings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchUserBookings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userBookings = action.payload;
                state.error = null;
            })
            .addCase(fetchUserBookings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch business bookings
            .addCase(fetchBusinessBookings.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchBusinessBookings.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bookings = action.payload;
                state.error = null;
            })
            .addCase(fetchBusinessBookings.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create booking
            .addCase(createBooking.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.isLoading = false;
                state.bookings.push(action.payload);
                state.userBookings.push(action.payload);
                state.error = null;
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update booking status
            .addCase(updateBookingStatus.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.bookings.findIndex(b => b.$id === action.payload.$id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
                const userIndex = state.userBookings.findIndex(b => b.$id === action.payload.$id);
                if (userIndex !== -1) {
                    state.userBookings[userIndex] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateBookingStatus.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Cancel booking
            .addCase(cancelBooking.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.bookings.findIndex(b => b.$id === action.payload.$id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
                const userIndex = state.userBookings.findIndex(b => b.$id === action.payload.$id);
                if (userIndex !== -1) {
                    state.userBookings[userIndex] = action.payload;
                }
                state.error = null;
            })
            .addCase(cancelBooking.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError, clearBookings } = bookingsSlice.actions;
export default bookingsSlice.reducer;
