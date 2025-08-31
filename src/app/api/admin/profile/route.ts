import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import jwt from "jsonwebtoken";
import { config } from "@/lib/config";

const ADMIN_JWT_SECRET = config.adminJwt.secret;

export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, ADMIN_JWT_SECRET) as { adminId: string; role: string };
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Get admin user data
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: decoded.adminId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        employeeId: true,
        permissions: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Admin user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: adminUser,
    });

  } catch (error) {
    console.error("Admin profile fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify admin token
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let decoded;
    
    try {
      decoded = jwt.verify(token, ADMIN_JWT_SECRET) as { adminId: string; role: string };
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const updates = await request.json();

    // Update admin user
    const updatedAdmin = await prisma.adminUser.update({
      where: { id: decoded.adminId },
      data: {
        name: updates.name,
        department: updates.department,
        employeeId: updates.employeeId,
        permissions: updates.permissions ? JSON.stringify(updates.permissions) : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        employeeId: true,
        permissions: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedAdmin,
    });

  } catch (error) {
    console.error("Admin profile update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update admin profile" },
      { status: 500 }
    );
  }
}
