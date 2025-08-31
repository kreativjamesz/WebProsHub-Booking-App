// Admin User Types
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  department: string;
  employeeId: string;
  permissions: string[];
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  lastModified: string;
}

// Admin Role Enum
export enum AdminRole {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  SUPPORT = "SUPPORT",
  MODERATOR = "MODERATOR"
}

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
