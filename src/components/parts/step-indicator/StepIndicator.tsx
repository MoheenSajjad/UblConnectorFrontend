import { CheckIcon } from "@/components/icons";
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
    <div className="flex justify-between ">
      {steps.map((step, index) => (
        <div
          key={step}
          className={`flex items-center justify-end ${
            index < steps.length - 1 ? "flex-1" : ""
          }`}
        >
          <div className="flex flex-col items-center justify-start mb-4">
            <span
              className={`hidden sm:block ${
                index + 1 <= currentStep
                  ? "text-slate-700 font-medium"
                  : "text-gray-900"
              }`}
            >
              {step}
            </span>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                index + 1 < currentStep
                  ? "bg-green-500 text-white"
                  : index + 1 === currentStep
                  ? "bg-slate-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1 < currentStep ? (
                <CheckIcon className="w-5 h-5 text-white" />
              ) : (
                index + 1
              )}
            </div>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-2 ${
                index + 1 < currentStep ? "bg-green-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
