"use client";

import { Receipt, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface ExpensesInputsProps {
  expenses: {
    maintenance: number;
    predial: number;
    hoa: number;
    insurance: number;
    management: number;
  };
  vacancyRate: number;
  appreciationRate: number;
  onExpensesChange: (expenses: ExpensesInputsProps["expenses"]) => void;
  onVacancyChange: (value: number) => void;
  onAppreciationChange: (value: number) => void;
}

export function ExpensesInputs({
  expenses,
  vacancyRate,
  appreciationRate,
  onExpensesChange,
  onVacancyChange,
  onAppreciationChange,
}: ExpensesInputsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const formatInputValue = (value: number) => {
    if (value === 0) return "";
    return value.toLocaleString("es-MX");
  };

  const parseInputValue = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    return parseInt(cleaned, 10) || 0;
  };

  const updateExpense = (key: keyof typeof expenses, value: number) => {
    onExpensesChange({ ...expenses, [key]: value });
  };

  const totalMonthlyExpenses =
    expenses.maintenance +
    expenses.predial +
    expenses.hoa +
    expenses.insurance +
    expenses.management;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <Receipt className="h-5 w-5 text-amber-600" />
        Gastos Mensuales
      </h3>

      {/* Main expenses */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Mantenimiento
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              $
            </span>
            <input
              type="text"
              value={formatInputValue(expenses.maintenance)}
              onChange={(e) => updateExpense("maintenance", parseInputValue(e.target.value))}
              className="w-full pl-7 pr-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Predial
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              $
            </span>
            <input
              type="text"
              value={formatInputValue(expenses.predial)}
              onChange={(e) => updateExpense("predial", parseInputValue(e.target.value))}
              className="w-full pl-7 pr-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="300"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
            Cuota HOA/Mant.
            <div className="relative group">
              <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48 z-10 border border-border">
                Cuota de mantenimiento del condominio o fraccionamiento
              </div>
            </div>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              $
            </span>
            <input
              type="text"
              value={formatInputValue(expenses.hoa)}
              onChange={(e) => updateExpense("hoa", parseInputValue(e.target.value))}
              className="w-full pl-7 pr-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="1,500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">
            Seguro
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              $
            </span>
            <input
              type="text"
              value={formatInputValue(expenses.insurance)}
              onChange={(e) => updateExpense("insurance", parseInputValue(e.target.value))}
              className="w-full pl-7 pr-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="200"
            />
          </div>
        </div>
      </div>

      {/* Total expenses */}
      <div className="p-3 bg-muted/50 rounded-lg flex justify-between items-center">
        <span className="text-sm text-muted-foreground">Total gastos mensuales:</span>
        <span className="font-semibold text-foreground">
          ${totalMonthlyExpenses.toLocaleString("es-MX")}
        </span>
      </div>

      {/* Advanced options toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-amber-600 hover:text-amber-700"
      >
        {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        Opciones avanzadas
      </button>

      {showAdvanced && (
        <div className="space-y-4 pt-2">
          {/* Property Management */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Administracion de propiedad (mensual)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                $
              </span>
              <input
                type="text"
                value={formatInputValue(expenses.management)}
                onChange={(e) => updateExpense("management", parseInputValue(e.target.value))}
                className="w-full pl-7 pr-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                placeholder="0"
              />
            </div>
          </div>

          {/* Vacancy Rate */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              Tasa de vacancia esperada
              <div className="relative group">
                <HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" />
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-56 z-10 border border-border">
                  Porcentaje del ano que esperas que la propiedad este desocupada
                </div>
              </div>
            </label>
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="20"
                value={vacancyRate}
                onChange={(e) => onVacancyChange(parseInt(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">0%</span>
                <span className="text-sm font-medium text-foreground">{vacancyRate}%</span>
                <span className="text-xs text-muted-foreground">20%</span>
              </div>
            </div>
          </div>

          {/* Appreciation Rate */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Apreciacion anual esperada
            </label>
            <div className="mt-2">
              <input
                type="range"
                min="0"
                max="15"
                step="0.5"
                value={appreciationRate}
                onChange={(e) => onAppreciationChange(parseFloat(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">0%</span>
                <span className="text-sm font-medium text-foreground">{appreciationRate}%</span>
                <span className="text-xs text-muted-foreground">15%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
