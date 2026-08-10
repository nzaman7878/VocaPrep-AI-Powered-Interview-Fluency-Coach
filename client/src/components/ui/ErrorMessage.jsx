import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({
  title = 'Something went wrong',
  message = "We couldn't process your request. Please try again.",
  onRetry,
  isRetrying,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-2xl p-6 flex flex-col items-center text-center max-w-md mx-auto shadow-sm"
    >
      <div className="w-12 h-12 bg-rose-100 dark:bg-rose-500/20 text-rose-500 dark:text-rose-400 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>

      <h3 className="text-lg font-bold text-rose-900 dark:text-rose-200 mb-2 font-display">{title}</h3>
      <p className="text-rose-700 dark:text-rose-300 text-sm mb-6 leading-relaxed">{message}</p>

      {onRetry && (
        <Button
          variant="danger"
          onClick={onRetry}
          disabled={isRetrying}
          className="shadow-sm flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'Retrying...' : 'Try Again'}
        </Button>
      )}
    </motion.div>
  );
};

export default ErrorMessage;
