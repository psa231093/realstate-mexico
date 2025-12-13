"use client";

import { usePropertyListing } from "@/contexts/PropertyListingContext";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AddressStep } from "./steps/AddressStep";
import { BasicsStep } from "./steps/BasicsStep";
import { DetailsStep } from "./steps/DetailsStep";
import { PhotosStep } from "./steps/PhotosStep";
import { ContactStep } from "./steps/ContactStep";
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
  const { currentStep, setCurrentStep } = usePropertyListing();

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Publicar Propiedad
          </h1>
          <p className="text-gray-600">
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
                        : "bg-gray-300 text-gray-600"
                    }`}
                  >
                    {currentStep > step.number ? "✓" : step.number}
                  </div>
                  <span
                    className={`text-xs mt-2 text-center hidden md:block ${
                      currentStep === step.number
                        ? "text-blue-600 font-semibold"
                        : "text-gray-600"
                    }`}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-colors ${
                      currentStep > step.number ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Step Card */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
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
            <Button onClick={handleNext} className="gap-2">
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Save Draft Notice */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Su progreso se guarda automáticamente
          </p>
        </div>
      </div>
    </div>
  );
}
