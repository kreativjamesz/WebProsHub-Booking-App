import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminUser } from '@/lib/types';

// Admin authentication state interface
export interface AdminAuthState {
  adminUser: AdminUser | null;
  adminToken: string | null;
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminAuthState = {
  adminUser: null,
  adminToken: null,
  isAdminAuthenticated: false,
  isLoading: false,
  error: null,
};

const adminAuthSlice = createSlice({
  name: 'adminAuth',
  initialState,
  reducers: {
    // Set admin user and authentication state
    setAdminUser: (state, action: PayloadAction<AdminUser>) => {
      state.adminUser = action.payload;
      state.isAdminAuthenticated = true;
      state.error = null;
    },

    // Set admin token
    setAdminToken: (state, action: PayloadAction<string>) => {
      state.adminToken = action.payload;
    },

    // Set admin authentication loading state
    setAdminLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    // Set admin authentication error
    setAdminError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Clear admin authentication error
    clearAdminError: (state) => {
      state.error = null;
    },

    // Clear admin user and reset authentication state
    clearAdminUser: (state) => {
      state.adminUser = null;
      state.adminToken = null;
      state.isAdminAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },

    // Initialize admin authentication from stored data
    initializeAdminAuth: (state, action: PayloadAction<{ adminUser: AdminUser; adminToken: string }>) => {
      state.adminUser = action.payload.adminUser;
      state.adminToken = action.payload.adminToken;
      state.isAdminAuthenticated = true;
      state.error = null;
      state.isLoading = false;
    },

    // Update admin user profile
    updateAdminProfile: (state, action: PayloadAction<Partial<AdminUser>>) => {
      if (state.adminUser) {
        state.adminUser = { ...state.adminUser, ...action.payload };
      }
    },

    // Reset admin authentication state to initial
    resetAdminAuth: (state) => {
      return initialState;
    },
  },
});

export const {
  setAdminUser,
  setAdminToken,
  setAdminLoading,
  setAdminError,
  clearAdminError,
  clearAdminUser,
  initializeAdminAuth,
  updateAdminProfile,
  resetAdminAuth,
} = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
