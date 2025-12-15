"use client";

import { useState } from "react";
import { Percent, Calendar, Wallet, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LoanInputsProps {
  downPayment: number;
  downPaymentType: "amount" | "percentage";
  interestRate: number;
  loanTermYears: number;
  onDownPaymentChange: (value: number) => void;
  onDownPaymentTypeChange: (type: "amount" | "percentage") => void;
  onInterestRateChange: (value: number) => void;
  onLoanTermChange: (value: number) => void;
}

const LOAN_TERMS = [15, 20, 25, 30];

export function LoanInputs({
  downPayment,
  downPaymentType,
  interestRate,
  loanTermYears,
  onDownPaymentChange,
  onDownPaymentTypeChange,
  onInterestRateChange,
  onLoanTermChange,
}: LoanInputsProps) {
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
        <Wallet className="h-5 w-5 text-primary" />
        Detalles del Credito
      </h3>

      {/* Down Payment */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Enganche
          </label>
          <div className="group relative">
            <HelpCircle className="h-4 w-4 text-muted-foreground cursor-help" />
            <div className="absolute right-0 top-6 w-64 p-3 bg-popover border border-border rounded-lg shadow-lg text-xs text-muted-foreground opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              La mayoria de los bancos en Mexico requieren un enganche minimo del 10-20% del valor de la propiedad.
            </div>
          </div>
        </div>

        {/* Toggle between percentage and amount */}
        <div className="flex rounded-lg border border-border overflow-hidden mb-2">
          <button
            type="button"
            onClick={() => onDownPaymentTypeChange("percentage")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              downPaymentType === "percentage"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            Porcentaje
          </button>
          <button
            type="button"
            onClick={() => onDownPaymentTypeChange("amount")}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              downPaymentType === "amount"
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            Monto
          </button>
        </div>

        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {downPaymentType === "percentage" ? "%" : "$"}
          </span>
          <Input
            type="text"
            inputMode="numeric"
            value={downPaymentType === "percentage" ? (downPayment || "") : formatInputValue(downPayment)}
            onChange={(e) => {
              if (downPaymentType === "percentage") {
                const val = parseInt(e.target.value.replace(/[^0-9]/g, ""), 10) || 0;
                onDownPaymentChange(Math.min(100, val));
              } else {
                onDownPaymentChange(parseInputValue(e.target.value));
              }
            }}
            placeholder={downPaymentType === "percentage" ? "20" : "500,000"}
            className="pl-7 text-right text-lg font-medium"
          />
        </div>
        {downPaymentType === "percentage" && (
          <div className="flex gap-2 mt-2">
            {[10, 15, 20, 25, 30].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => onDownPaymentChange(pct)}
                className={`flex-1 py-1.5 text-xs font-medium rounded border transition-colors ${
                  downPayment === pct
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Interest Rate */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="rate" className="text-sm font-medium text-foreground">
            Tasa de interes anual
          </label>
          <span className="text-sm font-bold text-primary">{interestRate}%</span>
        </div>
        <input
          id="rate"
          type="range"
          min="7"
          max="16"
          step="0.5"
          value={interestRate}
          onChange={(e) => onInterestRateChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>7%</span>
          <span>Promedio: 11%</span>
          <span>16%</span>
        </div>
      </div>

      {/* Loan Term */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Plazo del credito
        </label>
        <div className="grid grid-cols-4 gap-2">
          {LOAN_TERMS.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => onLoanTermChange(term)}
              className={`py-3 text-sm font-medium rounded-lg border transition-colors ${
                loanTermYears === term
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              {term} anos
            </button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Un plazo mas largo reduce el pago mensual pero aumenta el interes total
        </p>
      </div>
    </div>
  );
}
