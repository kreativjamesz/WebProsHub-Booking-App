import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices from new organized structure
import authReducer from './features/auth/authSlice';

// Admin slices - now properly organized
import adminAuthReducer from './features/admin/auth/adminAuthSlice';
import adminUsersReducer from './features/admin/users/adminUsersSlice';
import adminBusinessesReducer from './features/admin/businesses/adminBusinessesSlice';
import adminBookingsReducer from './features/admin/bookings/adminBookingsSlice';
import adminSystemReducer from './features/admin/system/adminSystemSlice';
import adminOperationsReducer from './features/admin/operations/adminOperationsSlice';

// Role-based slices
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
import { adminApi } from './features/admin/adminApi';
import { adminAuthApi } from './features/admin/auth/adminAuthApi';

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
        auth: persistedAuthReducer,           // Regular user authentication
        adminAuth: persistedAdminAuthReducer, // Admin authentication
        
        // Admin management slices - now properly organized
        adminUsers: adminUsersReducer,        // Admin user management
        adminBusinesses: adminBusinessesReducer, // Admin business management
        adminBookings: adminBookingsReducer,  // Admin booking management
        adminSystem: adminSystemReducer,      // Admin system management
        adminOperations: adminOperationsReducer, // Admin operations & audit
        
        // Role-based slices (user-specific features)
        public: publicReducer,                // Public/unauthenticated features
        customer: persistedCustomerReducer,   // Customer-specific features
        businessOwner: persistedBusinessOwnerReducer, // Business owner features
        
        // Core data slices (shared across all user types)
        businesses: businessesReducer,        // Business listings
        services: servicesReducer,            // Service listings
        categories: categoriesReducer,        // Category listings
        bookings: bookingsReducer,            // Booking management
        promos: promosReducer,                // Promotional offers
        
        // API reducers
        [authApi.reducerPath]: authApi.reducer,
        [adminApi.reducerPath]: adminApi.reducer,
        [adminAuthApi.reducerPath]: adminAuthApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(authApi.middleware, adminApi.middleware, adminAuthApi.middleware),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
