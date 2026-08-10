import React from 'react';
import { motion } from 'framer-motion';

const DeliveryMetricsCard = ({ delivery }) => {
  if (!delivery) return null;
  const { wpm, fillerCount, pauseCount, interpretation } = delivery;

  const metrics = [
    { label: 'Words Per Minute', value: wpm || 0, optimal: '120 - 150', suffix: ' WPM' },
    { label: 'Filler Words', value: fillerCount || 0, optimal: '0 - 2', suffix: '' },
    { label: 'Significant Pauses', value: pauseCount || 0, optimal: 'Varies', suffix: '' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-surface rounded-3xl p-6 border border-surface-elevated shadow-premium flex flex-col h-full"
    >
      <h3 className="text-xl font-bold text-text-primary font-display mb-6">Delivery & Fluency</h3>

      <div className="grid grid-cols-3 gap-3 mb-6">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="bg-background rounded-2xl p-3 border border-surface-elevated text-center flex flex-col justify-center"
          >
            <span className="text-2xl font-bold font-mono text-primary">
              {m.value}
              {m.suffix}
            </span>
            <span className="text-xs font-bold text-text-muted uppercase mt-1">{m.label}</span>
          </div>
        ))}
      </div>

      {interpretation && interpretation.feedback && (
        <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20 mt-auto">
          <p className="text-sm text-text-primary leading-relaxed italic">"{interpretation.feedback}"</p>
        </div>
      )}
    </motion.div>
  );
};

export default DeliveryMetricsCard;
