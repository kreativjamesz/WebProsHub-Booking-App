import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "./auth.types";
import { setCookie, removeCookie, getCookie } from "@/lib/utils/cookies";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
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

      if (authToken) {
        state.token = authToken;
        // Note: User data will be fetched via RTK Query
      }
    },

    // Logout both user types
    logoutAll: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      removeCookie("authToken");
    },
  },
});

export const {
  clearError,
  setUser,
  setToken,
  clearUser,
  setLoading,
  setError,
  initializeAuth,
  logoutAll,
} = authSlice.actions;

export default authSlice.reducer;
