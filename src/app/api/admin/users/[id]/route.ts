import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/users/[id] - Get single user details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isAdmin, error } = await requireAdmin();
    if (!isAdmin) return error;

    const { id } = await params;
    const supabase = await createClient();

    const { data: user, error: queryError } = await supabase
      .from("Profile")
      .select("*")
      .eq("id", id)
      .single();

    if (queryError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get user's property count
    const { count: propertyCount } = await supabase
      .from("Property")
      .select("*", { count: "exact", head: true })
      .eq("ownerId", id);

    // Get user's inquiry count (sent)
    const { count: inquiryCount } = await supabase
      .from("Inquiry")
      .select("*", { count: "exact", head: true })
      .eq("senderId", id);

    return NextResponse.json({
      ...user,
      propertyCount: propertyCount || 0,
      inquiryCount: inquiryCount || 0,
    });
  } catch (error) {
    console.error("Error in admin user GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/admin/users/[id] - Update user role
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isAdmin, userId, error } = await requireAdmin();
    if (!isAdmin) return error;

    const { id } = await params;
    const supabase = await createClient();
    const body = await request.json();

    // Prevent admin from changing their own role
    if (id === userId) {
      return NextResponse.json(
        { error: "Cannot change your own role" },
        { status: 400 }
      );
    }

    // Only allow role updates
    const { role } = body;
    const validRoles = ["USER", "AGENT", "ADMIN"];

    if (!role || !validRoles.includes(role)) {
      return NextResponse.json(
        { error: `Invalid role. Valid roles: ${validRoles.join(", ")}` },
        { status: 400 }
      );
    }

    const { data: user, error: updateError } = await supabase
      .from("Profile")
      .update({ role, updatedAt: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating user:", updateError);
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in admin user PATCH:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
