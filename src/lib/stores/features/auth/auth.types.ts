// Auth Types for regular users only
// Admin types are now in src/lib/stores/features/admin/admin.types.ts

// Regular User Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  BUSINESS_OWNER = "BUSINESS_OWNER",
  CUSTOMER = "CUSTOMER",
}

// Auth State Types
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Login Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

// Auth Response Types
export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

// Error Response Type
export interface ErrorResponse {
  success: false;
  error: string;
}
