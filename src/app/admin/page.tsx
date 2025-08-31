"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { clearAdminUser } from "@/lib/stores/features/admin/auth/adminAuthSlice";
import { removeCookie } from "@/lib/utils/cookies";
import { adminStorage } from "@/lib/utils/storage";
import { useFetchingUsersQuery } from "@/lib/stores/features/admin/adminApi";
import { fetchUsers } from "@/lib/stores/features/admin/users/adminUsersSlice";
import { fetchBusinesses } from "@/lib/stores/features/admin/businesses/adminBusinessesSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  Building,
  Settings,
  Shield,
  MapPin,
  Star,
  LogOut,
  TrendingUp,
  Calendar,
  Activity,
  ArrowRight,
  UserCheck,
  Building2,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { ChartCard } from "@/components/admin/ChartCard";
import { useAdminLogoutMutation } from "@/lib/stores/features/admin/auth/adminAuthApi";

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { adminUser } = useAppSelector((state) => state.adminAuth);
  const {
    users,
    isLoadingUsers,
    error: usersError,
  } = useAppSelector((state) => state.adminUsers);
  const {
    businesses: allBusinesses,
    isLoadingBusinesses,
    error: businessesError,
  } = useAppSelector((state) => state.adminBusinesses);

  const error = usersError || businessesError;

  // RTK Query hook for logout
  const [adminLogout] = useAdminLogoutMutation();

  // RTK Query hook for fetching users (to compare with manual fetch)
  const {
    data: rtkUsers,
    isLoading: isLoadingRtkUsers,
    error: rtkUsersError,
    refetch: refetchRtkUsers,
  } = useFetchingUsersQuery(
    { page: 1, search: "", role: "all", status: "all" },
    { skip: true } // Don't fetch automatically, only when button is clicked
  );

  useEffect(() => {
    // Fetch initial data for dashboard
    dispatch(fetchUsers({ page: 1 }));
    dispatch(fetchBusinesses({ page: 1 }));
  }, [dispatch]);

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

  // Calculate statistics
  const totalUsers = users?.length || 0;
  const totalBusinesses = allBusinesses?.length || 0;
  const activeBusinesses = allBusinesses?.filter((b) => b.isActive).length || 0;
  const customers = users?.filter((u) => u.role === "CUSTOMER").length || 0;
  const businessOwners =
    users?.filter((u) => u.role === "BUSINESS_OWNER").length || 0;

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Alert className="border-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Error loading dashboard data: {error}
            </AlertDescription>
          </Alert>
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Welcome back, {adminUser?.name}. Here&apos;s your system
                  overview.
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

        {/* API Test Buttons - Compare Manual Fetch vs RTK Query */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            API Test - Manual Fetch vs RTK Query
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <span>Manual Fetch (Slice)</span>
                </CardTitle>
                <CardDescription>
                  Uses fetchUsers from adminUsersSlice with async thunk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => dispatch(fetchUsers({ page: 1 }))}
                  disabled={isLoadingUsers}
                  className="w-full"
                >
                  {isLoadingUsers ? "Loading..." : "Test Manual Fetch Users"}
                </Button>
                <div className="text-sm">
                  <p>
                    <strong>Status:</strong>{" "}
                    {isLoadingUsers ? "Loading..." : "Ready"}
                  </p>
                  <p>
                    <strong>Users Count:</strong> {users?.length || 0}
                  </p>
                  <p>
                    <strong>Error:</strong> {usersError || "None"}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  <span>RTK Query</span>
                </CardTitle>
                <CardDescription>
                  Uses useFetchingUsersQuery from adminApi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => refetchRtkUsers()}
                  disabled={isLoadingRtkUsers}
                  className="w-full"
                  variant="outline"
                >
                  {isLoadingRtkUsers ? "Loading..." : "Test RTK Query Users"}
                </Button>
                <div className="text-sm">
                  <p>
                    <strong>Status:</strong>{" "}
                    {isLoadingRtkUsers ? "Loading..." : "Ready"}
                  </p>
                  <p>
                    <strong>Users Count:</strong> {rtkUsers?.length || 0}
                  </p>
                  <p>
                    <strong>Error:</strong>{" "}
                    {rtkUsersError ? "Error occurred" : "None"}
                  </p>
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
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              description="Registered users"
              trend={{ value: 12, isPositive: true }}
            />

            <StatCard
              title="Total Businesses"
              value={totalBusinesses}
              icon={<Building className="h-5 w-5" />}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              description="Registered businesses"
              trend={{ value: 8, isPositive: true }}
            />

            <StatCard
              title="Active Businesses"
              value={activeBusinesses}
              icon={<Building2 className="h-5 w-5" />}
              iconBgColor="bg-emerald-100"
              iconColor="text-emerald-600"
              description="Currently active"
              trend={{
                value:
                  totalBusinesses > 0
                    ? Math.round((activeBusinesses / totalBusinesses) * 100)
                    : 0,
                isPositive: true,
              }}
            />

            <StatCard
              title="Business Owners"
              value={businessOwners}
              icon={<UserCheck className="h-5 w-5" />}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
              description="Business accounts"
              trend={{ value: 15, isPositive: true }}
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
                allBusinesses.slice(0, 5).map((business, index) => (
                  <div
                    key={business.id}
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
                  allBusinesses.slice(0, 5).map((business, index) => (
                    <div
                      key={business.id}
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
