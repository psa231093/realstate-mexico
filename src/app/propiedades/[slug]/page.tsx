import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PropertyDetailClient } from "./PropertyDetailClient";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getProperty(slug: string) {
  try {
    const supabase = await createClient();

    const { data: property, error } = await supabase
      .from("Property")
      .select(`
        id,
        slug,
        title,
        description,
        type,
        status,
        price,
        bedrooms,
        bathrooms,
        parkingSpaces,
        areaTotal,
        areaCovered,
        yearBuilt,
        street,
        exteriorNumber,
        interiorNumber,
        colonia,
        municipality,
        state,
        postalCode,
        latitude,
        longitude,
        amenities,
        mainImageUrl,
        featured,
        views,
        createdAt,
        PropertyImage (
          id,
          url,
          alt,
          order
        ),
        Profile:ownerId (
          id,
          name,
          phone,
          email,
          avatarUrl,
          sellerType
        )
      `)
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (error) {
      // PGRST116 = "no rows found" - not a real error, just means property doesn't exist
      if (error.code !== 'PGRST116') {
        console.error("Error fetching property:", error);
      }
      return null;
    }

    if (!property) {
      return null;
    }

    // Increment view count
    await supabase
      .from("Property")
      .update({ views: (property.views || 0) + 1 })
      .eq("id", property.id);

    return property;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

// Fallback property for sample slugs
function getFallbackProperty(slug: string) {
  const fallbackProperties: Record<string, any> = {
    "casa-polanco-cdmx": {
      id: "sample-1",
      slug: "casa-polanco-cdmx",
      title: "Hermosa Casa en Polanco",
      description: "Espectacular casa en una de las zonas mas exclusivas de la Ciudad de Mexico. Esta propiedad cuenta con acabados de lujo, amplios espacios y una ubicacion privilegiada cerca de restaurantes, boutiques y parques. Ideal para familias que buscan comodidad y estilo de vida premium.",
      type: "CASA",
      status: "VENTA",
      price: 12500000,
      bedrooms: 4,
      bathrooms: 3.5,
      parkingSpaces: 2,
      areaTotal: 350,
      areaCovered: 280,
      yearBuilt: 2018,
      colonia: "Polanco",
      municipality: "Miguel Hidalgo",
      state: "Ciudad de Mexico",
      postalCode: "11560",
      latitude: 19.4352,
      longitude: -99.1944,
      amenities: ["Cocina integral", "Closets", "Estacionamiento techado", "Jardin", "Terraza", "Seguridad 24/7"],
      mainImageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      featured: true,
      PropertyImage: [
        { id: "1", url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", order: 0 },
        { id: "2", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", order: 1 },
        { id: "3", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", order: 2 },
        { id: "4", url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", order: 3 },
      ],
      Profile: {
        id: "owner-1",
        name: "Maria Garcia",
        phone: "5512345678",
        email: "maria@example.com",
        sellerType: "PARTICULAR",
      },
    },
    "departamento-condesa": {
      id: "sample-2",
      slug: "departamento-condesa",
      title: "Departamento Moderno Condesa",
      description: "Hermoso departamento en el corazon de la Condesa. Diseno contemporaneo con excelentes acabados. Cerca de parques, restaurantes y todo tipo de servicios. Perfecto para jovenes profesionales o parejas.",
      type: "DEPARTAMENTO",
      status: "VENTA",
      price: 4500000,
      bedrooms: 2,
      bathrooms: 2,
      parkingSpaces: 1,
      areaTotal: 120,
      areaCovered: 110,
      yearBuilt: 2020,
      colonia: "Condesa",
      municipality: "Cuauhtemoc",
      state: "Ciudad de Mexico",
      postalCode: "06140",
      latitude: 19.4111,
      longitude: -99.1747,
      amenities: ["Cocina integral", "Closets", "Gimnasio", "Roof garden", "Elevador", "Seguridad"],
      mainImageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
      featured: false,
      PropertyImage: [
        { id: "1", url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", order: 0 },
        { id: "2", url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", order: 1 },
        { id: "3", url: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800", order: 2 },
      ],
      Profile: {
        id: "owner-2",
        name: "Carlos Lopez",
        phone: "5587654321",
        email: "carlos@example.com",
        sellerType: "PARTICULAR",
      },
    },
    "casa-santa-fe": {
      id: "sample-3",
      slug: "casa-santa-fe",
      title: "Casa en Santa Fe",
      description: "Impresionante residencia en Santa Fe con vista espectacular. Amplios espacios, jardin privado y las mejores amenidades. Ubicacion estrategica con acceso a centros comerciales y corporativos.",
      type: "CASA",
      status: "VENTA",
      price: 18900000,
      bedrooms: 5,
      bathrooms: 4,
      parkingSpaces: 3,
      areaTotal: 450,
      areaCovered: 380,
      yearBuilt: 2019,
      colonia: "Santa Fe",
      municipality: "Cuajimalpa",
      state: "Ciudad de Mexico",
      postalCode: "05348",
      latitude: 19.3664,
      longitude: -99.2618,
      amenities: ["Alberca", "Jardin", "Cuarto de servicio", "Bodega", "Seguridad 24/7", "Gimnasio"],
      mainImageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      featured: false,
      PropertyImage: [
        { id: "1", url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", order: 0 },
        { id: "2", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", order: 1 },
      ],
      Profile: {
        id: "owner-3",
        name: "Ana Martinez",
        phone: "5511223344",
        email: "ana@example.com",
        sellerType: "INMOBILIARIA",
      },
    },
    "casa-coyoacan": {
      id: "sample-4",
      slug: "casa-coyoacan",
      title: "Casa Colonial Coyoacan",
      description: "Encantadora casa colonial en el historico barrio de Coyoacan. Arquitectura tradicional mexicana con toques modernos. Cerca de museos, cafes y el famoso mercado de Coyoacan.",
      type: "CASA",
      status: "VENTA",
      price: 8750000,
      bedrooms: 3,
      bathrooms: 2.5,
      parkingSpaces: 2,
      areaTotal: 280,
      areaCovered: 220,
      yearBuilt: 1985,
      colonia: "Coyoacan Centro",
      municipality: "Coyoacan",
      state: "Ciudad de Mexico",
      postalCode: "04100",
      latitude: 19.3503,
      longitude: -99.1619,
      amenities: ["Patio central", "Fuente", "Bodega", "Cuarto de servicio", "Jardin"],
      mainImageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      featured: true,
      PropertyImage: [
        { id: "1", url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", order: 0 },
        { id: "2", url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", order: 1 },
      ],
      Profile: {
        id: "owner-4",
        name: "Roberto Sanchez",
        phone: "5599887766",
        email: "roberto@example.com",
        sellerType: "PARTICULAR",
      },
    },
  };

  return fallbackProperties[slug] || null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const property = await getProperty(slug) || getFallbackProperty(slug);

  if (!property) {
    return {
      title: "Propiedad no encontrada",
    };
  }

  const address = `${property.colonia}, ${property.municipality}, ${property.state}`;

  return {
    title: property.title,
    description: property.description?.slice(0, 160) || `${property.title} en ${address}`,
    openGraph: {
      title: property.title,
      description: property.description?.slice(0, 160),
      images: [property.mainImageUrl || property.PropertyImage?.[0]?.url],
    },
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  let property = await getProperty(slug);

  // Try fallback for sample properties
  if (!property) {
    property = getFallbackProperty(slug);
  }

  if (!property) {
    notFound();
  }

  // Transform data for client component
  const propertyData = {
    id: property.id,
    slug: property.slug,
    title: property.title,
    description: property.description,
    type: property.type,
    status: property.status,
    price: Number(property.price),
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms ? Number(property.bathrooms) : undefined,
    parkingSpaces: property.parkingSpaces,
    areaTotal: property.areaTotal ? Number(property.areaTotal) : undefined,
    areaCovered: property.areaCovered ? Number(property.areaCovered) : undefined,
    yearBuilt: property.yearBuilt,
    address: `${property.colonia}, ${property.municipality}, ${property.state}`,
    colonia: property.colonia,
    municipality: property.municipality,
    state: property.state,
    postalCode: property.postalCode,
    latitude: property.latitude ? Number(property.latitude) : undefined,
    longitude: property.longitude ? Number(property.longitude) : undefined,
    amenities: Array.isArray(property.amenities) ? property.amenities : [],
    mainImageUrl: property.mainImageUrl,
    images: property.PropertyImage?.sort((a: any, b: any) => a.order - b.order).map((img: any) => img.url) || [],
    featured: property.featured,
    owner: (() => {
      const profile = Array.isArray(property.Profile) ? property.Profile[0] : property.Profile;
      if (!profile) return undefined;
      return {
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        avatarUrl: profile.avatarUrl,
        sellerType: profile.sellerType,
      };
    })(),
  };

  return <PropertyDetailClient property={propertyData} />;
}
