import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";

// GET /api/admin/inquiries - List all inquiries
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
    const status = searchParams.get("status"); // NUEVO, CONTACTADO, CERRADO
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    let query = supabase
      .from("Inquiry")
      .select(`
        id,
        name,
        email,
        phone,
        message,
        status,
        createdAt,
        Property:propertyId (
          id,
          title,
          slug,
          mainImageUrl
        ),
        Sender:senderId (
          id,
          name,
          email
        )
      `, { count: "exact" });

    // Apply filters
    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === "asc" });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: inquiries, error: queryError, count } = await query;

    if (queryError) {
      console.error("Error fetching inquiries:", queryError);
      return NextResponse.json(
        { error: "Failed to fetch inquiries" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      inquiries: inquiries || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Error in admin inquiries GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
