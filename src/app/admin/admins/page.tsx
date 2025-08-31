"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/types";
import { clearAdminUser } from "@/lib/stores/features/admin/adminAuthSlice";
import { useAdminLogoutMutation } from "@/lib/stores/features/admin/admin.api";
import { removeCookie } from "@/lib/utils/cookies";
import { adminStorage } from "@/lib/utils/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { 
  Users, 
  Shield, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  LogOut, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Crown,
  UserCheck,
  UserX
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  employeeId: string;
  permissions: string[];
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
  lastModified: string;
}

export default function AdminsPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { adminUser } = useSelector((state: RootState) => state.adminAuth);
  const [adminLogout] = useAdminLogoutMutation();

  // Check if user is SUPER_ADMIN
  useEffect(() => {
    if (adminUser && adminUser.role !== 'SUPER_ADMIN') {
      router.replace('/admin');
    }
  }, [adminUser, router]);

  // Mock data for admins
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: "admin-1",
      name: "John Admin",
      email: "john.admin@company.com",
      role: "ADMIN",
      department: "IT",
      employeeId: "EMP001",
      permissions: ["user_management", "business_management", "booking_management"],
      isActive: true,
      lastLogin: "2024-01-15T10:30:00Z",
      createdAt: "2023-06-01T00:00:00Z",
      lastModified: "2024-01-10T14:20:00Z"
    },
    {
      id: "admin-2",
      name: "Sarah Manager",
      email: "sarah.manager@company.com",
      role: "ADMIN",
      department: "Operations",
      employeeId: "EMP002",
      permissions: ["business_management", "booking_management"],
      isActive: true,
      lastLogin: "2024-01-14T16:45:00Z",
      createdAt: "2023-08-15T00:00:00Z",
      lastModified: "2024-01-12T09:15:00Z"
    },
    {
      id: "admin-3",
      name: "Mike Support",
      email: "mike.support@company.com",
      role: "SUPPORT",
      department: "Customer Service",
      employeeId: "EMP003",
      permissions: ["booking_management"],
      isActive: false,
      lastLogin: "2024-01-10T11:20:00Z",
      createdAt: "2023-09-20T00:00:00Z",
      lastModified: "2024-01-08T13:30:00Z"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter admins based on search and filters
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch = searchTerm === "" || 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "all" || admin.role === roleFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && admin.isActive) ||
      (statusFilter === "inactive" && !admin.isActive);
    const matchesDepartment = departmentFilter === "all" || admin.department === departmentFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  // Calculate statistics
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.isActive).length;
  const superAdmins = admins.filter(a => a.role === 'SUPER_ADMIN').length;
  const regularAdmins = admins.filter(a => a.role === 'ADMIN').length;

  const handleLogout = async () => {
    try {
      await adminLogout().unwrap();
      dispatch(clearAdminUser());
      removeCookie("adminToken");
      adminStorage.clearAdmin();
      router.push("/admin-login");
    } catch (error) {
      setError("Failed to logout. Please try again.");
    }
  };

  const handleEditAdmin = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAdmin = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateAdmin = (updatedAdmin: AdminUser) => {
    setAdmins(prev => prev.map(admin => 
      admin.id === updatedAdmin.id ? updatedAdmin : admin
    ));
    setIsEditDialogOpen(false);
    setSelectedAdmin(null);
  };

  const handleDeleteAdminConfirm = () => {
    if (selectedAdmin) {
      setAdmins(prev => prev.filter(admin => admin.id !== selectedAdmin.id));
      setIsDeleteDialogOpen(false);
      setSelectedAdmin(null);
    }
  };

  const handleCreateAdmin = (newAdmin: Omit<AdminUser, 'id' | 'createdAt' | 'lastModified'>) => {
    const admin: AdminUser = {
      ...newAdmin,
      id: `admin-${Date.now()}`,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    setAdmins(prev => [...prev, admin]);
    setIsCreateDialogOpen(false);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return <Badge className="bg-purple-100 text-purple-800 flex items-center gap-1"><Crown className="h-3 w-3" />Super Admin</Badge>;
      case "ADMIN":
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
      case "SUPPORT":
        return <Badge className="bg-green-100 text-green-800">Support</Badge>;
      case "MODERATOR":
        return <Badge className="bg-orange-100 text-orange-800">Moderator</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
        <CheckCircle className="h-3 w-3" />Active
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
        <XCircle className="h-3 w-3" />Inactive
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (adminUser?.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don&apos;t have permission to access this page.</p>
          <Button onClick={() => router.push('/admin')}>Back to Dashboard</Button>
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
                  <p className="text-sm font-medium text-muted-foreground">Total Admins</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Active Admins</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Super Admins</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Regular Admins</p>
                  <p className="text-2xl font-bold">{regularAdmins}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search admins..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
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
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="IT">IT</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Customer Service">Customer Service</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="ml-2">
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
                    <th className="text-left py-3 px-4 font-medium">Department</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-left py-3 px-4 font-medium">Last Login</th>
                    <th className="text-left py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAdmins.map((admin) => (
                    <tr key={admin.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{admin.name}</p>
                          <p className="text-sm text-muted-foreground">{admin.email}</p>
                          <p className="text-xs text-muted-foreground">ID: {admin.employeeId}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {getRoleBadge(admin.role)}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{admin.department}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(admin.isActive)}
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {formatDate(admin.lastLogin)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAdmin(admin)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAdmin(admin)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredAdmins.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No admins found matching your criteria.
                </div>
              )}
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
                  onChange={(e) => setSelectedAdmin({...selectedAdmin, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={selectedAdmin.email}
                  onChange={(e) => setSelectedAdmin({...selectedAdmin, email: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <Select value={selectedAdmin.role} onValueChange={(value) => setSelectedAdmin({...selectedAdmin, role: value})}>
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
                <Select value={selectedAdmin.department} onValueChange={(value) => setSelectedAdmin({...selectedAdmin, department: value})}>
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
                  checked={selectedAdmin.isActive}
                  onCheckedChange={(checked) => setSelectedAdmin({...selectedAdmin, isActive: checked})}
                />
                <label className="text-sm font-medium">Active</label>
              </div>
              <div className="flex space-x-2">
                <Button onClick={() => handleUpdateAdmin(selectedAdmin)}>Update</Button>
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete {selectedAdmin?.name}? This action cannot be undone.</p>
          <div className="flex space-x-2">
            <Button variant="destructive" onClick={handleDeleteAdminConfirm}>Delete</Button>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Admin Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Admin</DialogTitle>
          </DialogHeader>
          <CreateAdminForm onSubmit={handleCreateAdmin} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create Admin Form Component
function CreateAdminForm({ 
  onSubmit, 
  onCancel 
}: { 
  onSubmit: (admin: Omit<AdminUser, 'id' | 'createdAt' | 'lastModified'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'ADMIN',
    department: 'IT',
    employeeId: '',
    permissions: [] as string[],
    isActive: true,
    lastLogin: new Date().toISOString()
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
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Employee ID</label>
        <Input
          value={formData.employeeId}
          onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium">Role</label>
        <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ADMIN">Admin</SelectItem>
            <SelectItem value="SUPPORT">Support</SelectItem>
            <SelectItem value="MODERATOR">Moderator</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium">Department</label>
        <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
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
          onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
        />
        <label className="text-sm font-medium">Active</label>
      </div>
      <div className="flex space-x-2">
        <Button type="submit">Create Admin</Button>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
