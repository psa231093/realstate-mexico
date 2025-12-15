// Affordability Calculator for Mexican Mortgage Market

export interface AffordabilityInputs {
  monthlyIncome: number;
  monthlyDebts: number;
  downPayment: number;
  downPaymentType: "amount" | "percentage";
  interestRate: number; // Annual rate as percentage (e.g., 11 for 11%)
  loanTermYears: number;
}

export interface AffordabilityResults {
  maxHomePrice: number;
  loanAmount: number;
  monthlyPayment: number;
  breakdown: {
    principal: number;
    interest: number;
    propertyTax: number;
    insurance: number;
  };
  dtiRatio: number;
  totalInterestPaid: number;
  totalLoanCost: number;
}

// Mexican mortgage market constants
const DTI_RATIO = 0.30; // 30% debt-to-income ratio (standard in Mexico)
const PROPERTY_TAX_RATE = 0.001; // 0.1% of home value annually
const INSURANCE_RATE = 0.0005; // 0.05% of home value annually

/**
 * Calculate the maximum loan amount using the PMT formula inverse
 * PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
 * Solving for P: P = PMT * [(1+r)^n - 1] / [r(1+r)^n]
 */
function calculateMaxLoanAmount(
  monthlyPayment: number,
  annualRate: number,
  termYears: number
): number {
  if (monthlyPayment <= 0 || annualRate <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  const factor = Math.pow(1 + monthlyRate, numPayments);
  const maxLoan = (monthlyPayment * (factor - 1)) / (monthlyRate * factor);

  return Math.max(0, maxLoan);
}

/**
 * Calculate monthly mortgage payment using standard PMT formula
 */
function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0 || annualRate <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  const factor = Math.pow(1 + monthlyRate, numPayments);
  const payment = (principal * monthlyRate * factor) / (factor - 1);

  return payment;
}

/**
 * Calculate first month's principal and interest breakdown
 */
function calculateFirstMonthBreakdown(
  principal: number,
  annualRate: number,
  monthlyPayment: number
): { principalPayment: number; interestPayment: number } {
  const monthlyRate = annualRate / 100 / 12;
  const interestPayment = principal * monthlyRate;
  const principalPayment = monthlyPayment - interestPayment;

  return {
    principalPayment: Math.max(0, principalPayment),
    interestPayment: Math.max(0, interestPayment),
  };
}

/**
 * Main affordability calculation function
 */
export function calculateAffordability(
  inputs: AffordabilityInputs
): AffordabilityResults {
  const { monthlyIncome, monthlyDebts, downPayment, downPaymentType, interestRate, loanTermYears } =
    inputs;

  // Step 1: Calculate maximum monthly payment based on DTI
  const maxMonthlyPayment = monthlyIncome * DTI_RATIO;
  const availableForMortgage = Math.max(0, maxMonthlyPayment - monthlyDebts);

  // Step 2: Account for property tax and insurance in the monthly budget
  // We need to solve iteratively since tax/insurance depend on home price
  // Start with an estimate and refine
  let estimatedHomePrice = 0;
  let iterations = 0;
  const maxIterations = 20;

  // Initial estimate: assume 85% goes to P&I
  let availableForPI = availableForMortgage * 0.85;
  let maxLoan = calculateMaxLoanAmount(availableForPI, interestRate, loanTermYears);

  // Calculate down payment
  let downPaymentAmount: number;
  if (downPaymentType === "percentage") {
    // For percentage, we need to solve for home price where:
    // homePrice = loan / (1 - downPaymentPct)
    const downPaymentPct = downPayment / 100;
    if (downPaymentPct >= 1) {
      // 100% down payment means any home price is "affordable" but no loan needed
      estimatedHomePrice = availableForMortgage * 12 * loanTermYears; // Rough estimate
    } else {
      estimatedHomePrice = maxLoan / (1 - downPaymentPct);
    }
    downPaymentAmount = estimatedHomePrice * downPaymentPct;
  } else {
    downPaymentAmount = downPayment;
    estimatedHomePrice = maxLoan + downPaymentAmount;
  }

  // Iterative refinement to account for tax and insurance
  while (iterations < maxIterations) {
    const monthlyTax = (estimatedHomePrice * PROPERTY_TAX_RATE) / 12;
    const monthlyInsurance = (estimatedHomePrice * INSURANCE_RATE) / 12;
    const newAvailableForPI = availableForMortgage - monthlyTax - monthlyInsurance;

    if (newAvailableForPI <= 0) {
      estimatedHomePrice = 0;
      maxLoan = 0;
      break;
    }

    maxLoan = calculateMaxLoanAmount(newAvailableForPI, interestRate, loanTermYears);

    let newHomePrice: number;
    if (downPaymentType === "percentage") {
      const downPaymentPct = downPayment / 100;
      newHomePrice = downPaymentPct >= 1 ? estimatedHomePrice : maxLoan / (1 - downPaymentPct);
      downPaymentAmount = newHomePrice * downPaymentPct;
    } else {
      newHomePrice = maxLoan + downPaymentAmount;
    }

    // Check for convergence
    if (Math.abs(newHomePrice - estimatedHomePrice) < 100) {
      estimatedHomePrice = newHomePrice;
      break;
    }

    estimatedHomePrice = newHomePrice;
    iterations++;
  }

  // Final calculations
  const loanAmount = Math.max(0, estimatedHomePrice - downPaymentAmount);
  const monthlyPI = calculateMonthlyPayment(loanAmount, interestRate, loanTermYears);
  const monthlyTax = (estimatedHomePrice * PROPERTY_TAX_RATE) / 12;
  const monthlyInsurance = (estimatedHomePrice * INSURANCE_RATE) / 12;
  const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance;

  // First month breakdown
  const { principalPayment, interestPayment } = calculateFirstMonthBreakdown(
    loanAmount,
    interestRate,
    monthlyPI
  );

  // Total interest over life of loan
  const totalPayments = monthlyPI * loanTermYears * 12;
  const totalInterestPaid = totalPayments - loanAmount;

  // Calculate actual DTI ratio
  const actualDTI = monthlyIncome > 0 ? (totalMonthlyPayment + monthlyDebts) / monthlyIncome : 0;

  return {
    maxHomePrice: Math.round(estimatedHomePrice),
    loanAmount: Math.round(loanAmount),
    monthlyPayment: Math.round(totalMonthlyPayment),
    breakdown: {
      principal: Math.round(principalPayment),
      interest: Math.round(interestPayment),
      propertyTax: Math.round(monthlyTax),
      insurance: Math.round(monthlyInsurance),
    },
    dtiRatio: Math.round(actualDTI * 100),
    totalInterestPaid: Math.round(totalInterestPaid),
    totalLoanCost: Math.round(totalPayments),
  };
}

/**
 * Format number as Mexican Peso currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculate amortization schedule for the first N months
 */
export function calculateAmortizationSchedule(
  principal: number,
  annualRate: number,
  termYears: number,
  months: number = 12
): Array<{
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}> {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, termYears);
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= months && balance > 0; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = Math.min(monthlyPayment - interestPayment, balance);
    balance = Math.max(0, balance - principalPayment);

    schedule.push({
      month,
      payment: Math.round(monthlyPayment),
      principal: Math.round(principalPayment),
      interest: Math.round(interestPayment),
      balance: Math.round(balance),
    });
  }

  return schedule;
}
