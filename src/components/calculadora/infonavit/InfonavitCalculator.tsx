"use client";

import { useState, useMemo } from "react";
import { WorkerInfoInputs } from "./WorkerInfoInputs";
import { SavingsInputs } from "./SavingsInputs";
import { CreditTypeSelector } from "./CreditTypeSelector";
import { PointsDisplay } from "./PointsDisplay";
import { InfonavitResults } from "./InfonavitResults";
import {
  calculateInfonavit,
  DEFAULT_INFONAVIT_INPUTS,
  type InfonavitCreditType,
} from "@/lib/infonavit-calculator";

export function InfonavitCalculator() {
  // State for inputs
  const [monthlySalary, setMonthlySalary] = useState(DEFAULT_INFONAVIT_INPUTS.monthlySalary);
  const [age, setAge] = useState(DEFAULT_INFONAVIT_INPUTS.age);
  const [continuousWeeks, setContinuousWeeks] = useState(DEFAULT_INFONAVIT_INPUTS.continuousWeeks);
  const [savingsBalance, setSavingsBalance] = useState(DEFAULT_INFONAVIT_INPUTS.savingsBalance);
  const [creditType, setCreditType] = useState<InfonavitCreditType>(DEFAULT_INFONAVIT_INPUTS.creditType);
  const [bankCreditAmount, setBankCreditAmount] = useState(0);

  // Calculate results with useMemo
  const results = useMemo(() => {
    return calculateInfonavit({
      monthlySalary,
      age,
      continuousWeeks,
      savingsBalance,
      creditType,
      bankCreditAmount,
    });
  }, [monthlySalary, age, continuousWeeks, savingsBalance, creditType, bankCreditAmount]);

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <WorkerInfoInputs
              monthlySalary={monthlySalary}
              age={age}
              continuousWeeks={continuousWeeks}
              onSalaryChange={setMonthlySalary}
              onAgeChange={setAge}
              onWeeksChange={setContinuousWeeks}
            />
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <SavingsInputs
              savingsBalance={savingsBalance}
              onBalanceChange={setSavingsBalance}
            />
          </div>

          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <CreditTypeSelector
              creditType={creditType}
              onTypeChange={setCreditType}
              bankCreditAmount={bankCreditAmount}
              onBankCreditChange={setBankCreditAmount}
            />
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:sticky lg:top-24 h-fit space-y-6">
          <PointsDisplay results={results} />
          <InfonavitResults results={results} />
        </div>
      </div>
    </div>
  );
}
