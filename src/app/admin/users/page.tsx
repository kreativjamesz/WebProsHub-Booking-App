"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} from "@/stores/slices/private/admin.api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Users, UserCheck, Building2 } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/types/user";
import { getCookie } from "@/lib/utils/cookies";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";
import { useAdminHeader } from "@/lib/hooks";
import { StatCard } from "@/components/admin/StatCard";

export default function AdminUsersPage() {
  const { adminUser } = useAppSelector((state) => state.adminAuth);
  const dispatch = useAppDispatch();
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

  if (usersError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading users:{" "}
              {(usersError as { data?: { error?: string } })?.data?.error ||
                "Unknown error"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 min-h-screen bg-background">

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Users"
            value={totalUsers}
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
          />

          <StatCard
            title="Customers"
            value={customers}
            icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
          />

          <StatCard
            title="Business Owners"
            value={businessOwners}
            icon={<Building2 className="h-4 w-4 text-muted-foreground" />}
          />

          <StatCard
            title="Active Users"
            value={activeUsers}
            icon={<UserCheck className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <SearchInput
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  delay={500}
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="BUSINESS_OWNER">Business Owner</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={() => dispatch(refetchUsers)} variant="outline">
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="text-center py-8">Loading users...</div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user: User) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "BUSINESS_OWNER"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {user.role === "BUSINESS_OWNER"
                              ? "Business Owner"
                              : "Customer"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Select
                              value={user.role}
                              onValueChange={(newRole) =>
                                handleRoleUpdate(user.id, newRole)
                              }
                              disabled={isLoadingUsers}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="CUSTOMER">
                                  Customer
                                </SelectItem>
                                <SelectItem value="BUSINESS_OWNER">
                                  Business Owner
                                </SelectItem>
                              </SelectContent>
                            </Select>

                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={isLoadingUsers}
                            >
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

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
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
