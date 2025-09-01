import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import jwt from "jsonwebtoken";
import { config } from "@/lib/config";

const ADMIN_JWT_SECRET = config.adminJwt.secret;

export async function GET(
  request: NextRequest,
  { params }: { params: { adminId: string } }
) {
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

    let decoded: { adminId: string; role: string };
    try {
      decoded = jwt.verify(token, ADMIN_JWT_SECRET) as {
        adminId: string;
        role: string;
      };
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Verify that the admin user exists and is active
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: decoded.adminId },
      select: { id: true, role: true, isActive: true }
    });

    if (!adminUser || !adminUser.isActive) {
      return NextResponse.json(
        { success: false, error: "Admin authentication failed" },
        { status: 401 }
      );
    }

    // Get admin user by ID
    const targetAdmin = await prisma.adminUser.findUnique({
      where: { id: params.adminId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        employeeId: true,
        permissions: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!targetAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: targetAdmin
    });
  } catch (error) {
    console.error("Get admin user error:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { adminId: string } }
) {
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

    let decoded: { adminId: string; role: string };
    try {
      decoded = jwt.verify(token, ADMIN_JWT_SECRET) as {
        adminId: string;
        role: string;
      };
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Verify that the admin user exists and is active
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: decoded.adminId },
      select: { id: true, role: true, isActive: true }
    });

    if (!adminUser || !adminUser.isActive) {
      return NextResponse.json(
        { success: false, error: "Admin authentication failed" },
        { status: 401 }
      );
    }

    // Only SUPER_ADMIN can update admin users
    if (adminUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, role, department, employeeId, permissions, isActive } = body;

    // Check if admin user exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { id: params.adminId }
    });

    if (!existingAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it already exists
    if (email && email !== existingAdmin.email) {
      const emailExists = await prisma.adminUser.findUnique({
        where: { email }
      });

      if (emailExists) {
        return NextResponse.json(
          { success: false, error: "Email already exists" },
          { status: 400 }
        );
      }
    }

    // Update admin user
    const updatedAdmin = await prisma.adminUser.update({
      where: { id: params.adminId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        ...(department !== undefined && { department }),
        ...(employeeId !== undefined && { employeeId }),
        ...(permissions && { permissions: JSON.stringify(permissions) }),
        ...(isActive !== undefined && { isActive }),
        updatedBy: decoded.adminId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        department: true,
        employeeId: true,
        permissions: true,
        isActive: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      admin: updatedAdmin,
      message: "Admin user updated successfully"
    });
  } catch (error) {
    console.error("Update admin user error:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to update admin user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { adminId: string } }
) {
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

    let decoded: { adminId: string; role: string };
    try {
      decoded = jwt.verify(token, ADMIN_JWT_SECRET) as {
        adminId: string;
        role: string;
      };
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    // Verify that the admin user exists and is active
    const adminUser = await prisma.adminUser.findUnique({
      where: { id: decoded.adminId },
      select: { id: true, role: true, isActive: true }
    });

    if (!adminUser || !adminUser.isActive) {
      return NextResponse.json(
        { success: false, error: "Admin authentication failed" },
        { status: 401 }
      );
    }

    // Only SUPER_ADMIN can delete admin users
    if (adminUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Prevent self-deletion
    if (params.adminId === decoded.adminId) {
      return NextResponse.json(
        { success: false, error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    // Check if admin user exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { id: params.adminId }
    });

    if (!existingAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Delete admin user
    await prisma.adminUser.delete({
      where: { id: params.adminId }
    });

    return NextResponse.json({
      success: true,
      message: "Admin user deleted successfully"
    });
  } catch (error) {
    console.error("Delete admin user error:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to delete admin user" },
      { status: 500 }
    );
  }
}
