import { Business } from "@/lib/types";

// Admin Businesses Management State
export interface AdminBusinessesState {
  // Data
  businesses: Business[];
  selectedBusiness: Business | null;
  
  // Loading states
  isLoadingBusinesses: boolean;
  isLoadingBusiness: boolean;
  isUpdatingBusiness: boolean;
  isDeletingBusiness: boolean;
  isAssigningOwner: boolean;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalBusinesses: number;
  businessesPerPage: number;
  
  // Filters and search
  searchTerm: string;
  categoryFilter: string;
  statusFilter: "active" | "inactive" | "all";
  cityFilter: string;
  ratingFilter: "high" | "medium" | "low" | "all";
  
  // Error handling
  error: string | null;
  
  // Success messages
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
