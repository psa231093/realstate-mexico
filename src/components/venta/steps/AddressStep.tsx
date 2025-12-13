"use client";

import { usePropertyListing } from "@/contexts/PropertyListingContext";
import { Input } from "@/components/ui/input";
import { MEXICAN_STATES } from "@/constants/mexican-states";
import { MapPin } from "lucide-react";

export function AddressStep() {
  const { data, updateData } = usePropertyListing();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">
            Ubicación de la Propiedad
          </h3>
          <p className="text-sm text-blue-700">
            Ingrese la dirección completa donde se encuentra la propiedad
          </p>
        </div>
      </div>

      {/* Street and Numbers */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Calle <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ej: Avenida Insurgentes"
            value={data.street || ""}
            onChange={(e) => updateData({ street: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Número Exterior <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ej: 123"
            value={data.exteriorNumber || ""}
            onChange={(e) => updateData({ exteriorNumber: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Interior Number and Colonia */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Número Interior <span className="text-gray-400">(Opcional)</span>
          </label>
          <Input
            placeholder="Ej: 4B"
            value={data.interiorNumber || ""}
            onChange={(e) => updateData({ interiorNumber: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Colonia <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ej: Polanco"
            value={data.colonia || ""}
            onChange={(e) => updateData({ colonia: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Municipality and State */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Municipio/Alcaldía <span className="text-red-500">*</span>
          </label>
          <Input
            placeholder="Ej: Miguel Hidalgo"
            value={data.municipality || ""}
            onChange={(e) => updateData({ municipality: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Estado <span className="text-red-500">*</span>
          </label>
          <select
            value={data.state || ""}
            onChange={(e) => updateData({ state: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Seleccione un estado</option>
            {MEXICAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Postal Code */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Código Postal <span className="text-red-500">*</span>
          </label>
          <Input
            type="text"
            placeholder="Ej: 11560"
            value={data.postalCode || ""}
            onChange={(e) => updateData({ postalCode: e.target.value })}
            maxLength={5}
            required
          />
          <p className="text-xs text-gray-500 mt-1">5 dígitos</p>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
        <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-600 mb-1">Vista del mapa</p>
        <p className="text-sm text-gray-500">
          La integración del mapa estará disponible próximamente
        </p>
      </div>
    </div>
  );
}
