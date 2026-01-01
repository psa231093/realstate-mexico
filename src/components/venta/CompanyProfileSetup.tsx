"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  FileText,
  Globe,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Users
} from "lucide-react";

interface CompanyProfileData {
  companyName: string;
  phone: string;
  email: string;
  description: string;
  rfc: string;
  address: string;
  website: string;
  logoUrl?: string;
}

interface CompanyProfileSetupProps {
  onComplete: (profileData: CompanyProfileData) => void;
  existingProfile?: CompanyProfileData | null;
}

export function CompanyProfileSetup({ onComplete, existingProfile }: CompanyProfileSetupProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formData, setFormData] = useState<CompanyProfileData>({
    companyName: existingProfile?.companyName || "",
    phone: existingProfile?.phone || "",
    email: existingProfile?.email || user?.email || "",
    description: existingProfile?.description || "",
    rfc: existingProfile?.rfc || "",
    address: existingProfile?.address || "",
    website: existingProfile?.website || "",
    logoUrl: existingProfile?.logoUrl || "",
  });

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const updateField = (field: keyof CompanyProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getErrors = () => {
    const errors: Partial<Record<keyof CompanyProfileData, string>> = {};

    if (!formData.companyName?.trim()) {
      errors.companyName = "El nombre de la empresa es requerido";
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
    if (!formData.description?.trim()) {
      errors.description = "Una descripción de la empresa es requerida";
    } else if (formData.description.trim().length < 50) {
      errors.description = `Mínimo 50 caracteres (${formData.description.trim().length}/50)`;
    }
    if (!formData.address?.trim()) {
      errors.address = "La dirección de la oficina es requerida";
    }

    return errors;
  };

  const errors = getErrors();
  const isValid = Object.keys(errors).length === 0;

  const handleSubmit = async () => {
    // Mark all fields as touched to show errors
    setTouched({
      companyName: true,
      phone: true,
      email: true,
      description: true,
      address: true,
    });

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real implementation, save profile to database
      await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API call
      onComplete(formData);
    } catch (error) {
      console.error("Error saving company profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (field: keyof CompanyProfileData) => {
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
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Configura el Perfil de tu Inmobiliaria
          </h1>
          <p className="text-muted-foreground">
            La información de tu empresa aparecerá en todas las publicaciones
          </p>
        </div>

        {/* Benefits Banner */}
        <div className="mb-8 p-4 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg">
          <div className="flex items-start gap-3">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                Perfil Empresarial
              </h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Tu perfil de empresa se usará para todas las propiedades que publiques.
                Genera confianza con clientes mostrando tu marca profesional.
              </p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-lg shadow-md p-8 border border-border">
          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Nombre de la Empresa <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  placeholder="Ej: Grupo Inmobiliario Premier"
                  value={formData.companyName}
                  onChange={(e) => updateField("companyName", e.target.value)}
                  onBlur={() => handleBlur("companyName")}
                  className={`pl-10 ${getInputClass("companyName")}`}
                />
              </div>
              {touched.companyName && errors.companyName && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.companyName}
                </p>
              )}
            </div>

            {/* Phone and Email */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Teléfono de Oficina <span className="text-red-500">*</span>
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
                    placeholder="contacto@tuinmobiliaria.com"
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

            {/* RFC and Website */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  RFC <span className="text-muted-foreground">(Opcional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    placeholder="Ej: ABC123456XYZ"
                    value={formData.rfc}
                    onChange={(e) => updateField("rfc", e.target.value.toUpperCase())}
                    className="pl-10"
                    maxLength={13}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Mostrar tu RFC genera más confianza
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Sitio Web <span className="text-muted-foreground">(Opcional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <Input
                    placeholder="www.tuinmobiliaria.com"
                    value={formData.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Office Address */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Dirección de Oficina <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <Input
                  placeholder="Ej: Av. Paseo de la Reforma 222, Col. Juárez, CDMX"
                  value={formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  onBlur={() => handleBlur("address")}
                  className={`pl-10 ${getInputClass("address")}`}
                />
              </div>
              {touched.address && errors.address && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.address}
                </p>
              )}
            </div>

            {/* Company Description */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Acerca de la Empresa <span className="text-red-500">*</span>
              </label>
              <textarea
                placeholder="Describe tu inmobiliaria, años de experiencia, especialidades, áreas de servicio..."
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                onBlur={() => handleBlur("description")}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 bg-background text-foreground ${
                  touched.description && errors.description
                    ? "border-red-500 focus:ring-red-500"
                    : "border-input focus:ring-ring"
                }`}
              />
              {touched.description && errors.description ? (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.description}
                </p>
              ) : (
                <p className={`text-xs mt-1 ${formData.description.length >= 50 ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                  {formData.description.length}/50 caracteres mínimo
                  {formData.description.length >= 50 && " ✓"}
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
            Podrás editar el perfil de tu empresa en cualquier momento desde el panel de control
          </p>
        </div>
      </div>
    </div>
  );
}
