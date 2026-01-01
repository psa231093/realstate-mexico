"use client";

import Link from "next/link";
import { Calculator, Building2, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const tools = [
  {
    id: "capacidad",
    title: "Capacidad de Compra",
    description: "Descubre cuanto puedes pagar por tu vivienda basandote en tus ingresos y situacion financiera.",
    icon: Calculator,
    color: "blue",
    href: "/calculadora",
    features: ["Regla del 30% DTI", "Tasas mexicanas actuales", "Desglose de pagos"],
    highlight: "Para compradores",
  },
  {
    id: "infonavit",
    title: "Calculadora INFONAVIT",
    description: "Calcula tu puntaje INFONAVIT y descubre cuanto credito puedes obtener con tu subcuenta de vivienda.",
    icon: Building2,
    color: "green",
    href: "/calculadora/infonavit",
    features: ["Sistema de 1080 puntos", "Cofinavit incluido", "Tasas desde 1.98%"],
    highlight: "18M+ trabajadores",
  },
  {
    id: "inversion",
    title: "Calculadora de Inversion",
    description: "Analiza el rendimiento de tu inversion inmobiliaria con metricas profesionales.",
    icon: TrendingUp,
    color: "amber",
    href: "/calculadora/inversion",
    features: ["Cap Rate y ROI", "Comparacion vs CETES", "Proyecciones a 10 anos"],
    highlight: "Para inversionistas",
  },
];

const colorClasses = {
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    border: "border-blue-200 dark:border-blue-800",
    icon: "text-blue-600",
    badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
    hover: "hover:border-blue-400 dark:hover:border-blue-600",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-900/20",
    border: "border-green-200 dark:border-green-800",
    icon: "text-green-600",
    badge: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    hover: "hover:border-green-400 dark:hover:border-green-600",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    border: "border-amber-200 dark:border-amber-800",
    icon: "text-amber-600",
    badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    hover: "hover:border-amber-400 dark:hover:border-amber-600",
  },
};

export function SmartToolsSection() {
  return (
    <section className="py-16 bg-muted/50 border-y border-border">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Herramientas Inteligentes
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Toma decisiones informadas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculadoras disenadas especificamente para el mercado inmobiliario mexicano.
            Sin importar si eres comprador o inversionista, tenemos la herramienta perfecta para ti.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const colors = colorClasses[tool.color as keyof typeof colorClasses];
            const Icon = tool.icon;

            return (
              <Link
                key={tool.id}
                href={tool.href}
                className={`group relative bg-card rounded-2xl border-2 ${colors.border} ${colors.hover} p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                {/* Highlight Badge */}
                <div className={`absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-semibold ${colors.badge}`}>
                  {tool.highlight}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-5 mt-2`}>
                  <Icon className={`h-7 w-7 ${colors.icon}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-card-foreground mb-2 group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-5">
                  {tool.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {tool.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className={`w-1.5 h-1.5 rounded-full ${colors.icon.replace('text-', 'bg-')}`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <div className="flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                  Calcular ahora
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            ¿No sabes por donde empezar? Nuestra calculadora de capacidad de compra te guiara.
          </p>
          <Link href="/calculadora">
            <Button size="lg" className="font-semibold">
              <Calculator className="h-5 w-5 mr-2" />
              Comenzar Ahora
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
