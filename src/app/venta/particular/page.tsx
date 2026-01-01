"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { PropertyListingProvider, usePropertyListing } from "@/contexts/PropertyListingContext";
import { PropertyListingWizard } from "@/components/venta/PropertyListingWizard";
import { Loader2, User } from "lucide-react";

function ParticularContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { updateData } = usePropertyListing();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/venta");
      return;
    }

    if (user) {
      // Set seller type for Particular
      updateData({
        sellerType: "PARTICULAR",
      });
    }
  }, [user, authLoading, router, updateData]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div>
      {/* Seller Badge */}
      <div className="bg-green-600 text-white py-2 px-4">
        <div className="container mx-auto flex items-center gap-2">
          <User className="w-4 h-4" />
          <span className="text-sm font-medium">
            Publicando como: <strong>Dueño Directo</strong>
          </span>
        </div>
      </div>
      <PropertyListingWizard />
    </div>
  );
}

export default function ParticularPage() {
  return (
    <PropertyListingProvider>
      <ParticularContent />
    </PropertyListingProvider>
  );
}
