import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { sanitizeSearchInput } from "@/lib/security";

// GET /api/admin/properties - List all properties (including inactive)
export async function GET(request: NextRequest) {
  try {
    const { isAdmin, error } = await requireAdmin();
    if (!isAdmin) return error;

    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Filters
    const status = searchParams.get("status"); // active, inactive, all
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    let query = supabase
      .from("Property")
      .select(`
        id,
        title,
        slug,
        type,
        status,
        price,
        active,
        featured,
        views,
        mainImageUrl,
        state,
        municipality,
        createdAt,
        updatedAt,
        Profile:ownerId (
          id,
          name,
          email
        )
      `, { count: "exact" });

    // Apply filters
    if (status === "active") {
      query = query.eq("active", true);
    } else if (status === "inactive") {
      query = query.eq("active", false);
    }
    // "all" or no filter = show all

    if (type) {
      query = query.eq("type", type);
    }

    if (featured === "true") {
      query = query.eq("featured", true);
    }

    if (search) {
      const sanitizedSearch = sanitizeSearchInput(search);
      if (sanitizedSearch) {
        query = query.or(`title.ilike.%${sanitizedSearch}%,colonia.ilike.%${sanitizedSearch}%,municipality.ilike.%${sanitizedSearch}%`);
      }
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: properties, error: queryError, count } = await query;

    if (queryError) {
      console.error("Error fetching properties:", queryError);
      return NextResponse.json(
        { error: "Failed to fetch properties" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      properties: properties || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error in admin properties GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
