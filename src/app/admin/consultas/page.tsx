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
  Search,
  ExternalLink,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  User,
} from "lucide-react";

interface Property {
  id: string;
  title: string;
  slug: string;
  mainImageUrl: string | null;
}

interface Sender {
  id: string;
  name: string | null;
  email: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
  Property: Property;
  Sender: Sender | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminInquiriesPage() {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get("filter") === "pending" ? "NUEVO" : "all";

  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialFilter);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const fetchInquiries = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });

      if (statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      if (searchQuery) {
        params.set("search", searchQuery);
      }

      const res = await fetch(`/api/admin/inquiries?${params}`);
      if (res.ok) {
        const data = await res.json();
        setInquiries(data.inquiries);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, statusFilter, searchQuery]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) {
      return `Hoy ${date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`;
    } else if (diffDays === 1) {
      return "Ayer";
    } else if (diffDays < 7) {
      return `Hace ${diffDays} dias`;
    } else {
      return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NUEVO":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Nuevo
          </Badge>
        );
      case "CONTACTADO":
        return (
          <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Contactado
          </Badge>
        );
      case "CERRADO":
        return (
          <Badge variant="secondary">
            <XCircle className="h-3 w-3 mr-1" />
            Cerrado
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Consultas</h1>
        <p className="text-muted-foreground">
          Visualiza todas las consultas enviadas en la plataforma
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o mensaje..."
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
            <SelectItem value="NUEVO">Nuevos</SelectItem>
            <SelectItem value="CONTACTADO">Contactados</SelectItem>
            <SelectItem value="CERRADO">Cerrados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inquiries List */}
      <div className="space-y-4">
        {isLoading ? (
          [1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))
        ) : inquiries.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-8 text-center text-muted-foreground">
            No se encontraron consultas
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-card rounded-lg border border-border p-4 hover:border-border/80 transition-colors"
            >
              <div className="flex flex-col md:flex-row gap-4">
                {/* Property Thumbnail */}
                <Link
                  href={`/propiedades/${inquiry.Property.slug}`}
                  target="_blank"
                  className="relative w-full md:w-24 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted"
                >
                  <Image
                    src={inquiry.Property.mainImageUrl || "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200"}
                    alt={inquiry.Property.title}
                    fill
                    className="object-cover"
                  />
                </Link>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusBadge(inquiry.status)}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(inquiry.createdAt)}
                        </span>
                      </div>
                      <Link
                        href={`/propiedades/${inquiry.Property.slug}`}
                        target="_blank"
                        className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {inquiry.Property.title}
                      </Link>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/propiedades/${inquiry.Property.slug}`} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  {/* Sender Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm mb-3">
                    <div className="flex items-center gap-1 text-foreground">
                      <User className="h-4 w-4 text-muted-foreground" />
                      {inquiry.name}
                      {inquiry.Sender && (
                        <Badge variant="outline" className="ml-1 text-xs">
                          Registrado
                        </Badge>
                      )}
                    </div>
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {inquiry.email}
                    </a>
                    {inquiry.phone && (
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {inquiry.phone}
                      </a>
                    )}
                  </div>

                  {/* Message */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {inquiry.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
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
  );
}
