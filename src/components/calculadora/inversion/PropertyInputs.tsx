"use client";

import { Home, DollarSign, HelpCircle } from "lucide-react";

interface PropertyInputsProps {
  propertyPrice: number;
  monthlyRent: number;
  onPriceChange: (value: number) => void;
  onRentChange: (value: number) => void;
}

export function PropertyInputs({
  propertyPrice,
  monthlyRent,
  onPriceChange,
  onRentChange,
}: PropertyInputsProps) {
  const formatInputValue = (value: number) => {
    if (value === 0) return "";
    return value.toLocaleString("es-MX");
  };

  const parseInputValue = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    return parseInt(cleaned, 10) || 0;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Home className="h-5 w-5 text-amber-600" />
        Datos de la Propiedad
      </h3>

      {/* Property Price */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          Precio de la Propiedad
          <div className="relative group">
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64 z-10 border border-border">
              Precio de compra de la propiedad incluyendo gastos de escrituracion.
            </div>
          </div>
        </label>
        <div className="relative mt-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <input
            type="text"
            value={formatInputValue(propertyPrice)}
            onChange={(e) => onPriceChange(parseInputValue(e.target.value))}
            className="w-full pl-8 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="2,500,000"
          />
        </div>
      </div>

      {/* Monthly Rent */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-amber-600" />
          Renta Mensual Esperada
        </label>
        <div className="relative mt-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <input
            type="text"
            value={formatInputValue(monthlyRent)}
            onChange={(e) => onRentChange(parseInputValue(e.target.value))}
            className="w-full pl-8 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            placeholder="15,000"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Renta mensual que esperas cobrar
        </p>
      </div>

      {/* Quick yield preview */}
      {propertyPrice > 0 && monthlyRent > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            <strong>Rendimiento bruto rapido:</strong>{" "}
            {((monthlyRent * 12 / propertyPrice) * 100).toFixed(2)}% anual
          </p>
        </div>
      )}
    </div>
  );
}
