"use client";

import { Calculator, TrendingDown, Banknote } from "lucide-react";
import { formatCurrency, type AffordabilityResults } from "@/lib/affordability-calculator";

interface AffordabilityBreakdownProps {
  results: AffordabilityResults;
  loanTermYears: number;
}

export function AffordabilityBreakdown({ results, loanTermYears }: AffordabilityBreakdownProps) {
  const { maxHomePrice, loanAmount, monthlyPayment, totalInterestPaid, totalLoanCost } = results;

  if (maxHomePrice <= 0) return null;

  const totalPayments = loanTermYears * 12;
  const interestPercentage = loanAmount > 0 ? ((totalInterestPaid / loanAmount) * 100).toFixed(0) : 0;

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
        <Calculator className="h-5 w-5 text-primary" />
        Resumen del Credito
      </h3>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-2xl font-bold text-foreground">{loanTermYears}</p>
          <p className="text-xs text-muted-foreground">Anos de plazo</p>
        </div>
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-2xl font-bold text-foreground">{totalPayments}</p>
          <p className="text-xs text-muted-foreground">Pagos mensuales</p>
        </div>
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-2xl font-bold text-foreground">{interestPercentage}%</p>
          <p className="text-xs text-muted-foreground">Interes sobre capital</p>
        </div>
        <div className="text-center p-4 bg-muted/50 rounded-lg">
          <p className="text-2xl font-bold text-primary">{formatCurrency(monthlyPayment)}</p>
          <p className="text-xs text-muted-foreground">Pago mensual</p>
        </div>
      </div>

      {/* Cost Breakdown Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <Banknote className="h-5 w-5 text-blue-500" />
            <span className="text-foreground">Precio de la vivienda</span>
          </div>
          <span className="font-semibold text-foreground">{formatCurrency(maxHomePrice)}</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <TrendingDown className="h-5 w-5 text-green-500" />
            <span className="text-foreground">Enganche</span>
          </div>
          <span className="font-semibold text-green-600">- {formatCurrency(maxHomePrice - loanAmount)}</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-foreground font-medium">Monto del credito</span>
          <span className="font-semibold text-foreground">{formatCurrency(loanAmount)}</span>
        </div>

        <div className="flex items-center justify-between py-3 border-b border-border">
          <span className="text-muted-foreground">+ Interes total ({loanTermYears} anos)</span>
          <span className="font-semibold text-orange-600">+ {formatCurrency(totalInterestPaid)}</span>
        </div>

        <div className="flex items-center justify-between py-3 bg-primary/10 rounded-lg px-4 -mx-4">
          <span className="font-bold text-foreground">Costo total del credito</span>
          <span className="font-bold text-xl text-primary">{formatCurrency(totalLoanCost)}</span>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-900">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Consejos para ahorrar</h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Un enganche mayor reduce el monto del credito y el interes total</li>
          <li>• Compara tasas entre diferentes bancos antes de decidir</li>
          <li>• Considera hacer pagos adicionales al capital cuando sea posible</li>
          <li>• Un plazo mas corto significa mas pago mensual pero menos interes total</li>
        </ul>
      </div>
    </div>
  );
}
