"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { PropertyListingProvider, usePropertyListing } from "@/contexts/PropertyListingContext";
import { CompanyProfileSetup } from "@/components/venta/CompanyProfileSetup";
import { PropertyListingWizard } from "@/components/venta/PropertyListingWizard";
import { Loader2, Building2 } from "lucide-react";

interface CompanyProfile {
  companyName: string;
  phone: string;
  email: string;
  description: string;
  rfc: string;
  address: string;
  website: string;
  logoUrl?: string;
}

function InmobiliariaContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { updateData } = usePropertyListing();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/venta");
      return;
    }

    if (user) {
      // Check if company has a saved profile (from localStorage for now)
      // In production, this would be fetched from the database
      const savedProfile = localStorage.getItem(`company_profile_${user.id}`);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile) as CompanyProfile;
        setCompanyProfile(profile);
        setHasProfile(true);
        // Pre-populate contact info in the property listing context
        updateData({
          contactName: profile.companyName,
          contactEmail: profile.email,
          contactPhone: profile.phone,
          preferredContact: "phone",
          sellerType: "INMOBILIARIA",
        });
      } else {
        setHasProfile(false);
      }
      setIsLoading(false);
    }
  }, [user, authLoading, router, updateData]);

  const handleProfileComplete = (profileData: CompanyProfile) => {
    if (!user) return;

    // Save profile to localStorage (in production, save to database)
    localStorage.setItem(`company_profile_${user.id}`, JSON.stringify(profileData));
    setCompanyProfile(profileData);
    setHasProfile(true);

    // Pre-populate contact info
    updateData({
      contactName: profileData.companyName,
      contactEmail: profileData.email,
      contactPhone: profileData.phone,
      preferredContact: "phone",
      sellerType: "INMOBILIARIA",
    });
  };

  if (authLoading || isLoading) {
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

  // Show company profile setup if they don't have one yet
  if (!hasProfile) {
    return (
      <CompanyProfileSetup
        onComplete={handleProfileComplete}
        existingProfile={companyProfile}
      />
    );
  }

  // Show property listing wizard with pre-filled contact info
  return (
    <div>
      {/* Company Badge */}
      <div className="bg-purple-600 text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span className="text-sm font-medium">
              Publicando como: <strong>{companyProfile?.companyName}</strong>
            </span>
          </div>
          <button
            onClick={() => setHasProfile(false)}
            className="text-xs underline hover:no-underline"
          >
            Editar perfil
          </button>
        </div>
      </div>
      <PropertyListingWizard />
    </div>
  );
}

export default function InmobiliariaPage() {
  return (
    <PropertyListingProvider>
      <InmobiliariaContent />
    </PropertyListingProvider>
  );
}
