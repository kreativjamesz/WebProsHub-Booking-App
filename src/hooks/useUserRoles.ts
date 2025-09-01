import { useAppSelector } from "@/lib/hooks";

export const useUserRoles = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { adminUser } = useAppSelector((state) => state.adminAuth);

  const isCustomer = () => {
    return isAuthenticated && user?.role === "CUSTOMER";
  };

  const isBusinessOwner = () => {
    return isAuthenticated && user?.role === "BUSINESS_OWNER";
  };

  const isAuthenticatedUser = () => {
    return isAuthenticated && !!user;
  };

  const hasRole = (role: "CUSTOMER" | "BUSINESS_OWNER") => {
    return isAuthenticated && user?.role === role;
  };

  const getUserRole = () => {
    return user?.role || null;
  };

  const getAdminRole = () => {
    return adminUser?.role || null;
  };

  const isSuperAdmin = () => {
    return adminUser?.role === "SUPER_ADMIN";
  };

  const isModerator = () => {
    return adminUser?.role === "MODERATOR";
  };

  const isSupport = () => {
    return adminUser?.role === "SUPPORT";
  };

  const isAdmin = () => {
    return (
      adminUser?.role === "SUPER_ADMIN" ||
      adminUser?.role === "MODERATOR" ||
      adminUser?.role === "SUPPORT"
    );
  };

  return {
    isAdmin,
    isCustomer,
    isBusinessOwner,
    isAuthenticatedUser,
    hasRole,
    getUserRole,
    getAdminRole,
    isSuperAdmin,
    isModerator,
    isSupport,
    user,
    adminUser,
    isAuthenticated,
  };
};
