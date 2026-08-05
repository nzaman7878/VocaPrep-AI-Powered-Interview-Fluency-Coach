import { useEffect } from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={`relative z-50 w-full max-w-lg bg-surface border border-surface-elevated rounded-lg shadow-xl animate-float p-6 ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          {title && (
            <h2 className="font-display text-xl font-semibold text-text-primary">{title}</h2>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-sm text-text-muted hover:text-text-primary transition-colors hover:bg-surface-elevated focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="text-text-primary">{children}</div>
      </div>
    </div>
  );
};
