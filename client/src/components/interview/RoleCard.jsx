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
      className={`relative w-full text-left cursor-pointer p-6 rounded-3xl border-2 transition-all duration-300 flex flex-col h-full focus:outline-none focus:ring-4 focus:ring-primary/30 ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-premium'
          : 'glass-panel hover:border-primary/40 hover:shadow-xl'
      }`}
    >
      {isSelected && (
        <motion.div
          layoutId="role-selection-indicator"
          className="absolute top-6 right-6 h-3 w-3 bg-primary rounded-full shadow-[0_0_12px_var(--color-primary)] opacity-80"
        />
      )}

      <h3 className="text-2xl font-bold text-text-primary mb-3 font-display pr-6">{role.title}</h3>
      <p className="text-text-muted text-sm mb-6 leading-relaxed flex-grow">{role.description}</p>

      <div className="flex flex-wrap gap-2 mt-auto">
        {role.tags.map((tag) => (
          <Badge key={tag} variant={isSelected ? 'primary' : 'default'} className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </motion.button>
  );
};

export default RoleCard;
