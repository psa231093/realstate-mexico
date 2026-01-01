"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Search, Trash2, Play, Bell } from "lucide-react";

interface SavedSearch {
  id: string;
  name: string;
  criteria: {
    type?: string[];
    status?: string;
    state?: string;
    municipality?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
    maxBedrooms?: number;
  };
  alertsEnabled?: boolean;
  createdAt: string;
}

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSearches();
  }, []);

  const fetchSearches = async () => {
    try {
      const response = await fetch("/api/saved-searches");
      if (response.ok) {
        const data = await response.json();
        setSearches(data);
      }
    } catch (error) {
      console.error("Error fetching saved searches:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (searchId: string) => {
    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSearches((prev) => prev.filter((s) => s.id !== searchId));
      }
    } catch (error) {
      console.error("Error deleting search:", error);
    }
  };

  const handleToggleAlerts = async (searchId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alertsEnabled: enabled }),
      });
      if (response.ok) {
        setSearches((prev) =>
          prev.map((s) =>
            s.id === searchId ? { ...s, alertsEnabled: enabled } : s
          )
        );
      }
    } catch (error) {
      console.error("Error updating search:", error);
    }
  };

  const formatCriteria = (criteria: SavedSearch["criteria"]) => {
    const parts: string[] = [];

    if (criteria.type?.length) {
      parts.push(criteria.type.join(", "));
    }
    if (criteria.status) {
      parts.push(criteria.status === "VENTA" ? "En venta" : "En renta");
    }
    if (criteria.state) {
      parts.push(criteria.state);
    }
    if (criteria.minPrice || criteria.maxPrice) {
      const min = criteria.minPrice
        ? `$${(criteria.minPrice / 1000000).toFixed(1)}M`
        : "";
      const max = criteria.maxPrice
        ? `$${(criteria.maxPrice / 1000000).toFixed(1)}M`
        : "";
      parts.push(`${min} - ${max}`.trim());
    }
    if (criteria.minBedrooms) {
      parts.push(`${criteria.minBedrooms}+ recamaras`);
    }

    return parts.length > 0 ? parts.join(" • ") : "Sin filtros especificos";
  };

  const buildSearchUrl = (criteria: SavedSearch["criteria"]) => {
    const params = new URLSearchParams();
    if (criteria.type?.length) params.set("type", criteria.type.join(","));
    if (criteria.status) params.set("status", criteria.status);
    if (criteria.state) params.set("state", criteria.state);
    if (criteria.municipality) params.set("municipality", criteria.municipality);
    if (criteria.minPrice) params.set("minPrice", criteria.minPrice.toString());
    if (criteria.maxPrice) params.set("maxPrice", criteria.maxPrice.toString());
    if (criteria.minBedrooms) params.set("minBedrooms", criteria.minBedrooms.toString());
    return `/propiedades?${params.toString()}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
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
          Busquedas Guardadas
        </h1>
        <p className="text-muted-foreground">
          {searches.length} {searches.length === 1 ? "busqueda guardada" : "busquedas guardadas"}
        </p>
      </div>

      {/* Content */}
      {searches.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No tienes busquedas guardadas"
          description="Guarda tus busquedas para recibir alertas cuando haya nuevas propiedades"
          actionLabel="Buscar propiedades"
          actionHref="/propiedades"
        />
      ) : (
        <div className="space-y-4">
          {searches.map((search) => (
            <div
              key={search.id}
              className="bg-card rounded-lg border border-border p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">
                    {search.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatCriteria(search.criteria)}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Alert Toggle */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      checked={search.alertsEnabled || false}
                      onCheckedChange={(checked) =>
                        handleToggleAlerts(search.id, checked)
                      }
                    />
                  </div>

                  {/* Run Search */}
                  <Button variant="outline" size="sm" asChild>
                    <Link href={buildSearchUrl(search.criteria)}>
                      <Play className="h-4 w-4 mr-1" />
                      Buscar
                    </Link>
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(search.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
