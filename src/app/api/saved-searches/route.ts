import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/saved-searches - Get user's saved searches
export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: searches, error } = await supabase
      .from("SavedSearch")
      .select("*")
      .eq("userId", user.id)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching saved searches:", error);
      return NextResponse.json(
        { error: "Failed to fetch saved searches" },
        { status: 500 }
      );
    }

    return NextResponse.json(searches || []);
  } catch (error) {
    console.error("Error in saved-searches GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/saved-searches - Create a new saved search
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, criteria } = body;

    if (!name || !criteria) {
      return NextResponse.json(
        { error: "Name and criteria are required" },
        { status: 400 }
      );
    }

    const { data: search, error } = await supabase
      .from("SavedSearch")
      .insert({
        name,
        criteria,
        userId: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating saved search:", error);
      return NextResponse.json(
        { error: "Failed to create saved search" },
        { status: 500 }
      );
    }

    return NextResponse.json(search, { status: 201 });
  } catch (error) {
    console.error("Error in saved-searches POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
