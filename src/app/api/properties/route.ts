import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Prisma } from "@prisma/client";

// GET /api/properties - List properties with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

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

    // Build where clause
    const where: Prisma.PropertyWhereInput = {
      active: true,
    };

    if (type) {
      where.type = type as Prisma.EnumPropertyTypeFilter;
    }

    if (status) {
      where.status = status as Prisma.EnumPropertyStatusFilter;
    }

    if (state) {
      where.state = state;
    }

    if (municipality) {
      where.municipality = municipality;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (minBedrooms || maxBedrooms) {
      where.bedrooms = {};
      if (minBedrooms) where.bedrooms.gte = parseInt(minBedrooms);
      if (maxBedrooms) where.bedrooms.lte = parseInt(maxBedrooms);
    }

    if (minBathrooms || maxBathrooms) {
      where.bathrooms = {};
      if (minBathrooms) where.bathrooms.gte = parseFloat(minBathrooms);
      if (maxBathrooms) where.bathrooms.lte = parseFloat(maxBathrooms);
    }

    if (featured === "true") {
      where.featured = true;
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { colonia: { contains: search, mode: "insensitive" } },
        { municipality: { contains: search, mode: "insensitive" } },
        { state: { contains: search, mode: "insensitive" } },
      ];
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    const orderBy: Prisma.PropertyOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // Execute query
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          images: {
            orderBy: { order: "asc" },
            take: 5,
          },
          owner: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
              sellerType: true,
            },
          },
          _count: {
            select: {
              favorites: true,
            },
          },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      properties,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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
    await prisma.profile.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.full_name || user.user_metadata?.name,
        avatarUrl: user.user_metadata?.avatar_url || user.user_metadata?.picture,
        sellerType: body.sellerType,
      },
    });

    // Create property
    const property = await prisma.property.create({
      data: {
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
        publishedAt: new Date(),
        ownerId: user.id,
      },
      include: {
        images: true,
        owner: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
