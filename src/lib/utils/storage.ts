// Storage utilities for managing user data across sessions

export interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  preferences?: Record<string, string>;
  lastLogin: string;
  // Add any other user fields you need
}

export interface AdminData {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  employeeId?: string;
  permissions?: string[];
  lastLogin: string;
}

// User data storage
export const userStorage = {
  // Save user data to localStorage
  saveUser: (userData: UserData): void => {
    try {
      localStorage.setItem("userData", JSON.stringify(userData));
      console.log("💾 User data saved to localStorage");
    } catch (error) {
      console.error("❌ Failed to save user data to localStorage:", error);
    }
  },

  // Get user data from localStorage
  getUser: (): UserData | null => {
    try {
      const data = localStorage.getItem("userData");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("❌ Failed to read user data from localStorage:", error);
      return null;
    }
  },

  // Clear user data from localStorage
  clearUser: (): void => {
    try {
      localStorage.removeItem("userData");
      console.log("🗑️ User data cleared from localStorage");
    } catch (error) {
      console.error("❌ Failed to clear user data from localStorage:", error);
    }
  },
};

// Admin data storage
export const adminStorage = {
  // Save admin data to localStorage
  saveAdmin: (adminData: AdminData): void => {
    try {
      localStorage.setItem("adminData", JSON.stringify(adminData));
      console.log("💾 Admin data saved to localStorage");
    } catch (error) {
      console.error("❌ Failed to save admin data to localStorage:", error);
    }
  },

  // Get admin data from localStorage
  getAdmin: (): AdminData | null => {
    try {
      const data = localStorage.getItem("adminData");
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("❌ Failed to read admin data from localStorage:", error);
      return null;
    }
  },

  // Clear admin data from localStorage
  clearAdmin: (): void => {
    try {
      localStorage.removeItem("adminData");
      console.log("🗑️ Admin data cleared from localStorage");
    } catch (error) {
      console.error("❌ Failed to clear admin data from localStorage:", error);
    }
  },
};

// Session storage for temporary data
export const sessionStorageUtils = {
  // Save session data
  save: <T>(key: string, value: T): void => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`❌ Failed to save session data for ${key}:`, error);
    }
  },

  // Get session data
  get: <T>(key: string): T | null => {
    try {
      const data = window.sessionStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`❌ Failed to read session data for ${key}:`, error);
      return null;
    }
  },

  // Clear session data
  clear: (key: string): void => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`❌ Failed to clear session data for ${key}:`, error);
    }
  },
};

// Clear all auth-related storage
export const clearAllStorage = (): void => {
  userStorage.clearUser();
  adminStorage.clearAdmin();

  // Clear any other auth-related items
  try {
    localStorage.removeItem("authState");
    // Clear all session storage
    window.sessionStorage.clear();
    console.log("🧹 All storage cleared");
  } catch (error) {
    console.error("❌ Failed to clear all storage:", error);
  }
};
