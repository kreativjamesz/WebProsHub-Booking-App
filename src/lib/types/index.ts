// User Types
export type { User, AuthState } from './user';

// Admin Types
export type { AdminUser, AdminState, AdminPermissions } from './admin';
export type { AdminAuthState } from '../stores/features/admin/adminAuthSlice';
export type { AdminUsersState } from '../stores/features/admin/adminUsersSlice';
export type { AdminBusinessesState } from '../stores/features/admin/adminBusinessesSlice';
export type { AdminBookingsState } from '../stores/features/admin/adminBookingsSlice';
export type { AdminSystemState } from '../stores/features/admin/adminSystemSlice';

// Business Types
export type { Business, BusinessesState } from './business';

// Category Types
export type { Category, CategoriesState } from './category';

// Service Types
export type { Service, ServicesState } from './service';

// Booking Types
export type { Booking, BookingsState } from './booking';

// Promo Types
export type { Promo, PromosState } from './promo';

// Review Types
export type { Review } from './review';

// Favorite Types
export type { Favorite, FavoritesState } from './favorite';

// Root State
export interface RootState {
  auth: import('./user').AuthState;
  adminAuth: import('../stores/features/admin/adminAuthSlice').AdminAuthState;
  adminUsers: import('../stores/features/admin/adminUsersSlice').AdminUsersState;
  adminBusinesses: import('../stores/features/admin/adminBusinessesSlice').AdminBusinessesState;
  adminBookings: import('../stores/features/admin/adminBookingsSlice').AdminBookingsState;
  adminSystem: import('../stores/features/admin/adminSystemSlice').AdminSystemState;
  businesses: import('./business').BusinessesState;
  services: import('./service').ServicesState;
  categories: import('./category').CategoriesState;
  bookings: import('./booking').BookingsState;
  promos: import('./promo').PromosState;
  favorites: import('./favorite').FavoritesState;
}
