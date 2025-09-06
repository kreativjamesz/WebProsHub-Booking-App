import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices from new organized structure
import authReducer from './slices/auth/auth.slice';

// Admin slices - now properly organized
import adminAuthReducer from './slices/private/auth/adminAuth.slice';
import adminAdminsReducer from './slices/private/admins/adminAdmins.slice';
import adminUsersReducer from './slices/private/users/adminUsers.slice';
import adminBusinessesReducer from './slices/private/businesses/adminBusinesses.slice';
import adminBookingsReducer from './slices/private/bookings/adminBookings.slice';
import adminSystemReducer from './slices/private/system/adminSystem.slice';
import adminHeaderReducer from './slices/private/system/adminHeader.slice';


// Role-based slices
import publicReducer from './slices/public/public.slice';
import customerReducer from './slices/customer/customer.slice';
import businessOwnerReducer from './slices/business-owner/businessOwner.slice';

// Core data slices (shared across all user types)
import businessesReducer from './slices/public/businesses/businesses.slice';
import servicesReducer from './slices/public/services/services.slice';
import categoriesReducer from './slices/public/categories/categories.slice';
import bookingsReducer from './slices/public/bookings/bookings.slice';
import promosReducer from './slices/public/promos/promos.slice';

// Import RTK Query APIs
import { authApi } from './slices/auth/auth.api';
import { adminApi } from './slices/private/admin.api';
import { adminAuthApi } from './slices/private/auth/adminAuth.api';

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
        adminAdmins: adminAdminsReducer,     // Admin management
        adminUsers: adminUsersReducer,        // Admin user management
        adminBusinesses: adminBusinessesReducer, // Admin business management
        adminBookings: adminBookingsReducer,  // Admin booking management
        adminSystem: adminSystemReducer,      // Admin system management
        adminHeader: adminHeaderReducer,      // Admin header state

        
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
