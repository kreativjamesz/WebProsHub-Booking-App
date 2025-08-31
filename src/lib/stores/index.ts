import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import authReducer from './features/auth/authSlice';
import adminAuthReducer from './features/admin/adminAuthSlice';
import adminUsersReducer from './features/admin/adminUsersSlice';
import adminBusinessesReducer from './features/admin/adminBusinessesSlice';
import adminBookingsReducer from './features/admin/adminBookingsSlice';
import adminSystemReducer from './features/admin/adminSystemSlice';
import adminOperationsReducer from './features/admin/adminOperationsSlice';
import publicReducer from './features/public/publicSlice';
import customerReducer from './features/customer/customerSlice';
import businessOwnerReducer from './features/business-owner/businessOwnerSlice';

// Core data slices (shared across all user types)
import businessesReducer from './features/businesses/businessesSlice';
import servicesReducer from './features/services/servicesSlice';
import categoriesReducer from './features/categories/categoriesSlice';
import bookingsReducer from './features/bookings/bookingsSlice';
import promosReducer from './features/promos/promosSlice';

// Import RTK Query APIs
import { authApi } from './features/auth/auth.api';
import { adminApi } from './features/admin/admin.api';

// Persist config for auth
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user', 'isAuthenticated']
};

// Persist config for admin auth
const adminAuthPersistConfig = {
    key: 'adminAuth',
    storage,
    whitelist: ['adminUser', 'isAdminAuthenticated']
};

// Persist config for customer
const customerPersistConfig = {
    key: 'customer',
    storage,
    whitelist: ['profile', 'favorites']
};

// Persist config for business owner
const businessOwnerPersistConfig = {
    key: 'businessOwner',
    storage,
    whitelist: ['profile', 'currentBusiness']
};

// Create persisted reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedAdminAuthReducer = persistReducer(adminAuthPersistConfig, adminAuthReducer);
const persistedCustomerReducer = persistReducer(customerPersistConfig, customerReducer);
const persistedBusinessOwnerReducer = persistReducer(businessOwnerPersistConfig, businessOwnerReducer);

// Configure store
export const store = configureStore({
    reducer: {
        // Authentication slices
        auth: persistedAuthReducer,
        adminAuth: persistedAdminAuthReducer,
        
        // Admin management slices
        adminUsers: adminUsersReducer,
        adminBusinesses: adminBusinessesReducer,
        adminBookings: adminBookingsReducer,
        adminSystem: adminSystemReducer,
        adminOperations: adminOperationsReducer,
        
        // Role-based slices
        public: publicReducer,
        customer: persistedCustomerReducer,
        businessOwner: persistedBusinessOwnerReducer,
        
        // Core data slices (shared)
        businesses: businessesReducer,
        services: servicesReducer,
        categories: categoriesReducer,
        bookings: bookingsReducer,
        promos: promosReducer,
        
        // API reducers
        [authApi.reducerPath]: authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(authApi.middleware, adminApi.middleware),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
