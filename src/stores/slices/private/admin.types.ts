// Admin User Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password?: string; // Only for creation/update
  role: AdminRole;
  department?: string | null;
  employeeId?: string | null;
  permissions: string; // JSON string from database
  isActive: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

// Admin Role Enum
export type AdminRole = "SUPER_ADMIN" | "MODERATOR" | "SUPPORT";

// Admin Permissions Interface
export interface AdminPermissions {
  user_management: boolean;
  business_management: boolean;
  booking_management: boolean;
  admin_management: boolean;
  system_settings: boolean;
}

// Admin State Interface
export interface AdminState {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface AdminsResponse {
  success: boolean;
  admins: AdminUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalAdmins: number;
    adminsPerPage: number;
  };
}

export interface AdminResponse {
  success: boolean;
  admin: AdminUser;
  message?: string;
}

export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
  role: AdminRole;
  department?: string;
  employeeId?: string;
  permissions?: string;
  isActive?: boolean;
}

export interface UpdateAdminRequest {
  name?: string;
  email?: string;
  role?: AdminRole;
  department?: string;
  employeeId?: string;
  permissions?: string;
  isActive?: boolean;
}
