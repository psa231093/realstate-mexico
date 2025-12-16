/**
 * INFONAVIT/FOVISSSTE Calculator for Mexican Housing Credits
 * Based on 2024 INFONAVIT point system and credit calculation rules
 */

// 2024 UMA (Unidad de Medida y Actualizacion) values
export const UMA_DIARIO_2024 = 108.57; // MXN per day
export const UMA_MENSUAL_2024 = UMA_DIARIO_2024 * 30.4; // ~3,300.53 MXN
export const MIN_POINTS_FOR_CREDIT = 1080;

// Credit types
export type InfonavitCreditType = 'infonavit' | 'cofinavit' | 'cofinavit_ingresos';
export type FovisssteCreditType = 'tradicional' | 'pensionados' | 'respalda2m';

// INFONAVIT Inputs
export interface InfonavitInputs {
  monthlySalary: number;       // Salario mensual integrado
  age: number;                 // Edad del trabajador (17-65)
  continuousWeeks: number;     // Semanas cotizadas continuas
  savingsBalance: number;      // Saldo en subcuenta de vivienda
  creditType: InfonavitCreditType;
  // For Cofinavit
  bankCreditAmount?: number;   // Monto del credito bancario adicional
}

// INFONAVIT Results
export interface InfonavitResults {
  points: number;
  isEligible: boolean;
  maxCreditAmount: number;
  monthlyPayment: number;
  estimatedDiscount: number;   // Descuento quincenal
  savingsContribution: number;
  creditTerm: number;          // In months
  interestRate: number;
  totalPurchasePower: number;  // Credit + savings + bank (if cofinavit)
  breakdown: {
    salaryPoints: number;
    agePoints: number;
    continuousWeeksPoints: number;
    savingsPoints: number;
  };
  requirements: string[];
}

// FOVISSSTE Inputs
export interface FovisssteInputs {
  monthlySalary: number;
  yearsOfService: number;
  savingsBalance: number;
  age: number;
  creditType: FovisssteCreditType;
}

// FOVISSSTE Results
export interface FovisssteResults {
  isEligible: boolean;
  maxCreditAmount: number;
  monthlyPayment: number;
  creditTerm: number;
  interestRate: number;
  totalPurchasePower: number;
  requirements: string[];
}

/**
 * Calculate points based on salary (in UMA multiples)
 * Higher salary = more points, but with diminishing returns
 */
function calculateSalaryPoints(monthlySalary: number): number {
  const salaryInUMA = monthlySalary / UMA_MENSUAL_2024;

  // INFONAVIT point scale based on salary ranges
  if (salaryInUMA <= 1.0) return Math.round(39 * salaryInUMA);
  if (salaryInUMA <= 1.5) return Math.round(39 + (salaryInUMA - 1.0) * 30);
  if (salaryInUMA <= 2.0) return Math.round(54 + (salaryInUMA - 1.5) * 28);
  if (salaryInUMA <= 2.6) return Math.round(68 + (salaryInUMA - 2.0) * 26);
  if (salaryInUMA <= 3.7) return Math.round(84 + (salaryInUMA - 2.6) * 24);
  if (salaryInUMA <= 5.2) return Math.round(110 + (salaryInUMA - 3.7) * 18);
  if (salaryInUMA <= 7.0) return Math.round(137 + (salaryInUMA - 5.2) * 12);
  if (salaryInUMA <= 10.0) return Math.round(159 + (salaryInUMA - 7.0) * 8);

  // Cap at 25 UMA (legal maximum for INFONAVIT)
  const cappedUMA = Math.min(salaryInUMA, 25);
  return Math.min(200, Math.round(183 + (cappedUMA - 10.0) * 1.5));
}

/**
 * Calculate points based on age
 * Younger workers get slightly more points (longer loan term potential)
 */
function calculateAgePoints(age: number): number {
  if (age < 17) return 0;
  if (age <= 22) return 58;
  if (age <= 27) return 56;
  if (age <= 32) return 52;
  if (age <= 37) return 48;
  if (age <= 42) return 44;
  if (age <= 47) return 40;
  if (age <= 52) return 36;
  if (age <= 57) return 32;
  if (age <= 62) return 28;
  return 24;
}

/**
 * Calculate points based on continuous employment weeks
 * Minimum 104 weeks (2 years) required
 */
function calculateContinuousWeeksPoints(weeks: number): number {
  if (weeks < 104) return 0; // Minimum 2 years continuous

  // Points scale with continuous employment
  if (weeks < 130) return Math.round((weeks - 104) * 1.5);
  if (weeks < 156) return Math.round(39 + (weeks - 130) * 1.2);
  if (weeks < 208) return Math.round(70 + (weeks - 156) * 0.8);
  if (weeks < 260) return Math.round(112 + (weeks - 208) * 0.6);
  if (weeks < 312) return Math.round(143 + (weeks - 260) * 0.4);

  return Math.min(180, Math.round(164 + (weeks - 312) * 0.2));
}

/**
 * Calculate points based on savings balance in subcuenta de vivienda
 */
function calculateSavingsPoints(balance: number, monthlySalary: number): number {
  if (balance <= 0 || monthlySalary <= 0) return 0;

  // Ratio of savings to annual salary
  const annualSalary = monthlySalary * 12;
  const ratio = balance / annualSalary;

  // More savings relative to salary = more points
  if (ratio < 0.5) return Math.round(ratio * 40);
  if (ratio < 1.0) return Math.round(20 + (ratio - 0.5) * 60);
  if (ratio < 2.0) return Math.round(50 + (ratio - 1.0) * 40);
  if (ratio < 3.0) return Math.round(90 + (ratio - 2.0) * 20);

  return Math.min(120, Math.round(110 + (ratio - 3.0) * 5));
}

/**
 * Calculate maximum INFONAVIT credit based on points, salary, and age
 */
function calculateMaxInfonavitCredit(
  points: number,
  monthlySalary: number,
  age: number,
  creditType: InfonavitCreditType
): number {
  if (points < MIN_POINTS_FOR_CREDIT) return 0;

  // Base credit multiplier in VSM (Veces Salario Minimo)
  let baseMultiplier: number;
  if (points < 1100) baseMultiplier = 150;
  else if (points < 1150) baseMultiplier = 175;
  else if (points < 1200) baseMultiplier = 200;
  else if (points < 1250) baseMultiplier = 225;
  else baseMultiplier = 250;

  // Age factor (younger = longer term = higher credit)
  let ageFactor = 1.0;
  if (age <= 30) ageFactor = 1.15;
  else if (age <= 40) ageFactor = 1.10;
  else if (age <= 50) ageFactor = 1.0;
  else if (age <= 55) ageFactor = 0.90;
  else ageFactor = 0.75;

  // Credit type adjustments
  let typeMultiplier = 1.0;
  if (creditType === 'cofinavit') typeMultiplier = 0.7; // INFONAVIT portion is smaller
  else if (creditType === 'cofinavit_ingresos') typeMultiplier = 0.5;

  // Calculate credit amount
  const baseCredit = UMA_MENSUAL_2024 * baseMultiplier;
  const adjustedCredit = baseCredit * ageFactor * typeMultiplier;

  // Cap based on salary (max ~9x annual salary for pure INFONAVIT)
  const maxBySalary = monthlySalary * 12 * 9;

  return Math.min(adjustedCredit, maxBySalary);
}

/**
 * Calculate interest rate based on salary in UMA
 * INFONAVIT uses tiered rates based on income
 */
function calculateInterestRate(monthlySalary: number): number {
  const salaryInUMA = monthlySalary / UMA_MENSUAL_2024;

  // 2024 INFONAVIT interest rates by salary tier
  if (salaryInUMA <= 2.6) return 1.98;   // Lowest tier
  if (salaryInUMA <= 4.0) return 4.95;
  if (salaryInUMA <= 6.0) return 7.41;
  if (salaryInUMA <= 8.0) return 8.59;
  if (salaryInUMA <= 10.0) return 9.55;
  return 10.45;  // Highest tier
}

/**
 * Calculate loan term based on age (retirement at 65)
 */
function calculateLoanTerm(age: number): number {
  const yearsToRetirement = Math.max(65 - age, 5);
  const maxTermYears = Math.min(yearsToRetirement, 30);
  return maxTermYears * 12; // Return in months
}

/**
 * Calculate monthly payment using standard mortgage formula
 */
function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  termMonths: number
): number {
  if (principal <= 0 || termMonths <= 0) return 0;

  const monthlyRate = annualRate / 100 / 12;

  if (monthlyRate === 0) {
    return principal / termMonths;
  }

  const factor = Math.pow(1 + monthlyRate, termMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

/**
 * Main INFONAVIT calculator function
 */
export function calculateInfonavit(inputs: InfonavitInputs): InfonavitResults {
  const {
    monthlySalary,
    age,
    continuousWeeks,
    savingsBalance,
    creditType,
    bankCreditAmount = 0,
  } = inputs;

  // Calculate individual point components
  const salaryPoints = calculateSalaryPoints(monthlySalary);
  const agePoints = calculateAgePoints(age);
  const continuousWeeksPoints = calculateContinuousWeeksPoints(continuousWeeks);
  const savingsPoints = calculateSavingsPoints(savingsBalance, monthlySalary);

  // Total points
  const points = salaryPoints + agePoints + continuousWeeksPoints + savingsPoints;

  // Check eligibility
  const isEligible = points >= MIN_POINTS_FOR_CREDIT && continuousWeeks >= 104;

  // Calculate credit details
  const maxCreditAmount = calculateMaxInfonavitCredit(points, monthlySalary, age, creditType);
  const interestRate = calculateInterestRate(monthlySalary);
  const creditTerm = calculateLoanTerm(age);
  const monthlyPayment = calculateMonthlyPayment(maxCreditAmount, interestRate, creditTerm);

  // Biweekly discount (payment is taken from paycheck)
  const estimatedDiscount = monthlyPayment / 2;

  // Total purchase power
  let totalPurchasePower = maxCreditAmount + savingsBalance;
  if (creditType === 'cofinavit' || creditType === 'cofinavit_ingresos') {
    totalPurchasePower += bankCreditAmount;
  }

  // Generate requirements list
  const requirements: string[] = [];
  if (continuousWeeks < 104) {
    requirements.push(`Necesitas ${104 - continuousWeeks} semanas mas de cotizacion continua`);
  }
  if (points < MIN_POINTS_FOR_CREDIT) {
    requirements.push(`Necesitas ${MIN_POINTS_FOR_CREDIT - points} puntos mas para calificar`);
  }
  if (isEligible) {
    requirements.push('Cumples con los requisitos basicos para solicitar tu credito');
  }

  return {
    points,
    isEligible,
    maxCreditAmount,
    monthlyPayment: Math.round(monthlyPayment),
    estimatedDiscount: Math.round(estimatedDiscount),
    savingsContribution: savingsBalance,
    creditTerm,
    interestRate,
    totalPurchasePower,
    breakdown: {
      salaryPoints,
      agePoints,
      continuousWeeksPoints,
      savingsPoints,
    },
    requirements,
  };
}

/**
 * FOVISSSTE calculator for government workers
 */
export function calculateFovissste(inputs: FovisssteInputs): FovisssteResults {
  const {
    monthlySalary,
    yearsOfService,
    savingsBalance,
    age,
    creditType,
  } = inputs;

  // FOVISSSTE eligibility: minimum 18 months of service
  const isEligible = yearsOfService >= 1.5;

  // Credit multiplier based on type
  let creditMultiplier: number;
  let interestRate: number;

  switch (creditType) {
    case 'tradicional':
      creditMultiplier = 70;
      interestRate = 4.0;
      break;
    case 'pensionados':
      creditMultiplier = 50;
      interestRate = 6.0;
      break;
    case 'respalda2m':
      creditMultiplier = 60;
      interestRate = 5.5;
      break;
    default:
      creditMultiplier = 70;
      interestRate = 4.0;
  }

  // Calculate max credit (based on salary multiplier)
  const maxCreditAmount = monthlySalary * creditMultiplier;

  // Loan term based on age
  const creditTerm = calculateLoanTerm(age);

  // Monthly payment
  const monthlyPayment = calculateMonthlyPayment(maxCreditAmount, interestRate, creditTerm);

  // Total purchase power
  const totalPurchasePower = maxCreditAmount + savingsBalance;

  // Requirements
  const requirements: string[] = [];
  if (yearsOfService < 1.5) {
    const monthsNeeded = Math.ceil((1.5 - yearsOfService) * 12);
    requirements.push(`Necesitas ${monthsNeeded} meses mas de servicio`);
  }
  if (isEligible) {
    requirements.push('Cumples con los requisitos basicos para solicitar tu credito FOVISSSTE');
  }

  return {
    isEligible,
    maxCreditAmount,
    monthlyPayment: Math.round(monthlyPayment),
    creditTerm,
    interestRate,
    totalPurchasePower,
    requirements,
  };
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
 * Default input values for INFONAVIT calculator
 */
export const DEFAULT_INFONAVIT_INPUTS: InfonavitInputs = {
  monthlySalary: 15000,
  age: 35,
  continuousWeeks: 260, // 5 years
  savingsBalance: 100000,
  creditType: 'infonavit',
};

/**
 * Default input values for FOVISSSTE calculator
 */
export const DEFAULT_FOVISSSTE_INPUTS: FovisssteInputs = {
  monthlySalary: 20000,
  yearsOfService: 5,
  savingsBalance: 150000,
  age: 35,
  creditType: 'tradicional',
};
