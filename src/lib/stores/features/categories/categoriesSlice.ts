import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { CategoriesState, Category } from '@/lib/types';
import { ID, Query } from 'appwrite';

// Async thunks
export const fetchCategories = createAsyncThunk(
    'categories/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.CATEGORIES,
                [Query.equal('isActive', true)]
            );
            return response.documents as unknown as Category[];
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
    async (categoryData: Omit<Category, '$id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.CATEGORIES,
                ID.unique(),
                {
                    ...categoryData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            );
            return response as unknown as Category;
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
            const response = await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.CATEGORIES,
                categoryId,
                {
                    ...categoryData,
                    updatedAt: new Date().toISOString()
            });
            return response as unknown as Category;
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
                const index = state.categories.findIndex(c => c.$id === action.payload.$id);
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
