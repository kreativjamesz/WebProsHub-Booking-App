import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import jwt from "jsonwebtoken";

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || "admin-secret-key-change-in-production";

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
      decoded = jwt.verify(token, ADMIN_JWT_SECRET) as { adminId: string; role: string };
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
        { success: false, error: "Admin user not found or inactive" },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category") || "all";
    const city = searchParams.get("city") || "all";
    const limit = 20;
    const offset = (page - 1) * limit;

    // Build where clause
    const where: {
      OR?: Array<{ name?: { contains: string; mode: "insensitive" }; description?: { contains: string; mode: "insensitive" }; city?: { contains: string; mode: "insensitive" } }>;
      isActive?: boolean;
      categoryId?: string;
      city?: string;
    } = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }
    
    if (status !== "all") {
      where.isActive = status === "active";
    }
    
    if (category !== "all") {
      where.categoryId = category;
    }
    
    if (city !== "all") {
      where.city = city;
    }

    // Get businesses with pagination and include category and owner info
    const [businesses, totalBusinesses] = await Promise.all([
      prisma.business.findMany({
        where,
        select: {
          id: true,
          name: true,
          description: true,
          address: true,
          city: true,
          state: true,
          zipCode: true,
          phone: true,
          email: true,
          website: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          categoryId: true,
          ownerId: true,
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: offset,
        take: limit,
      }),
      prisma.business.count({ where }),
    ]);

    const totalPages = Math.ceil(totalBusinesses / limit);

    return NextResponse.json({
      success: true,
      businesses,
      pagination: {
        currentPage: page,
        totalPages,
        totalBusinesses,
        businessesPerPage: limit,
      },
    });

  } catch (error) {
    console.error("Admin businesses fetch error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch businesses" },
      { status: 500 }
    );
  }
}
