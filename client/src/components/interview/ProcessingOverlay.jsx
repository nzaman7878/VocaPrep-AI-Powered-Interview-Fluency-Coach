import React from 'react';
import { motion } from 'framer-motion';
import Spinner from '../ui/Spinner';
import StepProgress from '../ui/StepProgress';

const PIPELINE_STEPS = [
  { id: 'UPLOADING', label: 'Securely uploading audio...' },
  { id: 'TRANSCRIBING', label: 'Transcribing via AssemblyAI...' },
  { id: 'EVALUATING', label: 'AI evaluating content & delivery...' },
];

const ProcessingOverlay = ({ flowState }) => {
  // If we aren't in a processing state, return null
  const stepIndex = PIPELINE_STEPS.findIndex((s) => s.id === flowState);

  if (stepIndex === -1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white rounded-3xl p-10 border border-slate-200 shadow-2xl shadow-indigo-100/50 flex flex-col items-center justify-center min-h-[300px] text-center"
    >
      <div className="mb-8 relative">
        {/* Pulsing decorative background */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 bg-indigo-200 rounded-full blur-xl"
        />
        <Spinner size="xl" color="border-indigo-600" />
      </div>

      <h3 className="text-2xl font-bold text-slate-800 mb-6 font-display">Analyzing Your Answer</h3>

      <div className="w-full max-w-xs">
        <StepProgress steps={PIPELINE_STEPS} currentStepIndex={stepIndex} />
      </div>
    </motion.div>
  );
};

export default ProcessingOverlay;
