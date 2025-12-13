# Phase 1: Foundation & Security - Detailed Implementation Guide

**Duration:** 3 weeks  
**Priority:** 🔴 CRITICAL  
**Status:** Ready to Start

---

## 📋 Overview

Phase 1 transforms the application from a prototype with mock data to a production-ready foundation with real database integration, proper authentication, and secure image handling.

---

## Week 1: Database Integration & API Layer

### Day 1-2: Environment Setup

#### Tasks

1. **Create `.env.example`**
```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/realestate_mexico"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=""

# Image Storage (choose one)
# Option 1: Cloudinary
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Option 2: AWS S3
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
AWS_S3_BUCKET=""

# Option 3: UploadThing
UPLOADTHING_SECRET=""
UPLOADTHING_APP_ID=""

# Image Optimization
TINIFY_API_KEY=""

# Email (for notifications)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASSWORD=""
SMTP_FROM=""

# Redis (for caching)
REDIS_URL=""

# Monitoring
SENTRY_DSN=""
```

2. **Create `src/lib/env.ts` for environment validation**
```typescript
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
  NEXT_PUBLIC_MAPBOX_TOKEN: z.string().optional(),
  // Add other required env vars
});

export function validateEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    throw new Error("Invalid environment variables");
  }
}

export const env = validateEnv();
```

3. **Update `src/lib/prisma.ts` to use validated env**
```typescript
import { PrismaClient } from "@prisma/client";
import { env } from "./env";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

**Deliverable:** Environment variables properly configured and validated

---

### Day 3-5: Property API Routes

#### Create `src/app/api/properties/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { auth } from "@/lib/auth";
import { z } from "zod";

const propertySchema = z.object({
  title: z.string().min(10).max(200),
  description: z.string().min(50).max(5000),
  type: z.enum(["CASA", "DEPARTAMENTO", "TERRENO", "LOCAL_COMERCIAL", "OFICINA", "BODEGA", "RANCHO"]),
  status: z.enum(["VENTA", "RENTA", "VENDIDO", "RENTADO"]),
  price: z.number().positive(),
  bedrooms: z.number().int().positive().optional(),
  bathrooms: z.number().positive().optional(),
  parkingSpaces: z.number().int().min(0).optional(),
  areaTotal: z.number().positive().optional(),
  areaCovered: z.number().positive().optional(),
  yearBuilt: z.number().int().min(1800).max(new Date().getFullYear() + 1).optional(),
  street: z.string().min(5),
  exteriorNumber: z.string().optional(),
  interiorNumber: z.string().optional(),
  colonia: z.string().min(2),
  municipality: z.string().min(2),
  state: z.string().min(2),
  postalCode: z.string().regex(/^\d{5}$/),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  amenities: z.record(z.boolean()).optional(),
});

// GET /api/properties - List properties with filters and pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const skip = (page - 1) * limit;

    // Filters
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const state = searchParams.get("state");
    const municipality = searchParams.get("municipality");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const search = searchParams.get("search");

    // Build where clause
    const where: any = {
      active: true,
    };

    if (type) where.type = type;
    if (status) where.status = status;
    if (state) where.state = state;
    if (municipality) where.municipality = municipality;
    if (minPrice) where.price = { ...where.price, gte: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, lte: parseFloat(maxPrice) };
    if (bedrooms) where.bedrooms = { gte: parseInt(bedrooms) };
    if (bathrooms) where.bathrooms = { gte: parseFloat(bathrooms) };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { colonia: { contains: search, mode: "insensitive" } },
        { municipality: { contains: search, mode: "insensitive" } },
      ];
    }

    // Execute query
    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          images: {
            orderBy: { order: "asc" },
            take: 1,
          },
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
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

// POST /api/properties - Create new property
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = propertySchema.parse(body);

    // Generate slug
    const slug = validatedData.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if slug exists
    const existing = await prisma.property.findUnique({
      where: { slug },
    });

    const finalSlug = existing
      ? `${slug}-${Date.now()}`
      : slug;

    const property = await prisma.property.create({
      data: {
        ...validatedData,
        slug: finalSlug,
        ownerId: session.user.id,
        price: validatedData.price,
        latitude: validatedData.latitude,
        longitude: validatedData.longitude,
      },
      include: {
        images: true,
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Error creating property:", error);
    return NextResponse.json(
      { error: "Failed to create property" },
      { status: 500 }
    );
  }
}
```

#### Create `src/app/api/properties/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/properties/[id] - Get single property
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id, active: true },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            sellerType: true,
          },
        },
        favorites: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    // Increment views
    await prisma.property.update({
      where: { id: params.id },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { error: "Failed to fetch property" },
      { status: 500 }
    );
  }
}

// PATCH /api/properties/[id] - Update property
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check ownership
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      select: { ownerId: true },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (property.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updated = await prisma.property.update({
      where: { id: params.id },
      data: body,
      include: {
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating property:", error);
    return NextResponse.json(
      { error: "Failed to update property" },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Soft delete property
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check ownership
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      select: { ownerId: true },
    });

    if (!property) {
      return NextResponse.json(
        { error: "Property not found" },
        { status: 404 }
      );
    }

    if (property.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // Soft delete
    await prisma.property.update({
      where: { id: params.id },
      data: { active: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting property:", error);
    return NextResponse.json(
      { error: "Failed to delete property" },
      { status: 500 }
    );
  }
}
```

#### Create `src/app/api/properties/[id]/images/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
// Import your image upload service (Cloudinary, S3, etc.)

// POST /api/properties/[id]/images - Upload image
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify ownership
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      select: { ownerId: true },
    });

    if (!property || property.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    // Upload to cloud storage (implement based on your choice)
    const imageUrl = await uploadImage(file);

    // Get current max order
    const maxOrder = await prisma.propertyImage.findFirst({
      where: { propertyId: params.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const image = await prisma.propertyImage.create({
      data: {
        url: imageUrl,
        propertyId: params.id,
        order: (maxOrder?.order ?? -1) + 1,
      },
    });

    // Update main image if it's the first one
    if (!maxOrder) {
      await prisma.property.update({
        where: { id: params.id },
        data: { mainImageUrl: imageUrl },
      });
    }

    return NextResponse.json(image, { status: 201 });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}

async function uploadImage(file: File): Promise<string> {
  // Implement based on your storage choice:
  // - Cloudinary
  // - AWS S3
  // - UploadThing
  // etc.
  throw new Error("Implement image upload");
}
```

**Deliverable:** Complete API layer for properties

---

### Day 6-7: Replace Mock Data

#### Update `src/app/page.tsx`

```typescript
import { SearchHero } from "@/components/search/SearchHero";
import { PropertyCard } from "@/components/property/PropertyCard";
import { BuyAbilitySection } from "@/components/search/BuyAbilitySection";
import { prisma } from "@/lib/prisma";

async function getTrendingProperties() {
  try {
    const properties = await prisma.property.findMany({
      where: {
        active: true,
        status: { in: ["VENTA", "RENTA"] },
      },
      take: 4,
      orderBy: [
        { views: "desc" },
        { createdAt: "desc" },
      ],
      include: {
        images: {
          orderBy: { order: "asc" },
          take: 1,
        },
      },
    });

    return properties.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      price: Number(p.price),
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms ? Number(p.bathrooms) : undefined,
      area: p.areaTotal ? Number(p.areaTotal) : undefined,
      imageUrl: p.mainImageUrl || p.images[0]?.url || "",
      address: `${p.colonia}, ${p.municipality}, ${p.state}, ${p.postalCode}`,
      status: p.status,
      badge: p.featured ? "Destacada" : undefined,
    }));
  } catch (error) {
    console.error("Error fetching properties:", error);
    return [];
  }
}

export default async function Home() {
  const properties = await getTrendingProperties();

  return (
    <main>
      <SearchHero />
      
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Propiedades en Tendencia en Ciudad de México
            </h2>
            <p className="text-gray-600 mt-1">
              Vistas y guardadas más frecuentemente en las últimas 24 horas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </section>

      <BuyAbilitySection />
    </main>
  );
}
```

#### Update `src/app/propiedades/page.tsx`

Convert to server component with data fetching, or create a client component that fetches from API.

**Deliverable:** All mock data replaced with real database queries

---

## Week 2: Authentication & Authorization

### Day 1-3: Complete Auth Integration

#### Update `src/lib/auth.ts`

```typescript
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { env } from "./env";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Google({
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        // Fetch user role from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        token.role = dbUser?.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
```

#### Create `src/middleware.ts`

```typescript
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    if (!req.auth || req.auth.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!req.auth) {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
```

**Deliverable:** Complete authentication system with protected routes

---

## Week 3: Image Management & Storage

### Day 1-3: Cloud Storage Integration

Choose one storage solution and implement. Example with Cloudinary:

#### Create `src/lib/cloudinary.ts`

```typescript
import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: File | Buffer,
  folder: string = "properties"
): Promise<string> {
  try {
    const buffer = file instanceof File 
      ? Buffer.from(await file.arrayBuffer())
      : file;

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            format: "webp",
            quality: "auto",
            fetch_format: "auto",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as { secure_url: string });
          }
        )
        .end(buffer);
    });

    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
}
```

**Deliverable:** Image upload and storage working

---

## ✅ Phase 1 Completion Checklist

- [ ] Environment variables configured and validated
- [ ] Property API routes implemented (GET, POST, PATCH, DELETE)
- [ ] Image upload API implemented
- [ ] All mock data replaced with database queries
- [ ] Authentication fully integrated
- [ ] Protected routes working
- [ ] Property listing wizard connected to API
- [ ] Images stored in cloud storage
- [ ] Security vulnerabilities fixed
- [ ] Error handling implemented
- [ ] Basic testing completed

---

## 🚀 Next Steps

After completing Phase 1, proceed to **Phase 2: Core Features** as outlined in `ROADMAP.md`.

