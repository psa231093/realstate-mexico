"use client";

import { useState } from "react";
import { usePropertyListing } from "@/contexts/PropertyListingContext";
import { Input } from "@/components/ui/input";
import { MEXICAN_STATES } from "@/constants/mexican-states";
import { MapPin, AlertCircle } from "lucide-react";

interface FieldError {
  street?: string;
  exteriorNumber?: string;
  colonia?: string;
  municipality?: string;
  state?: string;
  postalCode?: string;
}

export function AddressStep() {
  const { data, updateData } = usePropertyListing();
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getErrors = (): FieldError => {
    const errors: FieldError = {};

    if (!data.street?.trim()) {
      errors.street = "La calle es requerida";
    }
    if (!data.exteriorNumber?.trim()) {
      errors.exteriorNumber = "El número exterior es requerido";
    }
    if (!data.colonia?.trim()) {
      errors.colonia = "La colonia es requerida";
    }
    if (!data.municipality?.trim()) {
      errors.municipality = "El municipio/alcaldía es requerido";
    }
    if (!data.state) {
      errors.state = "El estado es requerido";
    }
    if (!data.postalCode?.trim()) {
      errors.postalCode = "El código postal es requerido";
    } else if (!/^\d{5}$/.test(data.postalCode)) {
      errors.postalCode = "El código postal debe tener 5 dígitos";
    }

    return errors;
  };

  const errors = getErrors();

  const getInputClass = (field: keyof FieldError) => {
    const hasError = touched[field] && errors[field];
    return hasError
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Ubicación de la Propiedad
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Ingrese la dirección completa donde se encuentra la propiedad
          </p>
        </div>
      </div>

      {/* Street and Numbers */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-foreground mb-2">
            Calle <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ej: Avenida Insurgentes"
            value={data.street || ""}
            onChange={(e) => updateData({ street: e.target.value })}
            onBlur={() => handleBlur("street")}
            className={getInputClass("street")}
          />
          {touched.street && errors.street && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.street}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Número Exterior <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ej: 123"
            value={data.exteriorNumber || ""}
            onChange={(e) => updateData({ exteriorNumber: e.target.value })}
            onBlur={() => handleBlur("exteriorNumber")}
            className={getInputClass("exteriorNumber")}
          />
          {touched.exteriorNumber && errors.exteriorNumber && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.exteriorNumber}
            </p>
          )}
        </div>
      </div>

      {/* Interior Number and Colonia */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Número Interior <span className="text-muted-foreground">(Opcional)</span>
          </label>
          <Input
            placeholder="Ej: 4B"
            value={data.interiorNumber || ""}
            onChange={(e) => updateData({ interiorNumber: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Colonia <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ej: Polanco"
            value={data.colonia || ""}
            onChange={(e) => updateData({ colonia: e.target.value })}
            onBlur={() => handleBlur("colonia")}
            className={getInputClass("colonia")}
          />
          {touched.colonia && errors.colonia && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.colonia}
            </p>
          )}
        </div>
      </div>

      {/* Municipality and State */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Municipio/Alcaldía <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ej: Miguel Hidalgo"
            value={data.municipality || ""}
            onChange={(e) => updateData({ municipality: e.target.value })}
            onBlur={() => handleBlur("municipality")}
            className={getInputClass("municipality")}
          />
          {touched.municipality && errors.municipality && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.municipality}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Estado <span className="text-red-500">*</span>
          </label>
          <select
            value={data.state || ""}
            onChange={(e) => updateData({ state: e.target.value })}
            onBlur={() => handleBlur("state")}
            className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 bg-background text-foreground ${
              touched.state && errors.state
                ? "border-red-500 focus:ring-red-500"
                : "border-input focus:ring-ring"
            }`}
          >
            <option value="">Seleccione un estado</option>
            {MEXICAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {touched.state && errors.state && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.state}
            </p>
          )}
        </div>
      </div>

      {/* Postal Code */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Código Postal <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="Ej: 11560"
            value={data.postalCode || ""}
            onChange={(e) => updateData({ postalCode: e.target.value })}
            onBlur={() => handleBlur("postalCode")}
            maxLength={5}
            className={getInputClass("postalCode")}
          />
          {touched.postalCode && errors.postalCode ? (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.postalCode}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground mt-1">5 dígitos</p>
          )}
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-muted">
        <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-foreground mb-1">Vista del mapa</p>
        <p className="text-sm text-muted-foreground">
          La integración del mapa estará disponible próximamente
        </p>
      </div>
    </div>
  );
}

// Export validation function for use in wizard
export function validateAddressStep(data: {
  street?: string;
  exteriorNumber?: string;
  colonia?: string;
  municipality?: string;
  state?: string;
  postalCode?: string;
}): boolean {
  return !!(
    data.street?.trim() &&
    data.exteriorNumber?.trim() &&
    data.colonia?.trim() &&
    data.municipality?.trim() &&
    data.state &&
    data.postalCode?.trim() &&
    /^\d{5}$/.test(data.postalCode)
  );
}
