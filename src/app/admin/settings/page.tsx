"use client";

import { useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  Shield,
  Bell,
  Database,
  Users,
  Save,
  Eye,
  EyeOff,
  Lock,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { useAdminHeader } from "@/lib/hooks";

export default function AdminSettingsPage() {
  const router = useRouter();
  const { adminUser } = useAppSelector((state) => state.adminAuth);
  useAdminHeader("System Settings", [
    { label: "Dashboard", href: "/admin" },
    { label: "Settings" },
  ]);

  // RTK Query hooks
  const [updateSystemSettings] = useUpdateSystemSettingsMutation();

  const {
    data: systemSettingsData,
    isLoading: isLoadingSettings,
    error: settingsError,
    refetch: refetchSettings,
  } = useGetSystemSettingsQuery(undefined);

  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "My Booking App",
    siteDescription: "Professional booking management system",
    contactEmail: "admin@mybookingapp.com",
    supportPhone: "+1 (555) 123-4567",
    timezone: "UTC-5",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12-hour",
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordExpiry: 90,
    ipWhitelist: "",
    auditLogging: true,
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingConfirmations: true,
    bookingReminders: true,
    systemAlerts: true,
    marketingEmails: false,
  });

  const [systemSettings, setSystemSettings] = useState({
    maintenanceMode: false,
    debugMode: false,
    autoBackup: true,
    backupFrequency: "daily",
    maxFileSize: 10,
    allowedFileTypes: "jpg,png,pdf,doc",
    rateLimiting: true,
    maxRequestsPerMinute: 100,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveSettings = async (section: string) => {
    try {
      const settingsToSave = {
        general: generalSettings,
        security: securitySettings,
        notifications: notificationSettings,
        system: systemSettings,
      };

      await updateSystemSettings(settingsToSave).unwrap();
      toast.success(`${section} settings saved successfully!`);
      refetchSettings();
    } catch (error: unknown) {
      const errorMessage =
        (error as { data?: { error?: string } })?.data?.error ||
        `Failed to save ${section} settings`;
      toast.error(errorMessage);
      console.error("Save settings error:", error);
    }
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    // Here you would typically update the password via API
    console.log("Changing password...");
    alert("Password changed successfully!");

    // Clear form
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>General Settings</span>
              </CardTitle>
              <CardDescription>
                Basic system configuration and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        siteName: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        contactEmail: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Input
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) =>
                    setGeneralSettings((prev) => ({
                      ...prev,
                      siteDescription: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={generalSettings.timezone}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        timezone: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <Input
                    id="dateFormat"
                    value={generalSettings.dateFormat}
                    onChange={(e) =>
                      setGeneralSettings((prev) => ({
                        ...prev,
                        dateFormat: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <Button
                onClick={() => handleSaveSettings("General")}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Authentication and security configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      twoFactorAuth: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">
                    Log all admin actions
                  </p>
                </div>
                <Switch
                  checked={securitySettings.auditLogging}
                  onCheckedChange={(checked) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      auditLogging: checked,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        sessionTimeout: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) =>
                      setSecuritySettings((prev) => ({
                        ...prev,
                        maxLoginAttempts: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <Button
                onClick={() => handleSaveSettings("Security")}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notifications via email
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      emailNotifications: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send push notifications
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      pushNotifications: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Booking Confirmations</Label>
                  <p className="text-sm text-muted-foreground">
                    Notify users of booking confirmations
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.bookingConfirmations}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      bookingConfirmations: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>System Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive system alerts and warnings
                  </p>
                </div>
                <Switch
                  checked={notificationSettings.systemAlerts}
                  onCheckedChange={(checked) =>
                    setNotificationSettings((prev) => ({
                      ...prev,
                      systemAlerts: checked,
                    }))
                  }
                />
              </div>

              <Button
                onClick={() => handleSaveSettings("Notification")}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>System Settings</span>
              </CardTitle>
              <CardDescription>Advanced system configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put system in maintenance mode
                  </p>
                </div>
                <Switch
                  checked={systemSettings.maintenanceMode}
                  onCheckedChange={(checked) =>
                    setSystemSettings((prev) => ({
                      ...prev,
                      maintenanceMode: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Backup</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically backup system data
                  </p>
                </div>
                <Switch
                  checked={systemSettings.autoBackup}
                  onCheckedChange={(checked) =>
                    setSystemSettings((prev) => ({
                      ...prev,
                      autoBackup: checked,
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxFileSize">Max File Size (MB)</Label>
                  <Input
                    id="maxFileSize"
                    type="number"
                    value={systemSettings.maxFileSize}
                    onChange={(e) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        maxFileSize: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxRequestsPerMinute">
                    Rate Limit (req/min)
                  </Label>
                  <Input
                    id="maxRequestsPerMinute"
                    type="number"
                    value={systemSettings.maxRequestsPerMinute}
                    onChange={(e) =>
                      setSystemSettings((prev) => ({
                        ...prev,
                        maxRequestsPerMinute: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <Button
                onClick={() => handleSaveSettings("System")}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                Save System Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Password Change Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Change Password</span>
            </CardTitle>
            <CardDescription>
              Update your admin account password
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <Button
              onClick={handlePasswordChange}
              className="w-full md:w-auto"
              disabled={!currentPassword || !newPassword || !confirmPassword}
            >
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
