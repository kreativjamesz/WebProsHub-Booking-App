import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { verifyAdminToken } from "@/lib/utils/route-guards";

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if admin has permission to view system settings
    if (admin.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // For now, return default settings
    // In a real app, you'd store these in a database table
    const settings = {
      general: {
        siteName: "My Booking App",
        siteDescription: "Professional booking management system",
        contactEmail: "admin@mybookingapp.com",
        supportPhone: "+1 (555) 123-4567",
        timezone: "UTC-5",
        dateFormat: "MM/DD/YYYY",
        timeFormat: "12-hour",
      },
      security: {
        twoFactorAuth: true,
        sessionTimeout: 30,
        maxLoginAttempts: 5,
        passwordExpiry: 90,
        ipWhitelist: "",
        auditLogging: true,
      },
      notifications: {
        emailNotifications: true,
        smsNotifications: false,
        pushNotifications: true,
        bookingConfirmations: true,
        bookingReminders: true,
        systemAlerts: true,
        marketingEmails: false,
      },
      system: {
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: true,
        maxFileSize: 10,
        supportedFormats: ["jpg", "jpeg", "png", "pdf"],
        backupFrequency: "daily",
        logRetention: 90,
      }
    };

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error fetching system settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch system settings" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if admin has permission to update system settings
    if (admin.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    
    // In a real app, you'd save these to a database
    // For now, just return success
    console.log("System settings updated:", body);

    return NextResponse.json({ 
      message: "System settings updated successfully",
      settings: body 
    });
  } catch (error) {
    console.error("Error updating system settings:", error);
    return NextResponse.json(
      { error: "Failed to update system settings" },
      { status: 500 }
    );
  }
}
