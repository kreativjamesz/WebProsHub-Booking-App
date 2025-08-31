export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN" | "SUPPORT" | "MODERATOR";
  department: string;
  employeeId: string;
  permissions: string[];
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  lastModified: string;
}

export interface AdminState {
  adminUser: AdminUser | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AdminPermissions {
  user_management: boolean;
  business_management: boolean;
  booking_management: boolean;
  admin_management: boolean;
  system_settings: boolean;
}
