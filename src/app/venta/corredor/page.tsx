"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { PropertyListingProvider, usePropertyListing } from "@/contexts/PropertyListingContext";
import { AgentProfileSetup } from "@/components/venta/AgentProfileSetup";
import { PropertyListingWizard } from "@/components/venta/PropertyListingWizard";
import { Loader2 } from "lucide-react";

interface AgentProfile {
  displayName: string;
  phone: string;
  email: string;
  bio: string;
  licenseNumber: string;
  serviceAreas: string;
  photoUrl?: string;
}

function CorredorContent() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { updateData } = usePropertyListing();
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [agentProfile, setAgentProfile] = useState<AgentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/venta");
      return;
    }

    if (user) {
      // Check if agent has a saved profile (from localStorage for now)
      // In production, this would be fetched from the database
      const savedProfile = localStorage.getItem(`agent_profile_${user.id}`);
      if (savedProfile) {
        const profile = JSON.parse(savedProfile) as AgentProfile;
        setAgentProfile(profile);
        setHasProfile(true);
        // Pre-populate contact info in the property listing context
        updateData({
          contactName: profile.displayName,
          contactEmail: profile.email,
          contactPhone: profile.phone,
          preferredContact: "phone",
          sellerType: "CORREDOR",
        });
      } else {
        setHasProfile(false);
      }
      setIsLoading(false);
    }
  }, [user, authLoading, router, updateData]);

  const handleProfileComplete = (profileData: AgentProfile) => {
    if (!user) return;

    // Save profile to localStorage (in production, save to database)
    localStorage.setItem(`agent_profile_${user.id}`, JSON.stringify(profileData));
    setAgentProfile(profileData);
    setHasProfile(true);

    // Pre-populate contact info
    updateData({
      contactName: profileData.displayName,
      contactEmail: profileData.email,
      contactPhone: profileData.phone,
      preferredContact: "phone",
      sellerType: "CORREDOR",
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

  // Show profile setup if agent doesn't have a profile yet
  if (!hasProfile) {
    return (
      <AgentProfileSetup
        onComplete={handleProfileComplete}
        existingProfile={agentProfile}
      />
    );
  }

  // Show property listing wizard with pre-filled contact info
  return (
    <div>
      {/* Agent Badge */}
      <div className="bg-blue-600 text-white py-2 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              Publicando como: <strong>{agentProfile?.displayName}</strong>
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

export default function CorredorPage() {
  return (
    <PropertyListingProvider>
      <CorredorContent />
    </PropertyListingProvider>
  );
}
