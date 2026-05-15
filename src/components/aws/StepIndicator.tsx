import React from 'react';

interface Step {
  number: number;
  title: string;
  icon: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export default function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step.number < currentStep
                  ? 'bg-green-500 text-white shadow-md'
                  : step.number === currentStep
                  ? 'bg-aws-orange text-aws-dark shadow-lg scale-110'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              {step.number < currentStep ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>{step.icon}</span>
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium hidden sm:block ${
                step.number === currentStep ? 'text-aws-orange' : step.number < currentStep ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${
                step.number < currentStep ? 'bg-green-400' : 'bg-gray-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
