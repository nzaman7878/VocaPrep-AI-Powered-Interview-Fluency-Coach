import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../ui/Badge';

const QuestionCard = ({ question, index, total, isActive, onTimeUp, isLoading }) => {
  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minute default per question

  // Reset timer when question changes
  useEffect(() => {
    setSecondsLeft(120);
  }, [question?.text]);

  useEffect(() => {
    if (!isActive || secondsLeft <= 0 || isLoading) return;

    const timerId = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [isActive, secondsLeft, onTimeUp, isLoading]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isLowTime = secondsLeft < 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-100/50 relative overflow-hidden"
    >
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 bg-indigo-50 text-indigo-600 font-bold rounded-2xl font-display text-xl border border-indigo-100 shadow-sm">
            {index + 1}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
              Progress
            </span>
            <span className="text-sm font-medium text-slate-700">
              Question {index + 1} of {total}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant={question?.type === 'technical' ? 'primary' : 'secondary'}>
            {question?.type || 'behavioral'}
          </Badge>

          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg transition-colors ${
              isLowTime && !isLoading
                ? 'bg-red-50 text-red-600 border border-red-100 shadow-sm'
                : 'bg-slate-50 text-slate-700 border border-slate-200 shadow-sm'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {isLoading ? '--:--' : formatTime(secondsLeft)}
          </div>
        </div>
      </div>

      <div className="min-h-[160px] flex items-center relative">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4 text-slate-400"
            >
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-lg font-medium">
                Our AI is generating your next question...
              </span>
            </motion.div>
          ) : (
            <motion.h2
              key={question?.text || 'empty'}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-2xl md:text-3xl font-bold text-slate-800 leading-relaxed font-display"
            >
              {question?.text}
            </motion.h2>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuestionCard;
