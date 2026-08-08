import React from 'react';
import { motion } from 'framer-motion';

const CoachingTipCard = ({ coaching }) => {
  if (!coaching) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 shadow-2xl shadow-indigo-200/50 text-white relative overflow-hidden"
    >
      {/* Decorative background circle */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm border border-white/10">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold font-display tracking-wide">Coach's Synthesis</h3>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 mb-5">
          <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2">
            Key Actionable Tip
          </h4>
          <p className="text-lg font-medium leading-relaxed">
            {coaching.actionableTip || 'Keep practicing your delivery and structural framing.'}
          </p>
        </div>

        {coaching.encouragement && (
          <p className="text-sm text-indigo-100 italic">"{coaching.encouragement}"</p>
        )}
      </div>
    </motion.div>
  );
};

export default CoachingTipCard;
