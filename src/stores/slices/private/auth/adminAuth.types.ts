import { AdminUser } from '../admin.types';

// Admin Authentication State Interface
export interface AdminAuthState {
  adminUser: AdminUser | null;
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Admin Login Request Interface
export interface AdminLoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// Admin Login Response Interface
export interface AdminLoginResponse {
  success: boolean;
  adminUser: AdminUser;
  adminToken: string;
  message?: string;
}

// Admin Authentication Actions Interface
export interface AdminAuthActions {
  setAdminUser: (adminUser: AdminUser) => void;
  setAdminToken: (token: string) => void;
  setAdminLoading: (loading: boolean) => void;
  setAdminError: (error: string) => void;
  clearAdminError: () => void;
  clearAdminUser: () => void;
  initializeAdminAuth: (data: { adminUser: AdminUser; adminToken: string }) => void;
  updateAdminProfile: (updates: Partial<AdminUser>) => void;
  resetAdminAuth: () => void;
}

// Admin Authentication Status
export enum AdminAuthStatus {
  IDLE = "IDLE",
  LOADING = "LOADING",
  AUTHENTICATED = "AUTHENTICATED",
  UNAUTHENTICATED = "UNAUTHENTICATED",
  ERROR = "ERROR"
}

// Admin Session Interface
export interface AdminSession {
  adminId: string;
  adminEmail: string;
  adminRole: string;
  lastActivity: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
}
