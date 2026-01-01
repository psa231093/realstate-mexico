"use client";

import { usePropertyListing } from "@/contexts/PropertyListingContext";
import { Button } from "@/components/ui/button";
import { formatMXN } from "@/lib/utils";
import { PROPERTY_TYPE_LABELS, AMENITIES } from "@/constants/property-types";
import { CheckCircle2, Edit, Rocket, FileText } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function PreviewStep() {
  const { data, setCurrentStep, publishListing, isPublishing } = usePropertyListing();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handlePublish = async () => {
    try {
      setError(null);
      const { id, slug } = await publishListing();

      // Redirect to the appropriate success page based on seller type
      let successPath = "/venta/particular/success";
      if (data.sellerType === "CORREDOR") {
        successPath = "/venta/corredor/success";
      } else if (data.sellerType === "INMOBILIARIA") {
        successPath = "/venta/inmobiliaria/success";
      }

      router.push(`${successPath}?id=${id}&slug=${slug}`);
    } catch (err) {
      console.error("Error publishing:", err);
      setError(err instanceof Error ? err.message : "Hubo un error al publicar. Por favor intente nuevamente.");
    }
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

  const mainPhoto = data.photos && data.photos.length > 0
    ? data.photos[data.mainPhotoIndex || 0]
    : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
        <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Revisa y Publica
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Verifica que toda la informaci&oacute;n sea correcta antes de publicar
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Completion Status */}
      {!isFormComplete() && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
            Informaci&oacute;n Incompleta
          </h4>
          <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
            Por favor completa todos los campos requeridos antes de publicar:
          </p>
          <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
            {!data.street && <li>&bull; Direcci&oacute;n completa</li>}
            {!data.type && <li>&bull; Tipo de propiedad</li>}
            {!data.status && <li>&bull; Operaci&oacute;n (Venta/Renta)</li>}
            {!data.price && <li>&bull; Precio</li>}
            {!data.area && <li>&bull; &Aacute;rea</li>}
            {!data.description && <li>&bull; Descripci&oacute;n</li>}
            {(!data.photos || data.photos.length === 0) && <li>&bull; Al menos una foto</li>}
            {!data.contactName && <li>&bull; Nombre de contacto</li>}
            {!data.contactEmail && <li>&bull; Email de contacto</li>}
            {!data.contactPhone && <li>&bull; Tel&eacute;fono de contacto</li>}
          </ul>
        </div>
      )}

      {/* Property Preview Card */}
      <div className="border-2 border-border rounded-lg overflow-hidden bg-card">
        {/* Main Photo */}
        {mainPhoto ? (
          <div className="relative aspect-video bg-muted">
            <img
              src={mainPhoto.url}
              alt="Vista principal"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">Sin fotos</p>
          </div>
        )}

        <div className="p-6">
          {/* Price and Summary */}
          <div className="mb-6">
            <p className="text-3xl font-bold text-foreground mb-2">
              {data.price ? formatMXN(data.price) : "Sin precio"}
            </p>
            {data.status === "RENTA" && (
              <p className="text-sm text-muted-foreground mb-2">por mes</p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {data.bedrooms && (
                <span>{data.bedrooms} rec</span>
              )}
              {data.bathrooms && (
                <span>{data.bathrooms} ba&ntilde;os</span>
              )}
              {data.area && (
                <span>{data.area} m&sup2;</span>
              )}
            </div>
          </div>

          {/* Address */}
          <div className="mb-6">
            <p className="text-foreground font-medium">
              {data.street && data.exteriorNumber
                ? `${data.street} ${data.exteriorNumber}`
                : "Sin direcci&oacute;n"}
              {data.interiorNumber && ` Int. ${data.interiorNumber}`}
            </p>
            <p className="text-muted-foreground text-sm">
              {data.colonia && `${data.colonia}, `}
              {data.municipality && `${data.municipality}, `}
              {data.state}
            </p>
          </div>

          {/* Property Type */}
          {data.type && (
            <div className="mb-6">
              <span className="inline-block px-3 py-1 bg-muted text-foreground rounded-full text-sm font-medium">
                {PROPERTY_TYPE_LABELS[data.type as keyof typeof PROPERTY_TYPE_LABELS]}
              </span>
            </div>
          )}

          {/* Property Details Section */}
          <div className="border-t border-border pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Detalles de la Propiedad
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Informaci&oacute;n adicional que ayudar&aacute; a los compradores
                  </p>
                </div>
              </div>
              {data.status && (
                <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                  {data.status === "VENTA" ? "En Venta" : "En Renta"}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Descripci&oacute;n {!data.description && <span className="text-red-500">*</span>}
              </label>
              {data.description ? (
                <div className="px-3 py-2 border border-border rounded-md bg-muted text-sm text-foreground whitespace-pre-line min-h-[100px]">
                  {data.description}
                </div>
              ) : (
                <div className="px-3 py-2 border border-border rounded-md bg-muted text-sm text-muted-foreground min-h-[100px]">
                  Describa su propiedad...
                </div>
              )}
            </div>

            {/* Additional Details */}
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  A&ntilde;o de Construcci&oacute;n
                </label>
                <div className="px-3 py-2 border border-border rounded-md bg-muted text-sm text-foreground">
                  {data.yearBuilt ? data.yearBuilt : "No especificado"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Estacionamientos
                </label>
                <div className="px-3 py-2 border border-border rounded-md bg-muted text-sm text-foreground">
                  {data.parkingSpaces !== undefined ? data.parkingSpaces : "No especificado"}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Pisos/Niveles
                </label>
                <div className="px-3 py-2 border border-border rounded-md bg-muted text-sm text-foreground">
                  {data.floors ? data.floors : "No especificado"}
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-3">
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
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50"
                          : "border-border bg-card"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-blue-600 bg-blue-600"
                            : "border-border bg-card"
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
                      <span className="text-sm font-medium text-foreground">
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
          Editar Direcci&oacute;n
        </Button>
        <Button
          variant="outline"
          onClick={() => setCurrentStep(2)}
          className="gap-2"
        >
          <Edit className="w-4 h-4" />
          Editar Datos B&aacute;sicos
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
      <div className="pt-6 border-t border-border">
        <Button
          onClick={handlePublish}
          disabled={!isFormComplete() || isPublishing}
          className="w-full py-6 text-lg gap-2"
          size="lg"
        >
          <Rocket className="w-5 h-5" />
          {isPublishing ? "Publicando..." : "Publicar Propiedad"}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-3">
          Al publicar, aceptas nuestros t&eacute;rminos y condiciones
        </p>
      </div>
    </div>
  );
}
