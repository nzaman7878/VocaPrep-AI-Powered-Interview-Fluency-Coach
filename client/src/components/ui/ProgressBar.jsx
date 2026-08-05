export const ProgressBar = ({
  value = 0,
  max = 100,
  height = 'h-2',
  colorClass = 'bg-primary',
  trackClass = 'bg-surface-elevated',
  className = '',
  showLabel = false,
}) => {
  const normalizedValue = Math.min(Math.max(value, 0), max);
  const percentage = (normalizedValue / max) * 100;

  return (
    <div className={`w-full flex flex-col space-y-1.5 ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-sm">
          <span className="font-medium text-text-primary">Progress</span>
          <span className="font-mono text-text-muted">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full rounded-full overflow-hidden ${trackClass} ${height}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
