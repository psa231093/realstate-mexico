"use client";

import { useState } from "react";
import { usePropertyListing } from "@/contexts/PropertyListingContext";
import { Input } from "@/components/ui/input";
import { Phone, Mail, User, AlertCircle } from "lucide-react";

interface FieldError {
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  preferredContact?: string;
}

export function ContactStep() {
  const { data, updateData } = usePropertyListing();
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePreferredContactSelect = (method: string) => {
    setTouched((prev) => ({ ...prev, preferredContact: true }));
    updateData({ preferredContact: method });
  };

  const getErrors = (): FieldError => {
    const errors: FieldError = {};

    if (!data.contactName?.trim()) {
      errors.contactName = "El nombre es requerido";
    }
    if (!data.contactEmail?.trim()) {
      errors.contactEmail = "El correo electrónico es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      errors.contactEmail = "Ingresa un correo electrónico válido";
    }
    if (!data.contactPhone?.trim()) {
      errors.contactPhone = "El teléfono es requerido";
    } else if (!/^\d{10}$/.test(data.contactPhone.replace(/\s/g, ""))) {
      errors.contactPhone = "El teléfono debe tener 10 dígitos";
    }
    if (!data.preferredContact) {
      errors.preferredContact = "Selecciona un método de contacto preferido";
    }

    return errors;
  };

  const errors = getErrors();

  const getInputClass = (field: keyof FieldError) => {
    const hasError = touched[field] && errors[field];
    return hasError
      ? "border-red-500 focus:ring-red-500 focus:border-red-500"
      : "";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
        <User className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
            Información de Contacto
          </h3>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Los compradores interesados podrán comunicarse contigo
          </p>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
          Tu privacidad está protegida
        </h4>
        <p className="text-sm text-green-800 dark:text-green-200">
          Tu información de contacto solo se mostrará a compradores verificados y
          seriamente interesados. Nunca compartimos tus datos con terceros.
        </p>
      </div>

      {/* Contact Name */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Nombre Completo <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            placeholder="Ej: Juan Pérez García"
            value={data.contactName || ""}
            onChange={(e) => updateData({ contactName: e.target.value })}
            onBlur={() => handleBlur("contactName")}
            className={`pl-10 ${getInputClass("contactName")}`}
          />
        </div>
        {touched.contactName && errors.contactName && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.contactName}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Correo Electrónico <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="email"
            placeholder="Ej: juan.perez@email.com"
            value={data.contactEmail || ""}
            onChange={(e) => updateData({ contactEmail: e.target.value })}
            onBlur={() => handleBlur("contactEmail")}
            className={`pl-10 ${getInputClass("contactEmail")}`}
          />
        </div>
        {touched.contactEmail && errors.contactEmail && (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.contactEmail}
          </p>
        )}
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Teléfono <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="tel"
            placeholder="Ej: 55 1234 5678"
            value={data.contactPhone || ""}
            onChange={(e) => updateData({ contactPhone: e.target.value })}
            onBlur={() => handleBlur("contactPhone")}
            className={`pl-10 ${getInputClass("contactPhone")}`}
          />
        </div>
        {touched.contactPhone && errors.contactPhone ? (
          <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.contactPhone}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1">
            Incluye código de área (10 dígitos)
          </p>
        )}
      </div>

      {/* Preferred Contact Method */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-3">
          Método de Contacto Preferido <span className="text-red-500">*</span>
        </label>
        <div className="grid md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handlePreferredContactSelect("phone")}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              data.preferredContact === "phone"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50"
                : touched.preferredContact && errors.preferredContact
                ? "border-red-300 bg-card hover:border-red-400"
                : "border-border bg-card hover:border-muted-foreground"
            }`}
          >
            <Phone className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-foreground">Teléfono</span>
          </button>
          <button
            type="button"
            onClick={() => handlePreferredContactSelect("email")}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              data.preferredContact === "email"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50"
                : touched.preferredContact && errors.preferredContact
                ? "border-red-300 bg-card hover:border-red-400"
                : "border-border bg-card hover:border-muted-foreground"
            }`}
          >
            <Mail className="w-6 h-6 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-foreground">Email</span>
          </button>
          <button
            type="button"
            onClick={() => handlePreferredContactSelect("whatsapp")}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              data.preferredContact === "whatsapp"
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950/50"
                : touched.preferredContact && errors.preferredContact
                ? "border-red-300 bg-card hover:border-red-400"
                : "border-border bg-card hover:border-muted-foreground"
            }`}
          >
            <div className="text-2xl mb-2">💬</div>
            <span className="text-sm font-medium text-foreground">WhatsApp</span>
          </button>
        </div>
        {touched.preferredContact && errors.preferredContact && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {errors.preferredContact}
          </p>
        )}
      </div>

      {/* Showing Times */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Horario Disponible para Visitas
        </label>
        <textarea
          placeholder="Ej: Lunes a Viernes de 9am a 6pm, Sábados de 10am a 2pm"
          value={data.availableShowingTimes || ""}
          onChange={(e) => updateData({ availableShowingTimes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="text-xs text-muted-foreground mt-1">
          Ayuda a los compradores a saber cuándo pueden visitar
        </p>
      </div>
    </div>
  );
}

// Export validation function for use in wizard
export function validateContactStep(data: {
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  preferredContact?: string;
}): boolean {
  const emailValid = data.contactEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail);
  const phoneValid = data.contactPhone && /^\d{10}$/.test(data.contactPhone.replace(/\s/g, ""));

  return !!(
    data.contactName?.trim() &&
    emailValid &&
    phoneValid &&
    data.preferredContact
  );
}
