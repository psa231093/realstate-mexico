"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

interface PropertySearchBarProps {
  initialStatus?: "VENTA" | "RENTA";
  onFiltersChange?: (filters: SearchFilters) => void;
  onSaveSearch?: () => void;
}

export interface SearchFilters {
  location: string;
  status: "VENTA" | "RENTA";
  priceMin: number | null;
  priceMax: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  propertyTypes: string[];
}

const PRICE_OPTIONS = [
  { label: "Sin minimo", value: null },
  { label: "$500,000", value: 500000 },
  { label: "$1,000,000", value: 1000000 },
  { label: "$2,000,000", value: 2000000 },
  { label: "$3,000,000", value: 3000000 },
  { label: "$5,000,000", value: 5000000 },
  { label: "$7,500,000", value: 7500000 },
  { label: "$10,000,000", value: 10000000 },
  { label: "$15,000,000", value: 15000000 },
  { label: "$20,000,000", value: 20000000 },
];

const PRICE_MAX_OPTIONS = [
  { label: "Sin maximo", value: null },
  { label: "$1,000,000", value: 1000000 },
  { label: "$2,000,000", value: 2000000 },
  { label: "$3,000,000", value: 3000000 },
  { label: "$5,000,000", value: 5000000 },
  { label: "$7,500,000", value: 7500000 },
  { label: "$10,000,000", value: 10000000 },
  { label: "$15,000,000", value: 15000000 },
  { label: "$20,000,000", value: 20000000 },
  { label: "$30,000,000", value: 30000000 },
];

const BEDROOM_OPTIONS = [
  { label: "Cualquiera", value: null },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 },
  { label: "5+", value: 5 },
];

const BATHROOM_OPTIONS = [
  { label: "Cualquiera", value: null },
  { label: "1+", value: 1 },
  { label: "2+", value: 2 },
  { label: "3+", value: 3 },
  { label: "4+", value: 4 },
];

const PROPERTY_TYPES = [
  { label: "Casa", value: "CASA" },
  { label: "Departamento", value: "DEPARTAMENTO" },
  { label: "Terreno", value: "TERRENO" },
  { label: "Local Comercial", value: "LOCAL" },
  { label: "Oficina", value: "OFICINA" },
  { label: "Bodega", value: "BODEGA" },
];

export function PropertySearchBar({
  initialStatus = "VENTA",
  onFiltersChange,
  onSaveSearch,
}: PropertySearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [location, setLocation] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState<"VENTA" | "RENTA">(
    (searchParams.get("status") as "VENTA" | "RENTA") || initialStatus
  );
  const [priceMin, setPriceMin] = useState<number | null>(null);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [bathrooms, setBathrooms] = useState<number | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Refs for click outside
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeDropdown) {
        const ref = dropdownRefs.current[activeDropdown];
        if (ref && !ref.contains(event.target as Node)) {
          setActiveDropdown(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  // Notify parent of filter changes
  useEffect(() => {
    if (onFiltersChange) {
      onFiltersChange({
        location,
        status,
        priceMin,
        priceMax,
        bedrooms,
        bathrooms,
        propertyTypes,
      });
    }
  }, [location, status, priceMin, priceMax, bedrooms, bathrooms, propertyTypes, onFiltersChange]);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("q", location);
    if (status) params.set("status", status);
    if (priceMin) params.set("priceMin", priceMin.toString());
    if (priceMax) params.set("priceMax", priceMax.toString());
    if (bedrooms) params.set("bedrooms", bedrooms.toString());
    if (bathrooms) params.set("bathrooms", bathrooms.toString());
    if (propertyTypes.length > 0) params.set("types", propertyTypes.join(","));

    router.push(`/propiedades?${params.toString()}`);
  };

  const handleClearLocation = () => {
    setLocation("");
  };

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const togglePropertyType = (type: string) => {
    setPropertyTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const formatPrice = (value: number | null) => {
    if (value === null) return "";
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getPriceLabel = () => {
    if (priceMin === null && priceMax === null) return "Precio";
    if (priceMin && priceMax) return `${formatPrice(priceMin)} - ${formatPrice(priceMax)}`;
    if (priceMin) return `Desde ${formatPrice(priceMin)}`;
    if (priceMax) return `Hasta ${formatPrice(priceMax)}`;
    return "Precio";
  };

  const getBedsAndBathsLabel = () => {
    const parts = [];
    if (bedrooms) parts.push(`${bedrooms}+ rec`);
    if (bathrooms) parts.push(`${bathrooms}+ ban`);
    return parts.length > 0 ? parts.join(", ") : "Recamaras y Banos";
  };

  const getPropertyTypeLabel = () => {
    if (propertyTypes.length === 0) return "Tipo de Inmueble";
    if (propertyTypes.length === 1) {
      return PROPERTY_TYPES.find((t) => t.value === propertyTypes[0])?.label || "Tipo de Inmueble";
    }
    return `${propertyTypes.length} tipos`;
  };

  const handleSaveSearch = () => {
    if (!user) {
      // Could trigger auth modal here
      return;
    }
    onSaveSearch?.();
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
          {/* Location Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Input
              type="text"
              placeholder="Ciudad, colonia o codigo postal"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-4 pr-16 h-10 bg-background"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {location && (
                <button
                  onClick={handleClearLocation}
                  className="p-1 hover:bg-muted rounded-full"
                >
                  <X className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
              <button
                onClick={handleSearch}
                className="p-1 hover:bg-muted rounded-full"
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Status Dropdown (En Venta / En Renta) */}
          <div
            className="relative"
            ref={(el) => { dropdownRefs.current["status"] = el; }}
          >
            <Button
              variant="outline"
              className="h-10 gap-1 min-w-[120px] justify-between"
              onClick={() => toggleDropdown("status")}
            >
              <span>{status === "VENTA" ? "En Venta" : "En Renta"}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === "status" ? "rotate-180" : ""}`} />
            </Button>
            {activeDropdown === "status" && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 min-w-[150px]">
                <button
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center justify-between ${status === "VENTA" ? "text-primary font-medium" : ""}`}
                  onClick={() => {
                    setStatus("VENTA");
                    setActiveDropdown(null);
                  }}
                >
                  En Venta
                  {status === "VENTA" && <Check className="h-4 w-4" />}
                </button>
                <button
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-muted flex items-center justify-between ${status === "RENTA" ? "text-primary font-medium" : ""}`}
                  onClick={() => {
                    setStatus("RENTA");
                    setActiveDropdown(null);
                  }}
                >
                  En Renta
                  {status === "RENTA" && <Check className="h-4 w-4" />}
                </button>
              </div>
            )}
          </div>

          {/* Price Dropdown */}
          <div
            className="relative"
            ref={(el) => { dropdownRefs.current["price"] = el; }}
          >
            <Button
              variant="outline"
              className="h-10 gap-1 min-w-[100px] justify-between"
              onClick={() => toggleDropdown("price")}
            >
              <span className="truncate max-w-[150px]">{getPriceLabel()}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === "price" ? "rotate-180" : ""}`} />
            </Button>
            {activeDropdown === "price" && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 p-4 min-w-[300px]">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Minimo</label>
                    <select
                      value={priceMin ?? ""}
                      onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : null)}
                      className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {PRICE_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value ?? ""}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Maximo</label>
                    <select
                      value={priceMax ?? ""}
                      onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : null)}
                      className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {PRICE_MAX_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value ?? ""}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  size="sm"
                  onClick={() => setActiveDropdown(null)}
                >
                  Aplicar
                </Button>
              </div>
            )}
          </div>

          {/* Beds & Baths Dropdown */}
          <div
            className="relative"
            ref={(el) => { dropdownRefs.current["bedsBaths"] = el; }}
          >
            <Button
              variant="outline"
              className="h-10 gap-1 min-w-[140px] justify-between"
              onClick={() => toggleDropdown("bedsBaths")}
            >
              <span className="truncate max-w-[120px]">{getBedsAndBathsLabel()}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === "bedsBaths" ? "rotate-180" : ""}`} />
            </Button>
            {activeDropdown === "bedsBaths" && (
              <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 p-4 min-w-[280px]">
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Recamaras</label>
                  <div className="flex gap-1">
                    {BEDROOM_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        className={`flex-1 py-2 px-2 text-sm rounded-md border transition-colors ${
                          bedrooms === opt.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-input hover:bg-muted"
                        }`}
                        onClick={() => setBedrooms(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Banos</label>
                  <div className="flex gap-1">
                    {BATHROOM_OPTIONS.map((opt) => (
                      <button
                        key={opt.label}
                        className={`flex-1 py-2 px-3 text-sm rounded-md border transition-colors ${
                          bathrooms === opt.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-input hover:bg-muted"
                        }`}
                        onClick={() => setBathrooms(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <Button
                  className="w-full"
                  size="sm"
                  onClick={() => setActiveDropdown(null)}
                >
                  Aplicar
                </Button>
              </div>
            )}
          </div>

          {/* Property Type Dropdown */}
          <div
            className="relative"
            ref={(el) => { dropdownRefs.current["type"] = el; }}
          >
            <Button
              variant="outline"
              className="h-10 gap-1 min-w-[140px] justify-between"
              onClick={() => toggleDropdown("type")}
            >
              <span className="truncate max-w-[120px]">{getPropertyTypeLabel()}</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === "type" ? "rotate-180" : ""}`} />
            </Button>
            {activeDropdown === "type" && (
              <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-50 p-2 min-w-[200px]">
                {PROPERTY_TYPES.map((type) => (
                  <button
                    key={type.value}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted rounded flex items-center justify-between"
                    onClick={() => togglePropertyType(type.value)}
                  >
                    {type.label}
                    {propertyTypes.includes(type.value) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
                <div className="border-t border-border mt-2 pt-2">
                  <Button
                    className="w-full"
                    size="sm"
                    onClick={() => setActiveDropdown(null)}
                  >
                    Aplicar
                  </Button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
