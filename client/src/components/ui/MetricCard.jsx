import { Card, CardContent } from './Card';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

export const MetricCard = ({ title, value, subtitle, icon, trend, trendValue, className = '' }) => {
  const renderTrend = () => {
    if (!trend) return null;

    let TrendIcon = Minus;
    let colorClass = 'text-text-muted';

    if (trend === 'up') {
      TrendIcon = ArrowUpRight;
      colorClass = 'text-green-400';
    } else if (trend === 'down') {
      TrendIcon = ArrowDownRight;
      colorClass = 'text-red-400';
    }

    return (
      <div
        className={`flex items-center text-xs font-mono font-medium ${colorClass} bg-surface-elevated px-2 py-0.5 rounded-sm`}
      >
        <TrendIcon className="w-3 h-3 mr-1" />
        {trendValue}
      </div>
    );
  };

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <CardContent className="p-5 flex flex-col space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2 text-text-muted">
            {icon && <div className="text-primary">{icon}</div>}
            <span className="text-sm font-medium">{title}</span>
          </div>
          {renderTrend()}
        </div>

        <div>
          <div className="text-3xl font-display font-bold text-text-primary">{value}</div>
          {subtitle && <div className="text-sm text-text-muted mt-1 font-mono">{subtitle}</div>}
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricCard;
