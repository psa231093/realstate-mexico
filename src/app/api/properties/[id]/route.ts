import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/properties/[id] - Get single property
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();

    const { data: property, error } = await supabase
      .from("Property")
      .select(`
        *,
        PropertyImage (
          id,
          url,
          alt,
          order
        ),
        Profile:ownerId (
          id,
          name,
          email,
          phone,
          avatarUrl,
          sellerType
        )
      `)
      .eq("id", id)
      .single();

    if (error || !property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await supabase
      .from("Property")
      .update({ views: (property.views || 0) + 1 })
      .eq("id", id);

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
    const { data: existingProperty } = await supabase
      .from("Property")
      .select("ownerId")
      .eq("id", id)
      .single();

    if (!existingProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (existingProperty.ownerId !== user.id) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from("Profile")
        .select("role")
        .eq("id", user.id)
        .single();

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

    const { data: property, error } = await supabase
      .from("Property")
      .update(updateData)
      .eq("id", id)
      .select(`
        *,
        PropertyImage (
          id,
          url,
          alt,
          order
        ),
        Profile:ownerId (
          id,
          name,
          avatarUrl
        )
      `)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to update property" },
        { status: 500 }
      );
    }

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
    const { data: existingProperty } = await supabase
      .from("Property")
      .select("ownerId")
      .eq("id", id)
      .single();

    if (!existingProperty) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (existingProperty.ownerId !== user.id) {
      // Check if user is admin
      const { data: profile } = await supabase
        .from("Profile")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Forbidden" },
          { status: 403 }
        );
      }
    }

    // Soft delete by setting active to false
    const { error } = await supabase
      .from("Property")
      .update({ active: false })
      .eq("id", id);

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: "Failed to delete property" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
