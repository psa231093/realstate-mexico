"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export interface PropertyPhoto {
  url: string;
  file?: File;
  isUploaded: boolean;
}

export interface PropertyListingData {
  // Step 1: Address
  street?: string;
  exteriorNumber?: string;
  interiorNumber?: string;
  colonia?: string;
  municipality?: string;
  state?: string;
  postalCode?: string;

  // Step 2: Basics
  type?: string;
  status?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;

  // Step 3: Details
  description?: string;
  yearBuilt?: number;
  parkingSpaces?: number;
  floors?: number;
  amenities?: string[];

  // Step 4: Photos
  photos?: PropertyPhoto[];
  mainPhotoIndex?: number;

  // Step 5: Contact
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  preferredContact?: string;
  availableShowingTimes?: string;

  // Seller info
  sellerType?: string;
}

interface PropertyListingContextType {
  data: PropertyListingData;
  updateData: (newData: Partial<PropertyListingData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  saveDraft: () => void;
  loadDraft: () => void;
  clearDraft: () => void;
  publishListing: () => Promise<{ id: string; slug: string }>;
  isPublishing: boolean;
  uploadPhoto: (file: File) => Promise<PropertyPhoto>;
}

const PropertyListingContext = createContext<PropertyListingContextType | undefined>(undefined);

const STORAGE_KEY = "property_listing_draft";

export function PropertyListingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PropertyListingData>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isPublishing, setIsPublishing] = useState(false);
  const supabase = createClient();

  // Load draft from localStorage on mount
  useEffect(() => {
    loadDraft();
  }, []);

  // Auto-save draft whenever data changes
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      saveDraft();
    }
  }, [data]);

  const updateData = (newData: Partial<PropertyListingData>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  const saveDraft = () => {
    try {
      // Save to localStorage but exclude File objects (they can't be serialized)
      const dataToSave = {
        ...data,
        photos: data.photos?.map(p => ({ url: p.url, isUploaded: p.isUploaded }))
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data: dataToSave, currentStep }));
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  };

  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setData(parsed.data || {});
        setCurrentStep(parsed.currentStep || 1);
      }
    } catch (error) {
      console.error("Failed to load draft:", error);
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setData({});
      setCurrentStep(1);
    } catch (error) {
      console.error("Failed to clear draft:", error);
    }
  };

  const uploadPhoto = async (file: File): Promise<PropertyPhoto> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const result = await response.json();
    return {
      url: result.url,
      isUploaded: true,
    };
  };

  const publishListing = async (): Promise<{ id: string; slug: string }> => {
    setIsPublishing(true);

    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Debes iniciar sesión para publicar");
      }

      // Upload any photos that haven't been uploaded yet
      const uploadedPhotos: string[] = [];
      if (data.photos && data.photos.length > 0) {
        for (const photo of data.photos) {
          if (photo.isUploaded) {
            uploadedPhotos.push(photo.url);
          } else if (photo.file) {
            const uploaded = await uploadPhoto(photo.file);
            uploadedPhotos.push(uploaded.url);
          }
        }
      }

      // Generate title from property details
      const title = generateTitle();

      // Prepare property data for API
      const propertyData = {
        title,
        description: data.description || "",
        type: data.type,
        status: data.status,
        price: data.price,
        bedrooms: data.bedrooms || null,
        bathrooms: data.bathrooms || null,
        parkingSpaces: data.parkingSpaces || null,
        areaTotal: data.area || null,
        yearBuilt: data.yearBuilt || null,
        street: data.street,
        exteriorNumber: data.exteriorNumber || null,
        interiorNumber: data.interiorNumber || null,
        colonia: data.colonia,
        municipality: data.municipality,
        state: data.state,
        postalCode: data.postalCode,
        amenities: data.amenities ? { items: data.amenities } : null,
        mainImageUrl: uploadedPhotos.length > 0
          ? uploadedPhotos[data.mainPhotoIndex || 0]
          : null,
        sellerType: data.sellerType,
      };

      // Create property via API
      const response = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(propertyData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al publicar la propiedad");
      }

      const property = await response.json();

      // Add images to property if we have any
      if (uploadedPhotos.length > 0) {
        const imagesResponse = await fetch(`/api/properties/${property.id}/images`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            images: uploadedPhotos.map((url, index) => ({
              url,
              alt: `${title} - Imagen ${index + 1}`,
            })),
          }),
        });

        if (!imagesResponse.ok) {
          console.error("Error adding images to property");
        }
      }

      // Clear draft after successful publish
      clearDraft();

      return { id: property.id, slug: property.slug };
    } finally {
      setIsPublishing(false);
    }
  };

  const generateTitle = (): string => {
    const typeLabels: Record<string, string> = {
      CASA: "Casa",
      DEPARTAMENTO: "Departamento",
      TERRENO: "Terreno",
      LOCAL_COMERCIAL: "Local Comercial",
      OFICINA: "Oficina",
      BODEGA: "Bodega",
      RANCHO: "Rancho",
    };

    const typeName = typeLabels[data.type || "CASA"] || "Propiedad";
    const statusText = data.status === "RENTA" ? "en Renta" : "en Venta";
    const location = data.colonia || data.municipality || data.state || "";

    return `${typeName} ${statusText}${location ? ` en ${location}` : ""}`;
  };

  return (
    <PropertyListingContext.Provider
      value={{
        data,
        updateData,
        currentStep,
        setCurrentStep,
        saveDraft,
        loadDraft,
        clearDraft,
        publishListing,
        isPublishing,
        uploadPhoto,
      }}
    >
      {children}
    </PropertyListingContext.Provider>
  );
}

export function usePropertyListing() {
  const context = useContext(PropertyListingContext);
  if (!context) {
    throw new Error("usePropertyListing must be used within PropertyListingProvider");
  }
  return context;
}
