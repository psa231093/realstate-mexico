"use client";

import Link from "next/link";
import { Calculator, Building2, TrendingUp, ArrowRight } from "lucide-react";

type CalculatorType = "capacidad" | "infonavit" | "inversion";

interface CalculatorNavProps {
  active: CalculatorType;
}

const calculators = [
  {
    id: "capacidad" as const,
    title: "Capacidad de Compra",
    description: "Calcula cuanto puedes pagar por una vivienda segun tus ingresos",
    href: "/calculadora",
    icon: Calculator,
    color: "blue",
  },
  {
    id: "infonavit" as const,
    title: "INFONAVIT",
    description: "Calcula tu puntaje y credito INFONAVIT disponible",
    href: "/calculadora/infonavit",
    icon: Building2,
    color: "green",
  },
  {
    id: "inversion" as const,
    title: "Inversion",
    description: "Analiza rendimientos: cap rate, ROI vs CETES",
    href: "/calculadora/inversion",
    icon: TrendingUp,
    color: "amber",
  },
];

const colorClasses = {
  blue: {
    active: "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10",
    icon: "text-blue-600",
    badge: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
    hover: "hover:border-blue-500",
    hoverText: "group-hover:text-blue-600",
  },
  green: {
    active: "border-green-500 bg-green-50/50 dark:bg-green-900/10",
    icon: "text-green-600",
    badge: "text-green-600 bg-green-100 dark:bg-green-900/30",
    hover: "hover:border-green-500",
    hoverText: "group-hover:text-green-600",
  },
  amber: {
    active: "border-amber-500 bg-amber-50/50 dark:bg-amber-900/10",
    icon: "text-amber-600",
    badge: "text-amber-600 bg-amber-100 dark:bg-amber-900/30",
    hover: "hover:border-amber-500",
    hoverText: "group-hover:text-amber-600",
  },
};

export function CalculatorNav({ active }: CalculatorNavProps) {
  return (
    <section className="py-8 md:py-12 border-b border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-lg font-semibold text-foreground mb-6 text-center">
            Nuestras Calculadoras
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {calculators.map((calc) => {
              const isActive = calc.id === active;
              const colors = colorClasses[calc.color as keyof typeof colorClasses];
              const Icon = calc.icon;

              if (isActive) {
                return (
                  <div
                    key={calc.id}
                    className={`p-5 rounded-xl border-2 ${colors.active}`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <Icon className={`h-8 w-8 ${colors.icon}`} />
                      <span className={`text-xs font-medium px-2 py-1 rounded ${colors.badge}`}>
                        Actual
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{calc.title}</h3>
                    <p className="text-sm text-muted-foreground">{calc.description}</p>
                  </div>
                );
              }

              return (
                <Link
                  key={calc.id}
                  href={calc.href}
                  className={`p-5 rounded-xl border border-border bg-card ${colors.hover} hover:shadow-md transition-all group`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <Icon className={`h-8 w-8 ${colors.icon}`} />
                    <ArrowRight className={`h-5 w-5 text-muted-foreground ${colors.hoverText} transition-colors`} />
                  </div>
                  <h3 className={`font-semibold text-foreground mb-1 ${colors.hoverText} transition-colors`}>
                    {calc.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{calc.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
