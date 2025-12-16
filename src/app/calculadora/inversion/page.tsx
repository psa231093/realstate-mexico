import { Metadata } from "next";
import { InvestmentCalculator } from "@/components/calculadora/inversion/InvestmentCalculator";
import { CalculatorNav } from "@/components/calculadora/CalculatorNav";

export const metadata: Metadata = {
  title: "Calculadora de Inversion Inmobiliaria | Urbanify",
  description:
    "Calcula el rendimiento de tu inversion inmobiliaria. Cap rate, ROI, comparacion con CETES y otras inversiones. Ideal para inversionistas en Mexico.",
  keywords: [
    "inversion inmobiliaria",
    "cap rate mexico",
    "rendimiento renta",
    "roi inmuebles",
    "calculadora inversion",
    "bienes raices inversion",
    "airbnb rendimiento",
  ],
};

export default function InversionCalculadoraPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/50 to-background dark:from-background">
      {/* Calculator Navigation */}
      <CalculatorNav active="inversion" />

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              Para Inversionistas
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Calculadora de Inversion
            </h1>
            <p className="text-lg text-muted-foreground">
              Analiza el rendimiento de tu inversion inmobiliaria.
              Calcula cap rate, ROI y compara con otras opciones de inversion como CETES.
            </p>
          </div>

          {/* Calculator Component */}
          <div className="max-w-5xl mx-auto">
            <InvestmentCalculator />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Guia de Inversion Inmobiliaria
            </h2>

            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Que es el Cap Rate?
                </h3>
                <p className="text-muted-foreground text-sm">
                  El Cap Rate (Capitalization Rate) es el rendimiento anual de una propiedad
                  basado en el ingreso que genera, sin considerar financiamiento. Se calcula
                  dividiendo el ingreso operativo neto (NOI) entre el precio de la propiedad.
                  Un cap rate del 6-8% se considera bueno en Mexico.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Que es Cash-on-Cash Return?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Es el rendimiento sobre el dinero que realmente invertiste (tu efectivo).
                  Si usas financiamiento, solo consideras tu enganche y gastos iniciales,
                  no el monto total de la propiedad. Es util para comparar inversiones
                  con diferente nivel de apalancamiento.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Inmuebles vs CETES?
                </h3>
                <p className="text-muted-foreground text-sm">
                  CETES ofrecen rendimientos garantizados (~11% actualmente) sin riesgo de impago.
                  Los inmuebles pueden ofrecer rendimientos similares o mayores, pero con el
                  beneficio adicional de la apreciacion del valor y proteccion contra inflacion.
                  Sin embargo, requieren mas capital inicial y gestion activa.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Que gastos debo considerar?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Los principales gastos recurrentes son: predial (impuesto anual), cuota de
                  mantenimiento (HOA), seguro de la propiedad, reparaciones y mantenimiento
                  (estima 1% del valor anual), y posible administracion de la propiedad
                  (8-12% de la renta si usas un administrador).
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Que tasa de vacancia es normal?
                </h3>
                <p className="text-muted-foreground text-sm">
                  En zonas con alta demanda de renta, una vacancia del 5% es razonable
                  (equivale a ~2 semanas al ano para cambio de inquilino). En zonas con
                  menor demanda o propiedades de mayor precio, considera 8-10%. Para Airbnb,
                  una ocupacion del 60-70% es tipica en destinos turisticos mexicanos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
