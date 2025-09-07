"use client";

import { useState } from "react";
import {} from "@/lib/hooks";

import {
  useGetBusinessesQuery,
  useDeleteBusinessMutation,
  useAssignBusinessOwnerMutation,
  useUpdateBusinessStatusMutation,
} from "@/stores/slices/private/admin.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building, Users, Loader2, AlertTriangle, CheckCircle, Filter, Phone, Mail, Globe } from "lucide-react";
import { Business } from "@/types";
import { toast } from "sonner";
import { useAdminHeader } from "@/lib/hooks";
// StatCard kept for type reference in AdminCardGrid usage; remove if unused
import { AdminPageContainer } from "@/components/admin/AdminPageContainer";
import { AdminCardGrid } from "@/components/admin/AdminCardGrid";
import { AdminFilterCard } from "@/components/admin/AdminFilterCard";
import { BusinessesTable } from "@/components/admin/BusinessesTable";

export default function AdminBusinessesPage() {
  useAdminHeader("Businesses Management", [
    { label: "Dashboard", href: "/admin" },
    { label: "Businesses" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter] = useState("all");
  const [cityFilter] = useState("all");
  const [isAssigningOwner, setIsAssigningOwner] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState("");

  // RTK Query hooks
  const [deleteBusiness] = useDeleteBusinessMutation();
  const [assignBusinessOwner] = useAssignBusinessOwnerMutation();
  const [updateBusinessStatus] = useUpdateBusinessStatusMutation();

  const {
    data: businessesData,
    isLoading: isLoadingBusinesses,
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
    businessesPerPage: 12,
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
    <AdminPageContainer className="space-y-6">
      {/* Statistics Cards */}
      <AdminCardGrid
        cols={{ base: 1, md: 4, lg: 4 }}
        gapClassName="gap-4"
        items={[
          {
            type: "stat",
            title: "Total Businesses",
            value: totalBusinesses,
            icon: <Building className="h-4 w-4 text-muted-foreground" />,
          },
          {
            type: "stat",
            title: "Active Businesses",
            value: activeBusinesses,
            icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
          },
          {
            type: "stat",
            title: "Pending Approval",
            value: pendingBusinesses,
            icon: <AlertTriangle className="h-4 w-4 text-muted-foreground" />,
          },
          {
            type: "stat",
            title: "Assigned Owners",
            value: assignedBusinesses,
            icon: <Users className="h-4 w-4 text-muted-foreground" />,
          },
        ]}
      />

      {/* Filters and Search */}
      <AdminFilterCard
        className="businesses-filters-search mb-6"
        icon={<Filter className="h-5 w-5" />}
        title="Filters & Search"
        search={{
          placeholder: "Search by name, description, or city...",
          value: searchTerm,
          onChange: setSearchTerm,
          delay: 500,
        }}
        selects={[
          {
            id: "status",
            value: statusFilter,
            onValueChange: setStatusFilter,
            options: [
              { label: "All Status", value: "all" },
              { label: "Active", value: "active" },
              { label: "Inactive", value: "inactive" },
            ],
            triggerClassName: "w-full sm:w-48",
          },
        ]}
      />

      {/* Businesses Table */}
      <BusinessesTable
        containerClassName="businesses-table-container"
        title="Businesses"
        titleIcon={<Building className="h-5 w-5" />}
        description="Manage business listings, approvals, and ownership"
        businesses={filteredBusinesses}
        isLoading={isLoadingBusinesses}
        onView={(b) => setSelectedBusiness(b)}
        onToggleStatus={(id) => handleToggleBusinessStatus(id)}
        onDelete={(id) => handleDeleteBusiness(id)}
        pagination={{
          currentPage: pagination.currentPage,
          totalPages: pagination.totalPages,
          totalItems: pagination.totalBusinesses,
          itemsPerPage: pagination.businessesPerPage,
        }}
        onPageChange={setCurrentPage}
      />

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
    </AdminPageContainer>
  );
}
