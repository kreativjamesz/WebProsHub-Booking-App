import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AdminBreadcrumb = { label: string; href?: string };

export interface AdminHeaderState {
  title: string;
  breadcrumbs: AdminBreadcrumb[];
}

const initialState: AdminHeaderState = {
  title: "",
  breadcrumbs: [],
};

const adminHeaderSlice = createSlice({
  name: "adminHeader",
  initialState,
  reducers: {
    setHeader(
      state,
      action: PayloadAction<{ title: string; breadcrumbs?: AdminBreadcrumb[] }>
    ) {
      state.title = action.payload.title;
      state.breadcrumbs = action.payload.breadcrumbs ?? [];
    },
    setTitle(state, action: PayloadAction<string>) {
      state.title = action.payload;
    },
    setBreadcrumbs(state, action: PayloadAction<AdminBreadcrumb[]>) {
      state.breadcrumbs = action.payload;
    },
    clearHeader(state) {
      state.title = "";
      state.breadcrumbs = [];
    },
  },
});

export const { setHeader, setTitle, setBreadcrumbs, clearHeader } =
  adminHeaderSlice.actions;

export default adminHeaderSlice.reducer;


