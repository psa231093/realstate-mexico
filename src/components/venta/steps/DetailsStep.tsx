"use client";

import { useState } from "react";
import { usePropertyListing } from "@/contexts/PropertyListingContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AMENITIES } from "@/constants/property-types";
import { FileText, Sparkles, Loader2, AlertCircle } from "lucide-react";

export function DetailsStep() {
  const { data, updateData } = usePropertyListing();
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getErrors = () => {
    const errors: { description?: string } = {};

    if (!data.description?.trim()) {
      errors.description = "La descripción es requerida";
    } else if (data.description.trim().length < 50) {
      errors.description = `La descripción debe tener al menos 50 caracteres (${data.description.trim().length}/50)`;
    }

    return errors;
  };

  const errors = getErrors();
  const descriptionLength = data.description?.trim().length || 0;

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
        setTouched((prev) => ({ ...prev, description: true }));
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
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Detalles de la Propiedad
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Información adicional que ayudará a los compradores
          </p>
        </div>
      </div>

      {/* Description */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-foreground">
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
          onBlur={() => handleBlur("description")}
          rows={6}
          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 bg-background text-foreground ${
            touched.description && errors.description
              ? "border-red-500 focus:ring-red-500"
              : "border-input focus:ring-ring"
          }`}
        />
        {aiError && (
          <p className="text-xs text-red-500 mt-1">{aiError}</p>
        )}
        {touched.description && errors.description ? (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.description}
          </p>
        ) : (
          <p className={`text-xs mt-1 ${descriptionLength >= 50 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
            {descriptionLength}/50 caracteres mínimo
            {descriptionLength >= 50 && " ✓"}
          </p>
        )}
      </div>

      {/* Additional Details */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
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
          <label className="block text-sm font-semibold text-foreground mb-2">
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
          <label className="block text-sm font-semibold text-foreground mb-2">
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
        <label className="block text-sm font-semibold text-foreground mb-3">
          Amenidades
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {AMENITIES.map((amenity) => (
            <label
              key={amenity.id}
              className={`flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-all ${
                data.amenities?.includes(amenity.id)
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50"
                  : "border-border bg-card hover:border-muted-foreground"
              }`}
            >
              <input
                type="checkbox"
                checked={data.amenities?.includes(amenity.id) || false}
                onChange={() => toggleAmenity(amenity.id)}
                className="w-4 h-4 text-blue-600 rounded border-input focus:ring-ring"
              />
              <span className="text-sm font-medium text-foreground">
                {amenity.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

// Export validation function for use in wizard
export function validateDetailsStep(data: {
  description?: string;
}): boolean {
  return !!(data.description?.trim() && data.description.trim().length >= 50);
}
