import React from 'react';
import Badge from '../ui/Badge';
import { motion } from 'framer-motion';

const RoleCard = ({ role, isSelected, onClick }) => {
  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(role)}
      aria-pressed={isSelected}
      className={`relative w-full text-left cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col h-full focus:outline-none focus:ring-4 focus:ring-indigo-500/50 ${
        isSelected
          ? 'border-indigo-600 bg-indigo-50 shadow-xl shadow-indigo-100/50'
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-slate-100'
      }`}
    >
      {isSelected && (
        <motion.div
          layoutId="role-selection-indicator"
          className="absolute top-6 right-6 h-3 w-3 bg-indigo-600 rounded-full shadow-[0_0_12px_rgba(79,70,229,0.8)]"
        />
      )}

      <h3 className="text-2xl font-bold text-slate-800 mb-3 font-display pr-6">{role.title}</h3>
      <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-grow">{role.description}</p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {role.tags.map((tag) => (
          <Badge key={tag} variant={isSelected ? 'primary' : 'secondary'} className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </motion.button>
  );
};

export default RoleCard;
