"use client";

import { Wallet, HelpCircle } from "lucide-react";

interface SavingsInputsProps {
  savingsBalance: number;
  onBalanceChange: (value: number) => void;
}

export function SavingsInputs({
  savingsBalance,
  onBalanceChange,
}: SavingsInputsProps) {
  const formatInputValue = (value: number) => {
    if (value === 0) return "";
    return value.toLocaleString("es-MX");
  };

  const parseInputValue = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    return parseInt(cleaned, 10) || 0;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Wallet className="h-5 w-5 text-green-600" />
        Ahorro para Vivienda
      </h3>

      {/* Savings Balance */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          Saldo en Subcuenta de Vivienda
          <div className="relative group">
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64 z-10 border border-border">
              Es el ahorro que tu patron deposita en tu subcuenta de vivienda (5% de tu salario). Consultalo en Mi Cuenta INFONAVIT o en tu estado de cuenta de AFORE.
            </div>
          </div>
        </label>
        <div className="relative mt-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <input
            type="text"
            value={formatInputValue(savingsBalance)}
            onChange={(e) => onBalanceChange(parseInputValue(e.target.value))}
            className="w-full pl-8 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="100,000"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Este saldo se suma a tu credito para aumentar tu capacidad de compra
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
        <p className="text-sm text-green-800 dark:text-green-200">
          <strong>Tip:</strong> Tu patron aporta el 5% de tu salario a tu subcuenta de vivienda cada bimestre.
          Si no conoces tu saldo, puedes consultarlo en{" "}
          <a
            href="https://micuenta.infonavit.org.mx"
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium"
          >
            Mi Cuenta INFONAVIT
          </a>
        </p>
      </div>
    </div>
  );
}
