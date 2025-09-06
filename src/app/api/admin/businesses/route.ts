import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";
import { verifyAdminToken } from "@/lib/utils/route-guards";

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if admin has permission to view businesses
    if (admin.role !== "SUPER_ADMIN" && admin.role !== "MODERATOR") {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const category = searchParams.get("category") || "all";
    const city = searchParams.get("city") || "all";
    const limit = 12;
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
    
    // Check if it's an authentication-related error
    if (error instanceof Error && error.message.includes('Admin authentication failed')) {
      return NextResponse.json(
        { error: "Admin authentication failed" },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 }
    );
  }
}
