const Badge = ({ children, variant = 'default', size = 'md', className = '', icon }) => {
  const baseStyles =
    'inline-flex items-center justify-center font-mono font-medium rounded-sm border whitespace-nowrap';

  const variants = {
    default: 'bg-surface-elevated text-text-primary border-surface-elevated',
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
    success: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-400 dark:border-yellow-500/20',
    error: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {icon && <span className="mr-1.5 flex-shrink-0">{icon}</span>}
      {children}
    </span>
  );
};

export default Badge;
