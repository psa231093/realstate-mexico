"use client";

import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyCardCompact } from "@/components/property/PropertyCardCompact";
import { PropertyDetailModal } from "@/components/property/PropertyDetailModal";
import { PropertyMap } from "@/components/map/PropertyMap";
import { FiltersSidebar } from "@/components/search/FiltersSidebar";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Map as MapIcon, ChevronDown, SlidersHorizontal, X, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Property {
  id: string;
  slug: string;
  title: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  imageUrl: string;
  address: string;
  status: string;
  badge?: string;
  latitude?: number;
  longitude?: number;
}

// Fallback sample data for when database is empty or API fails
const fallbackProperties: Property[] = [
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
    latitude: 19.4352,
    longitude: -99.1944,
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
    latitude: 19.4111,
    longitude: -99.1747,
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
    latitude: 19.3664,
    longitude: -99.2618,
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
    latitude: 19.3467,
    longitude: -99.1617,
  },
];

export default function PropiedadesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    priceMin: number | null;
    priceMax: number | null;
    bedrooms: number[];
    bathrooms: number[];
    types: string[];
    state: string | null;
  }>({
    priceMin: null,
    priceMax: null,
    bedrooms: [],
    bathrooms: [],
    types: [],
    state: null,
  });

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const statusParam = searchParams.get("status");

  // Fetch properties from API
  useEffect(() => {
    async function fetchProperties() {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("limit", "50");

        if (statusParam) {
          params.set("status", statusParam);
        }
        if (searchQuery) {
          params.set("search", searchQuery);
        }

        const response = await fetch(`/api/properties?${params.toString()}`);

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();

        if (data.properties && data.properties.length > 0) {
          const mappedProperties: Property[] = data.properties.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            price: Number(p.price),
            bedrooms: p.bedrooms || undefined,
            bathrooms: p.bathrooms ? Number(p.bathrooms) : undefined,
            area: p.areaTotal ? Number(p.areaTotal) : undefined,
            imageUrl: p.mainImageUrl || p.images?.[0]?.url || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
            address: `${p.colonia}, ${p.municipality}, ${p.state}`,
            status: p.status,
            badge: p.featured ? "Destacada" : undefined,
            latitude: p.latitude ? Number(p.latitude) : undefined,
            longitude: p.longitude ? Number(p.longitude) : undefined,
          }));
          setProperties(mappedProperties);
        } else {
          setProperties(fallbackProperties);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
        setProperties(fallbackProperties);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProperties();
  }, [searchQuery, statusParam]);

  // Find selected property for modal
  const selectedProperty = selectedPropertyId
    ? properties.find((p) => p.id === selectedPropertyId)
    : null;

  // Filter properties based on active filters
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Price filter
      if (filters.priceMin && property.price < filters.priceMin) return false;
      if (filters.priceMax && property.price > filters.priceMax) return false;

      // Bedrooms filter
      if (filters.bedrooms.length > 0 && property.bedrooms) {
        const hasMatch = filters.bedrooms.some((bed: number) => {
          if (bed === 5) return property.bedrooms! >= 5;
          return property.bedrooms === bed;
        });
        if (!hasMatch) return false;
      }

      // Bathrooms filter
      if (filters.bathrooms.length > 0 && property.bathrooms) {
        const hasMatch = filters.bathrooms.some((bath: number) => {
          if (bath === 4) return property.bathrooms! >= 4;
          return property.bathrooms! >= bath && property.bathrooms! < bath + 1;
        });
        if (!hasMatch) return false;
      }

      // State filter
      if (filters.state && !property.address.includes(filters.state)) {
        return false;
      }

      return true;
    });
  }, [properties, filters]);

  // Get page title based on status
  const pageTitle = statusParam === "RENTA" ? "Propiedades en Renta" : "Propiedades en Venta";

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col bg-background">
      {/* Top Bar with Filters Toggle */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-foreground">
            {searchQuery ? `Resultados para "${searchQuery}"` : pageTitle}
          </h1>
          <span className="text-sm text-muted-foreground">
            {filteredProperties.length} propiedades
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground hidden sm:inline">Ordenar:</span>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <span className="text-sm">M&aacute;s recientes</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border border-border rounded-md p-1">
            <Button
              variant={viewMode === "map" ? "secondary" : "ghost"}
              size="sm"
              className="gap-1 h-8"
              onClick={() => setViewMode("map")}
            >
              <MapIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Mapa</span>
            </Button>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              className="gap-1 h-8"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </Button>
          </div>

          {/* Filters Button */}
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filtros</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      {viewMode === "map" ? (
        // Map View
        <div className="flex-1 flex overflow-hidden">
          {/* Map Section */}
          <div className="flex-1 relative">
            <PropertyMap
              properties={filteredProperties}
              onPropertyHover={setHoveredPropertyId}
              hoveredPropertyId={hoveredPropertyId}
            />
          </div>

          {/* Properties Sidebar */}
          <div className="w-[400px] bg-muted/50 border-l border-border flex flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-4 bg-card border-b border-border">
              <p className="text-sm font-medium text-foreground">
                {filteredProperties.length} resultados
              </p>
            </div>

            {/* Property List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <PropertyCardCompact
                    key={property.id}
                    {...property}
                    isHovered={hoveredPropertyId === property.id}
                    onMouseEnter={() => setHoveredPropertyId(property.id)}
                    onMouseLeave={() => setHoveredPropertyId(null)}
                    onClick={() => setSelectedPropertyId(property.id)}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-2">No se encontraron propiedades</p>
                  <p className="text-sm text-muted-foreground/70">
                    Intenta ajustar tus filtros
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Grid View
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            <div className="grid lg:grid-cols-[280px,1fr] gap-6">
              {/* Filters Sidebar (Desktop) */}
              <aside className="hidden lg:block">
                <FiltersSidebar onFiltersChange={setFilters} />
              </aside>

              {/* Property Grid */}
              <main>
                {filteredProperties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        {...property}
                        onClick={() => setSelectedPropertyId(property.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground mb-2">
                      No se encontraron propiedades
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Intenta ajustar tus filtros para ver m&aacute;s resultados
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {filteredProperties.length > 0 && (
                  <div className="mt-8 flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Anterior
                    </Button>
                    <Button variant="default" size="sm">
                      1
                    </Button>
                    <Button variant="outline" size="sm">
                      2
                    </Button>
                    <Button variant="outline" size="sm">
                      3
                    </Button>
                    <Button variant="outline" size="sm">
                      Siguiente
                    </Button>
                  </div>
                )}
              </main>
            </div>
          </div>
        </div>
      )}

      {/* Filters Drawer */}
      {showFilters && (
        <div className={`fixed inset-0 z-50 ${viewMode === "grid" ? "lg:hidden" : ""}`}>
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-card shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-4">
              <FiltersSidebar onFiltersChange={(newFilters) => {
                setFilters(newFilters);
              }} />
            </div>
            {/* Apply Button for Drawer */}
            <div className="sticky bottom-0 p-4 bg-card border-t border-border">
              <Button
                className="w-full"
                onClick={() => setShowFilters(false)}
              >
                Ver {filteredProperties.length} propiedades
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedPropertyId(null)}
        />
      )}
    </div>
  );
}
