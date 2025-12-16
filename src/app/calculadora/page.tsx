import { Metadata } from "next";
import { AffordabilityCalculator } from "@/components/calculadora/AffordabilityCalculator";
import { CalculatorNav } from "@/components/calculadora/CalculatorNav";

export const metadata: Metadata = {
  title: "Calculadoras Inmobiliarias | Urbanify",
  description:
    "Calculadoras para compradores e inversionistas inmobiliarios en Mexico. Capacidad de compra, credito INFONAVIT, y rendimiento de inversiones.",
  keywords: [
    "calculadora hipoteca",
    "capacidad de compra",
    "credito hipotecario mexico",
    "cuanto puedo pagar casa",
    "simulador hipoteca",
    "calculadora infonavit",
    "inversion inmobiliaria",
  ],
};

export default function CalculadoraPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-background dark:from-background">
      {/* Calculator Navigation */}
      <CalculatorNav active="capacidad" />

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Calculadora de Capacidad de Compra
            </h1>
            <p className="text-lg text-muted-foreground">
              Descubre cuanto puedes pagar por tu nuevo hogar basandote en tu situacion financiera actual.
              Nuestra calculadora usa los estandares del mercado hipotecario mexicano.
            </p>
          </div>

          {/* Calculator Component */}
          <div className="max-w-5xl mx-auto">
            <AffordabilityCalculator />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Preguntas Frecuentes
            </h2>

            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Como se calcula mi capacidad de compra?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Los bancos mexicanos generalmente aprueban creditos donde el pago mensual
                  (incluyendo capital, interes, impuestos y seguro) no excede el 30% de tu
                  ingreso bruto mensual. Esta calculadora usa esa regla para determinar el
                  precio maximo de vivienda que puedes pagar.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Que enganche necesito?
                </h3>
                <p className="text-muted-foreground text-sm">
                  La mayoria de los bancos en Mexico requieren un enganche minimo del 10-20%
                  del valor de la propiedad. Un enganche mayor puede ayudarte a obtener una
                  mejor tasa de interes y reducir tu pago mensual.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Que tasa de interes debo esperar?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Las tasas de interes para creditos hipotecarios en Mexico varian entre el 8%
                  y el 14%, dependiendo del banco, tu historial crediticio, el enganche y otros
                  factores. La tasa promedio actual es aproximadamente del 11%.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Que otros gastos debo considerar?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Ademas del pago mensual, considera los gastos de escrituracion (3-6% del valor),
                  avaluo, gastos notariales, y el costo de mudanza y posibles remodelaciones.
                  Tambien hay gastos recurrentes como predial, mantenimiento y servicios.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
