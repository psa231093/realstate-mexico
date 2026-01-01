"use client";

import { Home, Banknote, Calendar, Percent, Search } from "lucide-react";
import Link from "next/link";
import type { InfonavitResults as InfonavitResultsType } from "@/lib/infonavit-calculator";
import { formatCurrency } from "@/lib/infonavit-calculator";

interface InfonavitResultsProps {
  results: InfonavitResultsType;
}

export function InfonavitResults({ results }: InfonavitResultsProps) {
  const {
    isEligible,
    maxCreditAmount,
    monthlyPayment,
    estimatedDiscount,
    savingsContribution,
    creditTerm,
    interestRate,
    totalPurchasePower,
  } = results;

  if (!isEligible) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 shadow-sm mt-6">
        <div className="text-center py-8">
          <Home className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Aun no calificas para un credito
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Completa los requisitos minimos para ver cuanto credito podrias obtener.
            Necesitas al menos 1080 puntos y 104 semanas cotizadas continuas.
          </p>
        </div>
      </div>
    );
  }

  const termYears = Math.round(creditTerm / 12);

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm mt-6">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-6">
        <Home className="h-5 w-5 text-green-600" />
        Tu Credito Estimado
      </h3>

      {/* Main Result - Total Purchase Power */}
      <div className="text-center mb-6 p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <p className="text-sm text-green-700 dark:text-green-300 mb-1">
          Capacidad de compra total
        </p>
        <p className="text-4xl font-bold text-green-600">
          {formatCurrency(totalPurchasePower)}
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Credito + Ahorro en subcuenta
        </p>
      </div>

      {/* Credit Breakdown */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Banknote className="h-4 w-4 text-green-600" />
            <span className="text-xs text-muted-foreground">Credito INFONAVIT</span>
          </div>
          <p className="text-lg font-bold text-foreground">
            {formatCurrency(maxCreditAmount)}
          </p>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Home className="h-4 w-4 text-blue-600" />
            <span className="text-xs text-muted-foreground">Tu ahorro</span>
          </div>
          <p className="text-lg font-bold text-foreground">
            {formatCurrency(savingsContribution)}
          </p>
        </div>
      </div>

      {/* Payment Details */}
      <div className="border-t border-border pt-6 space-y-4">
        <h4 className="font-semibold text-foreground">Detalles del pago:</h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Pago mensual:</span>
            <span className="font-semibold text-foreground">{formatCurrency(monthlyPayment)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Descuento quincenal:</span>
            <span className="font-semibold text-foreground">{formatCurrency(estimatedDiscount)}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Plazo:</span>
            <span className="font-semibold text-foreground">{termYears} anos</span>
          </div>

          <div className="flex items-center gap-2">
            <Percent className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Tasa:</span>
            <span className="font-semibold text-foreground">{interestRate}% anual</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Nota:</strong> Este es un calculo estimado basado en la informacion proporcionada.
          El monto final de tu credito dependera de la evaluacion completa de INFONAVIT y puede variar.
        </p>
      </div>

      {/* CTA Button */}
      <Link
        href={`/propiedades?precioMax=${totalPurchasePower}`}
        className="mt-6 w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
      >
        <Search className="h-5 w-5" />
        Buscar propiedades hasta {formatCurrency(totalPurchasePower)}
      </Link>
    </div>
  );
}
