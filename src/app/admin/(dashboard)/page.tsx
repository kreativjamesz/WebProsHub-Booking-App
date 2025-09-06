"use client";

import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import {
  useGetUsersQuery,
  useGetBusinessesQuery,
  useGetSystemStatsQuery,
} from "@/stores/slices/private/admin.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Building,
  Settings,
  Shield,
  Star,
  Calendar,
  Activity,
  ArrowRight,
  UserCheck,
  Building2,
  BarChart3,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { useAdminHeader } from "@/lib/hooks";

import { type Business } from "@/types/business";
import { type User } from "@/types/user";

export default function AdminDashboard() {
  const router = useRouter();
  const { adminUser } = useAppSelector((state) => state.adminAuth);

  useAdminHeader("Admin Dashboard", [{ label: "Dashboard" }]);

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
  } = useGetUsersQuery({ page: 1, search: "", role: "all", status: "all" });

  const {
    data: businessesData,
    isLoading: isLoadingBusinesses,
    error: businessesError,
  } = useGetBusinessesQuery({
    page: 1,
    search: "",
    status: "all",
    category: "all",
    city: "all",
  });

  const {
    data: systemStats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useGetSystemStatsQuery(undefined);

  const error = usersError || businessesError || statsError;

  // Extract data from API responses
  const users = usersData?.users || [];
  const allBusinesses = businessesData?.businesses || [];

  // Calculate statistics
  const totalUsers = users.length;
  const totalBusinesses = allBusinesses.length;
  const activeBusinesses = allBusinesses.filter(
    (business: Business) => business.isActive
  ).length;
  const customers = users.filter(
    (user: User) => user.role === "CUSTOMER"
  ).length;
  const businessOwners = users.filter(
    (user: User) => user.role === "BUSINESS_OWNER"
  ).length;

  if (isLoadingUsers || isLoadingBusinesses || isLoadingStats) {
    return <div className="min-h-screen bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    </div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert className="border-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Error loading dashboard data:{" "}
              {(error as { data?: { error?: string } })?.data?.error ||
                "Unknown error"}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push("/admin/users")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">User Management</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage user accounts and roles
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push("/admin/businesses")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Building className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Business Management</h3>
                      <p className="text-sm text-muted-foreground">
                        Manage business listings and approvals
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push("/admin/system")}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Settings className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">System Settings</h3>
                      <p className="text-sm text-muted-foreground">
                        Configure system preferences
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Users"
              value={totalUsers}
              icon={<Users className="h-5 w-5" />}
            />

            <StatCard
              title="Total Businesses"
              value={totalBusinesses}
              icon={<Building className="h-5 w-5" />}
            />

            <StatCard
              title="Active Businesses"
              value={activeBusinesses}
              icon={<Building2 className="h-5 w-5" />}
            />

            <StatCard
              title="Business Owners"
              value={businessOwners}
              icon={<UserCheck className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard
            title="User Distribution"
            description="Breakdown of user types"
            icon={<BarChart3 className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Customers</span>
                </div>
                <span className="text-sm font-medium">{customers}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Business Owners</span>
                </div>
                <span className="text-sm font-medium">{businessOwners}</span>
              </div>
            </div>
          </ChartCard>

          <ChartCard
            title="Business Status"
            description="Active vs inactive businesses"
            icon={<Activity className="h-5 w-5" />}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active</span>
                <span className="text-sm font-medium">{activeBusinesses}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      totalBusinesses > 0
                        ? (activeBusinesses / totalBusinesses) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Active Rate</span>
                <span className="text-sm font-medium">
                  {totalBusinesses > 0
                    ? Math.round((activeBusinesses / totalBusinesses) * 100)
                    : 0}
                  %
                </span>
              </div>
            </div>
          </ChartCard>

          <ChartCard
            title="Top Performing Businesses"
            description="Businesses with highest activity"
            icon={<Star className="h-5 w-5" />}
          >
            <div className="space-y-3">
              {allBusinesses && allBusinesses.length > 0 ? (
                allBusinesses
                  .slice(0, 5)
                  .map((business: Business, index: number) => (
                    <div
                      key={`${index}-${business.id}`}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-muted-foreground">
                          {index + 1}.
                        </span>
                        <span className="text-sm font-medium truncate max-w-24">
                          {business.name}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{business.city}</p>
                        <p className="text-xs text-muted-foreground">
                          {business.isActive ? "Active" : "Pending"}
                        </p>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center text-sm text-muted-foreground">
                  No businesses found
                </div>
              )}
            </div>
          </ChartCard>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Latest System Updates</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allBusinesses && allBusinesses.length > 0 ? (
                  allBusinesses
                    .slice(0, 5)
                    .map((business: Business, index: number) => (
                      <div
                        key={`${index}-${business.id}`}
                        className="flex items-start space-x-3"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            business.isActive ? "bg-green-500" : "bg-yellow-500"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {business.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {business.city} •{" "}
                            {business.isActive ? "Active" : "Pending"}
                          </p>
                        </div>
                      </div>
                    ))
                ) : (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    No recent activity
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
