import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BookingsState, Booking } from '@/types';

// Async thunks
export const fetchBookings = createAsyncThunk(
    'bookings/fetchBookings',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database?action=list&model=bookings');
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
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

export const fetchUserBookings = createAsyncThunk(
    'bookings/fetchUserBookings',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/database?action=list&model=bookings&userId=${userId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user bookings');
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

export const fetchBusinessBookings = createAsyncThunk(
    'bookings/fetchBusinessBookings',
    async (businessId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/database?action=list&model=bookings&businessId=${businessId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch business bookings');
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

export const createBooking = createAsyncThunk(
    'bookings/createBooking',
    async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create',
                    model: 'bookings',
                    data: bookingData,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create booking');
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

export const updateBookingStatus = createAsyncThunk(
    'bookings/updateBookingStatus',
    async ({ bookingId, status }: { bookingId: string; status: Booking['status'] }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'update',
                    model: 'bookings',
                    id: bookingId,
                    data: { status },
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update booking status');
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

export const cancelBooking = createAsyncThunk(
    'bookings/cancelBooking',
    async (bookingId: string, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'update',
                    model: 'bookings',
                    id: bookingId,
                    data: { status: 'cancelled' },
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to cancel booking');
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
                const index = state.bookings.findIndex(b => b.id === action.payload.id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
                const userIndex = state.userBookings.findIndex(b => b.id === action.payload.id);
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
                const index = state.bookings.findIndex(b => b.id === action.payload.id);
                if (index !== -1) {
                    state.bookings[index] = action.payload;
                }
                const userIndex = state.userBookings.findIndex(b => b.id === action.payload.id);
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
