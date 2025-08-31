import { User } from "@/lib/types";

// Admin Users Management State
export interface AdminUsersState {
  // Data
  users: User[];
  selectedUser: User | null;
  
  // Loading states
  isLoadingUsers: boolean;
  isLoadingUser: boolean;
  isUpdatingUser: boolean;
  isDeletingUser: boolean;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  usersPerPage: number;
  
  // Filters and search
  searchTerm: string;
  roleFilter: string;
  statusFilter: "active" | "inactive" | "all";
  dateFilter: string;
  
  // Error handling
  error: string | null;
  
  // Success messages
  successMessage: string | null;
}

// Admin User Actions
export interface AdminUserActions {
  fetchUsers: (page?: number, filters?: Partial<AdminUsersState>) => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  updateUser: (id: string, data: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}
