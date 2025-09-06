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

    // Check if admin has permission to view bookings
    if (admin.role !== "SUPER_ADMIN" && admin.role !== "MODERATOR") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "all";
    const date = searchParams.get("date") || "all";
    const limit = 12;
    const skip = (page - 1) * limit;

    // Build where clause
    const where: {
      OR?: Array<{
        user?: { name?: { contains: string; mode: "insensitive" } };
        business?: { name?: { contains: string; mode: "insensitive" } };
        service?: { name?: { contains: string; mode: "insensitive" } };
      }>;
      status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
      date?: { gte?: Date; lte?: Date };
    } = {};

    // Search filter
    if (search) {
      where.OR = [
        { user: { name: { contains: search, mode: "insensitive" } } },
        { business: { name: { contains: search, mode: "insensitive" } } },
        { service: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    // Status filter
    if (status !== "all") {
      where.status = status as "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    }

    // Date filter
    if (date !== "all") {
      const now = new Date();
      switch (date) {
        case "today":
          where.date = {
            gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
            lte: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1),
          };
          break;
        case "week":
          const weekStart = new Date(now);
          weekStart.setDate(now.getDate() - now.getDay());
          where.date = { gte: weekStart };
          break;
        case "month":
          where.date = {
            gte: new Date(now.getFullYear(), now.getMonth(), 1),
          };
          break;
      }
    }

    // Get bookings with relations
    const [bookings, totalBookings] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
          business: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          service: {
            select: {
              id: true,
              name: true,
              price: true,
              duration: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.booking.count({ where }),
    ]);

    const totalPages = Math.ceil(totalBookings / limit);

    return NextResponse.json({
      bookings,
      pagination: {
        currentPage: page,
        totalPages,
        totalBookings,
        bookingsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
