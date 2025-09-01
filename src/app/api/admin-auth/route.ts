import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "@/lib/config";
import { AdminUser } from "@/types/admin";

const ADMIN_JWT_SECRET = config.adminJwt.secret;

export async function POST(request: NextRequest) {
  try {
    const { action, email, password, ...otherData } = await request.json();

    switch (action) {
      case "login":
        return await handleAdminLogin(email, password);
      case "logout":
        return await handleAdminLogout();
      case "refresh":
        return await handleAdminTokenRefresh(request);
      case "profile":
        return await handleAdminProfileUpdate(request, otherData);
      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Admin authentication error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Admin authentication failed",
      },
      { status: 500 }
    );
  }
}

async function handleAdminLogin(email: string, password: string) {
  try {
    console.log(`🔐 Admin login attempt for: ${email}`);

    // Find admin user by email
    const adminUser = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!adminUser) {
      console.log(`❌ Admin user not found: ${email}`);
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if admin account is active
    if (!adminUser.isActive) {
      console.log(`❌ Admin account inactive: ${email}`);
      return NextResponse.json(
        { success: false, error: "Account is deactivated" },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (adminUser.lockedUntil && adminUser.lockedUntil > new Date()) {
      console.log(`❌ Admin account locked: ${email}`);
      return NextResponse.json(
        { success: false, error: "Account is temporarily locked" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, adminUser.password);

    if (!isPasswordValid) {
      console.log(`❌ Invalid password for admin: ${email}`);

      // Increment login attempts
      await prisma.adminUser.update({
        where: { id: adminUser.id },
        data: {
          loginAttempts: adminUser.loginAttempts + 1,
          lockedUntil:
            adminUser.loginAttempts + 1 >= 5
              ? new Date(Date.now() + 15 * 60 * 1000)
              : null, // Lock for 15 minutes after 5 attempts
        },
      });

      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login
    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: {
        loginAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    // Generate admin JWT token
    const token = jwt.sign(
      {
        adminId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        permissions: JSON.parse(adminUser.permissions || "[]"),
      },
      ADMIN_JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Remove sensitive data from response
    const {
      password: _,
      twoFactorSecret: __,
      ...adminWithoutSensitive
    } = adminUser;

    console.log(`✅ Admin login successful: ${email} (${adminUser.role})`);

    return NextResponse.json({
      success: true,
      user: adminWithoutSensitive,
      token,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "Admin login failed" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "No admin token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as {
        adminId: string;
      };

      // Get current admin user data
      const adminUser = await prisma.adminUser.findUnique({
        where: { id: decoded.adminId },
      });

      if (!adminUser || !adminUser.isActive) {
        return NextResponse.json(
          { success: false, error: "Admin user not found or inactive" },
          { status: 404 }
        );
      }

      // Remove sensitive data from response
      const {
        password: _,
        twoFactorSecret: __,
        ...adminWithoutSensitive
      } = adminUser;

      return NextResponse.json({
        success: true,
        user: adminWithoutSensitive,
      });
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, error: "Invalid admin token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Get current admin user error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to get admin user",
      },
      { status: 500 }
    );
  }
}

// Admin logout handler
async function handleAdminLogout() {
  try {
    // For now, just return success since JWT tokens are stateless
    // In a real app, you might want to implement a token blacklist
    console.log("✅ Admin logout successful");
    return NextResponse.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}

// Admin token refresh handler
async function handleAdminTokenRefresh(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "No admin token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as {
        adminId: string;
      };

      // Get current admin user data
      const adminUser = await prisma.adminUser.findUnique({
        where: { id: decoded.adminId },
      });

      if (!adminUser || !adminUser.isActive) {
        return NextResponse.json(
          { success: false, error: "Admin user not found or inactive" },
          { status: 404 }
        );
      }

      // Generate new admin JWT token
      const newToken = jwt.sign(
        {
          adminId: adminUser.id,
          email: adminUser.email,
          role: adminUser.role,
          permissions: JSON.parse(adminUser.permissions || "[]"),
        },
        ADMIN_JWT_SECRET,
        { expiresIn: "24h" }
      );

      console.log(`✅ Admin token refreshed for: ${adminUser.email}`);

      return NextResponse.json({
        success: true,
        adminToken: newToken,
      });
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, error: "Invalid admin token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Admin token refresh error:", error);
    return NextResponse.json(
      { success: false, error: "Token refresh failed" },
      { status: 500 }
    );
  }
}

// Admin profile update handler
async function handleAdminProfileUpdate(request: NextRequest, updates: Partial<AdminUser>) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "No admin token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, ADMIN_JWT_SECRET) as {
        adminId: string;
      };

      // Get current admin user data
      const adminUser = await prisma.adminUser.findUnique({
        where: { id: decoded.adminId },
      });

      if (!adminUser || !adminUser.isActive) {
        return NextResponse.json(
          { success: false, error: "Admin user not found or inactive" },
          { status: 404 }
        );
      }

      // Update admin profile (only allow safe fields)
      const safeUpdates: Partial<AdminUser> = {};
      const allowedFields = ["name", "department", "employeeId"];

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          safeUpdates[field] = updates[field];
        }
      }

      if (Object.keys(safeUpdates).length === 0) {
        return NextResponse.json(
          { success: false, error: "No valid fields to update" },
          { status: 400 }
        );
      }

      const updatedAdmin = await prisma.adminUser.update({
        where: { id: decoded.adminId },
        data: safeUpdates,
      });

      // Remove sensitive data from response
      const {
        password: _,
        twoFactorSecret: __,
        ...adminWithoutSensitive
      } = updatedAdmin;

      console.log(`✅ Admin profile updated for: ${updatedAdmin.email}`);

      return NextResponse.json({
        success: true,
        adminUser: adminWithoutSensitive,
      });
    } catch (jwtError) {
      return NextResponse.json(
        { success: false, error: "Invalid admin token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Admin profile update error:", error);
    return NextResponse.json(
      { success: false, error: "Profile update failed" },
      { status: 500 }
    );
  }
}
