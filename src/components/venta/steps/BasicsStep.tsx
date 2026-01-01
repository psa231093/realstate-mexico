"use client";

import { useState } from "react";
import { usePropertyListing } from "@/contexts/PropertyListingContext";
import { Input } from "@/components/ui/input";
import { PROPERTY_TYPE_LABELS } from "@/constants/property-types";
import { Home, DollarSign, AlertCircle } from "lucide-react";

interface FieldError {
  type?: string;
  status?: string;
  price?: string;
  area?: string;
}

export function BasicsStep() {
  const { data, updateData } = usePropertyListing();
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Mark field as touched when user interacts with buttons
  const handleTypeSelect = (type: string) => {
    setTouched((prev) => ({ ...prev, type: true }));
    updateData({ type });
  };

  const handleStatusSelect = (status: string) => {
    setTouched((prev) => ({ ...prev, status: true }));
    updateData({ status });
  };

  const getErrors = (): FieldError => {
    const errors: FieldError = {};

    if (!data.type) {
      errors.type = "Selecciona un tipo de propiedad";
    }
    if (!data.status) {
      errors.status = "Selecciona el tipo de operación";
    }
    if (!data.price || data.price <= 0) {
      errors.price = "El precio es requerido";
    }
    if (!data.area || data.area <= 0) {
      errors.area = "El área es requerida";
    }

    return errors;
  };

  const errors = getErrors();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
        <Home className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Información Básica
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Detalles esenciales de su propiedad
          </p>
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Tipo de Propiedad <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => handleTypeSelect(key)}
              className={`p-4 border-2 rounded-lg text-sm font-medium transition-all ${
                data.type === key
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                  : touched.type && errors.type
                  ? "border-red-300 bg-card text-foreground hover:border-red-400"
                  : "border-border bg-card text-foreground hover:border-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {touched.type && errors.type && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.type}
          </p>
        )}
      </div>

      {/* Status (Venta/Renta) */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Operación <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => handleStatusSelect("VENTA")}
            className={`p-4 border-2 rounded-lg font-medium transition-all ${
              data.status === "VENTA"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                : touched.status && errors.status
                ? "border-red-300 bg-card text-foreground hover:border-red-400"
                : "border-border bg-card text-foreground hover:border-muted-foreground"
            }`}
          >
            <div className="text-2xl mb-1">🏷️</div>
            Venta
          </button>
          <button
            type="button"
            onClick={() => handleStatusSelect("RENTA")}
            className={`p-4 border-2 rounded-lg font-medium transition-all ${
              data.status === "RENTA"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300"
                : touched.status && errors.status
                ? "border-red-300 bg-card text-foreground hover:border-red-400"
                : "border-border bg-card text-foreground hover:border-muted-foreground"
            }`}
          >
            <div className="text-2xl mb-1">🔑</div>
            Renta
          </button>
        </div>
        {touched.status && errors.status && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.status}
          </p>
        )}
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Precio {data.status === "RENTA" ? "Mensual" : ""}{" "}
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <DollarSign className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="number"
            placeholder="Ej: 2500000"
            value={data.price || ""}
            onChange={(e) => updateData({ price: parseFloat(e.target.value) || undefined })}
            onBlur={() => handleBlur("price")}
            className={`pl-10 ${
              touched.price && errors.price
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : ""
            }`}
          />
        </div>
        {touched.price && errors.price ? (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.price}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">Pesos mexicanos (MXN)</p>
        )}
      </div>

      {/* Bedrooms, Bathrooms, Area */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Recámaras
          </label>
          <Input
            type="number"
            placeholder="Ej: 3"
            min="0"
            value={data.bedrooms || ""}
            onChange={(e) =>
              updateData({ bedrooms: parseInt(e.target.value) || undefined })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Baños
          </label>
          <Input
            type="number"
            placeholder="Ej: 2"
            min="0"
            step="0.5"
            value={data.bathrooms || ""}
            onChange={(e) =>
              updateData({ bathrooms: parseFloat(e.target.value) || undefined })
            }
          />
          <p className="text-xs text-muted-foreground mt-1">Puede usar .5 para medio baño</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Área (m²) <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            placeholder="Ej: 120"
            min="0"
            value={data.area || ""}
            onChange={(e) =>
              updateData({ area: parseFloat(e.target.value) || undefined })
            }
            onBlur={() => handleBlur("area")}
            className={
              touched.area && errors.area
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : ""
            }
          />
          {touched.area && errors.area && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.area}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// Export validation function for use in wizard
export function validateBasicsStep(data: {
  type?: string;
  status?: string;
  price?: number;
  area?: number;
}): boolean {
  return !!(
    data.type &&
    data.status &&
    data.price &&
    data.price > 0 &&
    data.area &&
    data.area > 0
  );
}
