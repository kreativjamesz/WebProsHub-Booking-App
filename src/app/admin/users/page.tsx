"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { fetchUsers, updateUserRole, deleteUser } from "@/lib/stores/features/admin/adminUsersSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

import { Search, Users, UserCheck, Building2 } from "lucide-react";
import { toast } from "sonner";
import { User } from "@/lib/types/user";
import { getCookie } from "@/lib/utils/cookies";

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Check admin token
  const adminToken = getCookie('adminToken');
  console.log('Admin Token:', adminToken ? 'Exists' : 'Missing');

  // Use Redux slice instead of RTK Query (same as dashboard)
  const {
    users,
    isLoadingUsers,
    error: usersError,
  } = useAppSelector((state) => state.adminUsers);

  // Fetch users when component mounts or filters change
  useEffect(() => {
    if (adminToken) {
      console.log('Fetching users with Redux slice...');
      dispatch(fetchUsers({
        page: currentPage,
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
      }));
    }
  }, [dispatch, adminToken, currentPage, searchTerm, roleFilter, statusFilter]);

  // Handle role update
  const handleRoleUpdate = async (userId: string, newRole: string) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole as User["role"] })).unwrap();
      toast.success("User role updated successfully");
      // Refresh the data
      dispatch(fetchUsers({
        page: currentPage,
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
      }));
    } catch (error) {
      toast.error("Failed to update user role");
      console.error("Role update error:", error);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success("User deleted successfully");
        // Refresh the data
        dispatch(fetchUsers({
          page: currentPage,
          search: searchTerm,
          role: roleFilter,
          status: statusFilter,
        }));
      } catch (error) {
        toast.error("Failed to delete user");
        console.error("Delete error:", error);
      }
    }
  };

  // Calculate statistics
  const totalUsers = users?.length || 0;
  const customers = users?.filter((u: User) => u.role === "CUSTOMER").length || 0;
  const businessOwners = users?.filter(
    (u: User) => u.role === "BUSINESS_OWNER"
  ).length || 0;
  const activeUsers = users?.length || 0;

  if (usersError) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              Error loading users:{" "}
              {usersError || "Unknown error"}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex items-center space-x-2">
          <Badge variant={adminToken ? "default" : "destructive"}>
            {adminToken ? "Authenticated" : "Not Authenticated"}
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Business Owners
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businessOwners}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => dispatch(fetchUsers({
              page: currentPage,
              search: searchTerm,
              role: roleFilter,
              status: statusFilter,
            }))} variant="outline">
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
                      <TableCell className="font-medium">{user.name}</TableCell>
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
                              <SelectItem value="CUSTOMER">Customer</SelectItem>
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
