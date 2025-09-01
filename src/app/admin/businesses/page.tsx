"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { clearAdminUser } from "@/stores/slices/private/auth/adminAuth.slice";
import { removeCookie } from "@/lib/utils/cookies";
import { adminStorage } from "@/lib/utils/storage";
import { useAdminLogoutMutation } from "@/stores/slices/private/auth/adminAuth.api";
import {
  useGetBusinessesQuery,
  useDeleteBusinessMutation,
  useAssignBusinessOwnerMutation,
  useUpdateBusinessStatusMutation,
} from "@/stores/slices/private/admin.api";
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
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Building,
  MapPin,
  Users,
  Settings,
  Trash2,
  Eye,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Filter,
  LogOut,
  Phone,
  Mail,
  Globe,
} from "lucide-react";
import { Business } from "@/types";
import { toast } from "sonner";
import { SearchInput } from "@/components/admin/SearchInput";
import { Pagination } from "@/components/admin/Pagination";

export default function AdminBusinessesPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { adminUser } = useAppSelector((state) => state.adminAuth);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const [isAssigningOwner, setIsAssigningOwner] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState("");

  // RTK Query hooks
  const [adminLogout] = useAdminLogoutMutation();
  const [deleteBusiness] = useDeleteBusinessMutation();
  const [assignBusinessOwner] = useAssignBusinessOwnerMutation();
  const [updateBusinessStatus] = useUpdateBusinessStatusMutation();

  const {
    data: businessesData,
    isLoading: isLoadingBusinesses,
    error: businessesError,
    refetch: refetchBusinesses,
  } = useGetBusinessesQuery({
    page: currentPage,
    search: searchTerm,
    status: statusFilter,
    category: categoryFilter,
    city: cityFilter,
  });

  // Extract data from API response
  const businesses = businessesData?.businesses || [];
  const pagination = businessesData?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalBusinesses: 0,
    businessesPerPage: 20,
  };

  const handleDeleteBusiness = async (businessId: string) => {
    if (confirm("Are you sure you want to delete this business?")) {
      try {
        await deleteBusiness(businessId).unwrap();
        toast.success("Business deleted successfully");
        refetchBusinesses();
      } catch (error: unknown) {
        const errorMessage =
          (error as { data?: { error?: string } })?.data?.error ||
          "Failed to delete business";
        toast.error(errorMessage);
        console.error("Delete error:", error);
      }
    }
  };

  const handleAssignOwner = async () => {
    if (selectedBusiness && ownerEmail) {
      setIsAssigningOwner(true);
      try {
        await assignBusinessOwner({
          businessId: selectedBusiness.id,
          ownerEmail,
        }).unwrap();
        setOwnerEmail("");
        setSelectedBusiness(null);
        toast.success("Business owner assigned successfully");
        refetchBusinesses();
      } catch (error: unknown) {
        const errorMessage =
          (error as { data?: { error?: string } })?.data?.error ||
          "Failed to assign business owner";
        toast.error(errorMessage);
        console.error("Assign owner error:", error);
      } finally {
        setIsAssigningOwner(false);
      }
    }
  };

  const handleToggleBusinessStatus = async (businessId: string) => {
    try {
      await updateBusinessStatus({ businessId, isActive: true }).unwrap();
      toast.success("Business status updated successfully");
      refetchBusinesses();
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        "Failed to update business status";
      toast.error(errorMessage);
      console.error("Status update error:", error);
    }
  };

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

  // Filter businesses based on search and status
  const filteredBusinesses =
    businesses?.filter((business: Business) => {
      const matchesSearch =
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        false ||
        business.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && business.isActive) ||
        (statusFilter === "inactive" && !business.isActive);
      return matchesSearch && matchesStatus;
    }) || [];

  // Calculate statistics
  const totalBusinesses = businesses?.length || 0;
  const activeBusinesses =
    businesses?.filter((b: Business) => b.isActive).length || 0;
  const pendingBusinesses =
    businesses?.filter((b: Business) => !b.isActive).length || 0;
  const assignedBusinesses =
    businesses?.filter((b: Business) => b.ownerId).length || 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Businesses Management
                </h1>
                <p className="text-muted-foreground">
                  Manage business listings, approvals, and ownership
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
                  <Building className="h-6 w-6 text-blue-600" />
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
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
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

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Assigned Owners
                  </p>
                  <p className="text-2xl font-bold">{assignedBusinesses}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="search" className="text-sm font-medium">
                  Search Businesses
                </Label>
                <div className="mt-1">
                  <SearchInput
                    placeholder="Search by name, description, or city..."
                    value={searchTerm}
                    onChange={setSearchTerm}
                    delay={500}
                  />
                </div>
              </div>
              <div className="sm:w-48">
                <Label htmlFor="status-filter" className="text-sm font-medium">
                  Filter by Status
                </Label>
                <select
                  id="status-filter"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Businesses Table */}
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
            {isLoadingBusinesses ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table className="businesses-table">
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
                    {filteredBusinesses.map((business: Business) => (
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
                              onClick={() => handleDeleteBusiness(business.id)}
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

                {/* Pagination */}
                <div className="mt-6">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalBusinesses}
                    itemsPerPage={pagination.businessesPerPage}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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

              <div className="space-y-2">
                <Label>Website</Label>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Globe className="h-3 w-3" />
                  <span>{selectedBusiness.website || "No website"}</span>
                </div>
              </div>

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
