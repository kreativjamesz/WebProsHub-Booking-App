import { createSlice } from '@reduxjs/toolkit';

interface AdminAdminsState {
  admins: any[];
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminAdminsState = {
  admins: [],
  isLoading: false,
  error: null,
};

const adminAdminsSlice = createSlice({
  name: 'adminAdmins',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { clearError } = adminAdminsSlice.actions;
export default adminAdminsSlice.reducer;
