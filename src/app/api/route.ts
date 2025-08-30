import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/database";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const model = searchParams.get('model');

    if (action === 'testConnection') {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`;
      return NextResponse.json({ 
        success: true, 
        data: { message: 'PostgreSQL database is connected' }
      });
    }

    if (action === 'list' && model) {
      let data;
      switch (model) {
        case 'users':
          data = await prisma.user.findMany();
          break;
        case 'businesses':
          data = await prisma.business.findMany({
            include: { owner: true, services: true }
          });
          break;
        case 'services':
          data = await prisma.service.findMany({
            include: { business: true }
          });
          break;
        case 'bookings':
          data = await prisma.booking.findMany({
            include: { user: true, business: true, service: true }
          });
          break;
        default:
          return NextResponse.json(
            { success: false, error: "Invalid model" },
            { status: 400 }
          );
      }
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database connection failed",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, model, data } = await request.json();

    switch (action) {
      case "create":
        let result;
        switch (model) {
          case 'user':
            result = await prisma.user.create({ data });
            break;
          case 'business':
            result = await prisma.business.create({ data });
            break;
          case 'service':
            result = await prisma.service.create({ data });
            break;
          case 'booking':
            result = await prisma.booking.create({ data });
            break;
          default:
            return NextResponse.json(
              { success: false, error: "Invalid model" },
              { status: 400 }
            );
        }
        return NextResponse.json({ success: true, data: result });

      case "update":
        const { id, ...updateData } = data;
        let updatedResult;
        switch (model) {
          case 'user':
            updatedResult = await prisma.user.update({
              where: { id },
              data: updateData
            });
            break;
          case 'business':
            updatedResult = await prisma.business.update({
              where: { id },
              data: updateData
            });
            break;
          case 'service':
            updatedResult = await prisma.service.update({
              where: { id },
              data: updateData
            });
            break;
          case 'booking':
            updatedResult = await prisma.booking.update({
              where: { id },
              data: updateData
            });
            break;
          default:
            return NextResponse.json(
              { success: false, error: "Invalid model" },
              { status: 400 }
            );
        }
        return NextResponse.json({ success: true, data: updatedResult });

      default:
        return NextResponse.json(
          { success: false, error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Database operation failed",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { action, model, id } = await request.json();

    if (action === "delete" && model && id) {
      let result;
      switch (model) {
        case 'user':
          result = await prisma.user.delete({ where: { id } });
          break;
        case 'business':
          result = await prisma.business.delete({ where: { id } });
          break;
        case 'service':
          result = await prisma.service.delete({ where: { id } });
          break;
        case 'booking':
          result = await prisma.booking.delete({ where: { id } });
          break;
        default:
          return NextResponse.json(
            { success: false, error: "Invalid model" },
            { status: 400 }
          );
      }
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action or missing parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Delete operation failed",
      },
      { status: 500 }
    );
  }
}
