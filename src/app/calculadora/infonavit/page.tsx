import { Metadata } from "next";
import { InfonavitCalculator } from "@/components/calculadora/infonavit/InfonavitCalculator";
import { CalculatorNav } from "@/components/calculadora/CalculatorNav";

export const metadata: Metadata = {
  title: "Calculadora INFONAVIT | Urbanify",
  description:
    "Calcula tu puntaje INFONAVIT y descubre cuanto credito puedes obtener para comprar tu casa. Simulador oficial de puntos y credito INFONAVIT 2024.",
  keywords: [
    "calculadora infonavit",
    "puntos infonavit",
    "credito infonavit",
    "simulador infonavit",
    "cuanto me presta infonavit",
    "precalificacion infonavit",
    "cofinavit",
  ],
};

export default function InfonavitCalculadoraPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/50 to-background dark:from-background">
      {/* Calculator Navigation */}
      <CalculatorNav active="infonavit" />

      {/* Hero Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Actualizado 2024
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Calculadora INFONAVIT
            </h1>
            <p className="text-lg text-muted-foreground">
              Calcula tu puntaje INFONAVIT y descubre cuanto credito puedes obtener
              para comprar tu vivienda. Incluye opciones de Cofinavit.
            </p>
          </div>

          {/* Calculator Component */}
          <div className="max-w-5xl mx-auto">
            <InfonavitCalculator />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">
              Preguntas Frecuentes sobre INFONAVIT
            </h2>

            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Cuantos puntos necesito para obtener un credito INFONAVIT?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Necesitas un minimo de 1080 puntos para calificar a un credito INFONAVIT.
                  Tus puntos se calculan basandose en tu edad, salario, semanas cotizadas
                  continuas y el saldo de tu subcuenta de vivienda.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Que es la subcuenta de vivienda?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Es una cuenta donde tu patron deposita el 5% de tu salario cada bimestre.
                  Este ahorro se acumula y se usa como parte del enganche cuando solicitas
                  tu credito. Puedes consultar tu saldo en Mi Cuenta INFONAVIT.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Que es Cofinavit?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Cofinavit te permite combinar tu credito INFONAVIT con un credito bancario
                  para obtener un monto mayor. Es ideal si necesitas comprar una vivienda
                  de mayor valor que lo que INFONAVIT solo te puede prestar.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Como puedo aumentar mis puntos INFONAVIT?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Puedes aumentar tus puntos de varias formas: manteniendo empleo continuo
                  (sin interrupciones mayores a 2 meses), aumentando tu saldo de subcuenta
                  con ahorro voluntario, y asegurandote de que tu patron te registre con
                  tu salario real completo.
                </p>
              </div>

              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="font-semibold text-foreground mb-2">
                  ¿Cual es la tasa de interes de INFONAVIT?
                </h3>
                <p className="text-muted-foreground text-sm">
                  Las tasas de INFONAVIT son muy competitivas y varian segun tu salario.
                  Van desde 1.98% para salarios bajos hasta 10.45% para salarios altos.
                  Entre menor sea tu salario, menor sera tu tasa de interes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
