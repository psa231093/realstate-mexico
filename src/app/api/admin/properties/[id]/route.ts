import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/properties/[id] - Get single property details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isAdmin, error } = await requireAdmin();
    if (!isAdmin) return error;

    const { id } = await params;
    const supabase = await createClient();

    const { data: property, error: queryError } = await supabase
      .from("Property")
      .select(`
        *,
        PropertyImage (*),
        Profile:ownerId (
          id,
          name,
          email,
          phone,
          role
        )
      `)
      .eq("id", id)
      .single();

    if (queryError || !property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error in admin property GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/properties/[id] - Update property (approve, reject, feature)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isAdmin, error } = await requireAdmin();
    if (!isAdmin) return error;

    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    // Only allow specific fields to be updated by admin
    const allowedFields = ["active", "featured"];
    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    // Add updatedAt timestamp
    updates.updatedAt = new Date().toISOString();

    const { data: property, error: updateError } = await supabase
      .from("Property")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating property:", updateError);
      return NextResponse.json(
        { error: "Failed to update property" },
        { status: 500 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error in admin property PATCH:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/properties/[id] - Hard delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isAdmin, error } = await requireAdmin();
    if (!isAdmin) return error;

    const { id } = await params;
    const supabase = await createClient();

    // Check if property exists
    const { data: existing } = await supabase
      .from("Property")
      .select("id")
      .eq("id", id)
      .single();

    if (!existing) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Hard delete the property (cascades to images, favorites, etc.)
    const { error: deleteError } = await supabase
      .from("Property")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error deleting property:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete property" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in admin property DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
