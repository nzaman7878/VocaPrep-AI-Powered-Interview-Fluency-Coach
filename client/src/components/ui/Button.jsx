import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

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
      'inline-flex items-center justify-center font-display font-medium transition-all duration-200 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed rounded-md';

    const variants = {
      primary:
        'bg-primary text-white hover:bg-opacity-90 focus:ring-primary shadow-lg shadow-primary/20 hover:-translate-y-0.5',
      secondary:
        'bg-surface-elevated text-text-primary hover:bg-opacity-80 focus:ring-surface-elevated border border-white/5 hover:-translate-y-0.5',
      accent:
        'bg-accent text-white hover:bg-opacity-90 focus:ring-accent shadow-lg shadow-accent/20 hover:-translate-y-0.5',
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
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
