"use client";

import { Building2, Building, Landmark, HelpCircle } from "lucide-react";
import type { InfonavitCreditType } from "@/lib/infonavit-calculator";

interface CreditTypeSelectorProps {
  creditType: InfonavitCreditType;
  onTypeChange: (type: InfonavitCreditType) => void;
  bankCreditAmount?: number;
  onBankCreditChange?: (value: number) => void;
}

export function CreditTypeSelector({
  creditType,
  onTypeChange,
  bankCreditAmount = 0,
  onBankCreditChange,
}: CreditTypeSelectorProps) {
  const creditTypes = [
    {
      id: 'infonavit' as InfonavitCreditType,
      name: 'INFONAVIT Solo',
      description: 'Credito 100% INFONAVIT',
      icon: Building2,
      color: 'green',
    },
    {
      id: 'cofinavit' as InfonavitCreditType,
      name: 'Cofinavit',
      description: 'INFONAVIT + Credito Bancario',
      icon: Building,
      color: 'blue',
    },
    {
      id: 'cofinavit_ingresos' as InfonavitCreditType,
      name: 'Cofinavit Ingresos Adicionales',
      description: 'Para ingresos adicionales comprobables',
      icon: Landmark,
      color: 'purple',
    },
  ];

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
        Tipo de Credito
        <div className="relative group">
          <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-72 z-10 border border-border">
            <strong>INFONAVIT Solo:</strong> Solo usas tu credito INFONAVIT.<br/>
            <strong>Cofinavit:</strong> Combinas INFONAVIT con un credito bancario para mayor monto.<br/>
            <strong>Cofinavit IA:</strong> Si tienes ingresos adicionales comprobables.
          </div>
        </div>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {creditTypes.map((type) => (
          <button
            key={type.id}
            type="button"
            onClick={() => onTypeChange(type.id)}
            className={`
              p-4 rounded-lg border-2 text-left transition-all
              ${creditType === type.id
                ? `border-${type.color}-600 bg-${type.color}-50 dark:bg-${type.color}-900/20`
                : 'border-border bg-card hover:border-muted-foreground/50'
              }
            `}
          >
            <type.icon className={`h-6 w-6 mb-2 ${
              creditType === type.id ? `text-${type.color}-600` : 'text-muted-foreground'
            }`} />
            <p className={`font-semibold ${
              creditType === type.id ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {type.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {type.description}
            </p>
          </button>
        ))}
      </div>

      {/* Bank Credit Amount (for Cofinavit) */}
      {(creditType === 'cofinavit' || creditType === 'cofinavit_ingresos') && onBankCreditChange && (
        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <label className="text-sm font-medium text-foreground mb-2 block">
            Monto del Credito Bancario Adicional
          </label>
          <div className="relative mt-2">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <input
              type="text"
              value={formatInputValue(bankCreditAmount)}
              onChange={(e) => onBankCreditChange(parseInputValue(e.target.value))}
              className="w-full pl-8 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="500,000"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Consulta con tu banco cuanto credito adicional te pueden otorgar
          </p>
        </div>
      )}
    </div>
  );
}
