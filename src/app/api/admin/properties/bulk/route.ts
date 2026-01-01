import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

// POST /api/admin/properties/bulk - Bulk actions on properties
export async function POST(request: NextRequest) {
  try {
    const { isAdmin, error } = await requireAdmin();
    if (!isAdmin) return error;

    const supabase = await createClient();
    const body = await request.json();
    const { action, propertyIds } = body;

    if (!action || !propertyIds || !Array.isArray(propertyIds) || propertyIds.length === 0) {
      return NextResponse.json(
        { error: "Action and propertyIds are required" },
        { status: 400 }
      );
    }

    const validActions = ["approve", "reject", "feature", "unfeature", "delete"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: `Invalid action. Valid actions: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case "approve":
        // Set active = true
        result = await supabase
          .from("Property")
          .update({ active: true, updatedAt: new Date().toISOString() })
          .in("id", propertyIds);
        break;

      case "reject":
        // Set active = false
        result = await supabase
          .from("Property")
          .update({ active: false, updatedAt: new Date().toISOString() })
          .in("id", propertyIds);
        break;

      case "feature":
        // Set featured = true
        result = await supabase
          .from("Property")
          .update({ featured: true, updatedAt: new Date().toISOString() })
          .in("id", propertyIds);
        break;

      case "unfeature":
        // Set featured = false
        result = await supabase
          .from("Property")
          .update({ featured: false, updatedAt: new Date().toISOString() })
          .in("id", propertyIds);
        break;

      case "delete":
        // Hard delete
        result = await supabase
          .from("Property")
          .delete()
          .in("id", propertyIds);
        break;
    }

    if (result?.error) {
      console.error(`Error in bulk ${action}:`, result.error);
      return NextResponse.json(
        { error: `Failed to ${action} properties` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      action,
      count: propertyIds.length,
    });
  } catch (error) {
    console.error("Error in admin properties bulk:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
