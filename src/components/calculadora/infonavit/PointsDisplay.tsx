"use client";

import { Target, TrendingUp } from "lucide-react";
import type { InfonavitResults } from "@/lib/infonavit-calculator";
import { MIN_POINTS_FOR_CREDIT } from "@/lib/infonavit-calculator";

interface PointsDisplayProps {
  results: InfonavitResults;
}

export function PointsDisplay({ results }: PointsDisplayProps) {
  const { points, isEligible, breakdown } = results;
  const progressPercentage = Math.min((points / MIN_POINTS_FOR_CREDIT) * 100, 100);

  const pointCategories = [
    { label: "Salario", value: breakdown.salaryPoints, color: "bg-green-500", max: 200 },
    { label: "Edad", value: breakdown.agePoints, color: "bg-blue-500", max: 58 },
    { label: "Semanas", value: breakdown.continuousWeeksPoints, color: "bg-purple-500", max: 180 },
    { label: "Ahorro", value: breakdown.savingsPoints, color: "bg-amber-500", max: 120 },
  ];

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
        <Target className="h-5 w-5 text-green-600" />
        Tu Puntaje INFONAVIT
      </h3>

      {/* Main Points Display */}
      <div className="text-center mb-6">
        <div className={`text-5xl font-bold ${isEligible ? 'text-green-600' : 'text-amber-600'}`}>
          {points}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          de {MIN_POINTS_FOR_CREDIT} puntos necesarios
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-4 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isEligible ? 'bg-green-500' : 'bg-amber-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-muted-foreground">0</span>
          <span className="text-xs text-muted-foreground">{MIN_POINTS_FOR_CREDIT}</span>
        </div>
      </div>

      {/* Eligibility Status */}
      <div className={`p-4 rounded-lg mb-6 ${
        isEligible
          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
          : 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'
      }`}>
        <div className="flex items-center gap-2">
          <TrendingUp className={`h-5 w-5 ${isEligible ? 'text-green-600' : 'text-amber-600'}`} />
          <span className={`font-semibold ${isEligible ? 'text-green-700 dark:text-green-300' : 'text-amber-700 dark:text-amber-300'}`}>
            {isEligible ? 'Calificas para credito INFONAVIT' : 'Aun no calificas'}
          </span>
        </div>
        {!isEligible && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
            Te faltan {MIN_POINTS_FOR_CREDIT - points} puntos para calificar
          </p>
        )}
      </div>

      {/* Points Breakdown */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-foreground">Desglose de puntos:</p>
        {pointCategories.map((category) => (
          <div key={category.label} className="flex items-center gap-3">
            <div className="w-20 text-xs text-muted-foreground">{category.label}</div>
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full ${category.color} transition-all duration-300`}
                style={{ width: `${(category.value / category.max) * 100}%` }}
              />
            </div>
            <div className="w-12 text-xs font-medium text-foreground text-right">
              {category.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
