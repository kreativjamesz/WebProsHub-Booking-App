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

    // Only SUPER_ADMIN can access admin management
    if (adminUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "all";
    const status = searchParams.get("status") || "all";
    const limit = 20;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: {
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        email?: { contains: string; mode: "insensitive" };
        employeeId?: { contains: string; mode: "insensitive" };
      }>;
      role?: "SUPER_ADMIN" | "MODERATOR" | "SUPPORT";
      isActive?: boolean;
    } = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { employeeId: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role !== "all") {
      where.role = role as "SUPER_ADMIN" | "MODERATOR" | "SUPPORT";
    }

    if (status !== "all") {
      where.isActive = status === "active";
    }

    // Get admin users with pagination
    const [admins, totalAdmins] = await Promise.all([
      prisma.adminUser.findMany({
        where,
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
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.adminUser.count({ where }),
    ]);

    const totalPages = Math.ceil(totalAdmins / limit);

    return NextResponse.json({
      success: true,
      admins,
      pagination: {
        currentPage: page,
        totalPages,
        totalAdmins,
        adminsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Admin users fetch error:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin users" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Only SUPER_ADMIN can create admin users
    if (adminUser.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { success: false, error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { name, email, password, role, department, employeeId, permissions, isActive } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: "Email already exists" },
        { status: 400 }
      );
    }

    // Hash password (you should use bcrypt or similar)
    // For now, we'll store it as plain text (NOT RECOMMENDED FOR PRODUCTION)
    const hashedPassword = password; // TODO: Implement proper password hashing

    // Create new admin user
    const newAdmin = await prisma.adminUser.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        department,
        employeeId,
        permissions: JSON.stringify(permissions || []),
        isActive: isActive !== undefined ? isActive : true,
        createdBy: decoded.adminId,
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
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      success: true,
      admin: newAdmin,
      message: "Admin user created successfully"
    });
  } catch (error) {
    console.error("Admin user creation error:", error);
    
    return NextResponse.json(
      { success: false, error: "Failed to create admin user" },
      { status: 500 }
    );
  }
}
