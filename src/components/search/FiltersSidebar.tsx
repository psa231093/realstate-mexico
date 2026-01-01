"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { MEXICAN_STATES } from "@/constants/mexican-states";
import { PROPERTY_TYPE_LABELS } from "@/constants/property-types";

interface Filters {
  priceMin: number | null;
  priceMax: number | null;
  bedrooms: number[];
  bathrooms: number[];
  types: string[];
  state: string | null;
}

interface FiltersSidebarProps {
  onFiltersChange?: (filters: Filters) => void;
}

export function FiltersSidebar({ onFiltersChange }: FiltersSidebarProps) {
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [selectedBedrooms, setSelectedBedrooms] = useState<number[]>([]);
  const [selectedBathrooms, setSelectedBathrooms] = useState<number[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("");

  const bedroomOptions = [1, 2, 3, 4, 5];
  const bathroomOptions = [1, 2, 3, 4];

  const updateFilters = (updates: Partial<Filters>) => {
    const newFilters = {
      priceMin: priceMin ? parseFloat(priceMin) : null,
      priceMax: priceMax ? parseFloat(priceMax) : null,
      bedrooms: selectedBedrooms,
      bathrooms: selectedBathrooms,
      types: selectedTypes,
      state: selectedState || null,
      ...updates,
    };

    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
  };

  const toggleBedroom = (value: number) => {
    const newBedrooms = selectedBedrooms.includes(value)
      ? selectedBedrooms.filter((v) => v !== value)
      : [...selectedBedrooms, value];
    setSelectedBedrooms(newBedrooms);
    updateFilters({ bedrooms: newBedrooms });
  };

  const toggleBathroom = (value: number) => {
    const newBathrooms = selectedBathrooms.includes(value)
      ? selectedBathrooms.filter((v) => v !== value)
      : [...selectedBathrooms, value];
    setSelectedBathrooms(newBathrooms);
    updateFilters({ bathrooms: newBathrooms });
  };

  const toggleType = (type: string) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(newTypes);
    updateFilters({ types: newTypes });
  };

  const clearAllFilters = () => {
    setPriceMin("");
    setPriceMax("");
    setSelectedBedrooms([]);
    setSelectedBathrooms([]);
    setSelectedTypes([]);
    setSelectedState("");
    updateFilters({
      priceMin: null,
      priceMax: null,
      bedrooms: [],
      bathrooms: [],
      types: [],
      state: null,
    });
  };

  const activeFilterCount =
    (priceMin ? 1 : 0) +
    (priceMax ? 1 : 0) +
    selectedBedrooms.length +
    selectedBathrooms.length +
    selectedTypes.length +
    (selectedState ? 1 : 0);

  return (
    <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-card-foreground">Filtros</h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-primary hover:text-primary/80"
          >
            Limpiar todo
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Rango de Precio
          </label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              placeholder="Mínimo"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              onBlur={() => updateFilters({})}
              className="text-sm"
            />
            <Input
              type="number"
              placeholder="Máximo"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              onBlur={() => updateFilters({})}
              className="text-sm"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Recámaras
          </label>
          <div className="flex flex-wrap gap-2">
            {bedroomOptions.map((num) => (
              <Button
                key={num}
                variant={selectedBedrooms.includes(num) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleBedroom(num)}
                className="min-w-[60px]"
              >
                {num === 5 ? "5+" : num}
              </Button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Baños
          </label>
          <div className="flex flex-wrap gap-2">
            {bathroomOptions.map((num) => (
              <Button
                key={num}
                variant={selectedBathrooms.includes(num) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleBathroom(num)}
                className="min-w-[60px]"
              >
                {num === 4 ? "4+" : num}
              </Button>
            ))}
          </div>
        </div>

        {/* Property Type */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Tipo de Propiedad
          </label>
          <div className="space-y-2">
            {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-2 cursor-pointer hover:bg-accent p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(key)}
                  onChange={() => toggleType(key)}
                  className="w-4 h-4 text-primary rounded border-input focus:ring-primary"
                />
                <span className="text-sm text-card-foreground">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* State */}
        <div>
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Estado
          </label>
          <select
            value={selectedState}
            onChange={(e) => {
              setSelectedState(e.target.value);
              updateFilters({ state: e.target.value || null });
            }}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Todos los estados</option>
            {MEXICAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* Apply Filters Button (Mobile) */}
        <Button className="w-full md:hidden">
          Aplicar Filtros
        </Button>
      </div>
    </div>
  );
}
