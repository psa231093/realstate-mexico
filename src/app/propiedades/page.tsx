"use client";

import { PropertyCard } from "@/components/property/PropertyCard";
import { PropertyCardCompact } from "@/components/property/PropertyCardCompact";
import { PropertyDetailModal } from "@/components/property/PropertyDetailModal";
import { PropertyMap } from "@/components/map/PropertyMap";
import { FiltersSidebar } from "@/components/search/FiltersSidebar";
import { PropertySearchBar, SearchFilters } from "@/components/search/PropertySearchBar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LayoutGrid, Map as MapIcon, ChevronDown, SlidersHorizontal, X, Loader2, Bookmark, Check } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
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
  images?: string[];
  address: string;
  status: string;
  badge?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  yearBuilt?: number;
  parkingSpaces?: number;
  floors?: number;
  amenities?: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
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

function PropiedadesPageContent() {
  const { user, signInWithGoogle } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"map" | "grid">("map");
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchBarFilters, setSearchBarFilters] = useState<SearchFilters | null>(null);

  // Save search state
  const [showSaveSearchDialog, setShowSaveSearchDialog] = useState(false);
  const [saveSearchName, setSaveSearchName] = useState("");
  const [isSavingSearch, setIsSavingSearch] = useState(false);
  const [searchSaved, setSearchSaved] = useState(false);

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

  // Handle search bar filter changes
  const handleSearchBarFiltersChange = useCallback((newFilters: SearchFilters) => {
    setSearchBarFilters(newFilters);
  }, []);

  // Handle saving search
  const handleSaveSearch = async () => {
    if (!user) {
      signInWithGoogle(window.location.pathname + window.location.search);
      return;
    }

    if (!saveSearchName.trim()) return;

    setIsSavingSearch(true);
    try {
      const criteria = {
        status: statusParam || "VENTA",
        ...(searchBarFilters?.location && { location: searchBarFilters.location }),
        ...(searchBarFilters?.priceMin && { minPrice: searchBarFilters.priceMin }),
        ...(searchBarFilters?.priceMax && { maxPrice: searchBarFilters.priceMax }),
        ...(searchBarFilters?.bedrooms && { minBedrooms: searchBarFilters.bedrooms }),
        ...(filters.priceMin && { minPrice: filters.priceMin }),
        ...(filters.priceMax && { maxPrice: filters.priceMax }),
        ...(filters.bedrooms.length > 0 && { bedrooms: filters.bedrooms }),
        ...(filters.types.length > 0 && { type: filters.types }),
        ...(filters.state && { state: filters.state }),
      };

      const response = await fetch("/api/saved-searches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: saveSearchName.trim(),
          criteria,
        }),
      });

      if (response.ok) {
        setSearchSaved(true);
        setTimeout(() => {
          setShowSaveSearchDialog(false);
          setSaveSearchName("");
          setSearchSaved(false);
        }, 1500);
      } else {
        const data = await response.json();
        alert(data.error || "Error al guardar la busqueda");
      }
    } catch (error) {
      console.error("Error saving search:", error);
      alert("Error al guardar la busqueda");
    } finally {
      setIsSavingSearch(false);
    }
  };

  // Check if there are any active filters
  const hasActiveFilters = useMemo(() => {
    return !!(
      searchBarFilters?.location ||
      searchBarFilters?.priceMin ||
      searchBarFilters?.priceMax ||
      searchBarFilters?.bedrooms ||
      filters.priceMin ||
      filters.priceMax ||
      filters.bedrooms.length > 0 ||
      filters.types.length > 0 ||
      filters.state
    );
  }, [searchBarFilters, filters]);


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
            imageUrl: p.mainImageUrl || p.PropertyImage?.[0]?.url || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
            images: p.PropertyImage?.sort((a: any, b: any) => a.order - b.order).map((img: any) => img.url) || [],
            address: `${p.colonia}, ${p.municipality}, ${p.state}`,
            status: p.status,
            badge: p.featured ? "Destacada" : undefined,
            latitude: p.latitude ? Number(p.latitude) : undefined,
            longitude: p.longitude ? Number(p.longitude) : undefined,
            description: p.description || undefined,
            yearBuilt: p.yearBuilt || undefined,
            parkingSpaces: p.parkingSpaces || undefined,
            amenities: p.amenities || undefined,
            contactName: p.Profile?.name || undefined,
            contactEmail: p.Profile?.email || undefined,
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

  // Filter properties based on active filters (combining sidebar and search bar)
  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      // Search bar price filter (takes priority)
      const effectivePriceMin = searchBarFilters?.priceMin ?? filters.priceMin;
      const effectivePriceMax = searchBarFilters?.priceMax ?? filters.priceMax;

      if (effectivePriceMin && property.price < effectivePriceMin) return false;
      if (effectivePriceMax && property.price > effectivePriceMax) return false;

      // Search bar bedrooms filter
      if (searchBarFilters?.bedrooms && property.bedrooms) {
        if (property.bedrooms < searchBarFilters.bedrooms) return false;
      } else if (filters.bedrooms.length > 0 && property.bedrooms) {
        const hasMatch = filters.bedrooms.some((bed: number) => {
          if (bed === 5) return property.bedrooms! >= 5;
          return property.bedrooms === bed;
        });
        if (!hasMatch) return false;
      }

      // Search bar bathrooms filter
      if (searchBarFilters?.bathrooms && property.bathrooms) {
        if (property.bathrooms < searchBarFilters.bathrooms) return false;
      } else if (filters.bathrooms.length > 0 && property.bathrooms) {
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

      // Location filter from search bar
      if (searchBarFilters?.location) {
        const locationLower = searchBarFilters.location.toLowerCase();
        if (!property.address.toLowerCase().includes(locationLower) &&
            !property.title.toLowerCase().includes(locationLower)) {
          return false;
        }
      }

      return true;
    });
  }, [properties, filters, searchBarFilters]);

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
      {/* Search Bar */}
      <PropertySearchBar
        initialStatus={statusParam === "RENTA" ? "RENTA" : "VENTA"}
        onFiltersChange={handleSearchBarFiltersChange}
      />

      {/* Secondary Bar with View Toggle and Results Count */}
      <div className="bg-card border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            {filteredProperties.length} propiedades encontradas
          </span>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 hidden sm:flex"
              onClick={() => setShowSaveSearchDialog(true)}
            >
              <Bookmark className="h-4 w-4" />
              Guardar busqueda
            </Button>
          )}
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
              <span className="text-sm">Mas recientes</span>
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

          {/* Filters Button (Mobile) */}
          <Button
            variant="outline"
            size="sm"
            className="gap-1 lg:hidden"
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

      {/* Save Search Dialog */}
      <Dialog open={showSaveSearchDialog} onOpenChange={setShowSaveSearchDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Guardar busqueda</DialogTitle>
            <DialogDescription>
              Guarda esta busqueda para acceder rapidamente a ella y recibir alertas de nuevas propiedades.
            </DialogDescription>
          </DialogHeader>

          {searchSaved ? (
            <div className="flex flex-col items-center py-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-foreground font-medium">Busqueda guardada</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label htmlFor="search-name" className="text-sm font-medium text-foreground">
                    Nombre de la busqueda
                  </label>
                  <input
                    id="search-name"
                    type="text"
                    placeholder="Ej: Casas en Polanco menos de 5M"
                    value={saveSearchName}
                    onChange={(e) => setSaveSearchName(e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />
                </div>

                {/* Show current filters summary */}
                <div className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
                  <p className="font-medium mb-1">Filtros actuales:</p>
                  <ul className="space-y-1">
                    <li>Estado: {statusParam === "RENTA" ? "En renta" : "En venta"}</li>
                    {searchBarFilters?.location && <li>Ubicacion: {searchBarFilters.location}</li>}
                    {(searchBarFilters?.priceMin || filters.priceMin) && (
                      <li>Precio minimo: ${((searchBarFilters?.priceMin || filters.priceMin || 0) / 1000000).toFixed(1)}M</li>
                    )}
                    {(searchBarFilters?.priceMax || filters.priceMax) && (
                      <li>Precio maximo: ${((searchBarFilters?.priceMax || filters.priceMax || 0) / 1000000).toFixed(1)}M</li>
                    )}
                    {(searchBarFilters?.bedrooms || filters.bedrooms.length > 0) && (
                      <li>Recamaras: {searchBarFilters?.bedrooms || filters.bedrooms.join(", ")}+</li>
                    )}
                    {filters.types.length > 0 && <li>Tipos: {filters.types.join(", ")}</li>}
                    {filters.state && <li>Estado: {filters.state}</li>}
                  </ul>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowSaveSearchDialog(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveSearch}
                  disabled={!saveSearchName.trim() || isSavingSearch}
                >
                  {isSavingSearch ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Guardar
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function PropiedadesPage() {
  return (
    <Suspense fallback={
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando propiedades...</p>
        </div>
      </div>
    }>
      <PropiedadesPageContent />
    </Suspense>
  );
}
