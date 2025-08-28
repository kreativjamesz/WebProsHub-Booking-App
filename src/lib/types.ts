export interface User {
  $id: string;
  email: string;
  name: string;
  role: "customer" | "business_owner" | "admin";
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  $id: string;
  name: string;
  description: string;
  logo?: string;
  coverImage?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  categoryId: string;
  ownerId: string;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  $id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  $id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  businessId: string;
  categoryId: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  $id: string;
  customerId: string;
  businessId: string;
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  totalPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Promo {
  $id: string;
  title: string;
  description: string;
  discountPercentage: number;
  businessId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  $id: string;
  customerId: string;
  businessId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface BusinessesState {
  businesses: Business[];
  featuredBusinesses: Business[];
  selectedBusiness: Business | null;
  isLoading: boolean;
  error: string | null;
}

export interface ServicesState {
  services: Service[];
  selectedService: Service | null;
  isLoading: boolean;
  error: string | null;
}

export interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}

export interface BookingsState {
  bookings: Booking[];
  userBookings: Booking[];
  selectedBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

export interface PromosState {
  promos: Promo[];
  featuredPromos: Promo[];
  selectedPromo: Promo | null;
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  businesses: BusinessesState;
  services: ServicesState;
  categories: CategoriesState;
  bookings: BookingsState;
  promos: PromosState;
}
