"use client";

import { PropertyListingProvider } from "@/contexts/PropertyListingContext";
import { PropertyListingWizard } from "@/components/venta/PropertyListingWizard";

export default function ParticularPage() {
  return (
    <PropertyListingProvider>
      <div className="min-h-screen bg-gray-50">
        <PropertyListingWizard />
      </div>
    </PropertyListingProvider>
  );
}
