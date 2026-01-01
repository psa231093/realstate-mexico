import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, getClientIP, rateLimitHeaders } from "@/lib/rate-limit";

// GET /api/favorites - Get user's favorite properties
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { data: favorites, error } = await supabase
      .from("Favorite")
      .select(`
        id,
        createdAt,
        Property:propertyId (
          id,
          slug,
          title,
          price,
          bedrooms,
          bathrooms,
          areaTotal,
          mainImageUrl,
          colonia,
          municipality,
          state,
          status,
          type
        )
      `)
      .eq("userId", user.id)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching favorites:", error);
      return NextResponse.json(
        { error: "Failed to fetch favorites" },
        { status: 500 }
      );
    }

    return NextResponse.json(favorites || []);
  } catch (error) {
    console.error("Error in favorites GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Add a property to favorites
export async function POST(request: NextRequest) {
  try {
    // Rate limiting - 60 favorite actions per minute
    const clientIP = getClientIP(request);
    const rateLimitResult = checkRateLimit(`favorites:${clientIP}`, { limit: 60, windowSeconds: 60 });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo." },
        { status: 429, headers: rateLimitHeaders(rateLimitResult) }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { propertyId } = body;

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    // Check if already favorited
    const { data: existing } = await supabase
      .from("Favorite")
      .select("id")
      .eq("userId", user.id)
      .eq("propertyId", propertyId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "Property already in favorites" },
        { status: 409 }
      );
    }

    const { data: favorite, error } = await supabase
      .from("Favorite")
      .insert({
        userId: user.id,
        propertyId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding favorite:", error);
      return NextResponse.json(
        { error: "Failed to add favorite" },
        { status: 500 }
      );
    }

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    console.error("Error in favorites POST:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites - Remove a property from favorites
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");

    if (!propertyId) {
      return NextResponse.json(
        { error: "Property ID is required" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("Favorite")
      .delete()
      .eq("userId", user.id)
      .eq("propertyId", propertyId);

    if (error) {
      console.error("Error removing favorite:", error);
      return NextResponse.json(
        { error: "Failed to remove favorite" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in favorites DELETE:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
