"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
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
import {
  Users,
  Building,
  UserPlus,
  Settings,
  Trash2,
  Edit,
  Eye,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { User, Business } from "@/lib/types";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { users, allBusinesses, isLoading, error } = useAppSelector(
    (state) => state.admin
  );

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isAssigningOwner, setIsAssigningOwner] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState("");

  useEffect(() => {
    dispatch(fetchAllUsers());
    dispatch(fetchAllBusinesses());
  }, [dispatch]);

  // Redirect if not admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      window.location.href = "/";
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return null;
  }

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
    if (!selectedBusiness || !ownerEmail.trim()) return;

    setIsAssigningOwner(true);
    try {
      await dispatch(
        assignBusinessOwner({
          businessId: selectedBusiness.$id,
          ownerEmail: ownerEmail.trim(),
        })
      ).unwrap();
      setOwnerEmail("");
      setSelectedBusiness(null);
    } catch (error) {
      console.error("Failed to assign owner:", error);
    } finally {
      setIsAssigningOwner(false);
    }
  };

  const handleToggleBusinessStatus = (
    businessId: string,
    currentStatus: boolean
  ) => {
    dispatch(toggleBusinessStatus({ businessId, isActive: !currentStatus }));
  };

  const getRoleBadge = (role: string) => {
    const variants: Record<
      string,
      "default" | "secondary" | "destructive" | "outline"
    > = {
      admin: "destructive",
      business_owner: "secondary",
      customer: "default",
    };
    return <Badge variant={variants[role] || "outline"}>{role}</Badge>;
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        <CheckCircle className="h-3 w-3 mr-1" />
        Active
      </Badge>
    ) : (
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Inactive
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage users, businesses, and system settings
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {users.filter((u) => u.role === "customer").length} customers,{" "}
                {users.filter((u) => u.role === "business_owner").length}{" "}
                business owners
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Businesses
              </CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allBusinesses.length}</div>
              <p className="text-xs text-muted-foreground">
                {allBusinesses.filter((b) => b.isActive).length} active,{" "}
                {allBusinesses.filter((b) => !b.isActive).length} inactive
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                System Status
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Healthy</div>
              <p className="text-xs text-muted-foreground">
                All systems operational
              </p>
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Users Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage user accounts and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
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
                  {users.map((user) => (
                    <TableRow key={user.$id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Select
                            value={user.role}
                            onValueChange={(value) =>
                              handleUpdateUserRole(user.$id, value)
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">Customer</SelectItem>
                              <SelectItem value="business_owner">
                                Business Owner
                              </SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.$id)}
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
          </CardContent>
        </Card>

        {/* Business Management */}
        <Card>
          <CardHeader>
            <CardTitle>Business Management</CardTitle>
            <CardDescription>
              Manage business accounts and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Business Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allBusinesses.map((business) => {
                    const owner = users.find((u) => u.$id === business.ownerId);
                    return (
                      <TableRow key={business.$id}>
                        <TableCell className="font-medium">
                          {business.name}
                        </TableCell>
                        <TableCell>{owner?.name || "Unassigned"}</TableCell>
                        <TableCell>
                          {business.city}, {business.state}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(business.isActive)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleToggleBusinessStatus(
                                  business.$id,
                                  business.isActive
                                )
                              }
                            >
                              {business.isActive ? "Deactivate" : "Activate"}
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedBusiness(business)}
                                >
                                  <UserPlus className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Assign Business Owner
                                  </DialogTitle>
                                  <DialogDescription>
                                    Assign a new owner to {business.name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="ownerEmail">
                                      Owner Email
                                    </Label>
                                    <Input
                                      id="ownerEmail"
                                      type="email"
                                      placeholder="Enter owner email"
                                      value={ownerEmail}
                                      onChange={(e) =>
                                        setOwnerEmail(e.target.value)
                                      }
                                    />
                                  </div>
                                  <Button
                                    onClick={handleAssignOwner}
                                    disabled={
                                      isAssigningOwner || !ownerEmail.trim()
                                    }
                                    className="w-full"
                                  >
                                    {isAssigningOwner ? (
                                      <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Assigning...
                                      </>
                                    ) : (
                                      "Assign Owner"
                                    )}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteBusiness(business.$id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
