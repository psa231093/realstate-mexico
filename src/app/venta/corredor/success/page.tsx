"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Home,
  Plus,
  Eye,
  MessageSquare,
  Settings,
  TrendingUp,
  Briefcase,
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get("id");
  const slug = searchParams.get("slug");

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            ¡Propiedad Publicada!
          </h1>
          <p className="text-lg text-muted-foreground">
            Tu propiedad ya está visible para miles de compradores potenciales
          </p>
          {propertyId && (
            <p className="text-sm text-muted-foreground mt-2">
              ID de publicación: <span className="font-mono">{propertyId}</span>
            </p>
          )}
        </div>

        {/* Agent Badge */}
        <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                Publicado desde tu perfil de Corredor
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Los interesados verán tu información profesional
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-card rounded-lg shadow-md p-6 mb-8 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Próximos Pasos
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Revisa tu Publicación</h3>
                <p className="text-sm text-muted-foreground">
                  Verifica que todo se vea correctamente en tu anuncio
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Recibe Contactos</h3>
                <p className="text-sm text-muted-foreground">
                  Responde rápidamente a los interesados para cerrar más ventas
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Monitorea el Rendimiento</h3>
                <p className="text-sm text-muted-foreground">
                  Revisa las estadísticas de vistas y contactos en tu panel
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tips for Agents */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-3">
            Tips para Corredores Exitosos
          </h3>
          <ul className="text-sm text-amber-800 dark:text-amber-200 space-y-2">
            <li>• Responde a consultas en menos de 1 hora para mayor conversión</li>
            <li>• Mantén tu perfil y licencia actualizados</li>
            <li>• Publica múltiples propiedades para aumentar tu visibilidad</li>
            <li>• Comparte tus listings en redes sociales</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {slug && (
            <Link href={`/propiedades/${slug}`} className="block">
              <Button variant="outline" className="w-full gap-2" size="lg">
                <Eye className="w-5 h-5" />
                Ver mi Publicación
              </Button>
            </Link>
          )}
          <Link href="/venta/corredor" className="block">
            <Button className="w-full gap-2" size="lg">
              <Plus className="w-5 h-5" />
              Publicar Otra Propiedad
            </Button>
          </Link>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/propiedades">
              <Button variant="outline" className="w-full gap-2">
                <Settings className="w-4 h-4" />
                Mi Panel
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="w-full gap-2">
                <Home className="w-4 h-4" />
                Inicio
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CorredorSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
