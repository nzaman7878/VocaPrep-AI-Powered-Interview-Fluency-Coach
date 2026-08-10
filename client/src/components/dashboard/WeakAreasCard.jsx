import React from 'react';

const WeakAreasCard = ({ weakAreas = [] }) => {
  if (!weakAreas || weakAreas.length === 0) {
    return (
      <div className="glass-panel shadow-premium rounded-3xl p-6 flex flex-col items-center justify-center h-full min-h-[250px]">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-text-primary">No Target Areas Yet</h3>
        <p className="text-sm text-text-muted text-center mt-2 max-w-xs">
          Take a few interviews so our AI can analyze your responses and identify areas for
          improvement.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel shadow-premium rounded-3xl p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-text-primary font-display">Target Areas</h3>
          <p className="text-sm text-text-muted mt-1">Based on recent AI evaluations</p>
        </div>
        <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-full border border-rose-100 dark:border-rose-500/20 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Needs Focus
        </span>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {weakAreas.map((area, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl bg-surface border border-surface-elevated hover:border-primary/30 hover:bg-primary/5 transition-all group"
          >
            <div className="flex items-start justify-between mb-2 gap-2">
              <h4 className="font-bold text-text-primary text-sm line-clamp-1 group-hover:text-primary transition-colors">
                {area.topic || 'General Response Strategy'}
              </h4>
              <span
                className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                  (area.score || 0) < 5
                    ? 'bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20'
                    : 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20'
                }`}
              >
                Score: {Math.round((area.score || 0) * 10)}
              </span>
            </div>
            <p className="text-sm text-text-muted line-clamp-3">
              {area.feedback ||
                'Focus on providing more detailed, concrete examples using the STAR method.'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeakAreasCard;
