import { Business } from "@/types";
// Admin Businesses Types
export interface AdminBusinessesState {
  businesses: Business[];
  selectedBusiness: Business | null;
  isLoadingBusinesses: boolean;
  isLoadingBusiness: boolean;
  isUpdatingBusiness: boolean;
  isDeletingBusiness: boolean;
  isAssigningOwner: boolean;
  currentPage: number;
  totalPages: number;
  totalBusinesses: number;
  businessesPerPage: number;
  searchTerm: string;
  statusFilter: string;
  categoryFilter: string;
  cityFilter: string;
  ratingFilter: string;
  error: string | null;
  successMessage: string | null;
}

// Admin Business Actions
export interface AdminBusinessActions {
  fetchBusinesses: (page?: number, filters?: Partial<AdminBusinessesState>) => Promise<void>;
  fetchBusiness: (id: string) => Promise<void>;
  updateBusiness: (id: string, data: Partial<Business>) => Promise<void>;
  deleteBusiness: (id: string) => Promise<void>;
  approveBusiness: (id: string) => Promise<void>;
  rejectBusiness: (id: string, reason: string) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}
