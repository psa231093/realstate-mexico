"use client";

import { TrendingUp, TrendingDown, Minus, DollarSign, Clock, Target, BarChart3 } from "lucide-react";
import type { InvestmentResults } from "@/lib/investment-calculator";
import { formatCurrency, CETES_28_RATE } from "@/lib/investment-calculator";

interface YieldResultsProps {
  results: InvestmentResults;
}

export function YieldResults({ results }: YieldResultsProps) {
  const {
    grossYield,
    netYield,
    capRate,
    cashOnCashReturn,
    monthlyNOI,
    annualCashFlow,
    paybackPeriod,
    roi5Year,
    roi10Year,
    projectedValue5Year,
    projectedValue10Year,
    comparison,
    investmentRating,
    recommendations,
  } = results;

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'good': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'average': return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      default: return 'text-red-600 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    }
  };

  const getRatingLabel = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Buena';
      case 'average': return 'Promedio';
      default: return 'Baja';
    }
  };

  const ComparisonIcon = comparison.difference >= 0 ? TrendingUp : TrendingDown;
  const comparisonColor = comparison.difference >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="space-y-6">
      {/* Investment Rating */}
      <div className={`p-4 rounded-lg border ${getRatingColor(investmentRating)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            <span className="font-semibold">Calificacion de la Inversion</span>
          </div>
          <span className="text-lg font-bold">{getRatingLabel(investmentRating)}</span>
        </div>
      </div>

      {/* Main Metrics */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <BarChart3 className="h-5 w-5 text-amber-600" />
          Metricas de Rendimiento
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Rendimiento Bruto</p>
            <p className="text-2xl font-bold text-foreground">{grossYield}%</p>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Rendimiento Neto</p>
            <p className="text-2xl font-bold text-foreground">{netYield}%</p>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-300 mb-1">Cap Rate</p>
            <p className="text-2xl font-bold text-amber-600">{capRate}%</p>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <p className="text-xs text-amber-700 dark:text-amber-300 mb-1">Cash-on-Cash</p>
            <p className="text-2xl font-bold text-amber-600">{cashOnCashReturn}%</p>
          </div>
        </div>
      </div>

      {/* Cash Flow */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <DollarSign className="h-5 w-5 text-amber-600" />
          Flujo de Efectivo
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Ingreso neto mensual (NOI)</span>
            <span className="font-semibold text-foreground">{formatCurrency(monthlyNOI)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Flujo de caja anual</span>
            <span className={`font-semibold ${annualCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(annualCashFlow)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Periodo de recuperacion
            </span>
            <span className="font-semibold text-foreground">
              {paybackPeriod === Infinity ? 'N/A' : `${paybackPeriod} anos`}
            </span>
          </div>
        </div>
      </div>

      {/* Long-term Projections */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-amber-600" />
          Proyecciones a Largo Plazo
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">ROI a 5 anos</p>
            <p className="text-xl font-bold text-foreground">{roi5Year}%</p>
            <p className="text-xs text-muted-foreground">
              Valor: {formatCurrency(projectedValue5Year)}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">ROI a 10 anos</p>
            <p className="text-xl font-bold text-foreground">{roi10Year}%</p>
            <p className="text-xs text-muted-foreground">
              Valor: {formatCurrency(projectedValue10Year)}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison with Alternatives */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Comparacion con Otras Inversiones
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">CETES 28 dias</span>
            <span className="font-medium text-foreground">{comparison.cetes28}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">CETES 364 dias</span>
            <span className="font-medium text-foreground">{comparison.cetes364}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">S&P 500 (historico)</span>
            <span className="font-medium text-foreground">{comparison.sp500}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Inflacion Mexico</span>
            <span className="font-medium text-foreground">{comparison.inflation}%</span>
          </div>

          <div className="border-t border-border pt-3 mt-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Tu rendimiento vs CETES</span>
              <span className={`font-bold flex items-center gap-1 ${comparisonColor}`}>
                <ComparisonIcon className="h-4 w-4" />
                {comparison.difference >= 0 ? '+' : ''}{comparison.difference.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Recomendaciones
        </h3>
        <ul className="space-y-2">
          {recommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
              <Minus className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600" />
              {rec}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
