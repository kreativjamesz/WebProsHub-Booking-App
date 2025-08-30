import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ServicesState, Service } from '@/lib/types';

// Async thunks
export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database?action=list&model=services');
            if (!response.ok) {
                throw new Error('Failed to fetch services');
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

export const fetchServicesByBusiness = createAsyncThunk(
    'services/fetchServicesByBusiness',
    async (businessId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/database?action=list&model=services&businessId=${businessId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch services by business');
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

export const fetchServiceById = createAsyncThunk(
    'services/fetchServiceById',
    async (serviceId: string, { rejectWithValue }) => {
        try {
            const response = await fetch(`/api/database?action=get&model=services&id=${serviceId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch service');
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

export const createService = createAsyncThunk(
    'services/createService',
    async (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'create',
                    model: 'services',
                    data: serviceData,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to create service');
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

export const updateService = createAsyncThunk(
    'services/updateService',
    async ({ serviceId, serviceData }: { serviceId: string; serviceData: Partial<Service> }, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'update',
                    model: 'services',
                    id: serviceId,
                    data: serviceData,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update service');
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

export const deleteService = createAsyncThunk(
    'services/deleteService',
    async (serviceId: string, { rejectWithValue }) => {
        try {
            const response = await fetch('/api/database', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'delete',
                    model: 'services',
                    id: serviceId,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to delete service');
            }
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
                            const index = state.services.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.services[index] = action.payload;
            }
            if (state.selectedService?.id === action.payload.id) {
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
                            state.services = state.services.filter(s => s.id !== action.payload);
            if (state.selectedService?.id === action.payload) {
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
