"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatMXN, cn } from "@/lib/utils";
import {
  Eye,
  EyeOff,
  Star,
  StarOff,
  Trash2,
  MoreVertical,
  CheckSquare,
  Square,
  Loader2,
  ExternalLink,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Owner {
  id: string;
  name: string | null;
  email: string;
}

interface Property {
  id: string;
  title: string;
  slug: string;
  type: string;
  status: string;
  price: number;
  active: boolean;
  featured: boolean;
  views: number;
  mainImageUrl: string | null;
  state: string;
  municipality: string;
  createdAt: string;
  Profile: Owner;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type BulkAction = "approve" | "reject" | "feature" | "unfeature" | "delete";

export default function AdminPropertiesPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") || "all";

  const [properties, setProperties] = useState<Property[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isBulkLoading, setIsBulkLoading] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<{ type: "single" | "bulk"; ids: string[] } | null>(null);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (typeFilter !== "all") {
        params.set("type", typeFilter);
      }
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const res = await fetch(`/api/admin/properties?${params}`);
      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, typeFilter, searchQuery]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Clear selection when filters change
  useEffect(() => {
    setSelectedIds(new Set());
  }, [statusFilter, typeFilter, searchQuery, currentPage]);

  const handleSelectAll = () => {
    if (selectedIds.size === properties.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(properties.map((p) => p.id)));
    }
  };

  const handleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSingleAction = async (id: string, action: "approve" | "reject" | "feature" | "unfeature") => {
    try {
      const updates: Record<string, boolean> = {};
      if (action === "approve") updates.active = true;
      if (action === "reject") updates.active = false;
      if (action === "feature") updates.featured = true;
      if (action === "unfeature") updates.featured = false;

      const res = await fetch(`/api/admin/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  const handleBulkAction = async (action: BulkAction) => {
    if (selectedIds.size === 0) return;

    if (action === "delete") {
      setDeleteTarget({ type: "bulk", ids: Array.from(selectedIds) });
      return;
    }

    setIsBulkLoading(true);
    try {
      const res = await fetch("/api/admin/properties/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          propertyIds: Array.from(selectedIds),
        }),
      });

      if (res.ok) {
        setSelectedIds(new Set());
        fetchProperties();
      }
    } catch (error) {
      console.error("Error in bulk action:", error);
    } finally {
      setIsBulkLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsBulkLoading(true);
    try {
      if (deleteTarget.type === "single") {
        await fetch(`/api/admin/properties/${deleteTarget.ids[0]}`, {
          method: "DELETE",
        });
      } else {
        await fetch("/api/admin/properties/bulk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "delete",
            propertyIds: deleteTarget.ids,
          }),
        });
      }

      setSelectedIds(new Set());
      fetchProperties();
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setIsBulkLoading(false);
      setDeleteTarget(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getTypeBadge = (type: string) => {
    const labels: Record<string, string> = {
      CASA: "Casa",
      DEPARTAMENTO: "Depto",
      TERRENO: "Terreno",
      LOCAL_COMERCIAL: "Local",
      OFICINA: "Oficina",
      BODEGA: "Bodega",
      RANCHO: "Rancho",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Propiedades</h1>
        <p className="text-muted-foreground">
          Modera y gestiona todas las propiedades de la plataforma
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por titulo o ubicacion..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Activos</SelectItem>
            <SelectItem value="inactive">Inactivos</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="CASA">Casa</SelectItem>
            <SelectItem value="DEPARTAMENTO">Departamento</SelectItem>
            <SelectItem value="TERRENO">Terreno</SelectItem>
            <SelectItem value="LOCAL_COMERCIAL">Local</SelectItem>
            <SelectItem value="OFICINA">Oficina</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bulk Actions Bar */}
      {selectedIds.size > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-foreground">
            {selectedIds.size} propiedad{selectedIds.size !== 1 ? "es" : ""} seleccionada{selectedIds.size !== 1 ? "s" : ""}
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("approve")}
              disabled={isBulkLoading}
            >
              <Eye className="h-4 w-4 mr-1" />
              Aprobar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("reject")}
              disabled={isBulkLoading}
            >
              <EyeOff className="h-4 w-4 mr-1" />
              Rechazar
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleBulkAction("feature")}
              disabled={isBulkLoading}
            >
              <Star className="h-4 w-4 mr-1" />
              Destacar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleBulkAction("delete")}
              disabled={isBulkLoading}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Eliminar
            </Button>
            {isBulkLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
        </div>
      )}

      {/* Properties Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground border-b border-border">
          <div className="col-span-1 flex items-center">
            <button onClick={handleSelectAll} className="p-1">
              {selectedIds.size === properties.length && properties.length > 0 ? (
                <CheckSquare className="h-5 w-5 text-primary" />
              ) : (
                <Square className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="col-span-4">Propiedad</div>
          <div className="col-span-2">Propietario</div>
          <div className="col-span-1">Estado</div>
          <div className="col-span-2">Precio</div>
          <div className="col-span-1">Vistas</div>
          <div className="col-span-1">Acciones</div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No se encontraron propiedades
          </div>
        ) : (
          <div className="divide-y divide-border">
            {properties.map((property) => (
              <div
                key={property.id}
                className={cn(
                  "grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors",
                  selectedIds.has(property.id) && "bg-primary/5"
                )}
              >
                {/* Checkbox */}
                <div className="hidden md:flex col-span-1 items-center">
                  <button onClick={() => handleSelect(property.id)} className="p-1">
                    {selectedIds.has(property.id) ? (
                      <CheckSquare className="h-5 w-5 text-primary" />
                    ) : (
                      <Square className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {/* Property Info */}
                <div className="md:col-span-4 flex items-center gap-3">
                  <div className="relative w-16 h-12 rounded overflow-hidden bg-muted flex-shrink-0">
                    <Image
                      src={property.mainImageUrl || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=100"}
                      alt={property.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {getTypeBadge(property.type)}
                      </Badge>
                      {property.featured && (
                        <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>
                    <p className="font-medium text-foreground truncate text-sm">
                      {property.title}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {property.municipality}, {property.state}
                    </p>
                  </div>
                </div>

                {/* Owner */}
                <div className="hidden md:block md:col-span-2">
                  <p className="text-sm text-foreground truncate">
                    {property.Profile?.name || "Sin nombre"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {property.Profile?.email}
                  </p>
                </div>

                {/* Status */}
                <div className="hidden md:block md:col-span-1">
                  {property.active ? (
                    <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                      Activo
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      Inactivo
                    </Badge>
                  )}
                </div>

                {/* Price */}
                <div className="hidden md:block md:col-span-2">
                  <p className="font-medium text-foreground">
                    {formatMXN(property.price)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(property.createdAt)}
                  </p>
                </div>

                {/* Views */}
                <div className="hidden md:block md:col-span-1">
                  <p className="text-sm text-muted-foreground">
                    {property.views.toLocaleString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="md:col-span-1 flex items-center justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/propiedades/${property.slug}`} target="_blank">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {property.active ? (
                        <DropdownMenuItem onClick={() => handleSingleAction(property.id, "reject")}>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Desactivar
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleSingleAction(property.id, "approve")}>
                          <Eye className="h-4 w-4 mr-2" />
                          Activar
                        </DropdownMenuItem>
                      )}
                      {property.featured ? (
                        <DropdownMenuItem onClick={() => handleSingleAction(property.id, "unfeature")}>
                          <StarOff className="h-4 w-4 mr-2" />
                          Quitar destacado
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleSingleAction(property.id, "feature")}>
                          <Star className="h-4 w-4 mr-2" />
                          Destacar
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteTarget({ type: "single", ids: [property.id] })}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile: Additional Info */}
                <div className="md:hidden flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleSelect(property.id)} className="p-1">
                      {selectedIds.has(property.id) ? (
                        <CheckSquare className="h-5 w-5 text-primary" />
                      ) : (
                        <Square className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    {property.active ? (
                      <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                        Activo
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Inactivo</Badge>
                    )}
                  </div>
                  <p className="font-medium">{formatMXN(property.price)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Pagina {pagination.page} de {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar propiedad{deleteTarget?.ids.length !== 1 ? "es" : ""}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. Se eliminara{deleteTarget?.ids.length !== 1 ? "n" : ""} permanentemente {deleteTarget?.ids.length} propiedad{deleteTarget?.ids.length !== 1 ? "es" : ""} y todos sus datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isBulkLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
