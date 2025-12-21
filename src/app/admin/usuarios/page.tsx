"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Search,
  MoreVertical,
  Shield,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";

interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  avatarUrl: string | null;
  sellerType: string | null;
  createdAt: string;
  propertyCount: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Role change dialog
  const [roleChangeTarget, setRoleChangeTarget] = useState<{
    user: UserProfile;
    newRole: string;
  } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (roleFilter !== "all") {
        params.set("role", roleFilter);
      }
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, roleFilter, searchQuery]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async () => {
    if (!roleChangeTarget) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${roleChangeTarget.user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: roleChangeTarget.newRole }),
      });

      if (res.ok) {
        fetchUsers();
      } else {
        const data = await res.json();
        alert(data.error || "Error al actualizar usuario");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setIsUpdating(false);
      setRoleChangeTarget(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge className="bg-red-500/10 text-red-600 border-red-500/20">
            <Shield className="h-3 w-3 mr-1" />
            Admin
          </Badge>
        );
      case "AGENT":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <Building2 className="h-3 w-3 mr-1" />
            Agente
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <User className="h-3 w-3 mr-1" />
            Usuario
          </Badge>
        );
    }
  };

  const getSellerTypeBadge = (sellerType: string | null) => {
    if (!sellerType) return null;
    const labels: Record<string, string> = {
      PARTICULAR: "Particular",
      INMOBILIARIA: "Inmobiliaria",
      CORREDOR: "Corredor",
    };
    return (
      <Badge variant="outline" className="text-xs">
        {labels[sellerType] || sellerType}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
        <p className="text-muted-foreground">
          Gestiona los usuarios y sus roles en la plataforma
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground"
          />
        </div>
        <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="USER">Usuarios</SelectItem>
            <SelectItem value="AGENT">Agentes</SelectItem>
            <SelectItem value="ADMIN">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Users Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        {/* Table Header */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-muted/50 text-sm font-medium text-muted-foreground border-b border-border">
          <div className="col-span-4">Usuario</div>
          <div className="col-span-2">Rol</div>
          <div className="col-span-2">Tipo Vendedor</div>
          <div className="col-span-2">Propiedades</div>
          <div className="col-span-1">Registro</div>
          <div className="col-span-1">Acciones</div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No se encontraron usuarios
          </div>
        ) : (
          <div className="divide-y divide-border">
            {users.map((user) => (
              <div
                key={user.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-muted/30 transition-colors"
              >
                {/* User Info */}
                <div className="md:col-span-4 flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatarUrl || undefined} />
                    <AvatarFallback>
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {user.name || "Sin nombre"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Role */}
                <div className="hidden md:block md:col-span-2">
                  {getRoleBadge(user.role)}
                </div>

                {/* Seller Type */}
                <div className="hidden md:block md:col-span-2">
                  {getSellerTypeBadge(user.sellerType) || (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </div>

                {/* Property Count */}
                <div className="hidden md:block md:col-span-2">
                  <span className="text-sm text-foreground">
                    {user.propertyCount} propiedad{user.propertyCount !== 1 ? "es" : ""}
                  </span>
                </div>

                {/* Created At */}
                <div className="hidden md:block md:col-span-1">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(user.createdAt)}
                  </span>
                </div>

                {/* Actions */}
                <div className="md:col-span-1 flex items-center justify-end">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem disabled className="text-xs text-muted-foreground">
                        Cambiar rol a:
                      </DropdownMenuItem>
                      {user.role !== "USER" && (
                        <DropdownMenuItem
                          onClick={() => setRoleChangeTarget({ user, newRole: "USER" })}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Usuario
                        </DropdownMenuItem>
                      )}
                      {user.role !== "AGENT" && (
                        <DropdownMenuItem
                          onClick={() => setRoleChangeTarget({ user, newRole: "AGENT" })}
                        >
                          <Building2 className="h-4 w-4 mr-2" />
                          Agente
                        </DropdownMenuItem>
                      )}
                      {user.role !== "ADMIN" && (
                        <DropdownMenuItem
                          onClick={() => setRoleChangeTarget({ user, newRole: "ADMIN" })}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Admin
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile: Additional Info */}
                <div className="md:hidden flex items-center justify-between text-sm">
                  {getRoleBadge(user.role)}
                  <span className="text-muted-foreground">
                    {user.propertyCount} propiedades
                  </span>
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

      {/* Role Change Confirmation Dialog */}
      <AlertDialog open={!!roleChangeTarget} onOpenChange={() => setRoleChangeTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cambiar rol de usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Estas a punto de cambiar el rol de <strong>{roleChangeTarget?.user.name || roleChangeTarget?.user.email}</strong> de{" "}
              <strong>{roleChangeTarget?.user.role}</strong> a <strong>{roleChangeTarget?.newRole}</strong>.
              {roleChangeTarget?.newRole === "ADMIN" && (
                <span className="block mt-2 text-yellow-600">
                  Los administradores tienen acceso completo a la plataforma.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRoleChange} disabled={isUpdating}>
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirmar cambio
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
