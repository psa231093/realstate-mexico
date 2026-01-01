"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { SellerTypeCard } from "@/components/venta/SellerTypeCard";
import { AuthModal } from "@/components/auth/AuthModal";
import { User, Building2, Briefcase } from "lucide-react";

export default function VentaPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<{
    sellerType: string;
    title: string;
    href: string;
  } | null>(null);

  const handleProfileSelect = (sellerType: string, title: string, href: string) => {
    if (user) {
      // User is already logged in, navigate directly
      router.push(href);
    } else {
      // User needs to register/login, show modal
      setSelectedProfile({ sellerType, title, href });
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-background dark:to-background">
      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        sellerType={selectedProfile?.sellerType || ""}
        sellerTitle={selectedProfile?.title || ""}
        redirectPath={selectedProfile?.href || ""}
      />

      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              &iquest;Con qu&eacute; perfil te identificas?
            </h1>
            <p className="text-xl text-muted-foreground">
              Selecciona el que se ajusta a tus intereses
            </p>
          </div>

          {/* Seller Type Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Particular / Dueño Directo */}
            <SellerTypeCard
              icon={User}
              title="Particular"
              description="Dueño Directo"
              features={[
                "Vende tu propiedad sin intermediarios",
                "Sin comisiones de corredor",
                "Control total del proceso",
                "Asesoría personalizada gratuita",
                "Publicación destacada en el sitio",
              ]}
              href="/venta/particular"
              sellerType="PARTICULAR"
              onSelect={handleProfileSelect}
            />

            {/* Inmobiliaria */}
            <SellerTypeCard
              icon={Building2}
              title="Inmobiliaria"
              description="Empresa de Bienes Raíces"
              features={[
                "Gestiona múltiples propiedades",
                "Panel de control avanzado",
                "Reportes y estadísticas detalladas",
                "Equipo de agentes ilimitado",
                "Perfil empresarial verificado",
              ]}
              href="/venta/inmobiliaria"
              sellerType="INMOBILIARIA"
              onSelect={handleProfileSelect}
            />

            {/* Corredor */}
            <SellerTypeCard
              icon={Briefcase}
              title="Corredor"
              description="Agente Independiente"
              features={[
                "Perfil profesional verificado",
                "Gestión de tu cartera",
                "Herramientas de prospección",
                "Red de contactos exclusiva",
                "Certificaciones y badges",
              ]}
              href="/venta/corredor"
              sellerType="CORREDOR"
              onSelect={handleProfileSelect}
            />
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-4">
              &iquest;No est&aacute;s seguro cu&aacute;l opci&oacute;n elegir?
            </p>
            <a
              href="/ayuda/tipos-vendedor"
              className="text-primary hover:text-primary/80 font-medium underline"
            >
              Conoce m&aacute;s sobre cada tipo de vendedor
            </a>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-foreground mb-12">
              &iquest;Por qu&eacute; vender con nosotros?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Benefit 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-blue-600 dark:text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  M&aacute;xima Visibilidad
                </h3>
                <p className="text-muted-foreground">
                  Miles de compradores potenciales visitan nuestra plataforma cada d&iacute;a
                </p>
              </div>

              {/* Benefit 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-green-600 dark:text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Proceso Seguro
                </h3>
                <p className="text-muted-foreground">
                  Protegemos tus datos y verificamos la identidad de los interesados
                </p>
              </div>

              {/* Benefit 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-purple-600 dark:text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Venta R&aacute;pida
                </h3>
                <p className="text-muted-foreground">
                  Herramientas y soporte para que vendas m&aacute;s r&aacute;pido
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
