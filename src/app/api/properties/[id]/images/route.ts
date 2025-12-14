import { NextRequest, NextResponse } from "next/server";
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
    const { data: property } = await supabase
      .from("Property")
      .select("ownerId, mainImageUrl")
      .eq("id", id)
      .single();

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
    const { data: existingImages } = await supabase
      .from("PropertyImage")
      .select("order")
      .eq("propertyId", id)
      .order("order", { ascending: false })
      .limit(1);

    let currentOrder = (existingImages?.[0]?.order ?? -1) + 1;

    // Create image records
    const imagesToInsert = images.map((image: { url: string; alt?: string }) => ({
      url: image.url,
      alt: image.alt || null,
      order: currentOrder++,
      propertyId: id,
    }));

    const { data: createdImages, error } = await supabase
      .from("PropertyImage")
      .insert(imagesToInsert)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to add images" },
        { status: 500 }
      );
    }

    // Set main image if not set
    if (!property.mainImageUrl && createdImages && createdImages.length > 0) {
      await supabase
        .from("Property")
        .update({ mainImageUrl: createdImages[0].url })
        .eq("id", id);
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
    const { data: property } = await supabase
      .from("Property")
      .select("ownerId, mainImageUrl")
      .eq("id", id)
      .single();

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
    const { data: imageToDelete } = await supabase
      .from("PropertyImage")
      .select("id, url, propertyId")
      .eq("id", imageId)
      .single();

    if (!imageToDelete || imageToDelete.propertyId !== id) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404 }
      );
    }

    // Delete from database
    const { error } = await supabase
      .from("PropertyImage")
      .delete()
      .eq("id", imageId);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to delete image" },
        { status: 500 }
      );
    }

    // If this was the main image, set new main image
    if (property.mainImageUrl === imageToDelete.url) {
      const { data: nextImage } = await supabase
        .from("PropertyImage")
        .select("url")
        .eq("propertyId", id)
        .order("order", { ascending: true })
        .limit(1)
        .single();

      await supabase
        .from("Property")
        .update({ mainImageUrl: nextImage?.url || null })
        .eq("id", id);
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
