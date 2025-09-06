import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "../stores";
import { useEffect } from "react";
import {
  setHeader,
  type AdminBreadcrumb,
} from "@/stores/slices/private/system/adminHeader.slice";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export the useUserRoles hook
export { useUserRoles } from "../hooks/useUserRoles";

export function useAdminHeader(title: string, breadcrumbs?: AdminBreadcrumb[]) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setHeader({ title, breadcrumbs }));
  }, [dispatch, title, breadcrumbs]);
}
