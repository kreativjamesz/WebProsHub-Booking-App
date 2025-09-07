"use client";

import { useState, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";

import {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useUpdateAdminMutation,
  useDeleteAdminMutation,
} from "@/stores/slices/private/admin.api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  UserCheck,
  AlertTriangle,
  UserPlus,
  UserX,
} from "lucide-react";
import { getCookie } from "@/lib/utils/cookies";
import { toast } from "sonner";
import { type AdminUser } from "@/stores/slices/private/admin.types";
// SearchInput no longer needed here; AdminFilterCard encapsulates it
import { useAdminHeader } from "@/lib/hooks";
import { AdminCardGrid } from "@/components/admin/AdminCardGrid";
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { AdminsTable } from "@/components/admin/AdminsTable";
import { AdminFilterCard } from "@/components/admin/AdminFilterCard";

export default function AdminsPage() {
  const router = useRouter();
  const { adminUser } = useAppSelector((state) => state.adminAuth);
  useAdminHeader("Admin Management", [
    { label: "Dashboard", href: "/admin" },
    { label: "Admins" },
  ]);

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
  const { data: adminsData, isLoading: isLoadingAdmins } = useGetAdminsQuery({
    page: currentPage,
    search: searchTerm,
    role: roleFilter,
    status: statusFilter,
  });

  const [createAdmin] = useCreateAdminMutation();
  const [updateAdmin] = useUpdateAdminMutation();
  const [deleteAdmin] = useDeleteAdminMutation();

  const handleCreateAdmin = async (
    adminData: Omit<AdminUser, "id" | "createdAt" | "updatedAt" | "lastLoginAt">
  ) => {
    try {
      await createAdmin(adminData).unwrap();
      toast.success("Admin user created successfully");
      setIsCreateDialogOpen(false);
      // optional: refetchAdmins();
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
      // optional: refetchAdmins();
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
        setSelectedAdmin(null);
        // optional: refetchAdmins();
      } catch (error: unknown) {
        const errorMessage =
          (error as { data?: { error?: string } })?.data?.error ||
          "Failed to delete admin user";
        toast.error(errorMessage);
        console.error("Delete error:", error);
      }
    }
  };

  // Extract data from API response
  const admins = adminsData?.admins || [];
  const pagination = adminsData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalAdmins: 0,
    adminsPerPage: 12,
  };

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  // Calculate statistics
  const totalAdmins = pagination.totalAdmins;
  const activeAdmins = admins.filter((a: AdminUser) => a.isActive).length;
  const inactiveAdmins = admins.filter((a: AdminUser) => !a.isActive).length;
  const superAdmins = admins.filter(
    (a: AdminUser) => a.role === "SUPER_ADMIN"
  ).length;
  const moderatorAdmins = admins.filter(
    (a: AdminUser) => a.role === "MODERATOR"
  ).length;
  const supportAdmins = admins.filter(
    (a: AdminUser) => a.role === "SUPPORT"
  ).length;

  const [roleCard, setRoleCard] = useState<
    "SUPER_ADMIN" | "MODERATOR" | "SUPPORT"
  >("SUPPORT");
  const roleCountByKey: Record<
    "SUPER_ADMIN" | "MODERATOR" | "SUPPORT",
    number
  > = {
    SUPER_ADMIN: superAdmins,
    MODERATOR: moderatorAdmins,
    SUPPORT: supportAdmins,
  };
  const roleLabelByKey: Record<
    "SUPER_ADMIN" | "MODERATOR" | "SUPPORT",
    string
  > = {
    SUPER_ADMIN: "SuperAdmins",
    MODERATOR: "Moderators",
    SUPPORT: "Supports",
  };

  if (adminUser?.role !== "SUPER_ADMIN") {
    return (
      <AdminPageContainer withBackground={false}>
        <div className="min-h-[60vh] flex items-center justify-center">
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
            title: "Total Admins",
            value: totalAdmins,
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
            className: "text-blue-500",
          },
          {
            type: "stat",
            title: "Active Admins",
            subtitle: `Showing ${activeAdmins} active admins`,
            value: activeAdmins,
            icon: <UserCheck className="h-4 w-4 text-muted-foreground" />,
            className: "text-green-500",
          },
          {
            type: "stat",
            title: "Inactive Admins",
            subtitle: `Showing ${inactiveAdmins} inactive admins`,
            value: inactiveAdmins,
            icon: <UserX className="h-4 w-4 text-muted-foreground" />,
            className: "text-red-500",
          },
          {
            type: "action",
            props: {
              title: roleLabelByKey[roleCard],
              clickable: false,
              hover: true,
              actions: (
                <Select
                  value={roleCard}
                  onValueChange={(v) => setRoleCard(v as typeof roleCard)}
                >
                  <SelectTrigger className="h-8 w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SUPER_ADMIN">SuperAdmins</SelectItem>
                    <SelectItem value="MODERATOR">Moderators</SelectItem>
                    <SelectItem value="SUPPORT">Supports</SelectItem>
                  </SelectContent>
                </Select>
              ),
              content: (
                <>
                  <div className="text-2xl font-bold">
                    {roleCountByKey[roleCard]}
                  </div>
                </>
              ),
            },
          },
        ]}
      />

      {/* Filters & Search */}
      <AdminFilterCard
        className="admins-filters-search mb-6"
        icon={<Shield className="h-5 w-5" />}
        title="Filters & Search"
        search={{
          placeholder: "Search admins...",
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
              { label: "Super Admin", value: "SUPER_ADMIN" },
              { label: "Admin", value: "ADMIN" },
              { label: "Support", value: "SUPPORT" },
              { label: "Moderator", value: "MODERATOR" },
            ],
            triggerClassName: "w-32",
          },
          {
            id: "status",
            value: statusFilter,
            onValueChange: setStatusFilter,
            options: [
              { label: "All Status", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
            triggerClassName: "w-32",
          },
        ]}
        actions={
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="ml-0 md:ml-2"
            size="sm"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Admin
          </Button>
        }
      />

      {/* Admins Table */}
      <AdminsTable
        containerClassName="admins-table-container"
        title="System Administrators"
        admins={admins}
        isLoading={isLoadingAdmins}
        onEdit={(a) => {
          setSelectedAdmin(a);
          setIsEditDialogOpen(true);
        }}
        onDelete={(id) => handleDeleteAdmin(id)}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalAdmins,
          itemsPerPage: pagination.adminsPerPage,
        }}
        onPageChange={setCurrentPage}
      />

      {/* Edit Admin Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-7xl">
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
    </AdminPageContainer>
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
