"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Share2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("id");

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ¡Propiedad Publicada!
          </h1>
          <p className="text-xl text-gray-600">
            Tu propiedad ha sido publicada exitosamente
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            ¿Qué sigue?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Revisión de la Publicación
                </h3>
                <p className="text-sm text-gray-600">
                  Tu propiedad será revisada por nuestro equipo en las próximas 24
                  horas para asegurar la calidad del contenido.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Recibe Contactos
                </h3>
                <p className="text-sm text-gray-600">
                  Los compradores interesados podrán contactarte a través de los
                  medios que proporcionaste.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  Gestiona tu Publicación
                </h3>
                <p className="text-sm text-gray-600">
                  Podrás editar, pausar o eliminar tu publicación en cualquier
                  momento desde tu panel de control.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Listing ID */}
        {listingId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
            <p className="text-sm text-gray-600 mb-1">ID de Publicación</p>
            <p className="font-mono text-lg font-semibold text-gray-900">
              {listingId}
            </p>
          </div>
        )}

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-3">
            💡 Consejos para vender más rápido
          </h3>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• Responde rápidamente a las consultas de los interesados</li>
            <li>• Mantén tu disponibilidad actualizada para visitas</li>
            <li>• Comparte tu publicación en redes sociales</li>
            <li>• Sé flexible con los horarios de visita</li>
            <li>• Mantén la propiedad limpia y presentable</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              Volver al Inicio
            </Link>
          </Button>
          <Button className="gap-2" asChild>
            <Link href="/venta/particular">
              Publicar Otra Propiedad
            </Link>
          </Button>
        </div>

        {/* Share */}
        <div className="mt-6 text-center">
          <Button variant="ghost" className="gap-2">
            <Share2 className="w-4 h-4" />
            Compartir Publicación
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
