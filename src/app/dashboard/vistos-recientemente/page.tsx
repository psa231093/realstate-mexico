"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  getRecentlyViewed,
  removeRecentlyViewed,
  clearRecentlyViewed,
  RecentlyViewedItem,
} from "@/lib/recently-viewed";
import { Clock, Bed, Bath, Maximize, X, Trash2, MapPin } from "lucide-react";

interface Property {
  id: string;
  slug: string;
  title: string;
  price: number;
  bedrooms: number | null;
  bathrooms: number | null;
  areaTotal: number | null;
  mainImageUrl: string | null;
  colonia: string;
  municipality: string;
  state: string;
  status: string;
}

interface ViewedProperty extends Property {
  viewedAt: string;
}

export default function RecentlyViewedPage() {
  const [properties, setProperties] = useState<ViewedProperty[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecentlyViewed();
  }, []);

  const fetchRecentlyViewed = async () => {
    try {
      const viewed = getRecentlyViewed();

      if (viewed.length === 0) {
        setIsLoading(false);
        return;
      }

      // Fetch property details for all viewed IDs
      const propertyIds = viewed.map((v) => v.propertyId);
      const response = await fetch(
        `/api/properties?ids=${propertyIds.join(",")}`
      );

      if (response.ok) {
        const data = await response.json();
        const propertiesMap = new Map(
          data.properties?.map((p: Property) => [p.id, p]) || []
        );

        // Combine with viewed timestamps
        const viewedProperties = viewed
          .map((v: RecentlyViewedItem) => {
            const property = propertiesMap.get(v.propertyId) as Property | undefined;
            if (property) {
              return { ...property, viewedAt: v.viewedAt };
            }
            return null;
          })
          .filter(Boolean) as ViewedProperty[];

        setProperties(viewedProperties);
      }
    } catch (error) {
      console.error("Error fetching recently viewed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = (propertyId: string) => {
    removeRecentlyViewed(propertyId);
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  const handleClearAll = () => {
    if (confirm("¿Estas seguro de que deseas limpiar tu historial?")) {
      clearRecentlyViewed();
      setProperties([]);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `Hace ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} ${diffDays === 1 ? "dia" : "dias"}`;
    } else {
      return date.toLocaleDateString("es-MX", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Vistos Recientemente
          </h1>
          <p className="text-muted-foreground">
            {properties.length} {properties.length === 1 ? "propiedad vista" : "propiedades vistas"}
          </p>
        </div>
        {properties.length > 0 && (
          <Button variant="outline" onClick={handleClearAll}>
            <Trash2 className="h-4 w-4 mr-2" />
            Limpiar historial
          </Button>
        )}
      </div>

      {/* Content */}
      {properties.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No has visto propiedades recientemente"
          description="Las propiedades que visites apareceran aqui"
          actionLabel="Explorar propiedades"
          actionHref="/propiedades"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-card rounded-lg border border-border overflow-hidden group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3]">
                <Image
                  src={property.mainImageUrl || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2 py-1 bg-primary text-primary-foreground text-xs font-medium rounded">
                    {property.status}
                  </span>
                </div>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleRemove(property.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/60 text-white text-xs rounded flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(property.viewedAt)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <Link href={`/propiedades/${property.slug}`}>
                  <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                    {property.title}
                  </h3>
                </Link>

                <p className="text-lg font-bold text-primary mt-1">
                  {formatPrice(property.price)}
                </p>

                <div className="flex items-center gap-1 text-muted-foreground text-sm mt-2">
                  <MapPin className="h-4 w-4" />
                  <span className="line-clamp-1">
                    {property.colonia}, {property.municipality}
                  </span>
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                  {property.bedrooms && (
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>{property.bedrooms}</span>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms}</span>
                    </div>
                  )}
                  {property.areaTotal && (
                    <div className="flex items-center gap-1">
                      <Maximize className="h-4 w-4" />
                      <span>{property.areaTotal} m²</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
