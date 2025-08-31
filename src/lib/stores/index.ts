import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Import slices
import authReducer from './features/auth/authSlice';
import businessesReducer from './features/businesses/businessesSlice';
import servicesReducer from './features/services/servicesSlice';
import categoriesReducer from './features/categories/categoriesSlice';
import bookingsReducer from './features/bookings/bookingsSlice';
import promosReducer from './features/promos/promosSlice';
import adminReducer from './features/admin/adminSlice';

// Import RTK Query API
import { authApi } from './features/auth/auth.api';

// Persist config for auth
const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user', 'isAuthenticated']
};

// Create persisted reducer for auth
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Configure store
export const store = configureStore({
    reducer: {
        auth: persistedAuthReducer,
        businesses: businessesReducer,
        services: servicesReducer,
        categories: categoriesReducer,
        bookings: bookingsReducer,
        promos: promosReducer,
        admin: adminReducer,
        [authApi.reducerPath]: authApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
            },
        }).concat(authApi.middleware),
});

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
