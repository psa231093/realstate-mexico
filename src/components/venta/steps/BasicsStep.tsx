"use client";

import { usePropertyListing } from "@/contexts/PropertyListingContext";
import { Input } from "@/components/ui/input";
import { PROPERTY_TYPE_LABELS } from "@/constants/property-types";
import { Home, DollarSign } from "lucide-react";

export function BasicsStep() {
  const { data, updateData } = usePropertyListing();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Home className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">
            Información Básica
          </h3>
          <p className="text-sm text-blue-700">
            Detalles esenciales de su propiedad
          </p>
        </div>
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Tipo de Propiedad <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(PROPERTY_TYPE_LABELS).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => updateData({ type: key })}
              className={`p-4 border-2 rounded-lg text-sm font-medium transition-all ${
                data.type === key
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Status (Venta/Renta) */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Operación <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateData({ status: "VENTA" })}
            className={`p-4 border-2 rounded-lg font-medium transition-all ${
              data.status === "VENTA"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            <div className="text-2xl mb-1">🏷️</div>
            Venta
          </button>
          <button
            type="button"
            onClick={() => updateData({ status: "RENTA" })}
            className={`p-4 border-2 rounded-lg font-medium transition-all ${
              data.status === "RENTA"
                ? "border-blue-600 bg-blue-50 text-blue-700"
                : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
            }`}
          >
            <div className="text-2xl mb-1">🔑</div>
            Renta
          </button>
        </div>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
            className="pl-10"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">Pesos mexicanos (MXN)</p>
      </div>

      {/* Bedrooms, Bathrooms, Area */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
          <p className="text-xs text-gray-500 mt-1">Puede usar .5 para medio baño</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
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
            required
          />
        </div>
      </div>
    </div>
  );
}
