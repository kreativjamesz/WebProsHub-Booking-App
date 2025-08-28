import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { PromosState, Promo } from '@/lib/types';
import { ID, Query } from 'appwrite';

// Async thunks
export const fetchPromos = createAsyncThunk(
    'promos/fetchPromos',
    async (_, { rejectWithValue }) => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.PROMOS,
                [Query.equal('isActive', true)]
            );
            return response.documents as unknown as Promo[];
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
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.PROMOS,
                [Query.equal('isActive', true)],
            );
            return response.documents as unknown as Promo[];
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
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.PROMOS,
                [Query.equal('businessId', businessId), Query.equal('isActive', true)]
            );
            return response.documents as unknown as Promo[];
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
    async (promoData: Omit<Promo, '$id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.PROMOS,
                ID.unique(),
                {
                    ...promoData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            );
            return response as unknown as Promo;
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
            const response = await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.PROMOS,
                promoId,
                {
                    ...promoData,
                    updatedAt: new Date().toISOString()
                }
            );
            return response as unknown as Promo;
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
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.PROMOS,
                promoId
            );
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
                const index = state.promos.findIndex(p => p.$id === action.payload.$id);
                if (index !== -1) {
                    state.promos[index] = action.payload;
                }
                const featuredIndex = state.featuredPromos.findIndex(p => p.$id === action.payload.$id);
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
                state.promos = state.promos.filter(p => p.$id !== action.payload);
                state.featuredPromos = state.featuredPromos.filter(p => p.$id !== action.payload);
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
