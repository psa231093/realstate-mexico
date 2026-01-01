"use client";

import { useState } from "react";
import { usePropertyListing } from "@/contexts/PropertyListingContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import { AddressStep, validateAddressStep } from "./steps/AddressStep";
import { BasicsStep, validateBasicsStep } from "./steps/BasicsStep";
import { DetailsStep, validateDetailsStep } from "./steps/DetailsStep";
import { PhotosStep, validatePhotosStep } from "./steps/PhotosStep";
import { ContactStep, validateContactStep } from "./steps/ContactStep";
import { PreviewStep } from "./steps/PreviewStep";

const steps = [
  { number: 1, title: "Dirección", component: AddressStep },
  { number: 2, title: "Datos Básicos", component: BasicsStep },
  { number: 3, title: "Detalles", component: DetailsStep },
  { number: 4, title: "Fotos", component: PhotosStep },
  { number: 5, title: "Contacto", component: ContactStep },
  { number: 6, title: "Vista Previa", component: PreviewStep },
];

export function PropertyListingWizard() {
  const { currentStep, setCurrentStep, data } = usePropertyListing();
  const [showValidationError, setShowValidationError] = useState(false);

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  // Validation function based on current step
  const isCurrentStepValid = (): boolean => {
    switch (currentStep) {
      case 1:
        return validateAddressStep(data);
      case 2:
        return validateBasicsStep(data);
      case 3:
        return validateDetailsStep(data);
      case 4:
        return validatePhotosStep(data);
      case 5:
        return validateContactStep(data);
      case 6:
        return true; // Preview step is always valid
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isCurrentStepValid()) {
      setShowValidationError(true);
      // Scroll to top to show the error
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setShowValidationError(false);
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    setShowValidationError(false);
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const stepIsValid = isCurrentStepValid();

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Publicar Propiedad
          </h1>
          <p className="text-muted-foreground">
            Complete la información para publicar su propiedad
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                      currentStep > step.number
                        ? "bg-green-500 text-white"
                        : currentStep === step.number
                        ? "bg-blue-600 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.number ? "✓" : step.number}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center hidden md:block ${
                      currentStep === step.number
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-colors ${
                      currentStep > step.number ? "bg-green-500" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Validation Error Banner */}
        {showValidationError && !stepIsValid && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-800">
                Por favor completa todos los campos requeridos
              </p>
              <p className="text-sm text-red-600">
                Revisa los campos marcados en rojo antes de continuar
              </p>
            </div>
          </div>
        )}

        {/* Current Step Card */}
        <div className="bg-card rounded-lg shadow-md p-8 mb-6 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            {steps[currentStep - 1]?.title}
          </h2>

          {CurrentStepComponent && <CurrentStepComponent />}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>

          {currentStep < steps.length && (
            <div className="flex items-center gap-3">
              {!stepIsValid && (
                <span className="text-sm text-amber-600 dark:text-amber-400 hidden sm:block">
                  Completa los campos requeridos
                </span>
              )}
              <Button
                onClick={handleNext}
                className={`gap-2 ${!stepIsValid ? "opacity-75" : ""}`}
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Save Draft Notice */}
        <div className="mt-4 text-center">
          <p className="text-sm text-muted-foreground">
            Su progreso se guarda automáticamente
          </p>
        </div>
      </div>
    </div>
  );
}
