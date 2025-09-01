"use client";

import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { clearAdminUser } from "@/stores/slices/private/auth/adminAuth.slice";
import { useAdminLogoutMutation } from "@/stores/slices/private/auth/adminAuth.api";
import {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} from "@/stores/slices/private/admin.api";
import { removeCookie } from "@/lib/utils/cookies";
import { adminStorage } from "@/lib/utils/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Users,
  Shield,
  UserPlus,
  Edit,
  LogOut,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Crown,
  UserCheck,
  Trash2,
} from "lucide-react";
import { getCookie } from "@/lib/utils/cookies";
import { toast } from "sonner";
import { type AdminUser } from "@/stores/slices/private/admin.types";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";

export default function AdminsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { adminUser } = useAppSelector((state) => state.adminAuth);
  const [adminLogout] = useAdminLogoutMutation();

  // Check admin token
  const adminToken = getCookie("adminToken");
  console.log("Admin Token:", adminToken ? "Exists" : "Missing");

  // Check if user is SUPER_ADMIN
  useEffect(() => {
    if (adminUser && adminUser.role !== "SUPER_ADMIN") {
      router.replace("/admin");
    }
  }, [adminUser, router]);

  // State for filters and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  // RTK Query hooks
  const {
    data: adminsData,
    isLoading: isLoadingAdmins,
    error: adminsError,
    refetch: refetchAdmins,
  } = useGetAdminsQuery({
    page: currentPage,
    search: searchTerm,
    role: roleFilter,
    status: statusFilter,
  });

  const [createAdmin, { isLoading: isCreatingAdmin }] =
    useCreateAdminMutation();
  const [updateAdmin, { isLoading: isUpdatingAdmin }] =
    useUpdateAdminMutation();
  const [deleteAdmin, { isLoading: isDeletingAdmin }] =
    useDeleteAdminMutation();

  // Extract data from API response
  const admins = adminsData?.admins || [];
  const pagination = adminsData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalAdmins: 0,
    adminsPerPage: 20,
  };

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  const handleLogout = async () => {
    try {
      await adminLogout().unwrap();
      dispatch(clearAdminUser());
      removeCookie("adminToken");
      adminStorage.clearAdmin();
      router.push("/admin-login");
    } catch (error) {
      console.error("Logout failed:", error);
      dispatch(clearAdminUser());
      removeCookie("adminToken");
      adminStorage.clearAdmin();
      router.push("/admin-login");
    }
  };

  const handleCreateAdmin = async (
    adminData: Omit<AdminUser, "id" | "createdAt" | "updatedAt" | "lastLoginAt">
  ) => {
    try {
      await createAdmin(adminData).unwrap();
      toast.success("Admin user created successfully");
      setIsCreateDialogOpen(false);
      refetchAdmins();
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Failed to create admin user";
      toast.error(errorMessage);
      console.error("Create error:", error);
    }
  };

  const handleUpdateAdmin = async (
    adminId: string,
    updates: Partial<
      Omit<AdminUser, "id" | "createdAt" | "updatedAt" | "lastLoginAt">
    >
  ) => {
    try {
      await updateAdmin({ adminId, updates }).unwrap();
      toast.success("Admin user updated successfully");
      setIsEditDialogOpen(false);
      setSelectedAdmin(null);
      refetchAdmins();
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Failed to update admin user";
      toast.error(errorMessage);
      console.error("Update error:", error);
    }
  };

  const handleDeleteAdmin = async (adminId: string) => {
    if (confirm("Are you sure you want to delete this admin user?")) {
      try {
        await deleteAdmin(adminId).unwrap();
        toast.success("Admin user deleted successfully");
        refetchAdmins();
      } catch (error: unknown) {
        const errorMessage =
          (error as { data?: { error?: string } })?.data?.error ||
          "Failed to delete admin user";
        toast.error(errorMessage);
        console.error("Delete error:", error);
      }
    }
  };

  // Calculate statistics
  const totalAdmins = pagination.totalAdmins;
  const activeAdmins = admins.filter((a: AdminUser) => a.isActive).length;
  const superAdmins = admins.filter(
    (a: AdminUser) => a.role === "SUPER_ADMIN"
  ).length;
  const moderatorAdmins = admins.filter(
    (a: AdminUser) => a.role === "MODERATOR"
  ).length;
  const supportAdmins = admins.filter(
    (a: AdminUser) => a.role === "SUPPORT"
  ).length;

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Super Admin
          </Badge>
        );
      case "MODERATOR":
        return <Badge className="bg-blue-100 text-blue-800">Moderator</Badge>;
      case "SUPPORT":
        return <Badge className="bg-green-100 text-green-800">Support</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
        <XCircle className="h-3 w-3" />
        Inactive
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (adminUser?.role !== "SUPER_ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            You don&apos;t have permission to access this page.
          </p>
          <Button onClick={() => router.push("/admin")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Admin Management
                </h1>
                <p className="text-muted-foreground">
                  Manage system administrators and their permissions
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <p className="font-semibold">{adminUser?.name}</p>
                <Badge variant="outline" className="mt-1">
                  {adminUser?.role.replace("_", " ")}
                </Badge>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Admins
                  </p>
                  <p className="text-2xl font-bold">{totalAdmins}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Admins
                  </p>
                  <p className="text-2xl font-bold">{activeAdmins}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Crown className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Super Admins
                  </p>
                  <p className="text-2xl font-bold">{superAdmins}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Moderator Admins
                  </p>
                  <p className="text-2xl font-bold">{moderatorAdmins}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Shield className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Support Admins
                  </p>
                  <p className="text-2xl font-bold">{supportAdmins}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {/* This dialog is not directly managed by isEditDialogOpen, so it needs its own state */}
        {/* For simplicity, we'll keep it as a separate dialog */}
        {/* This section is removed as per the new_code, as the error alert is no longer present */}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchInput
              placeholder="Search admins..."
              value={searchTerm}
              onChange={setSearchTerm}
              delay={500}
            />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="SUPPORT">Support</SelectItem>
                <SelectItem value="MODERATOR">Moderator</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="ml-2"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Add Admin
            </Button>
          </div>
        </div>

        {/* Admins Table */}
        <Card>
          <CardHeader>
            <CardTitle>System Administrators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Name</th>
                    <th className="text-left py-3 px-4 font-medium">Role</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Department
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">
                      Last Login
                    </th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoadingAdmins ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        Loading admins...
                      </td>
                    </tr>
                  ) : adminsError ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-destructive"
                      >
                        Error loading admins:{" "}
                        {(adminsError as { data?: { error?: string } })?.data
                          ?.error || "Unknown error"}
                      </td>
                    </tr>
                  ) : admins.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-8 text-center text-muted-foreground"
                      >
                        No admins found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin: AdminUser) => (
                      <tr key={admin.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{admin.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {admin.email}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              ID: {admin.employeeId || "N/A"}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {getRoleBadge(admin.role)}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">
                            {admin.department || "N/A"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(admin.isActive)}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {formatDate(admin.lastLoginAt || null)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setIsEditDialogOpen(true);
                              }}
                              disabled={isUpdatingAdmin}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteAdmin(admin.id)}
                              className="text-destructive hover:text-destructive"
                              disabled={isDeletingAdmin}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="mt-6">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalAdmins}
                  itemsPerPage={pagination.adminsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Admin</DialogTitle>
          </DialogHeader>
          {selectedAdmin && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input
                  value={selectedAdmin.name}
                  onChange={(e) =>
                    setSelectedAdmin({ ...selectedAdmin, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={selectedAdmin.email}
                  onChange={(e) =>
                    setSelectedAdmin({
                      ...selectedAdmin,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select
                  value={selectedAdmin.role}
                  onValueChange={(value: AdminUser["role"]) =>
                    setSelectedAdmin({ ...selectedAdmin, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPPORT">Support</SelectItem>
                    <SelectItem value="MODERATOR">Moderator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Department</label>
                <Select
                  value={selectedAdmin.department || ""}
                  onValueChange={(value) =>
                    setSelectedAdmin({ ...selectedAdmin, department: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Customer Service">
                      Customer Service
                    </SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedAdmin.isActive}
                  onCheckedChange={(checked) =>
                    setSelectedAdmin({ ...selectedAdmin, isActive: checked })
                  }
                />
                <label className="text-sm font-medium">Active</label>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() =>
                    handleUpdateAdmin(selectedAdmin.id, selectedAdmin)
                  }
                >
                  Update
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {/* This dialog is not directly managed by isEditDialogOpen, so it needs its own state */}
      {/* For simplicity, we'll keep it as a separate dialog */}
      {selectedAdmin && (
        <Dialog
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedAdmin(null);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Admin</DialogTitle>
            </DialogHeader>
            <p>
              Are you sure you want to delete {selectedAdmin.name}? This action
              cannot be undone.
            </p>
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                onClick={() => handleDeleteAdmin(selectedAdmin.id)}
              >
                Delete
              </Button>
              <Button variant="outline" onClick={() => setSelectedAdmin(null)}>
                Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Admin Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
          </DialogHeader>
          <CreateAdminForm
            onSubmit={handleCreateAdmin}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create Admin Form Component
function CreateAdminForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (
    admin: Omit<AdminUser, "id" | "createdAt" | "updatedAt" | "lastLoginAt">
  ) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<
    Omit<AdminUser, "id" | "createdAt" | "updatedAt" | "lastLoginAt">
  >({
    name: "",
    email: "",
    password: "",
    role: "SUPPORT",
    department: "IT",
    employeeId: "",
    permissions: "[]",
    isActive: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Employee ID</label>
        <Input
          value={formData.employeeId || ""}
          onChange={(e) =>
            setFormData({ ...formData, employeeId: e.target.value })
          }
        />
      </div>
      <div>
        <label className="text-sm font-medium">Role</label>
        <Select
          value={formData.role}
          onValueChange={(value: AdminUser["role"]) =>
            setFormData({ ...formData, role: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SUPPORT">Support</SelectItem>
            <SelectItem value="MODERATOR">Moderator</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Department</label>
        <Select
          value={formData.department || ""}
          onValueChange={(value) =>
            setFormData({ ...formData, department: value })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IT">IT</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
            <SelectItem value="Customer Service">Customer Service</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          checked={formData.isActive}
          onCheckedChange={(checked) =>
            setFormData({ ...formData, isActive: checked })
          }
        />
        <label className="text-sm font-medium">Active</label>
      </div>
      <div className="flex space-x-2">
        <Button type="submit">Create Admin</Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
