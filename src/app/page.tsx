import { SearchHero } from "@/components/search/SearchHero";
import { PropertyCard } from "@/components/property/PropertyCard";
import { BuyAbilitySection } from "@/components/search/BuyAbilitySection";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

// Fallback sample data for when database is empty
const fallbackProperties = [
  {
    id: "sample-1",
    slug: "casa-polanco-cdmx",
    title: "Hermosa Casa en Polanco",
    price: 12500000,
    bedrooms: 4,
    bathrooms: 3.5,
    area: 350,
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    address: "Polanco, Miguel Hidalgo, Ciudad de M\u00e9xico, 11560",
    status: "VENTA",
    badge: "Destacada",
  },
  {
    id: "sample-2",
    slug: "departamento-condesa",
    title: "Departamento Moderno Condesa",
    price: 4500000,
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    address: "Condesa, Cuauht\u00e9moc, Ciudad de M\u00e9xico, 06140",
    status: "VENTA",
    badge: "Nueva",
  },
  {
    id: "sample-3",
    slug: "casa-santa-fe",
    title: "Casa en Santa Fe",
    price: 18900000,
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    address: "Santa Fe, Cuajimalpa, Ciudad de M\u00e9xico, 05348",
    status: "VENTA",
    badge: "Premium",
  },
  {
    id: "sample-4",
    slug: "casa-coyoacan",
    title: "Casa Colonial Coyoac\u00e1n",
    price: 8750000,
    bedrooms: 3,
    bathrooms: 2.5,
    area: 280,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    address: "Coyoac\u00e1n, Ciudad de M\u00e9xico, 04100",
    status: "VENTA",
    badge: "Destacada",
  },
];

async function getProperties() {
  try {
    const supabase = await createClient();

    const { data: properties, error } = await supabase
      .from("Property")
      .select(`
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
        featured,
        PropertyImage (
          url
        )
      `)
      .eq("active", true)
      .order("featured", { ascending: false })
      .order("createdAt", { ascending: false })
      .limit(8);

    if (error) {
      console.error("Supabase error:", JSON.stringify(error, null, 2));
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      return fallbackProperties;
    }

    if (!properties || properties.length === 0) {
      return fallbackProperties;
    }

    return properties.map((property) => ({
      id: property.id,
      slug: property.slug,
      title: property.title,
      price: Number(property.price),
      bedrooms: property.bedrooms || undefined,
      bathrooms: property.bathrooms ? Number(property.bathrooms) : undefined,
      area: property.areaTotal ? Number(property.areaTotal) : undefined,
      imageUrl: property.mainImageUrl || property.PropertyImage?.[0]?.url || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
      address: `${property.colonia}, ${property.municipality}, ${property.state}`,
      status: property.status,
      badge: property.featured ? "Destacada" : undefined,
    }));
  } catch (error) {
    console.error("Error fetching properties:", error);
    return fallbackProperties;
  }
}

export default async function Home() {
  const properties = await getProperties();

  return (
    <main>
      {/* Hero Section */}
      <SearchHero />

      {/* Trending Properties Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Propiedades en Tendencia en M&eacute;xico
              </h2>
              <p className="text-muted-foreground mt-1">
                Las propiedades m&aacute;s vistas y guardadas recientemente
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Property Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </div>
      </section>

      {/* BuyAbility Section */}
      <BuyAbilitySection />
    </main>
  );
}
