import React from 'react';
import { motion } from 'framer-motion';

const StepProgress = ({ steps, currentStepIndex }) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex justify-between relative mb-2">
        {/* Background track line */}
        <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 bg-slate-100 rounded-full z-0" />

        {/* Active track line */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-indigo-500 rounded-full z-0"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStepIndex / Math.max(steps.length - 1, 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isActive || isCompleted ? '#6366f1' : '#f1f5f9', // indigo-500 vs slate-100
                  borderColor: isActive || isCompleted ? '#6366f1' : '#e2e8f0', // indigo-500 vs slate-200
                  scale: isActive ? 1.2 : 1,
                }}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                  ${isCompleted ? 'text-white' : 'text-transparent'}
                `}
              >
                {isCompleted && (
                  <svg
                    className="w-2.5 h-2.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Current Step Label */}
      <div className="text-center mt-4">
        <motion.p
          key={steps[currentStepIndex]?.id}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-bold text-indigo-700 tracking-wide uppercase"
        >
          {steps[currentStepIndex]?.label || 'Processing...'}
        </motion.p>
      </div>
    </div>
  );
};

export default StepProgress;
