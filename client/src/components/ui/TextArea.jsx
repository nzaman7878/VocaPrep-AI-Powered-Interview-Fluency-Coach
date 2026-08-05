import { forwardRef } from 'react';

const TextArea = forwardRef(({ className = '', label, error, helperText, id, ...props }, ref) => {
  const textareaId = id || Math.random().toString(36).substring(7);

  return (
    <div className="w-full flex flex-col space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="text-sm font-medium text-text-primary">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        className={`w-full bg-surface border border-surface-elevated rounded-md px-4 py-3 text-text-primary placeholder:text-text-muted transition-all duration-200 outline-none focus:bg-surface-elevated focus:border-primary focus:ring-2 focus:ring-primary/20 resize-y min-h-[100px] ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''
        } ${className}`}
        {...props}
      />
      {(error || helperText) && (
        <p className={`text-sm mt-1 font-mono ${error ? 'text-red-400' : 'text-text-muted'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
