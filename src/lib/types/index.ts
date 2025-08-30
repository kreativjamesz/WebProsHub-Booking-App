// User Types
export type { User, AuthState } from './user';

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

// Root State
export interface RootState {
  auth: import('./user').AuthState;
  businesses: import('./business').BusinessesState;
  services: import('./service').ServicesState;
  categories: import('./category').CategoriesState;
  bookings: import('./booking').BookingsState;
  promos: import('./promo').PromosState;
}
