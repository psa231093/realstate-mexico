"use client";

import { DollarSign, CreditCard, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

interface IncomeInputsProps {
  monthlyIncome: number;
  monthlyDebts: number;
  onIncomeChange: (value: number) => void;
  onDebtsChange: (value: number) => void;
}

export function IncomeInputs({
  monthlyIncome,
  monthlyDebts,
  onIncomeChange,
  onDebtsChange,
}: IncomeInputsProps) {
  const formatInputValue = (value: number) => {
    if (value === 0) return "";
    return value.toLocaleString("es-MX");
  };

  const parseInputValue = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    return parseInt(cleaned, 10) || 0;
  };

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-primary" />
        Tus Finanzas
      </h3>

      {/* Monthly Income */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="income" className="text-sm font-medium text-foreground">
            Ingreso mensual bruto
          </label>
          <div className="group relative">
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute right-0 top-6 w-64 p-3 bg-popover border border-border rounded-lg shadow-lg text-xs text-muted-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              Incluye tu salario antes de impuestos y otras fuentes de ingreso regular (bonos, rentas, etc.)
            </div>
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            id="income"
            type="text"
            inputMode="numeric"
            value={formatInputValue(monthlyIncome)}
            onChange={(e) => onIncomeChange(parseInputValue(e.target.value))}
            placeholder="50,000"
            className="pl-7 text-right text-lg font-medium"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Ingreso mensual antes de impuestos
        </p>
      </div>

      {/* Monthly Debts */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="debts" className="text-sm font-medium text-foreground">
            Deudas mensuales
          </label>
          <div className="group relative">
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute right-0 top-6 w-64 p-3 bg-popover border border-border rounded-lg shadow-lg text-xs text-muted-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              Incluye pagos de auto, tarjetas de credito, prestamos personales, pensiones alimenticias, etc.
            </div>
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
          <Input
            id="debts"
            type="text"
            inputMode="numeric"
            value={formatInputValue(monthlyDebts)}
            onChange={(e) => onDebtsChange(parseInputValue(e.target.value))}
            placeholder="5,000"
            className="pl-7 text-right text-lg font-medium"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          No incluyas gastos como comida, servicios o entretenimiento
        </p>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
        <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Los bancos mexicanos generalmente aprueban creditos donde el pago mensual no exceda el <strong>30%</strong> de tu ingreso bruto.
          </p>
        </div>
      </div>
    </div>
  );
}
