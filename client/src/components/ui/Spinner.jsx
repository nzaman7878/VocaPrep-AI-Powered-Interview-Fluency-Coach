import React from 'react';
import { motion } from 'framer-motion';

const Spinner = ({ size = 'md', color = 'text-indigo-600' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      className={`rounded-full border-t-transparent ${sizeClasses[size]} ${color}`}
      style={{ borderStyle: 'solid' }}
    />
  );
};

export default Spinner;
