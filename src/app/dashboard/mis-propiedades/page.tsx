"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/dashboard/EmptyState";
import {
  Home,
  Eye,
  Bed,
  Bath,
  Maximize,
  MapPin,
  MoreVertical,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  active: boolean;
  views: number;
  createdAt: string;
}

export default function MyPropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      const response = await fetch(`/api/properties?ownerId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data.properties || []);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (propertyId: string, currentActive: boolean) => {
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      });
      if (response.ok) {
        setProperties((prev) =>
          prev.map((p) =>
            p.id === propertyId ? { ...p, active: !currentActive } : p
          )
        );
      }
    } catch (error) {
      console.error("Error toggling property:", error);
    }
  };

  const handleDelete = async (propertyId: string) => {
    if (!confirm("¿Estas seguro de que deseas eliminar esta propiedad?")) {
      return;
    }
    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProperties((prev) => prev.filter((p) => p.id !== propertyId));
      }
    } catch (error) {
      console.error("Error deleting property:", error);
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
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
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
          <h1 className="text-2xl font-bold text-foreground">Mis Propiedades</h1>
          <p className="text-muted-foreground">
            {properties.length} {properties.length === 1 ? "propiedad publicada" : "propiedades publicadas"}
          </p>
        </div>
        <Button asChild>
          <Link href="/venta">
            <Home className="h-4 w-4 mr-2" />
            Publicar Propiedad
          </Link>
        </Button>
      </div>

      {/* Content */}
      {properties.length === 0 ? (
        <EmptyState
          icon={Home}
          title="No tienes propiedades publicadas"
          description="Publica tu primera propiedad y llega a miles de compradores"
          actionLabel="Publicar propiedad"
          actionHref="/venta"
        />
      ) : (
        <div className="space-y-4">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-card rounded-lg border border-border overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="relative w-full md:w-48 h-40 md:h-auto flex-shrink-0">
                  <Image
                    src={property.mainImageUrl || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                  {!property.active && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-medium">Inactiva</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={property.active ? "default" : "secondary"}>
                          {property.status}
                        </Badge>
                        <Badge variant="outline">{property.type}</Badge>
                      </div>

                      <Link href={`/propiedades/${property.slug}`}>
                        <h3 className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1">
                          {property.title}
                        </h3>
                      </Link>

                      <p className="text-lg font-bold text-primary">
                        {formatPrice(property.price)}
                      </p>

                      <div className="flex items-center gap-1 text-muted-foreground text-sm mt-1">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">
                          {property.colonia}, {property.municipality}, {property.state}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        {property.bedrooms && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{property.bedrooms} rec</span>
                          </div>
                        )}
                        {property.bathrooms && (
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{property.bathrooms} ban</span>
                          </div>
                        )}
                        {property.areaTotal && (
                          <div className="flex items-center gap-1">
                            <Maximize className="h-4 w-4" />
                            <span>{property.areaTotal} m²</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{property.views} vistas</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        Publicada el {formatDate(property.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/venta/editar/${property.id}`}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleActive(property.id, property.active)}
                        >
                          {property.active ? (
                            <>
                              <ToggleLeft className="h-4 w-4 mr-2" />
                              Desactivar
                            </>
                          ) : (
                            <>
                              <ToggleRight className="h-4 w-4 mr-2" />
                              Activar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(property.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
