"use client";

import { useState, useMemo } from "react";
import { PropertyInputs } from "./PropertyInputs";
import { ExpensesInputs } from "./ExpensesInputs";
import { YieldResults } from "./YieldResults";
import {
  calculateTraditionalInvestment,
  DEFAULT_INVESTMENT_INPUTS,
  type InvestmentInputs,
} from "@/lib/investment-calculator";

export function InvestmentCalculator() {
  // State for inputs
  const [propertyPrice, setPropertyPrice] = useState(DEFAULT_INVESTMENT_INPUTS.propertyPrice);
  const [monthlyRent, setMonthlyRent] = useState(DEFAULT_INVESTMENT_INPUTS.monthlyRent);
  const [expenses, setExpenses] = useState(DEFAULT_INVESTMENT_INPUTS.expenses);
  const [vacancyRate, setVacancyRate] = useState(DEFAULT_INVESTMENT_INPUTS.vacancyRate);
  const [appreciationRate, setAppreciationRate] = useState(DEFAULT_INVESTMENT_INPUTS.appreciationRate);

  // Calculate results with useMemo
  const results = useMemo(() => {
    const inputs: InvestmentInputs = {
      propertyPrice,
      downPayment: propertyPrice, // All cash for now
      monthlyRent,
      expenses,
      vacancyRate,
      appreciationRate,
      useFinancing: false,
    };
    return calculateTraditionalInvestment(inputs);
  }, [propertyPrice, monthlyRent, expenses, vacancyRate, appreciationRate]);

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <PropertyInputs
              propertyPrice={propertyPrice}
              monthlyRent={monthlyRent}
              onPriceChange={setPropertyPrice}
              onRentChange={setMonthlyRent}
            />
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <ExpensesInputs
              expenses={expenses}
              vacancyRate={vacancyRate}
              appreciationRate={appreciationRate}
              onExpensesChange={setExpenses}
              onVacancyChange={setVacancyRate}
              onAppreciationChange={setAppreciationRate}
            />
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:sticky lg:top-24 h-fit">
          <YieldResults results={results} />
        </div>
      </div>
    </div>
  );
}
