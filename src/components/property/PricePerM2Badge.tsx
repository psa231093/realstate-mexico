"use client";

import { calculatePricePerM2, formatPricePerM2 } from "@/lib/utils";

interface PricePerM2BadgeProps {
  price: number;
  area: number;
  size?: 'sm' | 'default';
}

export function PricePerM2Badge({
  price,
  area,
  size = 'default'
}: PricePerM2BadgeProps) {
  const pricePerM2 = calculatePricePerM2(price, area);

  if (!pricePerM2) return null;

  return (
    <span className={`text-muted-foreground ${
      size === 'sm' ? 'text-xs' : 'text-sm'
    }`}>
      {formatPricePerM2(pricePerM2)}
    </span>
  );
}
