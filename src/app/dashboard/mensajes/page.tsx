"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { MessageSquare, Mail, Phone, Clock, ExternalLink } from "lucide-react";

interface Property {
  id: string;
  slug: string;
  title: string;
  mainImageUrl: string | null;
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
}

export default function MessagesPage() {
  const [receivedInquiries, setReceivedInquiries] = useState<Inquiry[]>([]);
  const [sentInquiries, setSentInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("received");

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const [receivedRes, sentRes] = await Promise.all([
        fetch("/api/inquiries?type=received"),
        fetch("/api/inquiries?type=sent"),
      ]);

      if (receivedRes.ok) {
        const data = await receivedRes.json();
        setReceivedInquiries(data);
      }

      if (sentRes.ok) {
        const data = await sentRes.json();
        setSentInquiries(data);
      }
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) {
      return date.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Ayer";
    } else if (diffDays < 7) {
      return `Hace ${diffDays} dias`;
    } else {
      return date.toLocaleDateString("es-MX", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NUEVO":
        return <Badge variant="default">Nuevo</Badge>;
      case "CONTACTADO":
        return <Badge variant="secondary">Contactado</Badge>;
      case "CERRADO":
        return <Badge variant="outline">Cerrado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const InquiryCard = ({ inquiry, type }: { inquiry: Inquiry; type: "received" | "sent" }) => (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex gap-4">
        {/* Property Image */}
        <Link
          href={`/propiedades/${inquiry.Property.slug}`}
          className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden"
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
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {getStatusBadge(inquiry.status)}
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(inquiry.createdAt)}
                </span>
              </div>
              <Link
                href={`/propiedades/${inquiry.Property.slug}`}
                className="font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
              >
                {inquiry.Property.title}
              </Link>
            </div>
            <Link
              href={`/propiedades/${inquiry.Property.slug}`}
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>

          {type === "received" && (
            <div className="mt-2">
              <p className="font-medium text-sm text-foreground">{inquiry.name}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <a
                  href={`mailto:${inquiry.email}`}
                  className="flex items-center gap-1 hover:text-primary"
                >
                  <Mail className="h-3 w-3" />
                  {inquiry.email}
                </a>
                {inquiry.phone && (
                  <a
                    href={`tel:${inquiry.phone}`}
                    className="flex items-center gap-1 hover:text-primary"
                  >
                    <Phone className="h-3 w-3" />
                    {inquiry.phone}
                  </a>
                )}
              </div>
            </div>
          )}

          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {inquiry.message}
          </p>

          {type === "received" && (
            <div className="mt-3 flex gap-2">
              <Button size="sm" asChild>
                <a href={`mailto:${inquiry.email}`}>Responder</a>
              </Button>
              {inquiry.phone && (
                <Button size="sm" variant="outline" asChild>
                  <a href={`tel:${inquiry.phone}`}>Llamar</a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-64" />
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
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mensajes</h1>
        <p className="text-muted-foreground">
          Administra las consultas sobre tus propiedades
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="received">
            Recibidos ({receivedInquiries.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Enviados ({sentInquiries.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-6">
          {receivedInquiries.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No tienes mensajes recibidos"
              description="Cuando alguien te contacte sobre tus propiedades, aparecera aqui"
              actionLabel="Publicar propiedad"
              actionHref="/venta"
            />
          ) : (
            <div className="space-y-4">
              {receivedInquiries.map((inquiry) => (
                <InquiryCard key={inquiry.id} inquiry={inquiry} type="received" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          {sentInquiries.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No has enviado mensajes"
              description="Cuando contactes a un vendedor, el mensaje aparecera aqui"
              actionLabel="Explorar propiedades"
              actionHref="/propiedades"
            />
          ) : (
            <div className="space-y-4">
              {sentInquiries.map((inquiry) => (
                <InquiryCard key={inquiry.id} inquiry={inquiry} type="sent" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
