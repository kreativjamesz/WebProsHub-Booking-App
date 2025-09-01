import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PromosState, Promo } from '@/types';

// Async thunks
export const fetchPromos = createAsyncThunk(
    'promos/fetchPromos',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database?action=list&model=promos');
            if (!response.ok) {
                throw new Error('Failed to fetch promos');
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

export const fetchFeaturedPromos = createAsyncThunk(
    'promos/fetchFeaturedPromos',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database?action=list&model=promos&featured=true');
            if (!response.ok) {
                throw new Error('Failed to fetch featured promos');
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

export const fetchPromosByBusiness = createAsyncThunk(
    'promos/fetchPromosByBusiness',
    async (businessId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/database?action=list&model=promos&businessId=${businessId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch promos by business');
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

export const createPromo = createAsyncThunk(
    'promos/createPromo',
    async (promoData: Omit<Promo, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create',
                    model: 'promos',
                    data: promoData,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create promo');
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

export const updatePromo = createAsyncThunk(
    'promos/updatePromo',
    async ({ promoId, promoData }: { promoId: string; promoData: Partial<Promo> }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'update',
                    model: 'promos',
                    id: promoId,
                    data: promoData,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update promo');
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

export const deletePromo = createAsyncThunk(
    'promos/deletePromo',
    async (promoId: string, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'delete',
                    model: 'promos',
                    id: promoId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete promo');
            }
            return promoId;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

const initialState: PromosState = {
    promos: [],
    featuredPromos: [],
    selectedPromo: null,
    isLoading: false,
    error: null
};

const promosSlice = createSlice({
    name: 'promos',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSelectedPromo: (state, action: PayloadAction<Promo | null>) => {
            state.selectedPromo = action.payload;
        },
        clearPromos: (state) => {
            state.promos = [];
            state.featuredPromos = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch promos
            .addCase(fetchPromos.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPromos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.promos = action.payload;
                state.error = null;
            })
            .addCase(fetchPromos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch featured promos
            .addCase(fetchFeaturedPromos.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchFeaturedPromos.fulfilled, (state, action) => {
                state.isLoading = false;
                state.featuredPromos = action.payload;
                state.error = null;
            })
            .addCase(fetchFeaturedPromos.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch promos by business
            .addCase(fetchPromosByBusiness.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchPromosByBusiness.fulfilled, (state, action) => {
                state.isLoading = false;
                state.promos = action.payload;
                state.error = null;
            })
            .addCase(fetchPromosByBusiness.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create promo
            .addCase(createPromo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createPromo.fulfilled, (state, action) => {
                state.isLoading = false;
                state.promos.push(action.payload);
                state.error = null;
            })
            .addCase(createPromo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update promo
            .addCase(updatePromo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updatePromo.fulfilled, (state, action) => {
                state.isLoading = false;
                            const index = state.promos.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.promos[index] = action.payload;
            }
            const featuredIndex = state.featuredPromos.findIndex(p => p.id === action.payload.id);
                if (featuredIndex !== -1) {
                    state.featuredPromos[featuredIndex] = action.payload;
                }
                state.error = null;
            })
            .addCase(updatePromo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete promo
            .addCase(deletePromo.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deletePromo.fulfilled, (state, action) => {
                state.isLoading = false;
                            state.promos = state.promos.filter(p => p.id !== action.payload);
            state.featuredPromos = state.featuredPromos.filter(p => p.id !== action.payload);
                state.error = null;
            })
            .addCase(deletePromo.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError, clearPromos } = promosSlice.actions;
export default promosSlice.reducer;
