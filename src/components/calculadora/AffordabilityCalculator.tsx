"use client";

import { useState, useMemo } from "react";
import { IncomeInputs } from "./IncomeInputs";
import { LoanInputs } from "./LoanInputs";
import { ResultsDisplay } from "./ResultsDisplay";
import { AffordabilityBreakdown } from "./AffordabilityBreakdown";
import { calculateAffordability, type AffordabilityInputs, type AffordabilityResults } from "@/lib/affordability-calculator";

// Default values for Mexican market
const DEFAULT_VALUES: AffordabilityInputs = {
  monthlyIncome: 50000,
  monthlyDebts: 5000,
  downPayment: 20,
  downPaymentType: "percentage",
  interestRate: 11,
  loanTermYears: 20,
};

export function AffordabilityCalculator() {
  // Form state
  const [monthlyIncome, setMonthlyIncome] = useState(DEFAULT_VALUES.monthlyIncome);
  const [monthlyDebts, setMonthlyDebts] = useState(DEFAULT_VALUES.monthlyDebts);
  const [downPayment, setDownPayment] = useState(DEFAULT_VALUES.downPayment);
  const [downPaymentType, setDownPaymentType] = useState<"amount" | "percentage">(DEFAULT_VALUES.downPaymentType);
  const [interestRate, setInterestRate] = useState(DEFAULT_VALUES.interestRate);
  const [loanTermYears, setLoanTermYears] = useState(DEFAULT_VALUES.loanTermYears);

  // Calculate results whenever inputs change
  const results: AffordabilityResults = useMemo(() => {
    return calculateAffordability({
      monthlyIncome,
      monthlyDebts,
      downPayment,
      downPaymentType,
      interestRate,
      loanTermYears,
    });
  }, [monthlyIncome, monthlyDebts, downPayment, downPaymentType, interestRate, loanTermYears]);

  return (
    <div className="space-y-8">
      {/* Main Calculator Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-8">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <IncomeInputs
              monthlyIncome={monthlyIncome}
              monthlyDebts={monthlyDebts}
              onIncomeChange={setMonthlyIncome}
              onDebtsChange={setMonthlyDebts}
            />
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <LoanInputs
              downPayment={downPayment}
              downPaymentType={downPaymentType}
              interestRate={interestRate}
              loanTermYears={loanTermYears}
              onDownPaymentChange={setDownPayment}
              onDownPaymentTypeChange={setDownPaymentType}
              onInterestRateChange={setInterestRate}
              onLoanTermChange={setLoanTermYears}
            />
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <ResultsDisplay results={results} />
          </div>
        </div>
      </div>

      {/* Full Width Breakdown */}
      <AffordabilityBreakdown results={results} loanTermYears={loanTermYears} />
    </div>
  );
}
