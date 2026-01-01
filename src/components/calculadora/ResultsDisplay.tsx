"use client";

import Link from "next/link";
import { Home, TrendingUp, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, type AffordabilityResults } from "@/lib/affordability-calculator";

interface ResultsDisplayProps {
  results: AffordabilityResults;
  isCalculating?: boolean;
}

export function ResultsDisplay({ results, isCalculating }: ResultsDisplayProps) {
  const { maxHomePrice, loanAmount, monthlyPayment, breakdown, dtiRatio } = results;

  const hasValidResults = maxHomePrice > 0;

  // Calculate breakdown percentages for the visual bar
  const totalBreakdown = breakdown.principal + breakdown.interest + breakdown.propertyTax + breakdown.insurance;
  const principalPct = totalBreakdown > 0 ? (breakdown.principal / totalBreakdown) * 100 : 0;
  const interestPct = totalBreakdown > 0 ? (breakdown.interest / totalBreakdown) * 100 : 0;
  const taxPct = totalBreakdown > 0 ? (breakdown.propertyTax / totalBreakdown) * 100 : 0;
  const insurancePct = totalBreakdown > 0 ? (breakdown.insurance / totalBreakdown) * 100 : 0;

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        Tu Capacidad de Compra
      </h3>

      {/* Main Result */}
      <div className="text-center py-6 px-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
        <p className="text-sm text-muted-foreground mb-2">Precio maximo de vivienda</p>
        <p className={`text-4xl md:text-5xl font-bold text-primary transition-opacity ${isCalculating ? "opacity-50" : ""}`}>
          {hasValidResults ? formatCurrency(maxHomePrice) : "$0"}
        </p>
        {hasValidResults && (
          <p className="text-sm text-muted-foreground mt-2">
            Credito de {formatCurrency(loanAmount)}
          </p>
        )}
      </div>

      {/* Monthly Payment Card */}
      {hasValidResults && (
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-foreground">Pago mensual estimado</span>
            <span className="text-2xl font-bold text-foreground">{formatCurrency(monthlyPayment)}</span>
          </div>

          {/* Visual Breakdown Bar */}
          <div className="h-4 rounded-full overflow-hidden flex mb-4">
            <div
              className="bg-blue-500 transition-all"
              style={{ width: `${principalPct}%` }}
              title={`Principal: ${formatCurrency(breakdown.principal)}`}
            />
            <div
              className="bg-orange-500 transition-all"
              style={{ width: `${interestPct}%` }}
              title={`Interes: ${formatCurrency(breakdown.interest)}`}
            />
            <div
              className="bg-green-500 transition-all"
              style={{ width: `${taxPct}%` }}
              title={`Impuestos: ${formatCurrency(breakdown.propertyTax)}`}
            />
            <div
              className="bg-purple-500 transition-all"
              style={{ width: `${insurancePct}%` }}
              title={`Seguro: ${formatCurrency(breakdown.insurance)}`}
            />
          </div>

          {/* Breakdown Legend */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Principal</span>
              <span className="ml-auto font-medium">{formatCurrency(breakdown.principal)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-muted-foreground">Interes</span>
              <span className="ml-auto font-medium">{formatCurrency(breakdown.interest)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Impuestos</span>
              <span className="ml-auto font-medium">{formatCurrency(breakdown.propertyTax)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500" />
              <span className="text-muted-foreground">Seguro</span>
              <span className="ml-auto font-medium">{formatCurrency(breakdown.insurance)}</span>
            </div>
          </div>
        </div>
      )}

      {/* DTI Indicator */}
      {hasValidResults && (
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Relacion deuda-ingreso</span>
            <span className={`text-sm font-bold ${dtiRatio <= 30 ? "text-green-600" : dtiRatio <= 40 ? "text-yellow-600" : "text-red-600"}`}>
              {dtiRatio}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${dtiRatio <= 30 ? "bg-green-500" : dtiRatio <= 40 ? "bg-yellow-500" : "bg-red-500"}`}
              style={{ width: `${Math.min(100, dtiRatio * 2)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {dtiRatio <= 30
              ? "Excelente - Estas dentro del rango ideal"
              : dtiRatio <= 40
              ? "Aceptable - Algunos bancos podrian aprobar"
              : "Alto - Podria ser dificil obtener aprobacion"}
          </p>
        </div>
      )}

      {/* CTA Button */}
      {hasValidResults && (
        <Link href={`/propiedades?priceMax=${maxHomePrice}`} className="block">
          <Button size="lg" className="w-full py-6 text-base gap-2">
            <Search className="h-5 w-5" />
            Buscar propiedades en este rango
          </Button>
        </Link>
      )}

      {/* Empty State */}
      {!hasValidResults && (
        <div className="text-center py-8 text-muted-foreground">
          <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-sm">
            Ingresa tu informacion financiera para calcular cuanto puedes pagar por una vivienda.
          </p>
        </div>
      )}
    </div>
  );
}
