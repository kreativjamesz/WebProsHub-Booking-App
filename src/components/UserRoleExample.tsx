import { useUserRoles } from "@/lib/hooks";

export const UserRoleExample = () => {
  const {
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
  } = useUserRoles();

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">User Role Hook Example</h2>

      {/* Authentication Status */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Authentication Status</h3>
        <p>Is Authenticated: {isAuthenticated ? "✅ Yes" : "❌ No"}</p>
        <p>
          Is Authenticated User: {isAuthenticatedUser() ? "✅ Yes" : "❌ No"}
        </p>
      </div>

      {/* Regular User Roles */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Regular User Roles</h3>
        <p>Is Customer: {isCustomer() ? "✅ Yes" : "❌ No"}</p>
        <p>Is Business Owner: {isBusinessOwner() ? "✅ Yes" : "❌ No"}</p>
        <p>Current Role: {getUserRole() || "None"}</p>
        <p>Has Customer Role: {hasRole("CUSTOMER") ? "✅ Yes" : "❌ No"}</p>
        <p>
          Has Business Owner Role:{" "}
          {hasRole("BUSINESS_OWNER") ? "✅ Yes" : "❌ No"}
        </p>
      </div>

      {/* Admin User Roles */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Admin User Roles</h3>
        <p>Is Admin: {isAdmin() ? "✅ Yes" : "❌ No"}</p>
        <p>Is Super Admin: {isSuperAdmin() ? "✅ Yes" : "❌ No"}</p>
        <p>Is Moderator: {isModerator() ? "✅ Yes" : "❌ No"}</p>
        <p>Is Support: {isSupport() ? "✅ Yes" : "❌ No"}</p>
        <p>Admin Role: {getAdminRole() || "None"}</p>
      </div>

      {/* User Information */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">User Information</h3>
        <p>Regular User: {user ? `${user.name} (${user.email})` : "None"}</p>
        <p>
          Admin User:{" "}
          {adminUser ? `${adminUser.name} (${adminUser.email})` : "None"}
        </p>
      </div>

      {/* Conditional Rendering Examples */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">
          Conditional Rendering Examples
        </h3>

        {isCustomer() && (
          <div className="p-3 bg-blue-100 rounded">
            🛒 This content is only visible to customers
          </div>
        )}

        {isBusinessOwner() && (
          <div className="p-3 bg-green-100 rounded">
            🏢 This content is only visible to business owners
          </div>
        )}

        {isAdmin() && (
          <div className="p-3 bg-purple-100 rounded">
            👑 This content is only visible to admins
          </div>
        )}

        {isSuperAdmin() && (
          <div className="p-3 bg-red-100 rounded">
            ⚡ This content is only visible to super admins
          </div>
        )}

        {!isAuthenticatedUser() && (
          <div className="p-3 bg-gray-100 rounded">
            🔒 This content is only visible to unauthenticated users
          </div>
        )}
      </div>
    </div>
  );
};
