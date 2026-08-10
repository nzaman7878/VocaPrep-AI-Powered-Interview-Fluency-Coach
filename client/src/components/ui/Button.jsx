import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Button = forwardRef(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-display font-medium transition-colors outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed rounded-lg relative overflow-hidden';

    const variants = {
      primary:
        'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-premium',
      secondary:
        'glass-panel text-text-primary hover:bg-surface-elevated focus:ring-surface-elevated',
      accent:
        'bg-accent text-white hover:bg-accent/90 focus:ring-accent shadow-premium',
      outline:
        'bg-transparent text-text-primary border border-surface-elevated hover:bg-surface-elevated focus:ring-surface-elevated',
      ghost:
        'bg-transparent text-text-primary hover:bg-surface-elevated focus:ring-surface-elevated',
      danger: 'bg-red-500/10 text-red-500 hover:bg-red-500/20 focus:ring-red-500',
    };

    const sizes = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
      icon: 'p-2',
    };

    return (
      <motion.button
        ref={ref}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
