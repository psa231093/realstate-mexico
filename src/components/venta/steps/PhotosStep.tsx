"use client";

import { usePropertyListing } from "@/contexts/PropertyListingContext";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Upload, Star, X } from "lucide-react";
import { useState } from "react";

export function PhotosStep() {
  const { data, updateData } = usePropertyListing();
  const [isDragging, setIsDragging] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState(0);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(Array.from(files));
    }
  };

  const compressImage = async (base64Image: string): Promise<string> => {
    try {
      const response = await fetch("/api/compress-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image }),
      });

      if (!response.ok) {
        throw new Error("Compression failed");
      }

      const result = await response.json();
      console.log(
        `Image compressed: ${result.stats.savedPercentage}% reduction`
      );
      return result.compressedImage;
    } catch (error) {
      console.error("Compression error:", error);
      // Return original image if compression fails
      return base64Image;
    }
  };

  const handleFiles = async (files: File[]) => {
    setIsCompressing(true);
    setCompressionProgress(0);

    try {
      // Convert files to base64
      const readers = files.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      });

      const base64Images = await Promise.all(readers);

      // Compress each image
      const compressedImages: string[] = [];
      for (let i = 0; i < base64Images.length; i++) {
        const compressed = await compressImage(base64Images[i]);
        compressedImages.push(compressed);
        setCompressionProgress(Math.round(((i + 1) / base64Images.length) * 100));
      }

      const currentPhotos = data.photos || [];
      updateData({ photos: [...currentPhotos, ...compressedImages] });
    } catch (error) {
      console.error("Error processing images:", error);
      alert("Hubo un error al procesar las imágenes. Por favor intente nuevamente.");
    } finally {
      setIsCompressing(false);
      setCompressionProgress(0);
    }
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
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <ImageIcon className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">
            Fotos de la Propiedad
          </h3>
          <p className="text-sm text-blue-700">
            Las propiedades con fotos de calidad reciben hasta 5x más consultas
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
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Arrastra fotos aquí
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          o haz clic para seleccionar archivos
        </p>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
          disabled={isCompressing}
        />
        <label htmlFor="file-upload">
          <Button type="button" variant="outline" asChild disabled={isCompressing}>
            <span className="cursor-pointer">
              {isCompressing ? "Procesando..." : "Seleccionar Fotos"}
            </span>
          </Button>
        </label>
        <p className="text-xs text-gray-500 mt-3">
          Formatos aceptados: JPG, PNG, WEBP. Máximo 10MB por imagen.
        </p>

        {/* Compression Progress */}
        {isCompressing && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${compressionProgress}%` }}
              />
            </div>
            <p className="text-sm text-blue-600 font-medium">
              Optimizando imágenes... {compressionProgress}%
            </p>
          </div>
        )}
      </div>

      {/* Photo Guidelines */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h4 className="font-semibold text-amber-900 mb-2">
          💡 Consejos para mejores fotos
        </h4>
        <ul className="text-sm text-amber-800 space-y-1">
          <li>• Toma fotos en buena iluminación natural</li>
          <li>• Incluye todas las habitaciones y áreas principales</li>
          <li>• Muestra las mejores características de la propiedad</li>
          <li>• Mantén los espacios limpios y ordenados</li>
          <li>• Evita fotos borrosas o mal encuadradas</li>
        </ul>
      </div>

      {/* Optimization Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">
          ✨ Optimización Automática
        </h4>
        <p className="text-sm text-green-800">
          Tus imágenes serán optimizadas automáticamente para reducir el tamaño del
          archivo sin perder calidad, ahorrando espacio de almacenamiento y mejorando
          la velocidad de carga.
        </p>
      </div>

      {/* Photos Grid */}
      {data.photos && data.photos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Fotos Subidas ({data.photos.length})
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.photos.map((photo, index) => (
              <div
                key={index}
                className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200"
              >
                <img
                  src={photo}
                  alt={`Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />

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
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                  {index > 0 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => movePhoto(index, "left")}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ←
                    </Button>
                  )}
                  {index < (data.photos?.length || 0) - 1 && (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => movePhoto(index, "right")}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      →
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removePhoto(index)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
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
