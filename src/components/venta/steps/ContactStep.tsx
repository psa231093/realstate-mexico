"use client";

import { usePropertyListing } from "@/contexts/PropertyListingContext";
import { Input } from "@/components/ui/input";
import { Phone, Mail, User } from "lucide-react";

export function ContactStep() {
  const { data, updateData } = usePropertyListing();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <User className="w-5 h-5 text-blue-600 mt-0.5" />
        <div>
          <h3 className="font-semibold text-blue-900 mb-1">
            Información de Contacto
          </h3>
          <p className="text-sm text-blue-700">
            Los compradores interesados podrán comunicarse contigo
          </p>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-900 mb-2">
          🔒 Tu privacidad está protegida
        </h4>
        <p className="text-sm text-green-800">
          Tu información de contacto solo se mostrará a compradores verificados y
          seriamente interesados. Nunca compartimos tus datos con terceros.
        </p>
      </div>

      {/* Contact Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
            className="pl-10"
            required
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
            className="pl-10"
            required
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
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
            className="pl-10"
            required
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Incluye código de área (10 dígitos)
        </p>
      </div>

      {/* Preferred Contact Method */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Método de Contacto Preferido <span className="text-red-500">*</span>
        </label>
        <div className="grid md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => updateData({ preferredContact: "phone" })}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              data.preferredContact === "phone"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          >
            <Phone className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <span className="text-sm font-medium">Teléfono</span>
          </button>
          <button
            type="button"
            onClick={() => updateData({ preferredContact: "email" })}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              data.preferredContact === "email"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          >
            <Mail className="w-6 h-6 mx-auto mb-2 text-blue-600" />
            <span className="text-sm font-medium">Email</span>
          </button>
          <button
            type="button"
            onClick={() => updateData({ preferredContact: "whatsapp" })}
            className={`p-4 border-2 rounded-lg text-center transition-all ${
              data.preferredContact === "whatsapp"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-white hover:border-gray-400"
            }`}
          >
            <div className="text-2xl mb-2">💬</div>
            <span className="text-sm font-medium">WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Showing Times */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Horario Disponible para Visitas
        </label>
        <textarea
          placeholder="Ej: Lunes a Viernes de 9am a 6pm, Sábados de 10am a 2pm"
          value={data.availableShowingTimes || ""}
          onChange={(e) => updateData({ availableShowingTimes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Ayuda a los compradores a saber cuándo pueden visitar
        </p>
      </div>
    </div>
  );
}
