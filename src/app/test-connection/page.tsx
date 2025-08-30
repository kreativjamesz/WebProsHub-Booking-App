"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { seedDatabase, clearDatabase, createAdminUser } from "@/lib/seed-data";
import { testDatabaseConnection } from "@/lib/test-connection";
import {
  ConnectionTestResult,
  SeedingResult,
} from "@/lib/types/test-connection";

export default function TestConnectionPage() {
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionTestResult | null>(null);
  const [seedingStatus, setSeedingStatus] = useState<SeedingResult | null>(
    null
  );
  const [adminStatus, setAdminStatus] = useState<{
    success: boolean;
    message?: string;
    error?: unknown;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTestConnection = async () => {
    setIsLoading(true);
    const result = await testDatabaseConnection();
    setConnectionStatus(result);
    setIsLoading(false);
  };

  const handleSeedDatabase = async () => {
    setIsLoading(true);
    const result = await seedDatabase();
    setSeedingStatus(result);
    setIsLoading(false);
  };

  const handleClearDatabase = async () => {
    if (
      confirm(
        "Are you sure you want to clear all data? This action cannot be undone."
      )
    ) {
      setIsLoading(true);
      const result = await clearDatabase();
      setSeedingStatus(result);
      setIsLoading(false);
    }
  };

  const handleCreateAdminUser = async () => {
    setIsLoading(true);
    const result = await createAdminUser();
    setAdminStatus(result);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">🔗 Appwrite Connection Test</h1>

      <div className="grid gap-6">
        {/* Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle>Test Appwrite Connection</CardTitle>
            <CardDescription>
              Verify that your app can connect to Appwrite and access the
              database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleTestConnection}
              disabled={isLoading}
              className="mb-4"
            >
              {isLoading ? "Testing..." : "Test Connection"}
            </Button>

            {connectionStatus && (
              <div
                className={`p-4 rounded-lg ${
                  connectionStatus.success
                    ? "bg-green-100 border border-green-300"
                    : "bg-red-100 border border-red-300"
                }`}
              >
                <h3 className="font-semibold mb-2">
                  {connectionStatus.success
                    ? "✅ Connection Successful"
                    : "❌ Connection Failed"}
                </h3>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(connectionStatus, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin User Creation */}
        <Card>
          <CardHeader>
            <CardTitle>👑 Create Admin User</CardTitle>
            <CardDescription>
              Create your first admin user account to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleCreateAdminUser}
              disabled={isLoading}
              variant="default"
              className="mb-4"
            >
              {isLoading ? "Creating..." : "Create Admin User"}
            </Button>

            {adminStatus && (
              <div
                className={`p-4 rounded-lg ${
                  adminStatus.success
                    ? "bg-green-100 border border-green-300"
                    : "bg-red-100 border border-red-300"
                }`}
              >
                <h3 className="font-semibold mb-2">
                  {adminStatus.success
                    ? "✅ Admin User Created"
                    : "❌ Failed to Create Admin"}
                </h3>
                <p className="mb-2">{adminStatus.message}</p>
                {adminStatus.success && (
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">
                      🔑 Login Credentials:
                    </h4>
                    <p className="text-sm text-blue-700">
                      <strong>Email:</strong> admin@bookmyservice.com
                      <br />
                      <strong>Password:</strong> You&apos;ll need to set this in
                      Appwrite Console
                    </p>
                    <p className="text-sm text-blue-600 mt-2">
                      💡 Go to Appwrite Console → Users → Edit Admin User → Set
                      Password
                    </p>
                  </div>
                )}
                <pre className="text-sm overflow-auto mt-2">
                  {JSON.stringify(adminStatus, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Database Seeding */}
        <Card>
          <CardHeader>
            <CardTitle>Seed Sample Data</CardTitle>
            <CardDescription>
              Generate sample categories, businesses, services, and promotions
              for testing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-4">
              <Button
                onClick={handleSeedDatabase}
                disabled={isLoading}
                variant="default"
              >
                {isLoading ? "Seeding..." : "Seed Database"}
              </Button>

              <Button
                onClick={handleClearDatabase}
                disabled={isLoading}
                variant="destructive"
              >
                {isLoading ? "Clearing..." : "Clear Database"}
              </Button>
            </div>

            {seedingStatus && (
              <div
                className={`p-4 rounded-lg ${
                  seedingStatus.success
                    ? "bg-green-100 border border-green-300"
                    : "bg-red-100 border border-red-300"
                }`}
              >
                <h3 className="font-semibold mb-2">
                  {seedingStatus.success
                    ? "✅ Operation Successful"
                    : "❌ Operation Failed"}
                </h3>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Setup Instructions</CardTitle>
            <CardDescription>
              Follow these steps to get your app running
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>
                Make sure your{" "}
                <code className="bg-gray-100 px-1 rounded">.env.local</code>{" "}
                file has the correct Appwrite credentials
              </li>
              <li>
                Click &quot;Test Connection&quot; to verify Appwrite
                connectivity
              </li>
              <li>
                If connection is successful, click &quot;Seed Database&quot; to
                create sample data
              </li>
              <li>
                Check the console for detailed logs of the seeding process
              </li>
              <li>
                Once seeded, you can navigate to your app pages to see the data
              </li>
            </ol>

            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">💡 Pro Tip:</h4>
              <p className="text-blue-700 text-sm">
                Open your browser&apos;s developer console (F12) to see detailed
                logs during the seeding process. This will help you debug any
                issues with the data creation.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
