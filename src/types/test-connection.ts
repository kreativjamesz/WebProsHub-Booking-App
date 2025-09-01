export interface ConnectionTestResult {
  success: boolean;
  collections?: any[];
  error?: unknown;
}

export interface SeedingResult {
  success: boolean;
  message?: string;
  error?: unknown;
}

export interface ClearDatabaseResult {
  success: boolean;
  message?: string;
  error?: unknown;
}
