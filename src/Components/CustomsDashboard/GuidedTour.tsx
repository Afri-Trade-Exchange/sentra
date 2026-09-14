import React, { useState } from 'react';
import { TourStep } from './types';

const GuidedTour: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(() => localStorage.getItem('tourCompleted') !== 'true');

  const steps: TourStep[] = [
    {
      element: '#search',
      title: 'Search',
      content: 'Type to instantly filter consignments by trader name, ID, or status.',
      position: 'bottom'
    },
    {
      element: '#filters',
      title: 'Filters',
      content: 'Refine results using multiple criteria for precise control.',
      position: 'right'
    },
    {
      element: '#quick-actions',
      title: 'Quick Actions',
      content: 'Access common tasks like creating new consignments or generating reports.',
      position: 'left'
    },
    {
      element: '#analytics',
      title: 'Analytics',
      content: 'Monitor key metrics and trends at a glance.',
      position: 'top'
    }
  ];

  const completeTour = () => {
    setIsVisible(false);
    localStorage.setItem('tourCompleted', 'true');
  };

  if (!isVisible || currentStep >= steps.length) return null;

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div
        className="
          absolute p-6
          bg-white
          rounded-2xl
          shadow-2xl
          w-[calc(100%-2rem)] max-w-md
          transform -translate-x-1/2 -translate-y-1/2
          left-1/2 top-1/2
        "
      >
        <div className="flex gap-1.5 mb-6">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`
                h-1 flex-1 rounded-full
                transition-colors duration-200
                ${index <= currentStep ? 'bg-teal-600' : 'bg-gray-200'}
              `}
            />
          ))}
        </div>

        <h4 className="font-semibold text-xl mb-3">
          {steps[currentStep].title}
        </h4>
        <p className="text-base leading-relaxed text-gray-600 mb-8">
          {steps[currentStep].content}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <button
              type="button"
              onClick={completeTour}
              className="
                px-4 py-2
                text-sm font-medium text-gray-600
                hover:text-gray-900
                transition-colors
              "
            >
              Skip Tour
            </button>
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="
                  px-4 py-2
                  text-sm font-medium text-gray-600
                  hover:text-gray-900
                  transition-colors
                "
              >
                Previous
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => isLastStep ? completeTour() : setCurrentStep(prev => prev + 1)}
            className="
              px-6 py-2
              bg-teal-600 text-white
              hover:bg-teal-700
              rounded-xl
              transition-colors
              text-sm font-medium
              focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
            "
          >
            {isLastStep ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidedTour;
