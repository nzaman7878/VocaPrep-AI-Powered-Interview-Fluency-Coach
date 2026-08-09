import React from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ toast, removeToast }) => {
  const { id, type, message, duration } = toast;

  React.useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        removeToast(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, removeToast]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-white border-emerald-100',
    error: 'bg-white border-red-100',
    info: 'bg-white border-blue-100',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`pointer-events-auto flex items-center gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full ${bgColors[type]}`}
      role="alert"
    >
      <div className="flex-shrink-0">{icons[type]}</div>
      <div className="flex-1 text-sm font-medium text-slate-700">{message}</div>
      <button
        onClick={() => removeToast(id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md p-1"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default Toast;
