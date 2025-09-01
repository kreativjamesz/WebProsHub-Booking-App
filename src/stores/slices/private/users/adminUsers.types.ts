// Admin Users Types
export interface AdminUsersState {
  users: any[];
  selectedUser: any | null;
  isLoadingUsers: boolean;
  isLoadingUser: boolean;
  isUpdatingUser: boolean;
  isDeletingUser: boolean;
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  usersPerPage: number;
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  error: string | null;
  successMessage: string | null;
}

// Admin User Actions
export interface AdminUserActions {
  fetchUsers: (page?: number, filters?: Partial<AdminUsersState>) => Promise<void>;
  fetchUser: (id: string) => Promise<void>;
  updateUser: (id: string, data: Partial<any>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}
