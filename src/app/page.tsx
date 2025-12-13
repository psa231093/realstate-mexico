import { SearchHero } from "@/components/search/SearchHero";
import { PropertyCard } from "@/components/property/PropertyCard";
import { BuyAbilitySection } from "@/components/search/BuyAbilitySection";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Sample data - will be replaced with real data from database
const sampleProperties = [
  {
    id: "1",
    slug: "casa-polanco-cdmx",
    title: "Hermosa Casa en Polanco",
    price: 12500000,
    bedrooms: 4,
    bathrooms: 3.5,
    area: 350,
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    address: "Polanco, Miguel Hidalgo, Ciudad de México, 11560",
    status: "VENTA",
    badge: "Destacada",
  },
  {
    id: "2",
    slug: "departamento-condesa",
    title: "Departamento Moderno Condesa",
    price: 4500000,
    bedrooms: 2,
    bathrooms: 2,
    area: 120,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    address: "Condesa, Cuauhtémoc, Ciudad de México, 06140",
    status: "VENTA",
    badge: "Precio Rebajado: $4,500,000 (11/30)",
  },
  {
    id: "3",
    slug: "casa-santa-fe",
    title: "Casa en Santa Fe",
    price: 18900000,
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    address: "Santa Fe, Cuajimalpa, Ciudad de México, 05348",
    status: "VENTA",
    badge: "Chimenea Eléctrica",
  },
  {
    id: "4",
    slug: "casa-coyoacan",
    title: "Casa Colonial Coyoacán",
    price: 8750000,
    bedrooms: 3,
    bathrooms: 2.5,
    area: 280,
    imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    address: "Coyoacán, Ciudad de México, 04100",
    status: "VENTA",
    badge: "Casa Adosada",
  },
];

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <SearchHero />

      {/* Trending Properties Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Propiedades en Tendencia en Ciudad de México
              </h2>
              <p className="text-gray-600 mt-1">
                Vistas y guardadas más frecuentemente en las últimas 24 horas
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
            {sampleProperties.map((property) => (
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
