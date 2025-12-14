"use client";

import { useState } from "react";
import Image from "next/image";
import { formatMXN } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Heart,
  Share2,
  MoreHorizontal,
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
  Link,
} from "lucide-react";

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
  latitude: number;
  longitude: number;
  description?: string;
  yearBuilt?: number;
  parkingSpaces?: number;
  floors?: number;
  amenities?: string[];
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
}

export function PropertyDetailModal({ property, onClose }: PropertyDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const propertyUrl = typeof window !== "undefined"
    ? `${window.location.origin}/propiedad/${property.slug}`
    : "";

  const handleShare = async () => {
    // Try native share API first (mobile)
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
    // Show share menu on desktop
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

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(propertyUrl)}`, "_blank");
    setShowShareMenu(false);
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${property.title} - ${formatMXN(property.price)}`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(propertyUrl)}`, "_blank");
    setShowShareMenu(false);
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(`Propiedad: ${property.title}`);
    const body = encodeURIComponent(`Mira esta propiedad:\n\n${property.title}\nPrecio: ${formatMXN(property.price)}\n\n${propertyUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setShowShareMenu(false);
  };

  // Use multiple images or fallback to single image
  const images = property.images?.length
    ? property.images
    : [property.imageUrl, property.imageUrl, property.imageUrl, property.imageUrl];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Sample amenities if not provided
  const amenities = property.amenities || [
    "Cocina integral",
    "Closets",
    "Estacionamiento techado",
    "Jardín",
    "Terraza",
    "Seguridad 24/7",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - clicking closes modal */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-card shadow-2xl overflow-hidden flex flex-col rounded-xl animate-in zoom-in-95 duration-200 border border-border">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Volver a búsqueda</span>
          </button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Guardar</span>
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

              {/* Share Menu Dropdown */}
              {showShareMenu && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-card rounded-lg shadow-lg border border-border py-2 z-20">
                  <button
                    onClick={copyToClipboard}
                    className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-accent flex items-center gap-3"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link className="h-4 w-4" />}
                    {copied ? "¡Copiado!" : "Copiar enlace"}
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
                  <button
                    onClick={shareToFacebook}
                    className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-accent flex items-center gap-3"
                  >
                    <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>
                  <button
                    onClick={shareToTwitter}
                    className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-accent flex items-center gap-3"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    X (Twitter)
                  </button>
                  <button
                    onClick={shareByEmail}
                    className="w-full px-4 py-2 text-left text-sm text-card-foreground hover:bg-accent flex items-center gap-3"
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </button>
                </div>
              )}
            </div>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* Image Gallery */}
          <div className="relative">
            {/* Main Image Grid */}
            <div className="grid grid-cols-4 grid-rows-2 gap-1 h-[400px]">
              {/* Main large image */}
              <div className="col-span-2 row-span-2 relative">
                <Image
                  src={images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
                {property.badge && (
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    {property.badge}
                  </span>
                )}
              </div>

              {/* Smaller images */}
              {images.slice(1, 5).map((img, index) => (
                <div key={index} className="relative">
                  <Image
                    src={img}
                    alt={`${property.title} - ${index + 2}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}

              {/* See all photos button */}
              <button
                onClick={() => setShowAllPhotos(true)}
                className="absolute bottom-4 right-4 bg-card px-4 py-2 rounded-lg shadow-md text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2 text-card-foreground"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Ver {images.length} fotos
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Price and Address */}
                <div>
                  <h1 className="text-3xl font-bold text-card-foreground mb-2">
                    {formatMXN(property.price)}
                  </h1>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {property.address}
                  </p>
                </div>

                {/* Key Stats */}
                <div className="flex items-center gap-6 py-4 border-y border-border">
                  {property.bedrooms && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-card-foreground">{property.bedrooms}</p>
                      <p className="text-sm text-muted-foreground">recámaras</p>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-card-foreground">{property.bathrooms}</p>
                      <p className="text-sm text-muted-foreground">baños</p>
                    </div>
                  )}
                  {property.area && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-card-foreground">{property.area}</p>
                      <p className="text-sm text-muted-foreground">m²</p>
                    </div>
                  )}
                </div>

                {/* Property Details */}
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground mb-4">
                    Detalles de la propiedad
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Building className="h-5 w-5" />
                      <span>Tipo: Casa</span>
                    </div>
                    {property.yearBuilt && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Calendar className="h-5 w-5" />
                        <span>Año: {property.yearBuilt}</span>
                      </div>
                    )}
                    {property.parkingSpaces && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Car className="h-5 w-5" />
                        <span>Estacionamiento: {property.parkingSpaces}</span>
                      </div>
                    )}
                    {property.floors && (
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Building className="h-5 w-5" />
                        <span>Pisos: {property.floors}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground mb-4">
                    Descripción
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {property.description ||
                      `Hermosa propiedad ubicada en ${property.address}. Esta propiedad cuenta con ${property.bedrooms || 3} recámaras, ${property.bathrooms || 2} baños y ${property.area || 200} m² de construcción. Excelente ubicación con fácil acceso a servicios, escuelas y centros comerciales. No pierdas la oportunidad de conocer esta increíble propiedad.`}
                  </p>
                </div>

                {/* Amenities */}
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground mb-4">
                    Características
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-muted text-muted-foreground rounded-full text-sm"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Location Map */}
                <div>
                  <h2 className="text-lg font-semibold text-card-foreground mb-4">
                    Ubicación
                  </h2>
                  <div className="h-64 bg-muted rounded-lg overflow-hidden">
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
              </div>

              {/* Right Column - Contact Card */}
              <div className="lg:col-span-1">
                <div className="sticky top-24 bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">
                    Contactar al vendedor
                  </h3>

                  <div className="space-y-4">
                    <Button className="w-full py-6 text-base">
                      Solicitar información
                    </Button>

                    <Button variant="outline" className="w-full py-6 text-base gap-2">
                      <Phone className="h-4 w-4" />
                      Llamar
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      o envía un mensaje
                    </div>

                    <textarea
                      className="w-full border border-input bg-background text-foreground rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-ring focus:border-ring"
                      rows={4}
                      placeholder="Hola, me interesa esta propiedad. ¿Podría darme más información?"
                    />

                    <Button variant="outline" className="w-full gap-2">
                      <Mail className="h-4 w-4" />
                      Enviar mensaje
                    </Button>
                  </div>

                  {/* Agent Info */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-muted-foreground">
                          {(property.contactName || "Vendedor")[0]}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-card-foreground">
                          {property.contactName || "Vendedor"}
                        </p>
                        <p className="text-sm text-muted-foreground">Propietario</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Gallery */}
      {showAllPhotos && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col">
          {/* Gallery Header */}
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

          {/* Gallery Image */}
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

          {/* Thumbnails */}
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
