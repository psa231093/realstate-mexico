"use client";

import { DollarSign, Calendar, Clock, HelpCircle } from "lucide-react";

interface WorkerInfoInputsProps {
  monthlySalary: number;
  age: number;
  continuousWeeks: number;
  onSalaryChange: (value: number) => void;
  onAgeChange: (value: number) => void;
  onWeeksChange: (value: number) => void;
}

export function WorkerInfoInputs({
  monthlySalary,
  age,
  continuousWeeks,
  onSalaryChange,
  onAgeChange,
  onWeeksChange,
}: WorkerInfoInputsProps) {
  const formatInputValue = (value: number) => {
    if (value === 0) return "";
    return value.toLocaleString("es-MX");
  };

  const parseInputValue = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    return parseInt(cleaned, 10) || 0;
  };

  const yearsFromWeeks = Math.floor(continuousWeeks / 52);
  const remainingWeeks = continuousWeeks % 52;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-green-600" />
        Informacion Laboral
      </h3>

      {/* Monthly Salary */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          Salario Mensual Integrado
          <div className="relative group">
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64 z-10 border border-border">
              Tu salario mensual incluyendo prestaciones como aguinaldo, vacaciones, etc. Lo puedes encontrar en tu recibo de nomina o en el portal de IMSS.
            </div>
          </div>
        </label>
        <div className="relative mt-2">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            $
          </span>
          <input
            type="text"
            value={formatInputValue(monthlySalary)}
            onChange={(e) => onSalaryChange(parseInputValue(e.target.value))}
            className="w-full pl-8 pr-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="15,000"
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Salario mensual bruto (antes de impuestos)
        </p>
      </div>

      {/* Age */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-green-600" />
          Edad
        </label>
        <div className="mt-2">
          <input
            type="range"
            min="17"
            max="65"
            value={age}
            onChange={(e) => onAgeChange(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">17 anos</span>
            <span className="text-lg font-semibold text-foreground">{age} anos</span>
            <span className="text-xs text-muted-foreground">65 anos</span>
          </div>
        </div>
      </div>

      {/* Continuous Weeks */}
      <div>
        <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <Clock className="h-4 w-4 text-green-600" />
          Semanas Cotizadas Continuas
          <div className="relative group">
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64 z-10 border border-border">
              Semanas que has trabajado sin interrupcion mayor a 2 meses. Lo puedes consultar en el portal de INFONAVIT o en tu constancia de semanas cotizadas del IMSS.
            </div>
          </div>
        </label>
        <div className="mt-2">
          <input
            type="range"
            min="0"
            max="520"
            step="4"
            value={continuousWeeks}
            onChange={(e) => onWeeksChange(parseInt(e.target.value))}
            className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-green-600"
          />
          <div className="flex justify-between mt-2">
            <span className="text-xs text-muted-foreground">0 semanas</span>
            <span className="text-lg font-semibold text-foreground">
              {continuousWeeks} semanas
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({yearsFromWeeks} anos{remainingWeeks > 0 ? `, ${remainingWeeks} sem` : ""})
              </span>
            </span>
            <span className="text-xs text-muted-foreground">520 semanas</span>
          </div>
        </div>
        {continuousWeeks < 104 && (
          <p className="text-xs text-amber-600 mt-2">
            Minimo requerido: 104 semanas (2 anos)
          </p>
        )}
      </div>
    </div>
  );
}
