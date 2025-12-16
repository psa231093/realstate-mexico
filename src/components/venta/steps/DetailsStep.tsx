"use client";

import { useState } from "react";
import { usePropertyListing } from "@/contexts/PropertyListingContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AMENITIES } from "@/constants/property-types";
import { FileText, Sparkles, Loader2 } from "lucide-react";

export function DetailsStep() {
  const { data, updateData } = usePropertyListing();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleGenerateDescription = async () => {
    setIsGenerating(true);
    setAiError(null);

    try {
      // Get amenity labels from selected amenity IDs
      const selectedAmenityLabels = (data.amenities || [])
        .map((id) => AMENITIES.find((a) => a.id === id)?.label)
        .filter(Boolean);

      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: data.type,
          status: data.status,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area: data.area,
          colonia: data.colonia,
          municipality: data.municipality,
          state: data.state,
          amenities: selectedAmenityLabels,
          parkingSpaces: data.parkingSpaces,
          yearBuilt: data.yearBuilt,
          price: data.price,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al generar la descripcion");
      }

      const result = await response.json();
      if (result.description) {
        updateData({ description: result.description });
      }
    } catch (error) {
      console.error("Error generating description:", error);
      setAiError("No se pudo generar la descripcion. Intenta de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleAmenity = (amenityId: string) => {
    const current = data.amenities || [];
    const updated = current.includes(amenityId)
      ? current.filter((id) => id !== amenityId)
      : [...current, amenityId];
    updateData({ amenities: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">
            Detalles de la Propiedad
          </h3>
          <p className="text-sm text-blue-700">
            Información adicional que ayudará a los compradores
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">
            Descripcion <span className="text-red-500">*</span>
          </label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleGenerateDescription}
            disabled={isGenerating}
            className="gap-2 text-purple-600 border-purple-300 hover:bg-purple-50 hover:text-purple-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generar con IA
              </>
            )}
          </Button>
        </div>
        <textarea
          placeholder="Describa su propiedad... Incluya caracteristicas especiales, condicion actual, razones por las que es un buen lugar para vivir, etc."
          value={data.description || ""}
          onChange={(e) => updateData({ description: e.target.value })}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {aiError && (
          <p className="text-xs text-red-500 mt-1">{aiError}</p>
        )}
        <p className="text-xs text-gray-500 mt-1">
          Minimo 50 caracteres. Sea especifico y honesto. Use el boton de IA para generar una descripcion automaticamente.
        </p>
      </div>

      {/* Additional Details */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Año de Construcción
          </label>
          <Input
            type="number"
            placeholder="Ej: 2015"
            min="1900"
            max={new Date().getFullYear()}
            value={data.yearBuilt || ""}
            onChange={(e) =>
              updateData({ yearBuilt: parseInt(e.target.value) || undefined })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Estacionamientos
          </label>
          <Input
            type="number"
            placeholder="Ej: 2"
            min="0"
            value={data.parkingSpaces || ""}
            onChange={(e) =>
              updateData({ parkingSpaces: parseInt(e.target.value) || undefined })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Pisos/Niveles
          </label>
          <Input
            type="number"
            placeholder="Ej: 2"
            min="1"
            value={data.floors || ""}
            onChange={(e) =>
              updateData({ floors: parseInt(e.target.value) || undefined })
            }
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Amenidades
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AMENITIES.map((amenity) => (
            <label
              key={amenity.id}
              className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                data.amenities?.includes(amenity.id)
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <input
                type="checkbox"
                checked={data.amenities?.includes(amenity.id) || false}
                onChange={() => toggleAmenity(amenity.id)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                {amenity.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
