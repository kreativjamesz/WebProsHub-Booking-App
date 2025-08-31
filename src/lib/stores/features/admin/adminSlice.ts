import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AdminUser, AdminState } from "@/lib/types/admin";
import { setCookie, removeCookie, getCookie } from "@/lib/utils/cookies";

const initialState: AdminState = {
  adminUser: null,
  isAdminAuthenticated: false,
  isLoading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    // Set admin user
    setAdminUser: (state, action: PayloadAction<AdminUser>) => {
      state.adminUser = action.payload;
      state.isAdminAuthenticated = true;
      state.error = null;
    },

    // Set admin token
    setAdminToken: (state, action: PayloadAction<string>) => {
      setCookie("adminToken", action.payload);
    },

    // Clear admin user
    clearAdminUser: (state) => {
      state.adminUser = null;
      state.isAdminAuthenticated = false;
      state.error = null;
      removeCookie("adminToken");
    },

    // Loading states
    setAdminLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Error handling
    setAdminError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear admin errors
    clearAdminError: (state) => {
      state.error = null;
    },

    // Initialize admin auth from cookies
    initializeAdminAuth: (state) => {
      const adminToken = getCookie("adminToken");
      if (adminToken) {
        // Note: Admin user data will be fetched via RTK Query
        state.isAdminAuthenticated = true;
      }
    },
  },
});

export const {
  setAdminUser,
  setAdminToken,
  clearAdminUser,
  setAdminLoading,
  setAdminError,
  clearAdminError,
  initializeAdminAuth,
} = adminSlice.actions;

export default adminSlice.reducer;
