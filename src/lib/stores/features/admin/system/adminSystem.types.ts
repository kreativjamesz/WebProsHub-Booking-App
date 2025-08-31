// Admin System Management State
export interface AdminSystemState {
  // System Overview
  totalUsers: number;
  totalBusinesses: number;
  totalBookings: number;
  totalRevenue: number;
  
  // System Health
  systemStatus: "healthy" | "warning" | "critical";
  lastBackup: string;
  databaseSize: string;
  activeSessions: number;
  
  // Loading states
  isLoadingStats: boolean;
  isLoadingSystemHealth: boolean;
  isPerformingBackup: boolean;
  
  // Error handling
  error: string | null;
  
  // Success messages
  successMessage: string | null;
}

// System Metrics
export interface SystemMetrics {
  users: {
    total: number;
    active: number;
    inactive: number;
    growth: number;
  };
  businesses: {
    total: number;
    active: number;
    pending: number;
    growth: number;
  };
  bookings: {
    total: number;
    completed: number;
    cancelled: number;
    revenue: number;
  };
}

// Admin System Actions
export interface AdminSystemActions {
  fetchSystemStats: () => Promise<void>;
  fetchSystemHealth: () => Promise<void>;
  performBackup: () => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}
