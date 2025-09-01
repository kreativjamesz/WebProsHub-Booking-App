export interface User {
  id: string;
  email: string;
  name: string;
  role: "CUSTOMER" | "BUSINESS_OWNER";
  status?: "ACTIVE" | "INACTIVE"; // Made optional temporarily
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = "CUSTOMER" | "BUSINESS_OWNER";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
