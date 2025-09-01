// Admin Admins Types
export interface AdminAdminsState {
  admins: any[];
  selectedAdmin: any | null;
  isLoadingAdmins: boolean;
  isLoadingAdmin: boolean;
  isCreatingAdmin: boolean;
  isUpdatingAdmin: boolean;
  isDeletingAdmin: boolean;
  currentPage: number;
  totalPages: number;
  totalAdmins: number;
  adminsPerPage: number;
  searchTerm: string;
  roleFilter: string;
  statusFilter: string;
  error: string | null;
  successMessage: string | null;
}
