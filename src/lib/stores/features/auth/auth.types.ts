// Auth Types for both regular users and admin users

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

// Admin User Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  department?: string;
  employeeId?: string;
  isActive: boolean;
  permissions: string[];
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export enum AdminRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  MODERATOR = "MODERATOR",
  SUPPORT = "SUPPORT",
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

export interface AdminLoginRequest {
  email: string;
  password: string;
}

// Auth Response Types
export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

export interface AdminAuthResponse {
  success: boolean;
  user: AdminUser;
  token: string;
}

// Error Response Type
export interface ErrorResponse {
  success: false;
  error: string;
}
