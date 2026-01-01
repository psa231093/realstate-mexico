"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatMXN } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { addRecentlyViewed } from "@/lib/recently-viewed";
import { Button } from "@/components/ui/button";
import { PricePerM2Badge } from "@/components/property/PricePerM2Badge";
import {
  ArrowLeft,
  Heart,
  Share2,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Car,
  Building,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
  Copy,
  Check,
  Link as LinkIcon,
  MessageSquare,
  Loader2,
  Home,
} from "lucide-react";

interface PropertyData {
  id: string;
  slug: string;
  title: string;
  description?: string;
  type: string;
  status: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  areaTotal?: number;
  areaCovered?: number;
  yearBuilt?: number;
  address: string;
  colonia: string;
  municipality: string;
  state: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  amenities: string[];
  mainImageUrl?: string;
  images: string[];
  featured: boolean;
  owner?: {
    id: string;
    name?: string;
    phone?: string;
    email?: string;
    avatarUrl?: string;
    sellerType?: string;
  };
}

interface PropertyDetailClientProps {
  property: PropertyData;
}

const propertyTypeLabels: Record<string, string> = {
  CASA: "Casa",
  DEPARTAMENTO: "Departamento",
  TERRENO: "Terreno",
  LOCAL_COMERCIAL: "Local Comercial",
  OFICINA: "Oficina",
  BODEGA: "Bodega",
  RANCHO: "Rancho",
};

export function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const router = useRouter();
  const { user, signInWithGoogle } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageText, setMessageText] = useState(
    `Hola, me interesa la propiedad "${property.title}" en ${property.address}. ¿Podria darme mas informacion?`
  );
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);

  const propertyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/propiedades/${property.slug}`
    : "";

  // Track recently viewed property
  useEffect(() => {
    if (property.id && !property.id.startsWith("sample-")) {
      addRecentlyViewed(property.id);
    }
  }, [property.id]);

  // Check if property is favorited
  useEffect(() => {
    async function checkFavorite() {
      if (!user || property.id.startsWith("sample-")) return;
      try {
        const res = await fetch(`/api/favorites?propertyId=${property.id}`);
        if (res.ok) {
          const data = await res.json();
          setIsFavorite(data.isFavorite);
        }
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    }
    checkFavorite();
  }, [user, property.id]);

  const handleToggleFavorite = async () => {
    if (!user) {
      signInWithGoogle(window.location.pathname);
      return;
    }

    if (property.id.startsWith("sample-")) return;

    setIsSavingFavorite(true);
    try {
      const res = await fetch("/api/favorites", {
        method: isFavorite ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId: property.id }),
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsSavingFavorite(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: property.title,
          text: `${property.title} - ${formatMXN(property.price)}`,
          url: propertyUrl,
        });
        return;
      } catch (err) {
        // User cancelled or error, fall back to menu
      }
    }
    setShowShareMenu(!showShareMenu);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(propertyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`${property.title} - ${formatMXN(property.price)}\n${propertyUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
    setShowShareMenu(false);
  };

  const handleStartConversation = async () => {
    if (!user) {
      signInWithGoogle(window.location.pathname);
      return;
    }

    if (!messageText.trim()) {
      setMessageError("Por favor escribe un mensaje");
      return;
    }

    setIsSendingMessage(true);
    setMessageError(null);

    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          initialMessage: messageText.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Error al enviar mensaje");
      }

      router.push("/dashboard/mensajes");
    } catch (error) {
      console.error("Error starting conversation:", error);
      setMessageError(error instanceof Error ? error.message : "Error al enviar mensaje");
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Use multiple images or fallback
  const images = property.images.length > 0
    ? property.images
    : property.mainImageUrl
    ? [property.mainImageUrl]
    : ["https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800"];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/propiedades"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Volver a busqueda</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={handleToggleFavorite}
              disabled={isSavingFavorite}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
              <span className="hidden sm:inline">{isFavorite ? "Guardada" : "Guardar"}</span>
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Compartir</span>
              </Button>

              {showShareMenu && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-card rounded-lg shadow-lg border border-border py-2 z-20">
                  <button
                    onClick={copyToClipboard}
                    className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-accent flex items-center gap-3"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <LinkIcon className="h-4 w-4" />}
                    {copied ? "Copiado!" : "Copiar enlace"}
                  </button>
                  <button
                    onClick={shareToWhatsApp}
                    className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-accent flex items-center gap-3"
                  >
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative bg-muted">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-1 md:h-[500px]">
            {/* Main large image */}
            <div className="md:col-span-2 md:row-span-2 relative aspect-[4/3] md:aspect-auto">
              <Image
                src={images[0]}
                alt={property.title}
                fill
                className="object-cover"
                priority
              />
              {property.featured && (
                <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                  Destacada
                </span>
              )}
            </div>

            {/* Smaller images */}
            {images.slice(1, 5).map((img, index) => (
              <div key={index} className="relative hidden md:block aspect-video">
                <Image
                  src={img}
                  alt={`${property.title} - ${index + 2}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}

            {/* See all photos button */}
            {images.length > 1 && (
              <button
                onClick={() => setShowAllPhotos(true)}
                className="absolute bottom-4 right-4 bg-card px-4 py-2 rounded-lg shadow-md text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2 text-card-foreground"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Ver {images.length} fotos
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Price */}
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Home className="h-4 w-4" />
                <span>{propertyTypeLabels[property.type] || property.type}</span>
                <span>•</span>
                <span>{property.status === "VENTA" ? "En Venta" : "En Renta"}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                {property.title}
              </h1>
              <p className="text-muted-foreground flex items-center gap-1 mb-4">
                <MapPin className="h-4 w-4" />
                {property.address}
              </p>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl md:text-4xl font-bold text-foreground">
                  {formatMXN(property.price)}
                </p>
                {property.areaTotal && (
                  <PricePerM2Badge price={property.price} area={property.areaTotal} />
                )}
              </div>
            </div>

            {/* Key Stats */}
            <div className="flex flex-wrap items-center gap-6 py-6 border-y border-border">
              {property.bedrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-bold text-foreground">{property.bedrooms}</p>
                    <p className="text-sm text-muted-foreground">recamaras</p>
                  </div>
                </div>
              )}
              {property.bathrooms !== undefined && (
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-bold text-foreground">{property.bathrooms}</p>
                    <p className="text-sm text-muted-foreground">banos</p>
                  </div>
                </div>
              )}
              {property.areaTotal && (
                <div className="flex items-center gap-2">
                  <Maximize className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-bold text-foreground">{property.areaTotal}</p>
                    <p className="text-sm text-muted-foreground">m² totales</p>
                  </div>
                </div>
              )}
              {property.parkingSpaces !== undefined && (
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-xl font-bold text-foreground">{property.parkingSpaces}</p>
                    <p className="text-sm text-muted-foreground">estacionamientos</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Descripcion
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {property.description ||
                  `Hermosa propiedad ubicada en ${property.address}. Esta propiedad cuenta con ${property.bedrooms || 3} recamaras, ${property.bathrooms || 2} banos y ${property.areaTotal || 200} m² de construccion. Excelente ubicacion con facil acceso a servicios, escuelas y centros comerciales.`}
              </p>
            </div>

            {/* Property Details */}
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Detalles de la propiedad
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Building className="h-5 w-5" />
                  <span>Tipo: {propertyTypeLabels[property.type] || property.type}</span>
                </div>
                {property.yearBuilt && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar className="h-5 w-5" />
                    <span>Ano: {property.yearBuilt}</span>
                  </div>
                )}
                {property.areaCovered && (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Maximize className="h-5 w-5" />
                    <span>Construccion: {property.areaCovered} m²</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {property.amenities.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Caracteristicas
                </h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Location Map */}
            {property.latitude && property.longitude && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Ubicacion
                </h2>
                <div className="h-64 md:h-80 bg-muted rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${property.latitude},${property.longitude}&zoom=15`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Contact Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">
                Contactar al vendedor
              </h3>

              <div className="space-y-3">
                {/* WhatsApp Contact Button */}
                <Button
                  className="w-full py-6 text-base gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => {
                    const phone = property.owner?.phone?.replace(/\D/g, "") || "";
                    const message = encodeURIComponent(
                      `Hola, me interesa la propiedad "${property.title}" en ${property.address} con precio de ${formatMXN(property.price)}. ¿Podria darme mas informacion?`
                    );
                    const whatsappUrl = phone
                      ? `https://wa.me/52${phone}?text=${message}`
                      : `https://wa.me/?text=${message}`;
                    window.open(whatsappUrl, "_blank");
                  }}
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contactar por WhatsApp
                </Button>

                <Button
                  className="w-full py-6 text-base gap-2"
                  variant="default"
                  onClick={() => setShowMessageDialog(true)}
                >
                  <MessageSquare className="h-5 w-5" />
                  Enviar mensaje
                </Button>

                {property.owner?.phone && (
                  <Button
                    variant="outline"
                    className="w-full py-6 text-base gap-2"
                    onClick={() => window.open(`tel:${property.owner?.phone}`, "_self")}
                  >
                    <Phone className="h-4 w-4" />
                    Llamar
                  </Button>
                )}
              </div>

              {/* Owner Info */}
              {property.owner && (
                <div className="mt-6 pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                      {property.owner.avatarUrl ? (
                        <Image
                          src={property.owner.avatarUrl}
                          alt={property.owner.name || "Vendedor"}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-lg font-semibold text-muted-foreground">
                          {(property.owner.name || "V")[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-card-foreground">
                        {property.owner.name || "Vendedor"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {property.owner.sellerType === "INMOBILIARIA"
                          ? "Inmobiliaria"
                          : property.owner.sellerType === "CORREDOR"
                          ? "Corredor"
                          : "Propietario"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message Dialog */}
      {showMessageDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMessageDialog(false)}
          />
          <div className="relative bg-card rounded-xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowMessageDialog(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-semibold text-foreground mb-2">
              Enviar mensaje
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Contacta al vendedor de esta propiedad
            </p>

            {!user && (
              <div className="mb-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">
                  Inicia sesion para enviar mensajes
                </p>
                <Button
                  size="sm"
                  onClick={() => signInWithGoogle(window.location.pathname)}
                >
                  Iniciar sesion con Google
                </Button>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Tu mensaje
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="w-full border border-input bg-background text-foreground rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-ring focus:border-ring"
                rows={4}
                placeholder="Escribe tu mensaje aqui..."
                disabled={!user}
              />
              {messageError && (
                <p className="text-sm text-destructive mt-1">{messageError}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowMessageDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={handleStartConversation}
                disabled={!user || isSendingMessage}
              >
                {isSendingMessage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4" />
                    Enviar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Full Screen Gallery */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between p-4 text-white">
            <button
              onClick={() => setShowAllPhotos(false)}
              className="flex items-center gap-2 hover:text-gray-300"
            >
              <X className="h-6 w-6" />
              <span>Cerrar</span>
            </button>
            <span className="text-sm">
              {currentImageIndex + 1} / {images.length}
            </span>
          </div>

          <div className="flex-1 flex items-center justify-center relative px-16">
            <button
              onClick={prevImage}
              className="absolute left-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>

            <div className="relative w-full h-full max-w-5xl max-h-[80vh]">
              <Image
                src={images[currentImageIndex]}
                alt={`${property.title} - ${currentImageIndex + 1}`}
                fill
                className="object-contain"
              />
            </div>

            <button
              onClick={nextImage}
              className="absolute right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>

          <div className="p-4 flex justify-center gap-2 overflow-x-auto">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative w-20 h-16 rounded overflow-hidden flex-shrink-0 ${
                  index === currentImageIndex ? "ring-2 ring-white" : "opacity-50"
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
