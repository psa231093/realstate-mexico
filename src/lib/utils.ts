import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Currency formatter for Mexican Pesos
export function formatMXN(amount: number, compact: boolean = false): string {
  if (compact) {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  }
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Number abbreviation (1,500,000 → 1.5M)
export function abbreviateNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K';
  }
  return num.toString();
}

// Format Mexican address
export function formatAddress(address: {
  street?: string;
  exteriorNumber?: string;
  interiorNumber?: string;
  colonia?: string;
  municipality?: string;
  state?: string;
  postalCode?: string;
}): string {
  const parts = [
    address.street,
    address.exteriorNumber,
    address.interiorNumber,
    address.colonia,
    address.municipality,
    address.state,
    address.postalCode,
  ].filter(Boolean);

  return parts.join(', ');
}
