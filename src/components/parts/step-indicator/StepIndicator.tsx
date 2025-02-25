import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
}) => {
  return (
    <div className="flex justify-between mb-8">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex items-center ${
            index < steps.length - 1 ? "flex-1" : ""
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              index + 1 <= currentStep
                ? "bg-navy-700 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div className="flex-1 h-0.5 mx-2 bg-gray-200">
              <div
                className={`h-full bg-navy-700 transition-all duration-300 ${
                  index + 1 < currentStep ? "w-full" : "w-0"
                }`}
              />
            </div>
          )}
          <span
            className={`hidden sm:block ${
              index + 1 === currentStep
                ? "text-navy-700 font-medium"
                : "text-gray-500"
            }`}
          >
            {step}
          </span>
        </div>
      ))}
    </div>
  );
};
