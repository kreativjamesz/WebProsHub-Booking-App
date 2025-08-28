import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { databases, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { ServicesState, Service } from '@/lib/types';
import { ID, Query } from 'appwrite';

// Async thunks
export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.SERVICES,
                [Query.equal('isActive', true)]
            );
            return response.documents as unknown as Service[];
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const fetchServicesByBusiness = createAsyncThunk(
    'services/fetchServicesByBusiness',
    async (businessId: string, { rejectWithValue }) => {
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTIONS.SERVICES,
                [Query.equal('businessId', businessId), Query.equal('isActive', true)]
            );
            return response.documents as unknown as Service[];
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const fetchServiceById = createAsyncThunk(
    'services/fetchServiceById',
    async (serviceId: string, { rejectWithValue }) => {
        try {
            const response = await databases.getDocument(
                DATABASE_ID,
                COLLECTIONS.SERVICES,
                serviceId
            );
            return response as unknown as Service;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const createService = createAsyncThunk(
    'services/createService',
    async (serviceData: Omit<Service, '$id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
        try {
            const response = await databases.createDocument(
                DATABASE_ID,
                COLLECTIONS.SERVICES,
                ID.unique(),
                {
                    ...serviceData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            );
            return response as unknown as Service;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const updateService = createAsyncThunk(
    'services/updateService',
    async ({ serviceId, serviceData }: { serviceId: string; serviceData: Partial<Service> }, { rejectWithValue }) => {
        try {
            const response = await databases.updateDocument(
                DATABASE_ID,
                COLLECTIONS.SERVICES,
                serviceId,
                {
                    ...serviceData,
                    updatedAt: new Date().toISOString()
                }
            );
            return response as unknown as Service;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

export const deleteService = createAsyncThunk(
    'services/deleteService',
    async (serviceId: string, { rejectWithValue }) => {
        try {
            await databases.deleteDocument(
                DATABASE_ID,
                COLLECTIONS.SERVICES,
                serviceId
            );
            return serviceId;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue("An unknown error occurred");
        }
    }
);

const initialState: ServicesState = {
    services: [],
    selectedService: null,
    isLoading: false,
    error: null
};

const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setSelectedService: (state, action: PayloadAction<Service | null>) => {
            state.selectedService = action.payload;
        },
        clearServices: (state) => {
            state.services = [];
            state.selectedService = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch services
            .addCase(fetchServices.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services = action.payload;
                state.error = null;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch services by business
            .addCase(fetchServicesByBusiness.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchServicesByBusiness.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services = action.payload;
                state.error = null;
            })
            .addCase(fetchServicesByBusiness.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Fetch service by ID
            .addCase(fetchServiceById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchServiceById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedService = action.payload;
                state.error = null;
            })
            .addCase(fetchServiceById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Create service
            .addCase(createService.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services.push(action.payload);
                state.error = null;
            })
            .addCase(createService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Update service
            .addCase(updateService.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateService.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.services.findIndex(s => s.$id === action.payload.$id);
                if (index !== -1) {
                    state.services[index] = action.payload;
                }
                if (state.selectedService?.$id === action.payload.$id) {
                    state.selectedService = action.payload;
                }
                state.error = null;
            })
            .addCase(updateService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Delete service
            .addCase(deleteService.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.isLoading = false;
                state.services = state.services.filter(s => s.$id !== action.payload);
                if (state.selectedService?.$id === action.payload) {
                    state.selectedService = null;
                }
                state.error = null;
            })
            .addCase(deleteService.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearError, setSelectedService, clearServices } = servicesSlice.actions;
export default servicesSlice.reducer;
