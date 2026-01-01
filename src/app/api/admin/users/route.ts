import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/users - List all users
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
    const role = searchParams.get("role"); // USER, AGENT, ADMIN
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    let query = supabase
      .from("Profile")
      .select("*", { count: "exact" });

    // Apply filters
    if (role && role !== "all") {
      query = query.eq("role", role);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: users, error: queryError, count } = await query;

    if (queryError) {
      console.error("Error fetching users:", queryError);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }

    // Get property counts for each user
    const usersWithCounts = await Promise.all(
      (users || []).map(async (user) => {
        const { count: propertyCount } = await supabase
          .from("Property")
          .select("*", { count: "exact", head: true })
          .eq("ownerId", user.id);

        return {
          ...user,
          propertyCount: propertyCount || 0,
        };
      })
    );

    return NextResponse.json({
      users: usersWithCounts,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error in admin users GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
