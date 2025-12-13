"use client";

import { usePropertyListing } from "@/contexts/PropertyListingContext";
import { Button } from "@/components/ui/button";
import { formatMXN } from "@/lib/utils";
import { PROPERTY_TYPE_LABELS, AMENITIES } from "@/constants/property-types";
import { CheckCircle2, Edit, Rocket, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PreviewStep() {
  const { data, setCurrentStep, publishListing, clearDraft } = usePropertyListing();
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      const published = publishListing();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to success page
      router.push(`/venta/particular/success?id=${published.id}`);
    } catch (error) {
      console.error("Error publishing:", error);
      alert("Hubo un error al publicar. Por favor intente nuevamente.");
    } finally {
      setIsPublishing(false);
    }
  };

  const getAmenityLabel = (id: string) => {
    return AMENITIES.find((a) => a.id === id)?.label || id;
  };

  const isFormComplete = () => {
    return (
      data.street &&
      data.colonia &&
      data.municipality &&
      data.state &&
      data.postalCode &&
      data.type &&
      data.status &&
      data.price &&
      data.area &&
      data.description &&
      data.contactName &&
      data.contactEmail &&
      data.contactPhone &&
      data.preferredContact &&
      data.photos &&
      data.photos.length > 0
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">
            Revisa y Publica
          </h3>
          <p className="text-sm text-blue-700">
            Verifica que toda la información sea correcta antes de publicar
          </p>
        </div>
      </div>

      {/* Completion Status */}
      {!isFormComplete() && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-900 mb-2">
            ⚠️ Información Incompleta
          </h4>
          <p className="text-sm text-amber-800 mb-3">
            Por favor completa todos los campos requeridos antes de publicar:
          </p>
          <ul className="text-sm text-amber-800 space-y-1">
            {!data.street && <li>• Dirección completa</li>}
            {!data.type && <li>• Tipo de propiedad</li>}
            {!data.status && <li>• Operación (Venta/Renta)</li>}
            {!data.price && <li>• Precio</li>}
            {!data.area && <li>• Área</li>}
            {!data.description && <li>• Descripción</li>}
            {(!data.photos || data.photos.length === 0) && <li>• Al menos una foto</li>}
            {!data.contactName && <li>• Nombre de contacto</li>}
            {!data.contactEmail && <li>• Email de contacto</li>}
            {!data.contactPhone && <li>• Teléfono de contacto</li>}
          </ul>
        </div>
      )}

      {/* Property Preview Card */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
        {/* Main Photo */}
        {data.photos && data.photos.length > 0 ? (
          <div className="relative aspect-video bg-gray-200">
            <img
              src={data.photos[data.mainPhotoIndex || 0]}
              alt="Vista principal"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Sin fotos</p>
          </div>
        )}

        <div className="p-6">
          {/* Price and Summary */}
          <div className="mb-6">
            <p className="text-3xl font-bold text-gray-900 mb-2">
              {data.price ? formatMXN(data.price) : "Sin precio"}
            </p>
            {data.status === "RENTA" && (
              <p className="text-sm text-gray-600 mb-2">por mes</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              {data.bedrooms && (
                <span>{data.bedrooms} rec</span>
              )}
              {data.bathrooms && (
                <span>{data.bathrooms} baños</span>
              )}
              {data.area && (
                <span>{data.area} m²</span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <p className="text-gray-700 font-medium">
              {data.street && data.exteriorNumber
                ? `${data.street} ${data.exteriorNumber}`
                : "Sin dirección"}
              {data.interiorNumber && ` Int. ${data.interiorNumber}`}
            </p>
            <p className="text-gray-600 text-sm">
              {data.colonia && `${data.colonia}, `}
              {data.municipality && `${data.municipality}, `}
              {data.state}
            </p>
          </div>

          {/* Property Type */}
          {data.type && (
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                {PROPERTY_TYPE_LABELS[data.type as keyof typeof PROPERTY_TYPE_LABELS]}
              </span>
            </div>
          )}

          {/* Property Details Section */}
          <div className="border-t pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    Detalles de la Propiedad
                  </h3>
                  <p className="text-sm text-gray-600">
                    Información adicional que ayudará a los compradores
                  </p>
                </div>
              </div>
              {data.status && (
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {data.status === "VENTA" ? "En Venta" : "En Renta"}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Descripción {!data.description && <span className="text-red-500">*</span>}
              </label>
              {data.description ? (
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700 whitespace-pre-line min-h-[100px]">
                  {data.description}
                </div>
              ) : (
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-400 min-h-[100px]">
                  Describa su propiedad... Incluya características especiales, condición actual, razones por las que es un buen lugar para vivir, etc.
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Mínimo 50 caracteres. Sea específico y honesto.
              </p>
            </div>

            {/* Additional Details */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Año de Construcción
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700">
                  {data.yearBuilt ? data.yearBuilt : "Ej: 2015"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Estacionamientos
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700">
                  {data.parkingSpaces !== undefined ? data.parkingSpaces : "Ej: 2"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Pisos/Niveles
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm text-gray-700">
                  {data.floors ? data.floors : "Ej: 2"}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Amenidades
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {AMENITIES.map((amenity) => {
                  const isSelected = data.amenities?.includes(amenity.id) || false;
                  return (
                    <div
                      key={amenity.id}
                      className={`flex items-center gap-3 p-3 border-2 rounded-lg ${
                        isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-blue-600 bg-blue-600"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7"></path>
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {amenity.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Sections */}
      <div className="grid md:grid-cols-2 gap-3">
        <Button
          variant="outline"
          onClick={() => setCurrentStep(1)}
          className="gap-2"
        >
          <Edit className="w-4 h-4" />
          Editar Dirección
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentStep(2)}
          className="gap-2"
        >
          <Edit className="w-4 h-4" />
          Editar Datos Básicos
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentStep(3)}
          className="gap-2"
        >
          <Edit className="w-4 h-4" />
          Editar Detalles
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentStep(4)}
          className="gap-2"
        >
          <Edit className="w-4 h-4" />
          Editar Fotos
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentStep(5)}
          className="gap-2 md:col-span-2"
        >
          <Edit className="w-4 h-4" />
          Editar Contacto
        </Button>
      </div>

      {/* Publish Button */}
      <div className="pt-6 border-t">
        <Button
          onClick={handlePublish}
          disabled={!isFormComplete() || isPublishing}
          className="w-full py-6 text-lg gap-2"
          size="lg"
        >
          <Rocket className="w-5 h-5" />
          {isPublishing ? "Publicando..." : "Publicar Propiedad"}
        </Button>
        <p className="text-xs text-gray-500 text-center mt-3">
          Al publicar, aceptas nuestros términos y condiciones
        </p>
      </div>
    </div>
  );
}
