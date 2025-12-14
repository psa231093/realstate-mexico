import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/properties/[id] - Get single property
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const property = await prisma.property.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
            sellerType: true,
          },
        },
        _count: {
          select: {
            favorites: true,
            inquiries: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.property.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

// PATCH /api/properties/[id] - Update property
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if property exists and user owns it
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (existingProperty.ownerId !== user.id) {
      // Check if user is admin
      const profile = await prisma.profile.findUnique({
        where: { id: user.id },
        select: { role: true },
      });

      if (profile?.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    }

    const body = await request.json();

    // Fields that can be updated
    const allowedFields = [
      "title", "description", "type", "status", "price",
      "bedrooms", "bathrooms", "parkingSpaces", "areaTotal", "areaCovered",
      "yearBuilt", "street", "exteriorNumber", "interiorNumber", "colonia",
      "municipality", "state", "postalCode", "latitude", "longitude",
      "amenities", "mainImageUrl", "featured", "active"
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    const property = await prisma.property.update({
      where: { id },
      data: updateData,
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Delete property (soft delete)
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if property exists and user owns it
    const existingProperty = await prisma.property.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!existingProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (existingProperty.ownerId !== user.id) {
      // Check if user is admin
      const profile = await prisma.profile.findUnique({
        where: { id: user.id },
        select: { role: true },
      });

      if (profile?.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    }

    // Soft delete by setting active to false
    await prisma.property.update({
      where: { id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
