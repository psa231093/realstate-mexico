"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath, Maximize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMXN } from "@/lib/utils";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PricePerM2Badge } from "./PricePerM2Badge";

interface PropertyCardProps {
  id: string;
  slug: string;
  title: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  imageUrl: string;
  address: string;
  status: string;
  badge?: string;
  contactPhone?: string;
}

export function PropertyCard({
  id,
  slug,
  title,
  price,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
  address,
  status,
  badge,
  contactPhone,
}: PropertyCardProps) {
  return (
    <Link href={`/propiedades/${slug}`} className="block group">
      <div className="bg-card rounded-lg overflow-hidden border border-border hover:shadow-xl transition-all duration-300">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3">
              <Badge variant="destructive" className="font-semibold">
                {badge}
              </Badge>
            </div>
          )}

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 bg-background/90 hover:bg-background rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement favorite functionality
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>

          {/* WhatsApp Button */}
          <div className="absolute bottom-3 right-3">
            <WhatsAppButton
              property={{
                propertyTitle: title,
                propertyPrice: price,
                propertyAddress: address,
                contactPhone,
              }}
              size="icon"
              showText={false}
              className="h-9 w-9 rounded-full shadow-md"
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="mb-2">
            <p className="text-2xl font-bold text-card-foreground">
              {formatMXN(price)}
            </p>
            {area && (
              <PricePerM2Badge price={price} area={area} size="sm" />
            )}
          </div>

          {/* Property Details */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-3">
            {bedrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bed className="h-4 w-4" />
                <span>{bedrooms} rec</span>
              </div>
            )}
            {bathrooms !== undefined && (
              <div className="flex items-center gap-1">
                <Bath className="h-4 w-4" />
                <span>{bathrooms} baños</span>
              </div>
            )}
            {area && (
              <div className="flex items-center gap-1">
                <Maximize className="h-4 w-4" />
                <span>{area} m²</span>
              </div>
            )}
          </div>

          {/* Address */}
          <p className="text-sm text-muted-foreground truncate">{address}</p>

          {/* Status */}
          <p className="text-xs text-muted-foreground/70 mt-2">
            {status === "VENTA" ? "En Venta" : "En Renta"}
          </p>
        </div>
      </div>
    </Link>
  );
}
