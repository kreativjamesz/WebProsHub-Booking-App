import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CategoriesState, Category } from '@/lib/types';

// Async thunks
export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database?action=list&model=categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
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

export const createCategory = createAsyncThunk(
    'categories/createCategory',
    async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create',
                    model: 'categories',
                    data: categoryData,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create category');
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

export const updateCategory = createAsyncThunk(
    'categories/updateCategory',
    async ({ categoryId, categoryData }: { categoryId: string; categoryData: Partial<Category> }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'update',
                    model: 'categories',
                    id: categoryId,
                    data: categoryData,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update category');
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

const initialState: CategoriesState = {
    categories: [],
    isLoading: false,
    error: null
};

const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch categories
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
                state.error = null;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create category
            .addCase(createCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories.push(action.payload);
                state.error = null;
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update category
            .addCase(updateCategory.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.categories.findIndex(c => c.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
                state.error = null;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError } = categoriesSlice.actions;
export default categoriesSlice.reducer;
