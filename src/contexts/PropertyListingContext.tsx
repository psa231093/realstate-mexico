"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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
  photos?: string[];
  mainPhotoIndex?: number;

  // Step 5: Contact
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  preferredContact?: string;
  availableShowingTimes?: string;
}

interface PropertyListingContextType {
  data: PropertyListingData;
  updateData: (newData: Partial<PropertyListingData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  saveDraft: () => void;
  loadDraft: () => void;
  clearDraft: () => void;
  publishListing: () => void;
}

const PropertyListingContext = createContext<PropertyListingContextType | undefined>(undefined);

const STORAGE_KEY = "property_listing_draft";
const PUBLISHED_LISTINGS_KEY = "published_listings";

export function PropertyListingProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<PropertyListingData>({});
  const [currentStep, setCurrentStep] = useState(1);

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
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ data, currentStep }));
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

  const publishListing = () => {
    try {
      // Get existing published listings
      const existing = localStorage.getItem(PUBLISHED_LISTINGS_KEY);
      const listings = existing ? JSON.parse(existing) : [];

      // Add new listing with timestamp and ID
      const newListing = {
        id: `listing_${Date.now()}`,
        ...data,
        publishedAt: new Date().toISOString(),
        sellerType: "PARTICULAR",
      };

      listings.push(newListing);
      localStorage.setItem(PUBLISHED_LISTINGS_KEY, JSON.stringify(listings));

      // Clear draft after publishing
      clearDraft();

      return newListing;
    } catch (error) {
      console.error("Failed to publish listing:", error);
      throw error;
    }
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
