import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User, AdminUser } from "./auth.types";
import { setCookie, removeCookie, getCookie } from "@/lib/utils/cookies";

const initialState: AuthState = {
  user: null,
  adminUser: null,
  token: null,
  adminToken: null,
  isAuthenticated: false,
  isAdminAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
    },

    // Regular user actions
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      setCookie("authToken", action.payload);
    },

    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeCookie("authToken");
    },

    // Admin user actions
    setAdminUser: (state, action: PayloadAction<AdminUser>) => {
      state.adminUser = action.payload;
      state.isAdminAuthenticated = true;
      state.error = null;
    },

    setAdminToken: (state, action: PayloadAction<string>) => {
      state.adminToken = action.payload;
      setCookie("adminToken", action.payload);
    },

    clearAdminUser: (state) => {
      state.adminUser = null;
      state.adminToken = null;
      state.isAdminAuthenticated = false;
      removeCookie("adminToken");
    },

    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Error handling
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Initialize from cookies
    initializeAuth: (state) => {
      const authToken = getCookie("authToken");
      const adminToken = getCookie("adminToken");
      
      if (authToken) {
        state.token = authToken;
        // Note: User data will be fetched via RTK Query
      }
      
      if (adminToken) {
        state.adminToken = adminToken;
        // Note: Admin user data will be fetched via RTK Query
      }
    },

    // Logout both user types
    logoutAll: (state) => {
      state.user = null;
      state.adminUser = null;
      state.token = null;
      state.adminToken = null;
      state.isAuthenticated = false;
      state.isAdminAuthenticated = false;
      state.error = null;
      removeCookie("authToken");
      removeCookie("adminToken");
    },
  },
});

export const {
  clearError,
  setUser,
  setToken,
  clearUser,
  setAdminUser,
  setAdminToken,
  clearAdminUser,
  setLoading,
  setError,
  initializeAuth,
  logoutAll,
} = authSlice.actions;

export default authSlice.reducer;
