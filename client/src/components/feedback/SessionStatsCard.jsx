import React from 'react';
import { motion } from 'framer-motion';

const SessionStatsCard = ({ stats }) => {
  if (!stats) return null;

  const { avgContentScore, avgWpm, totalQuestions, durationMinutes } = stats;

  const statItems = [
    {
      label: 'Avg Content Quality',
      value: avgContentScore?.toFixed(1) || '0.0',
      suffix: '/10',
      color: 'text-indigo-600',
    },
    {
      label: 'Avg Delivery Pace',
      value: Math.round(avgWpm) || '0',
      suffix: ' WPM',
      color: 'text-emerald-600',
    },
    {
      label: 'Questions Answered',
      value: totalQuestions || '0',
      suffix: '',
      color: 'text-amber-600',
    },
    {
      label: 'Total Practice Time',
      value: durationMinutes || '0',
      suffix: ' min',
      color: 'text-purple-600',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-surface rounded-3xl p-8 border border-surface-elevated shadow-premium"
    >
      <h3 className="text-2xl font-bold text-text-primary font-display mb-8 text-center">
        Session Statistics
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {statItems.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center p-4 bg-background rounded-2xl border border-surface-elevated"
          >
            <span className={`text-3xl font-bold font-mono mb-2 ${item.color}`}>
              {item.value}
              <span className="text-lg opacity-70 ml-1">{item.suffix}</span>
            </span>
            <span className="text-sm font-bold text-text-muted uppercase tracking-wider text-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SessionStatsCard;
