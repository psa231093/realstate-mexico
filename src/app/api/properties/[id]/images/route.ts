import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/properties/[id]/images - Add images to property
export async function POST(request: NextRequest, { params }: RouteParams) {
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
    const property = await prisma.property.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (property.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { images } = body;

    if (!images || !Array.isArray(images)) {
      return NextResponse.json(
        { error: "Images array is required" },
        { status: 400 }
      );
    }

    // Get current max order
    const maxOrderResult = await prisma.propertyImage.aggregate({
      where: { propertyId: id },
      _max: { order: true },
    });
    let currentOrder = (maxOrderResult._max.order ?? -1) + 1;

    // Create image records
    const createdImages = await Promise.all(
      images.map(async (image: { url: string; alt?: string }) => {
        const propertyImage = await prisma.propertyImage.create({
          data: {
            url: image.url,
            alt: image.alt || null,
            order: currentOrder++,
            propertyId: id,
          },
        });
        return propertyImage;
      })
    );

    // Set main image if not set
    const propertyData = await prisma.property.findUnique({
      where: { id },
      select: { mainImageUrl: true },
    });

    if (!propertyData?.mainImageUrl && createdImages.length > 0) {
      await prisma.property.update({
        where: { id },
        data: { mainImageUrl: createdImages[0].url },
      });
    }

    return NextResponse.json(createdImages, { status: 201 });
  } catch (error) {
    console.error("Error adding images:", error);
    return NextResponse.json(
      { error: "Failed to add images" },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id]/images - Remove image from property
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
    const property = await prisma.property.findUnique({
      where: { id },
      select: { ownerId: true, mainImageUrl: true },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (property.ownerId !== user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { error: "Image ID is required" },
        { status: 400 }
      );
    }

    // Get image to delete
    const imageToDelete = await prisma.propertyImage.findUnique({
      where: { id: imageId },
    });

    if (!imageToDelete || imageToDelete.propertyId !== id) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Delete from database
    await prisma.propertyImage.delete({
      where: { id: imageId },
    });

    // If this was the main image, set new main image
    if (property.mainImageUrl === imageToDelete.url) {
      const nextImage = await prisma.propertyImage.findFirst({
        where: { propertyId: id },
        orderBy: { order: "asc" },
      });

      await prisma.property.update({
        where: { id },
        data: { mainImageUrl: nextImage?.url || null },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
