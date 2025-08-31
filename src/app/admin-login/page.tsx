"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  EyeOff,
  Loader2,
  Shield,
  ArrowRight,
  Lock,
  Mail,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Building } from "lucide-react";
import { useAdminLoginMutation } from "@/lib/stores/features/admin/admin.api";
import { useDispatch } from "react-redux";
import {
  setAdminUser,
  setAdminToken,
  clearAdminError,
  setAdminError,
} from "@/lib/stores/features/admin/adminAuthSlice";
import { setCookie } from "@/lib/utils/cookies";
import { adminStorage } from "@/lib/utils/storage";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  // RTK Query hooks
  const [adminLogin, { isLoading, error: loginError }] =
    useAdminLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearAdminError());

    try {
      const result = await adminLogin({ email, password }).unwrap();

      // Check if user is admin (any admin role is valid)
      if (
        !["SUPER_ADMIN", "ADMIN", "MODERATOR", "SUPPORT"].includes(
          result.user.role
        )
      ) {
        throw new Error("Access denied. Admin privileges required.");
      }

      // Store in Redux store
      dispatch(setAdminUser(result.user));
      dispatch(setAdminToken(result.token));

      // Also set cookie for server-side access
      setCookie("adminToken", result.token);

      // Save admin data to localStorage for persistence
      adminStorage.saveAdmin({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        department: result.user.department,
        employeeId: result.user.employeeId,
        permissions: result.user.permissions || [],
        lastLogin: new Date().toISOString(),
      });

      // Redirect to admin dashboard
      router.push("/admin");
    } catch (error: unknown) {
      if (error instanceof Error) {
        const errorMessage =
          (error as unknown as { data: { error: string } })?.data?.error ||
          error?.message ||
          "Login failed";
        dispatch(setAdminError(errorMessage));
        console.error("Admin login error:", errorMessage);
      } else {
        dispatch(setAdminError("Login failed"));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Logo icon={Building} showSubtitle={false} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Admin Access</h1>
            <p className="text-muted-foreground">
              Sign in to access the administrative panel
            </p>
          </div>
        </div>

        {/* Admin Login Form */}
        <Card className="border-2 border-destructive/20">
          <CardHeader className="space-y-2">
            <CardTitle className="text-xl text-center flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-destructive" />
              <span>Admin Login</span>
            </CardTitle>
            <CardDescription className="text-center">
              Enter your admin credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {loginError && (
                <Alert className="border-destructive">
                  <AlertDescription>
                    {"data" in loginError
                      ? (loginError.data as unknown as { error: string })
                          ?.error || "Login failed"
                      : "Login failed"}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Admin Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter admin email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 border-2 focus:border-destructive"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Admin Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter admin password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-11 border-2 focus:border-destructive"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-destructive hover:bg-destructive/90"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Access Admin Panel
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-4">
          <Separator />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <Link
                href="/"
                className="font-medium text-primary hover:underline flex items-center justify-center space-x-1"
              >
                <ArrowRight className="h-3 w-3" />
                <span>Back to main site</span>
              </Link>
            </p>
            <p className="text-xs text-muted-foreground">
              This area is restricted to authorized administrators only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
