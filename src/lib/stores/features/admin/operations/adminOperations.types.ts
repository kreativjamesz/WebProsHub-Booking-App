// Admin Operation Types
export enum AdminOperationType {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  APPROVE = "APPROVE",
  REJECT = "REJECT",
  SUSPEND = "SUSPEND",
  ACTIVATE = "ACTIVATE"
}

export enum AdminOperationStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED"
}

// Admin Audit Log Entry
export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminName: string;
  operation: AdminOperationType;
  entityType: "user" | "business" | "booking" | "system";
  entityId: string;
  entityName: string;
  details: string;
  status: AdminOperationStatus;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
}

// Admin Operations State
export interface AdminOperationsState {
  // Data
  auditLogs: AdminAuditLog[];
  selectedLog: AdminAuditLog | null;
  
  // Loading states
  isLoadingLogs: boolean;
  isLoadingLog: boolean;
  isPerformingOperation: boolean;
  
  // Pagination
  currentPage: number;
  totalPages: number;
  totalLogs: number;
  logsPerPage: number;
  
  // Filters and search
  searchTerm: string;
  operationFilter: AdminOperationType | "all";
  entityTypeFilter: string;
  statusFilter: AdminOperationStatus | "all";
  dateRangeFilter: {
    start: string;
    end: string;
  };
  
  // Error handling
  error: string | null;
  
  // Success messages
  successMessage: string | null;
}

// Admin Operations Actions
export interface AdminOperationsActions {
  fetchAuditLogs: (page?: number, filters?: Partial<AdminOperationsState>) => Promise<void>;
  fetchAuditLog: (id: string) => Promise<void>;
  performOperation: (operation: AdminOperationType, entityType: string, entityId: string, details: string) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
}
