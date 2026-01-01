import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT /api/saved-searches/[id] - Update a saved search
export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    // Verify ownership
    const { data: existing } = await supabase
      .from("SavedSearch")
      .select("userId")
      .eq("id", id)
      .single();

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, alertsEnabled } = body;

    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (name !== undefined) updateData.name = name;
    if (alertsEnabled !== undefined) updateData.alertsEnabled = alertsEnabled;

    const { data: search, error } = await supabase
      .from("SavedSearch")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating saved search:", error);
      return NextResponse.json(
        { error: "Failed to update saved search" },
        { status: 500 }
      );
    }

    return NextResponse.json(search);
  } catch (error) {
    console.error("Error in saved-searches PUT:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/saved-searches/[id] - Delete a saved search
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

    // Verify ownership
    const { data: existing } = await supabase
      .from("SavedSearch")
      .select("userId")
      .eq("id", id)
      .single();

    if (!existing || existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    const { error } = await supabase
      .from("SavedSearch")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting saved search:", error);
      return NextResponse.json(
        { error: "Failed to delete saved search" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in saved-searches DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
