import React from 'react';
import { motion } from 'framer-motion';

const ContentScoreCard = ({ evaluation }) => {
  if (!evaluation) return null;
  const { score, strengths = [], weaknesses = [] } = evaluation;

  // Color coding based on score
  const getScoreColor = (s) => {
    if (s >= 8) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (s >= 6) return 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20';
    return 'text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20';
  };

  const scoreColor = getScoreColor(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-3xl p-6 border border-surface-elevated shadow-premium flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-text-primary font-display">Content Quality</h3>
        <div
          className={`flex items-center justify-center w-14 h-14 rounded-2xl border-2 shadow-sm ${scoreColor}`}
        >
          <span className="text-2xl font-bold font-mono leading-none">{score}</span>
          <span className="text-sm font-bold opacity-70 ml-0.5">/10</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-grow">
        {strengths.length > 0 && (
          <div>
            <h4 className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Strengths
            </h4>
            <ul className="space-y-1">
              {strengths.slice(0, 2).map((s, i) => (
                <li
                  key={i}
                  className="text-sm text-text-muted pl-5 relative before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-emerald-400 before:rounded-full"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {weaknesses.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-bold text-amber-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              Areas for Polish
            </h4>
            <ul className="space-y-1">
              {weaknesses.slice(0, 2).map((w, i) => (
                <li
                  key={i}
                  className="text-sm text-text-muted pl-5 relative before:absolute before:left-1 before:top-2 before:w-1.5 before:h-1.5 before:bg-amber-400 before:rounded-full"
                >
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContentScoreCard;
