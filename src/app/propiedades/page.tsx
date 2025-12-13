"use client";

import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyCardCompact } from "@/components/property/PropertyCardCompact";
import { PropertyDetailModal } from "@/components/property/PropertyDetailModal";
import { PropertyMap } from "@/components/map/PropertyMap";
import { FiltersSidebar } from "@/components/search/FiltersSidebar";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Map as MapIcon, ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

// Extended sample data with coordinates - in production, this would come from the database
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
    latitude: 19.4352,
    longitude: -99.1944,
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
    badge: "Precio Rebajado",
    latitude: 19.4111,
    longitude: -99.1747,
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
    latitude: 19.3664,
    longitude: -99.2618,
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
    latitude: 19.3467,
    longitude: -99.1617,
  },
  {
    id: "5",
    slug: "departamento-roma-norte",
    title: "Departamento Loft Roma Norte",
    price: 3800000,
    bedrooms: 1,
    bathrooms: 1,
    area: 85,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    address: "Roma Norte, Cuauhtémoc, Ciudad de México, 06700",
    status: "VENTA",
    latitude: 19.4195,
    longitude: -99.1619,
  },
  {
    id: "6",
    slug: "casa-san-angel",
    title: "Casa con Jardín San Ángel",
    price: 15200000,
    bedrooms: 4,
    bathrooms: 3,
    area: 400,
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    address: "San Ángel, Álvaro Obregón, Ciudad de México, 01000",
    status: "VENTA",
    badge: "Nueva",
    latitude: 19.3488,
    longitude: -99.1901,
  },
  {
    id: "7",
    slug: "departamento-del-valle",
    title: "Departamento Del Valle",
    price: 5600000,
    bedrooms: 3,
    bathrooms: 2,
    area: 145,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    address: "Del Valle, Benito Juárez, Ciudad de México, 03100",
    status: "VENTA",
    latitude: 19.3891,
    longitude: -99.1708,
  },
  {
    id: "8",
    slug: "casa-tlalpan",
    title: "Casa Amplia Tlalpan",
    price: 9800000,
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
    imageUrl: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800",
    address: "Tlalpan, Ciudad de México, 14000",
    status: "VENTA",
    latitude: 19.2866,
    longitude: -99.1669,
  },
];

export default function PropiedadesPage() {
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");
  const [sortBy, setSortBy] = useState("newest");
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<any>({
    priceMin: null,
    priceMax: null,
    bedrooms: [],
    bathrooms: [],
    types: [],
    state: null,
  });

  // Find selected property for modal
  const selectedProperty = selectedPropertyId
    ? sampleProperties.find((p) => p.id === selectedPropertyId)
    : null;

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const statusParam = searchParams.get("status");

  // Filter properties based on active filters
  const filteredProperties = useMemo(() => {
    return sampleProperties.filter((property) => {
      // Status filter from URL
      if (statusParam && property.status !== statusParam) return false;

      // Price filter
      if (filters.priceMin && property.price < filters.priceMin) return false;
      if (filters.priceMax && property.price > filters.priceMax) return false;

      // Bedrooms filter
      if (filters.bedrooms.length > 0 && property.bedrooms) {
        const hasMatch = filters.bedrooms.some((bed: number) => {
          if (bed === 5) return property.bedrooms >= 5;
          return property.bedrooms === bed;
        });
        if (!hasMatch) return false;
      }

      // Bathrooms filter
      if (filters.bathrooms.length > 0 && property.bathrooms) {
        const hasMatch = filters.bathrooms.some((bath: number) => {
          if (bath === 4) return property.bathrooms >= 4;
          return property.bathrooms >= bath && property.bathrooms < bath + 1;
        });
        if (!hasMatch) return false;
      }

      // State filter
      if (filters.state && !property.address.includes(filters.state)) {
        return false;
      }

      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          property.title.toLowerCase().includes(query) ||
          property.address.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [filters, searchQuery, statusParam]);

  // Get page title based on status
  const pageTitle = statusParam === "RENTA" ? "Propiedades en Renta" : "Propiedades en Venta";

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Top Bar with Filters Toggle */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900">
            {searchQuery ? `Resultados para "${searchQuery}"` : pageTitle}
          </h1>
          <span className="text-sm text-gray-500">
            {filteredProperties.length} propiedades
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 hidden sm:inline">Ordenar:</span>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <span className="text-sm">Más recientes</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 border border-gray-200 rounded-md p-1">
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

          {/* Filters Button (Mobile & Grid view) */}
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
        // Map View - Zillow Style
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
          <div className="w-[400px] bg-gray-50 border-l border-gray-200 flex flex-col overflow-hidden">
            {/* Sidebar Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <p className="text-sm font-medium text-gray-900">
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
                  <p className="text-gray-600 mb-2">No se encontraron propiedades</p>
                  <p className="text-sm text-gray-500">
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
                    <p className="text-lg text-gray-600 mb-2">
                      No se encontraron propiedades
                    </p>
                    <p className="text-sm text-gray-500">
                      Intenta ajustar tus filtros para ver más resultados
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

      {/* Filters Drawer - Works in map view (all screens) and grid view (mobile only) */}
      {showFilters && (
        <div className={`fixed inset-0 z-50 ${viewMode === "grid" ? "lg:hidden" : ""}`}>
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filtros</h2>
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
            <div className="sticky bottom-0 p-4 bg-white border-t border-gray-200">
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
