"use client";

import { usePropertyListing, PropertyPhoto } from "@/contexts/PropertyListingContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload, Star, X, AlertCircle } from "lucide-react";
import { useState } from "react";

export function PhotosStep() {
  const { data, updateData, uploadPhoto } = usePropertyListing();
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false);

  const hasPhotos = data.photos && data.photos.length > 0;
  const showError = hasAttemptedNext && !hasPhotos;

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const handleFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newPhotos: PropertyPhoto[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith("image/")) {
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert(`El archivo ${file.name} es demasiado grande. Máximo 10MB.`);
          continue;
        }

        if (user) {
          // User is logged in - upload directly to Supabase
          try {
            const uploaded = await uploadPhoto(file);
            newPhotos.push(uploaded);
          } catch (error) {
            console.error("Error uploading image:", error);
            // Fallback to local preview
            const base64 = await fileToBase64(file);
            newPhotos.push({
              url: base64,
              file,
              isUploaded: false,
            });
          }
        } else {
          // User not logged in - store locally for now
          const base64 = await fileToBase64(file);
          newPhotos.push({
            url: base64,
            file,
            isUploaded: false,
          });
        }

        setUploadProgress(Math.round(((i + 1) / files.length) * 100));
      }

      const currentPhotos = data.photos || [];
      updateData({ photos: [...currentPhotos, ...newPhotos] });
    } catch (error) {
      console.error("Error processing images:", error);
      alert("Hubo un error al procesar las imágenes. Por favor intente nuevamente.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    handleFiles(files);
  };

  const removePhoto = (index: number) => {
    const currentPhotos = data.photos || [];
    const updated = currentPhotos.filter((_, i) => i !== index);
    updateData({
      photos: updated,
      mainPhotoIndex: data.mainPhotoIndex === index ? 0 : data.mainPhotoIndex
    });
  };

  const setMainPhoto = (index: number) => {
    updateData({ mainPhotoIndex: index });
  };

  const movePhoto = (fromIndex: number, direction: "left" | "right") => {
    const currentPhotos = data.photos || [];
    const toIndex = direction === "left" ? fromIndex - 1 : fromIndex + 1;

    if (toIndex < 0 || toIndex >= currentPhotos.length) return;

    const updated = [...currentPhotos];
    [updated[fromIndex], updated[toIndex]] = [updated[toIndex], updated[fromIndex]];

    updateData({ photos: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
        <ImageIcon className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Fotos de la Propiedad <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Las propiedades con fotos de calidad reciben hasta 5x m&aacute;s consultas
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/50"
            : showError
            ? "border-red-400 bg-red-50 dark:bg-red-950/30"
            : "border-border bg-muted hover:border-muted-foreground"
        }`}
      >
        <Upload className={`w-12 h-12 mx-auto mb-4 ${showError ? "text-red-400" : "text-muted-foreground"}`} />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Arrastra fotos aqu&iacute;
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          o haz clic para seleccionar archivos
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={isUploading}
        />
        <label htmlFor="file-upload">
          <Button type="button" variant="outline" asChild disabled={isUploading}>
            <span className="cursor-pointer">
              {isUploading ? "Subiendo..." : "Seleccionar Fotos"}
            </span>
          </Button>
        </label>
        <p className="text-xs text-muted-foreground mt-3">
          Formatos aceptados: JPG, PNG, WEBP, GIF. M&aacute;ximo 10MB por imagen.
        </p>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-4">
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-primary font-medium">
              Subiendo im&aacute;genes... {uploadProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Error Message */}
      {showError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-700">
            Debes subir al menos una foto de la propiedad
          </p>
        </div>
      )}

      {/* Photo Guidelines */}
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
        <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
          Consejos para mejores fotos
        </h4>
        <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-1">
          <li>&bull; Toma fotos en buena iluminaci&oacute;n natural</li>
          <li>&bull; Incluye todas las habitaciones y &aacute;reas principales</li>
          <li>&bull; Muestra las mejores caracter&iacute;sticas de la propiedad</li>
          <li>&bull; Mant&eacute;n los espacios limpios y ordenados</li>
          <li>&bull; Evita fotos borrosas o mal encuadradas</li>
        </ul>
      </div>

      {/* Photos Grid */}
      {data.photos && data.photos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">
            Fotos Subidas ({data.photos.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.photos.map((photo, index) => (
              <div
                key={index}
                className="relative group aspect-video bg-muted rounded-lg overflow-hidden border-2 border-border"
              >
                <img
                  src={photo.url}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Upload Status Badge */}
                {!photo.isUploaded && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Local
                  </div>
                )}

                {/* Main Photo Badge */}
                {data.mainPhotoIndex === index && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" />
                    Principal
                  </div>
                )}

                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setMainPhoto(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Establecer como principal"
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                  {index > 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => movePhoto(index, "left")}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Mover a la izquierda"
                    >
                      &larr;
                    </Button>
                  )}
                  {index < (data.photos?.length || 0) - 1 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => movePhoto(index, "right")}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Mover a la derecha"
                    >
                      &rarr;
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removePhoto(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Eliminar"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Export validation function for use in wizard
export function validatePhotosStep(data: {
  photos?: { url: string; isUploaded: boolean }[];
}): boolean {
  return !!(data.photos && data.photos.length > 0);
}
