"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Briefcase,
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  Camera,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface AgentProfileData {
  displayName: string;
  phone: string;
  email: string;
  bio: string;
  licenseNumber: string;
  serviceAreas: string;
  photoUrl?: string;
}

interface AgentProfileSetupProps {
  onComplete: (profileData: AgentProfileData) => void;
  existingProfile?: AgentProfileData | null;
}

export function AgentProfileSetup({ onComplete, existingProfile }: AgentProfileSetupProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<AgentProfileData>({
    displayName: existingProfile?.displayName || user?.user_metadata?.full_name || "",
    phone: existingProfile?.phone || "",
    email: existingProfile?.email || user?.email || "",
    bio: existingProfile?.bio || "",
    licenseNumber: existingProfile?.licenseNumber || "",
    serviceAreas: existingProfile?.serviceAreas || "",
    photoUrl: existingProfile?.photoUrl || "",
  });

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const updateField = (field: keyof AgentProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getErrors = () => {
    const errors: Partial<Record<keyof AgentProfileData, string>> = {};

    if (!formData.displayName?.trim()) {
      errors.displayName = "El nombre es requerido";
    }
    if (!formData.phone?.trim()) {
      errors.phone = "El teléfono es requerido";
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      errors.phone = "El teléfono debe tener 10 dígitos";
    }
    if (!formData.email?.trim()) {
      errors.email = "El correo es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Ingresa un correo válido";
    }
    if (!formData.bio?.trim()) {
      errors.bio = "Una breve descripción es requerida";
    } else if (formData.bio.trim().length < 50) {
      errors.bio = `Mínimo 50 caracteres (${formData.bio.trim().length}/50)`;
    }
    if (!formData.serviceAreas?.trim()) {
      errors.serviceAreas = "Las zonas de servicio son requeridas";
    }

    return errors;
  };

  const errors = getErrors();
  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async () => {
    // Mark all fields as touched to show errors
    setTouched({
      displayName: true,
      phone: true,
      email: true,
      bio: true,
      serviceAreas: true,
    });

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real implementation, save profile to database
      // For now, we'll just pass the data to the parent
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      onComplete(formData);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (field: keyof AgentProfileData) => {
    const hasError = touched[field] && errors[field];
    return hasError
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : "";
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Configura tu Perfil de Corredor
          </h1>
          <p className="text-muted-foreground">
            Tu perfil profesional se mostrará en todas tus publicaciones
          </p>
        </div>

        {/* Benefits Banner */}
        <div className="mb-8 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                Solo una vez
              </h3>
              <p className="text-sm text-green-800 dark:text-green-200">
                Configura tu perfil ahora y toda tu información de contacto se llenará
                automáticamente en tus futuras publicaciones.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-lg shadow-md p-8 border border-border">
          <div className="space-y-6">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Nombre Profesional <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  placeholder="Ej: Juan Pérez - Asesor Inmobiliario"
                  value={formData.displayName}
                  onChange={(e) => updateField("displayName", e.target.value)}
                  onBlur={() => handleBlur("displayName")}
                  className={`pl-10 ${getInputClass("displayName")}`}
                />
              </div>
              {touched.displayName && errors.displayName && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.displayName}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                Este nombre aparecerá en tus publicaciones
              </p>
            </div>

            {/* Phone and Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="tel"
                    placeholder="55 1234 5678"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    onBlur={() => handleBlur("phone")}
                    className={`pl-10 ${getInputClass("phone")}`}
                  />
                </div>
                {touched.phone && errors.phone && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={`pl-10 ${getInputClass("email")}`}
                  />
                </div>
                {touched.email && errors.email && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* License Number (Optional) */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Número de Licencia <span className="text-muted-foreground">(Opcional)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  placeholder="Ej: AMPI-12345"
                  value={formData.licenseNumber}
                  onChange={(e) => updateField("licenseNumber", e.target.value)}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Agregar tu licencia genera más confianza con los clientes
              </p>
            </div>

            {/* Service Areas */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Zonas de Servicio <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  placeholder="Ej: Polanco, Condesa, Roma Norte, CDMX"
                  value={formData.serviceAreas}
                  onChange={(e) => updateField("serviceAreas", e.target.value)}
                  onBlur={() => handleBlur("serviceAreas")}
                  className={`pl-10 ${getInputClass("serviceAreas")}`}
                />
              </div>
              {touched.serviceAreas && errors.serviceAreas && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.serviceAreas}
                </p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Acerca de Ti <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe tu experiencia, especialidades y por qué los clientes deberían trabajar contigo..."
                value={formData.bio}
                onChange={(e) => updateField("bio", e.target.value)}
                onBlur={() => handleBlur("bio")}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 bg-background text-foreground ${
                  touched.bio && errors.bio
                    ? "border-red-500 focus:ring-red-500"
                    : "border-input focus:ring-ring"
                }`}
              />
              {touched.bio && errors.bio ? (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.bio}
                </p>
              ) : (
                <p className={`text-xs mt-1 ${formData.bio.length >= 50 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                  {formData.bio.length}/50 caracteres mínimo
                  {formData.bio.length >= 50 && " ✓"}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full py-6 text-lg gap-2"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  Continuar a Publicar Propiedad
                  <span className="ml-2">→</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Podrás editar tu perfil en cualquier momento desde tu panel de control
          </p>
        </div>
      </div>
    </div>
  );
}
