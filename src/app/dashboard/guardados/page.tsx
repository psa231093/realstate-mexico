"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Heart, Bed, Bath, Maximize, Trash2, MapPin } from "lucide-react";

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
  type: string;
}

interface Favorite {
  id: string;
  createdAt: string;
  Property: Property;
}

export default function SavedHomesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/favorites");
      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (propertyId: string) => {
    setRemovingId(propertyId);
    try {
      const response = await fetch(`/api/favorites?propertyId=${propertyId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFavorites((prev) =>
          prev.filter((f) => f.Property.id !== propertyId)
        );
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    } finally {
      setRemovingId(null);
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Propiedades Guardadas
        </h1>
        <p className="text-muted-foreground">
          {favorites.length} {favorites.length === 1 ? "propiedad guardada" : "propiedades guardadas"}
        </p>
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No tienes propiedades guardadas"
          description="Explora propiedades y guarda tus favoritas para verlas aqui"
          actionLabel="Explorar propiedades"
          actionHref="/propiedades"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favorites.map((favorite) => {
            const property = favorite.Property;
            return (
              <div
                key={favorite.id}
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
                    variant="destructive"
                    size="icon"
                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemove(property.id)}
                    disabled={removingId === property.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
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
            );
          })}
        </div>
      )}
    </div>
  );
}
