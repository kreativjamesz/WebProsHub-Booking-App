"use client";

import { useState } from "react";
import {} from "@/lib/hooks";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/stores/slices/private/admin.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {} from "@/components/ui/table";

import { Users, UserCheck, Building2, Filter } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/types/user";
import { getCookie } from "@/lib/utils/cookies";
import { Pagination } from "@/components/admin/Pagination";
import { useAdminHeader } from "@/lib/hooks";
// StatCard not used directly; AdminCardGrid renders cards
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { AdminCardGrid } from "@/components/admin/AdminCardGrid";
import { AdminFilterCard } from "@/components/admin/AdminFilterCard";
import { UsersTable } from "@/components/admin/UsersTable";

export default function AdminUsersPage() {
  // const { adminUser } = useAppSelector((state) => state.adminAuth);
  useAdminHeader("User Management", [
    { label: "Dashboard", href: "/admin" },
    { label: "Users" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Check admin token
  const adminToken = getCookie("adminToken");
  console.log("Admin Token:", adminToken ? "Exists" : "Missing");

  // RTK Query hooks
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [deleteUser] = useDeleteUserMutation();

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = useGetUsersQuery({
    page: currentPage,
    search: searchTerm,
    role: roleFilter,
    status: statusFilter,
  });

  // Extract data from API response
  const users = usersData?.users || [];
  const pagination = usersData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    usersPerPage: 12,
  };

  // Handle role update
  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await updateUserRole({ userId, role: newRole as User["role"] }).unwrap();
      toast.success("User role updated successfully");
      refetchUsers();
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Failed to update user role";
      toast.error(errorMessage);
      console.error("Role update error:", error);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId).unwrap();
        toast.success("User deleted successfully");
        refetchUsers();
      } catch (error: unknown) {
        const errorMessage =
          (error as { data?: { error?: string } })?.data?.error ||
          "Failed to delete user";
        toast.error(errorMessage);
        console.error("Delete error:", error);
      }
    }
  };

  // Calculate statistics
  const totalUsers = pagination.totalUsers;
  const customers = users.filter(
    (user: User) => user.role === "CUSTOMER"
  ).length;
  const businessOwners = users.filter(
    (user: User) => user.role === "BUSINESS_OWNER"
  ).length;
  const activeUsers = users.filter(
    (user: User) => user.status === "ACTIVE"
  ).length;
  const inactiveUsers = users.filter(
    (user: User) => user.status === "INACTIVE"
  ).length;

  const isShowingActive = statusFilter === "ACTIVE" || statusFilter === "all";
  const toggleActiveInactive = () => {
    setStatusFilter(isShowingActive ? "INACTIVE" : "ACTIVE");
  };

  if (usersError) {
    return (
      <AdminPageContainer>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading users:{" "}
              {(usersError as { data?: { error?: string } })?.data?.error ||
                "Unknown error"}
            </div>
          </CardContent>
        </Card>
      </AdminPageContainer>
    );
  }

  return (
    <AdminPageContainer className="space-y-6">
      {/* Statistics Cards */}
      <AdminCardGrid
        cols={{ base: 1, md: 4, lg: 4 }}
        gapClassName="gap-4"
        items={[
          {
            type: "stat",
            title: "Total Users",
            value: totalUsers,
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
          },
          {
            type: "stat",
            title: "Customers",
            value: customers,
            icon: <UserCheck className="h-4 w-4 text-muted-foreground" />,
          },
          {
            type: "stat",
            title: "Business Owners",
            // subtitle: `Showing ${
            //   isShowingActive ? "ACTIVE" : "INACTIVE"
            // } users`,
            value: businessOwners,
            icon: <Building2 className="h-4 w-4 text-muted-foreground" />,
          },
          {
            type: "action",
            props: {
              title: isShowingActive ? "Active Users" : "Inactive Users",
              // subtitle: `Showing ${
              //   isShowingActive ? "ACTIVE" : "INACTIVE"
              // } users`,
              clickable: true,
              hover: true,
              onClick: toggleActiveInactive,
              actions: (
                <span className="text-xs px-2 py-0.5 rounded bg-muted">
                  Toggle
                </span>
              ),
              content: (
                <>
                  <div className="text-2xl font-bold">
                    {isShowingActive ? activeUsers : inactiveUsers}
                  </div>
                </>
              ),
            },
          },
        ]}
      />

      {/* Filters and Search */}
      <AdminFilterCard
        className="users-filters-search mb-6"
        title="Filters & Search"
        icon={<Filter className="h-5 w-5" />}
        search={{
          placeholder: "Search users...",
          value: searchTerm,
          onChange: setSearchTerm,
          delay: 500,
        }}
        selects={[
          {
            id: "role",
            value: roleFilter,
            onValueChange: setRoleFilter,
            options: [
              { label: "All Roles", value: "all" },
              { label: "Customer", value: "CUSTOMER" },
              { label: "Business Owner", value: "BUSINESS_OWNER" },
            ],
            triggerClassName: "w-full md:w-48",
          },
          {
            id: "status",
            value: statusFilter,
            onValueChange: setStatusFilter,
            options: [
              { label: "All Status", value: "all" },
              { label: "Active", value: "ACTIVE" },
              { label: "Inactive", value: "INACTIVE" },
            ],
            triggerClassName: "w-full md:w-48",
          },
        ]}
        actions={
          <Button onClick={() => refetchUsers()} variant="outline">
            Refresh
          </Button>
        }
      />

      {/* Users Table */}
      <Card className="users-table-container">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <UsersTable
            users={users}
            isLoading={isLoadingUsers}
            onUpdateRole={(id, role) => handleRoleUpdate(id, role)}
            onDelete={(id) => handleDeleteUser(id)}
          />

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalUsers}
              itemsPerPage={pagination.usersPerPage}
              onPageChange={setCurrentPage}
            />
          </div>
        </CardContent>
      </Card>
    </AdminPageContainer>
  );
}
