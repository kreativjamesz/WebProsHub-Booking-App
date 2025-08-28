import { Models } from 'appwrite';

// Types for test connection responses
export interface ConnectionTestResult {
  success: boolean;
  collections?: Models.DefaultDocument[];
  error?: unknown;
}

export interface SeedingResult {
  success: boolean;
  categories?: Models.DefaultDocument[];
  businesses?: Models.DefaultDocument[];
  error?: unknown;
}

export interface ClearDatabaseResult {
  success: boolean;
  error?: unknown;
}
