/**
 * Investment/Rental Yield Calculator for Mexican Real Estate
 * Calculates cap rate, ROI, cash-on-cash return, and compares with other investments
 */

// Current Mexican investment rates (2024)
export const CETES_28_RATE = 11.25;  // CETES 28 days rate
export const CETES_364_RATE = 10.85; // CETES 364 days rate
export const SP500_HISTORICAL = 10.5; // S&P 500 historical average
export const MEXICO_INFLATION = 4.5; // Approximate inflation rate

export type InvestmentMode = 'traditional' | 'airbnb';

// Input interfaces
export interface InvestmentInputs {
  propertyPrice: number;
  downPayment: number;         // If financing
  monthlyRent: number;
  expenses: {
    maintenance: number;       // Monthly maintenance/repairs
    predial: number;           // Property tax (predial)
    hoa: number;               // HOA/maintenance fees
    insurance: number;         // Property insurance
    management: number;        // Property management fee
  };
  vacancyRate: number;         // Expected vacancy percentage (0-100)
  appreciationRate: number;    // Expected annual appreciation
  useFinancing: boolean;
  financing?: {
    loanAmount: number;
    interestRate: number;
    termYears: number;
  };
}

export interface AirbnbInputs {
  propertyPrice: number;
  downPayment: number;
  nightlyRate: number;
  occupancyRate: number;       // Expected occupancy percentage (0-100)
  expenses: {
    maintenance: number;
    predial: number;
    hoa: number;
    insurance: number;
    utilities: number;         // Higher for Airbnb
    cleaning: number;          // Per turnover cleaning cost
    supplies: number;          // Toiletries, linens, etc.
  };
  platformFee: number;         // Airbnb/VRBO fee percentage
  managementFee: number;       // Property manager percentage (if any)
  appreciationRate: number;
  useFinancing: boolean;
  financing?: {
    loanAmount: number;
    interestRate: number;
    termYears: number;
  };
}

export interface InvestmentResults {
  // Core metrics
  grossYield: number;          // (Annual Rent / Price) * 100
  netYield: number;            // (NOI / Price) * 100
  capRate: number;             // (NOI / Price) * 100 (same as net yield for all-cash)
  cashOnCashReturn: number;    // (Annual Cash Flow / Cash Invested) * 100

  // Income & expenses
  monthlyGrossIncome: number;
  monthlyExpenses: number;
  monthlyNOI: number;          // Net Operating Income
  annualNOI: number;
  annualCashFlow: number;      // After debt service

  // Investment metrics
  paybackPeriod: number;       // Years to recover investment
  totalCashInvested: number;
  monthlyMortgage: number;     // 0 if no financing

  // Long-term projections
  roi5Year: number;            // Total ROI over 5 years
  roi10Year: number;           // Total ROI over 10 years
  projectedValue5Year: number;
  projectedValue10Year: number;

  // Comparison with alternatives
  comparison: {
    cetes28: number;
    cetes364: number;
    sp500: number;
    inflation: number;
    difference: number;        // vs CETES 28
  };

  // Rating
  investmentRating: 'excellent' | 'good' | 'average' | 'poor';
  recommendations: string[];
}

/**
 * Calculate monthly mortgage payment
 */
function calculateMortgagePayment(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0 || termYears <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;

  if (monthlyRate === 0) return principal / numPayments;

  const factor = Math.pow(1 + monthlyRate, numPayments);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * Calculate future value with appreciation
 */
function calculateFutureValue(
  presentValue: number,
  annualRate: number,
  years: number
): number {
  return presentValue * Math.pow(1 + annualRate / 100, years);
}

/**
 * Calculate ROI including appreciation and cash flow
 */
function calculateTotalROI(
  cashInvested: number,
  annualCashFlow: number,
  propertyPrice: number,
  appreciationRate: number,
  years: number
): number {
  const futureValue = calculateFutureValue(propertyPrice, appreciationRate, years);
  const totalCashFlow = annualCashFlow * years;
  const appreciation = futureValue - propertyPrice;
  const totalReturn = totalCashFlow + appreciation;

  return (totalReturn / cashInvested) * 100;
}

/**
 * Get investment rating based on metrics
 */
function getInvestmentRating(
  capRate: number,
  cashOnCash: number,
  comparisonDiff: number
): 'excellent' | 'good' | 'average' | 'poor' {
  // Score based on multiple factors
  let score = 0;

  // Cap rate scoring
  if (capRate >= 8) score += 3;
  else if (capRate >= 6) score += 2;
  else if (capRate >= 4) score += 1;

  // Cash-on-cash scoring
  if (cashOnCash >= 12) score += 3;
  else if (cashOnCash >= 8) score += 2;
  else if (cashOnCash >= 5) score += 1;

  // Comparison with CETES
  if (comparisonDiff >= 3) score += 2;
  else if (comparisonDiff >= 0) score += 1;

  if (score >= 7) return 'excellent';
  if (score >= 5) return 'good';
  if (score >= 3) return 'average';
  return 'poor';
}

/**
 * Generate recommendations based on results
 */
function generateRecommendations(
  results: Partial<InvestmentResults>,
  inputs: InvestmentInputs | AirbnbInputs
): string[] {
  const recommendations: string[] = [];

  if (results.capRate && results.capRate < 5) {
    recommendations.push('El cap rate es bajo. Considera negociar un mejor precio o buscar propiedades con mayor potencial de renta.');
  }

  if (results.comparison && results.comparison.difference < 0) {
    recommendations.push(`Esta inversion rinde menos que CETES (${CETES_28_RATE}%). Evalua si la apreciacion futura justifica el riesgo.`);
  }

  if ('vacancyRate' in inputs && inputs.vacancyRate > 10) {
    recommendations.push('La tasa de vacancia es alta. Investiga el mercado de renta en la zona.');
  }

  if (results.paybackPeriod && results.paybackPeriod > 20) {
    recommendations.push('El periodo de recuperacion es largo. Esta inversion es mejor para apreciacion a largo plazo.');
  }

  if (results.cashOnCashReturn && results.cashOnCashReturn > 10) {
    recommendations.push('Excelente retorno sobre tu inversion en efectivo. Considera reinvertir las ganancias.');
  }

  if (recommendations.length === 0) {
    recommendations.push('Esta propiedad presenta metricas de inversion equilibradas.');
  }

  return recommendations;
}

/**
 * Main traditional rental investment calculator
 */
export function calculateTraditionalInvestment(inputs: InvestmentInputs): InvestmentResults {
  const {
    propertyPrice,
    downPayment,
    monthlyRent,
    expenses,
    vacancyRate,
    appreciationRate,
    useFinancing,
    financing,
  } = inputs;

  // Calculate effective monthly income (accounting for vacancy)
  const effectiveVacancy = vacancyRate / 100;
  const monthlyGrossIncome = monthlyRent * (1 - effectiveVacancy);

  // Calculate total monthly expenses
  const totalExpenses =
    expenses.maintenance +
    expenses.predial +
    expenses.hoa +
    expenses.insurance +
    expenses.management;

  // Net Operating Income
  const monthlyNOI = monthlyGrossIncome - totalExpenses;
  const annualNOI = monthlyNOI * 12;

  // Financing calculations
  let monthlyMortgage = 0;
  let totalCashInvested = propertyPrice;

  if (useFinancing && financing) {
    monthlyMortgage = calculateMortgagePayment(
      financing.loanAmount,
      financing.interestRate,
      financing.termYears
    );
    totalCashInvested = downPayment;
  }

  // Annual cash flow (after debt service)
  const annualCashFlow = annualNOI - (monthlyMortgage * 12);

  // Core metrics
  const grossYield = (monthlyRent * 12 / propertyPrice) * 100;
  const netYield = (annualNOI / propertyPrice) * 100;
  const capRate = netYield; // Same for all-cash purchase
  const cashOnCashReturn = totalCashInvested > 0
    ? (annualCashFlow / totalCashInvested) * 100
    : 0;

  // Payback period
  const paybackPeriod = annualCashFlow > 0
    ? totalCashInvested / annualCashFlow
    : Infinity;

  // Long-term projections
  const projectedValue5Year = calculateFutureValue(propertyPrice, appreciationRate, 5);
  const projectedValue10Year = calculateFutureValue(propertyPrice, appreciationRate, 10);
  const roi5Year = calculateTotalROI(totalCashInvested, annualCashFlow, propertyPrice, appreciationRate, 5);
  const roi10Year = calculateTotalROI(totalCashInvested, annualCashFlow, propertyPrice, appreciationRate, 10);

  // Comparison with alternatives
  const comparison = {
    cetes28: CETES_28_RATE,
    cetes364: CETES_364_RATE,
    sp500: SP500_HISTORICAL,
    inflation: MEXICO_INFLATION,
    difference: cashOnCashReturn - CETES_28_RATE,
  };

  // Rating and recommendations
  const investmentRating = getInvestmentRating(capRate, cashOnCashReturn, comparison.difference);

  const partialResults: Partial<InvestmentResults> = {
    capRate,
    cashOnCashReturn,
    paybackPeriod,
    comparison,
  };

  const recommendations = generateRecommendations(partialResults, inputs);

  return {
    grossYield: Math.round(grossYield * 100) / 100,
    netYield: Math.round(netYield * 100) / 100,
    capRate: Math.round(capRate * 100) / 100,
    cashOnCashReturn: Math.round(cashOnCashReturn * 100) / 100,
    monthlyGrossIncome: Math.round(monthlyGrossIncome),
    monthlyExpenses: Math.round(totalExpenses),
    monthlyNOI: Math.round(monthlyNOI),
    annualNOI: Math.round(annualNOI),
    annualCashFlow: Math.round(annualCashFlow),
    paybackPeriod: Math.round(paybackPeriod * 10) / 10,
    totalCashInvested: Math.round(totalCashInvested),
    monthlyMortgage: Math.round(monthlyMortgage),
    roi5Year: Math.round(roi5Year * 10) / 10,
    roi10Year: Math.round(roi10Year * 10) / 10,
    projectedValue5Year: Math.round(projectedValue5Year),
    projectedValue10Year: Math.round(projectedValue10Year),
    comparison,
    investmentRating,
    recommendations,
  };
}

/**
 * Airbnb/short-term rental calculator
 */
export function calculateAirbnbInvestment(inputs: AirbnbInputs): InvestmentResults {
  const {
    propertyPrice,
    downPayment,
    nightlyRate,
    occupancyRate,
    expenses,
    platformFee,
    managementFee,
    appreciationRate,
    useFinancing,
    financing,
  } = inputs;

  // Calculate monthly income
  const daysPerMonth = 30;
  const occupiedDays = daysPerMonth * (occupancyRate / 100);
  const turnovers = Math.ceil(occupiedDays / 3); // Estimate turnovers (avg 3-day stay)

  const grossMonthlyRevenue = nightlyRate * occupiedDays;
  const platformFees = grossMonthlyRevenue * (platformFee / 100);
  const managementFees = grossMonthlyRevenue * (managementFee / 100);
  const cleaningCosts = expenses.cleaning * turnovers;

  const monthlyGrossIncome = grossMonthlyRevenue - platformFees - managementFees;

  // Calculate total monthly expenses
  const totalExpenses =
    expenses.maintenance +
    expenses.predial +
    expenses.hoa +
    expenses.insurance +
    expenses.utilities +
    cleaningCosts +
    expenses.supplies;

  // Convert to traditional inputs format for consistent calculation
  const traditionalInputs: InvestmentInputs = {
    propertyPrice,
    downPayment,
    monthlyRent: monthlyGrossIncome,
    expenses: {
      maintenance: expenses.maintenance,
      predial: expenses.predial,
      hoa: expenses.hoa,
      insurance: expenses.insurance,
      management: expenses.utilities + cleaningCosts + expenses.supplies,
    },
    vacancyRate: 0, // Already accounted for in occupancy
    appreciationRate,
    useFinancing,
    financing,
  };

  return calculateTraditionalInvestment(traditionalInputs);
}

/**
 * Format currency in Mexican Pesos
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(2)}%`;
}

/**
 * Default input values for traditional rental
 */
export const DEFAULT_INVESTMENT_INPUTS: InvestmentInputs = {
  propertyPrice: 2500000,
  downPayment: 500000,
  monthlyRent: 15000,
  expenses: {
    maintenance: 500,
    predial: 300,
    hoa: 1500,
    insurance: 200,
    management: 0,
  },
  vacancyRate: 5,
  appreciationRate: 6,
  useFinancing: false,
  financing: {
    loanAmount: 2000000,
    interestRate: 11,
    termYears: 20,
  },
};

/**
 * Default input values for Airbnb
 */
export const DEFAULT_AIRBNB_INPUTS: AirbnbInputs = {
  propertyPrice: 2500000,
  downPayment: 500000,
  nightlyRate: 1500,
  occupancyRate: 60,
  expenses: {
    maintenance: 1000,
    predial: 300,
    hoa: 1500,
    insurance: 300,
    utilities: 2000,
    cleaning: 500,
    supplies: 500,
  },
  platformFee: 3,
  managementFee: 20,
  appreciationRate: 6,
  useFinancing: false,
  financing: {
    loanAmount: 2000000,
    interestRate: 11,
    termYears: 20,
  },
};
