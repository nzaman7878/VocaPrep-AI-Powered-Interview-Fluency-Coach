import { forwardRef } from 'react';

const Input = forwardRef(
  ({ className = '', label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || Math.random().toString(36).substring(7);
    const helperId = `${inputId}-helper`;

    return (
      <div className="w-full flex flex-col space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-text-muted pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={!!error}
            aria-describedby={error || helperText ? helperId : undefined}
            className={`w-full bg-surface border border-surface-elevated rounded-md px-4 py-2 text-text-primary placeholder:text-text-muted transition-all duration-200 outline-none focus:bg-surface-elevated focus:border-primary focus:ring-2 focus:ring-primary/20 ${
              leftIcon ? 'pl-10' : ''
            } ${rightIcon ? 'pr-10' : ''} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''} ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-text-muted flex items-center">{rightIcon}</div>
          )}
        </div>
        {(error || helperText) && (
          <p
            id={helperId}
            className={`text-sm mt-1 font-mono ${error ? 'text-red-400' : 'text-text-muted'}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
