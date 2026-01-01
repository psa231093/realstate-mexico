"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath, Maximize } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatMXN } from "@/lib/utils";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { PricePerM2Badge } from "./PricePerM2Badge";

interface PropertyCardCompactProps {
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
  isHovered?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export function PropertyCardCompact({
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
  isHovered,
  onMouseEnter,
  onMouseLeave,
}: PropertyCardCompactProps) {
  return (
    <Link
      href={`/propiedades/${slug}`}
      className="block group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div
        className={`
          bg-card rounded-lg overflow-hidden border transition-all duration-200
          ${isHovered ? "border-primary shadow-lg" : "border-border hover:shadow-md"}
        `}
      >
        <div className="flex">
          {/* Image */}
          <div className="relative w-40 h-32 flex-shrink-0 overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {badge && (
              <div className="absolute top-2 left-2">
                <Badge variant="destructive" className="text-xs font-semibold">
                  {badge}
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
            <div>
              {/* Price */}
              <p className="text-lg font-bold text-card-foreground">
                {formatMXN(price)}
              </p>
              {area && (
                <PricePerM2Badge price={price} area={area} size="sm" />
              )}

              {/* Property Details */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                {bedrooms !== undefined && (
                  <div className="flex items-center gap-0.5">
                    <Bed className="h-3 w-3" />
                    <span>{bedrooms}</span>
                  </div>
                )}
                {bathrooms !== undefined && (
                  <div className="flex items-center gap-0.5">
                    <Bath className="h-3 w-3" />
                    <span>{bathrooms}</span>
                  </div>
                )}
                {area && (
                  <div className="flex items-center gap-0.5">
                    <Maximize className="h-3 w-3" />
                    <span>{area} m²</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <p className="text-xs text-muted-foreground/70 mt-1 truncate">{address}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-1 mt-2">
              <WhatsAppButton
                property={{
                  propertyTitle: title,
                  propertyPrice: price,
                  propertyAddress: address,
                  contactPhone,
                }}
                size="icon"
                showText={false}
                className="h-7 w-7 rounded-full"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:bg-accent"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement favorite functionality
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
