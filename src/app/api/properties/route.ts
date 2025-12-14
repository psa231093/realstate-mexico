import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/properties - List properties with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    // Filters
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const state = searchParams.get("state");
    const municipality = searchParams.get("municipality");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minBedrooms = searchParams.get("minBedrooms");
    const maxBedrooms = searchParams.get("maxBedrooms");
    const minBathrooms = searchParams.get("minBathrooms");
    const maxBathrooms = searchParams.get("maxBathrooms");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");
    const ownerId = searchParams.get("ownerId");

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    let query = supabase
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
          avatarUrl,
          sellerType
        )
      `, { count: 'exact' })
      .eq("active", true);

    // Apply filters
    if (type) query = query.eq("type", type);
    if (status) query = query.eq("status", status);
    if (state) query = query.eq("state", state);
    if (municipality) query = query.eq("municipality", municipality);
    if (minPrice) query = query.gte("price", parseFloat(minPrice));
    if (maxPrice) query = query.lte("price", parseFloat(maxPrice));
    if (minBedrooms) query = query.gte("bedrooms", parseInt(minBedrooms));
    if (maxBedrooms) query = query.lte("bedrooms", parseInt(maxBedrooms));
    if (minBathrooms) query = query.gte("bathrooms", parseFloat(minBathrooms));
    if (maxBathrooms) query = query.lte("bathrooms", parseFloat(maxBathrooms));
    if (featured === "true") query = query.eq("featured", true);
    if (ownerId) query = query.eq("ownerId", ownerId);
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,colonia.ilike.%${search}%,municipality.ilike.%${search}%,state.ilike.%${search}%`);
    }

    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === "asc" })
      .range(offset, offset + limit - 1);

    const { data: properties, error, count } = await query;

    if (error) {
      console.error("Supabase error:", error);
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
    console.error("Error fetching properties:", error);
    return NextResponse.json(
      { error: "Failed to fetch properties" },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property
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

    // Validate required fields
    const requiredFields = [
      "title", "description", "type", "status", "price",
      "street", "colonia", "municipality", "state", "postalCode"
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate slug from title
    const baseSlug = body.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Make slug unique by adding a random suffix
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    // Ensure profile exists for this user
    const { data: existingProfile } = await supabase
      .from("Profile")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!existingProfile) {
      await supabase.from("Profile").insert({
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || user.user_metadata?.name,
        avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        sellerType: body.sellerType,
      });
    }

    // Create property
    const { data: property, error } = await supabase
      .from("Property")
      .insert({
        title: body.title,
        description: body.description,
        type: body.type,
        status: body.status,
        price: body.price,
        bedrooms: body.bedrooms || null,
        bathrooms: body.bathrooms || null,
        parkingSpaces: body.parkingSpaces || null,
        areaTotal: body.areaTotal || null,
        areaCovered: body.areaCovered || null,
        yearBuilt: body.yearBuilt || null,
        street: body.street,
        exteriorNumber: body.exteriorNumber || null,
        interiorNumber: body.interiorNumber || null,
        colonia: body.colonia,
        municipality: body.municipality,
        state: body.state,
        postalCode: body.postalCode,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        amenities: body.amenities || null,
        mainImageUrl: body.mainImageUrl || null,
        slug,
        featured: false,
        active: true,
        publishedAt: new Date().toISOString(),
        ownerId: user.id,
      })
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
        { error: "Failed to create property" },
        { status: 500 }
      );
    }

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
