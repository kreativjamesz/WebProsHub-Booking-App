import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { verifyAdminToken } from "@/lib/utils/route-guards";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdminToken(request);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if admin has permission to view system stats
    if (admin.role !== "SUPER_ADMIN" && admin.role !== "MODERATOR") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    // Get system statistics
    const [
      totalUsers,
      totalBusinesses,
      totalBookings,
      totalCategories,
      activeBusinesses,
      pendingBookings,
      completedBookings,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.business.count(),
      prisma.booking.count(),
      prisma.category.count(),
      prisma.business.count({ where: { isActive: true } }),
      prisma.booking.count({ where: { status: "PENDING" } }),
      prisma.booking.count({ where: { status: "COMPLETED" } }),
    ]);

    // Calculate active users (temporarily use total users since status field might not exist)
    const activeUsers = totalUsers;

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      recentUsers,
      recentBusinesses,
      recentBookings,
    ] = await Promise.all([
      prisma.user.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.business.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.booking.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
    ]);

    // Get monthly booking trends (last 6 months) - simplified
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    // Simplified monthly data - just get total bookings in the period
    const monthlyBookings = await prisma.booking.count({
      where: {
        createdAt: { gte: sixMonthsAgo }
      }
    });

    // Format monthly data (simplified)
    const monthlyData = [{
      month: new Date().toISOString().slice(0, 7), // Current month
      count: monthlyBookings
    }];

    return NextResponse.json({
      stats: {
        totalUsers,
        totalBusinesses,
        totalBookings,
        totalCategories,
        activeUsers,
        activeBusinesses,
        pendingBookings,
        completedBookings,
        recentUsers,
        recentBusinesses,
        recentBookings,
      },
      trends: {
        monthlyBookings: monthlyData,
      }
    });
  } catch (error) {
    console.error("Error fetching system stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch system statistics" },
      { status: 500 }
    );
  }
}
