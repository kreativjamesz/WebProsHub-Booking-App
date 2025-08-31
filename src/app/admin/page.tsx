"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { clearAdminUser } from "@/lib/stores/features/auth/authSlice";
import { removeCookie } from "@/lib/utils/cookies";
import { adminStorage } from "@/lib/utils/storage";
import { useLogoutMutation } from "@/lib/stores/features/auth/auth.api";
import {
  fetchAllUsers,
  fetchAllBusinesses,
  updateUserRole,
  deleteUser,
  deleteBusiness,
  assignBusinessOwner,
  toggleBusinessStatus,
} from "@/lib/stores/features/admin/adminSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Building,
  UserPlus,
  Settings,
  Trash2,
  Eye,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Shield,
  MapPin,
  Star,
  NotebookPen,
  Phone,
  Mail,
  Globe,
  LogOut,
} from "lucide-react";
import { User, Business } from "@/lib/types";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { adminUser } = useAppSelector((state) => state.auth);
  const { users, allBusinesses, isLoading, error } = useAppSelector(
    (state) => state.admin
  );

  // RTK Query hook for logout
  const [logout] = useLogoutMutation();

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [isAssigningOwner, setIsAssigningOwner] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBusinesses());
  }, [dispatch]);

  // Authentication is now handled by AdminAuthGuard in the layout
  // No need for duplicate checks here

  const handleUpdateUserRole = (userId: string, newRole: string) => {
    dispatch(updateUserRole({ userId, role: newRole as User["role"] }));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(userId));
    }
  };

  const handleDeleteBusiness = (businessId: string) => {
    if (confirm("Are you sure you want to delete this business?")) {
      dispatch(deleteBusiness(businessId));
    }
  };

  const handleAssignOwner = async () => {
    if (selectedBusiness && ownerEmail) {
      setIsAssigningOwner(true);
      try {
        await dispatch(
          assignBusinessOwner({ businessId: selectedBusiness.id, ownerEmail })
        );
        setOwnerEmail("");
        setSelectedBusiness(null);
      } finally {
        setIsAssigningOwner(false);
      }
    }
  };

  const handleToggleBusinessStatus = (businessId: string) => {
    dispatch(toggleBusinessStatus({ businessId, isActive: true }));
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearAdminUser());
      removeCookie("adminToken"); // Remove cookie
      adminStorage.clearAdmin(); // Clear localStorage
      router.push("/admin-login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Even if logout fails, clear local state and cookies
      dispatch(clearAdminUser());
      removeCookie("adminToken"); // Remove cookie
      adminStorage.clearAdmin(); // Clear localStorage
      router.push("/admin-login");
    }
  };

  // Calculate statistics
  const totalUsers = users?.length || 0;
  const totalBusinesses = allBusinesses?.length || 0;
  const activeBusinesses = allBusinesses?.filter((b) => b.isActive).length || 0;
  const pendingBusinesses =
    allBusinesses?.filter((b) => !b.isActive).length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage users, businesses, and system settings
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
                    Total Users
                  </p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Businesses
                  </p>
                  <p className="text-2xl font-bold">{totalBusinesses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Businesses
                  </p>
                  <p className="text-2xl font-bold">{activeBusinesses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Pending Approval
                  </p>
                  <p className="text-2xl font-bold">{pendingBusinesses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users Management</span>
            </TabsTrigger>
            <TabsTrigger
              value="businesses"
              className="flex items-center space-x-2"
            >
              <Building className="h-4 w-4" />
              <span>Businesses Management</span>
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>System Users</span>
                </CardTitle>
                <CardDescription>
                  Manage user accounts, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users?.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <Select
                                value={user.role}
                                onValueChange={(value) =>
                                  handleUpdateUserRole(user.id, value)
                                }
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
                                  <SelectItem value="ADMIN">Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.role === "ADMIN"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {user.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedUser(user)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Businesses Tab */}
          <TabsContent value="businesses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>Businesses</span>
                </CardTitle>
                <CardDescription>
                  Manage business listings, approvals, and ownership
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Business</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Owner</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {allBusinesses?.map((business) => (
                          <TableRow key={business.id}>
                            <TableCell>
                              <div className="space-y-1">
                                <p className="font-medium">{business.name}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                  {business.description}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>
                                  {business.city}, {business.state}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                <Users className="h-3 w-3" />
                                <span>{business.ownerId || "Unassigned"}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  business.isActive ? "default" : "secondary"
                                }
                                className={
                                  business.isActive
                                    ? "bg-green-100 text-green-800"
                                    : ""
                                }
                              >
                                {business.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setSelectedBusiness(business)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleToggleBusinessStatus(business.id)
                                  }
                                >
                                  <Settings className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    handleDeleteBusiness(business.id)
                                  }
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              View and manage user information
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <p className="text-sm font-medium">{selectedUser.name}</p>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm font-medium">{selectedUser.email}</p>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Badge variant="secondary">{selectedUser.role}</Badge>
              </div>
              <div className="space-y-2">
                <Label>Created</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Business Details Dialog */}
      <Dialog
        open={!!selectedBusiness}
        onOpenChange={() => setSelectedBusiness(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Business Details</DialogTitle>
            <DialogDescription>
              View and manage business information
            </DialogDescription>
          </DialogHeader>
          {selectedBusiness && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <p className="text-sm font-medium">{selectedBusiness.name}</p>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Badge
                    variant={
                      selectedBusiness.isActive ? "default" : "secondary"
                    }
                    className={
                      selectedBusiness.isActive
                        ? "bg-green-100 text-green-800"
                        : ""
                    }
                  >
                    {selectedBusiness.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedBusiness.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Location</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedBusiness.address}, {selectedBusiness.city},{" "}
                    {selectedBusiness.state} {selectedBusiness.zipCode}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Contact</Label>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p className="flex items-center space-x-2">
                      <Phone className="h-3 w-3" />
                      <span>{selectedBusiness.phone}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Mail className="h-3 w-3" />
                      <span>{selectedBusiness.email}</span>
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Assign Business Owner</Label>
                <div className="flex space-x-2">
                  <Input
                    type="email"
                    placeholder="Enter owner email"
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                  />
                  <Button
                    onClick={handleAssignOwner}
                    disabled={isAssigningOwner || !ownerEmail}
                    size="sm"
                  >
                    {isAssigningOwner ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Assign"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
