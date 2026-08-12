import React from 'react';

const AdminStatCard = ({ title, value, icon: Icon, trend, trendLabel, color = 'primary' }) => {
  const isPositive = trend >= 0;
  
  const colorMap = {
    primary: 'text-primary bg-primary/10',
    success: 'text-success bg-success/10',
    warning: 'text-warning bg-warning/10',
    info: 'text-info bg-info/10',
  };

  return (
    <div className="bg-surface border border-surface-elevated rounded-xl p-6 flex flex-col h-full shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-muted uppercase tracking-wider">{title}</h3>
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="mt-auto">
        <div className="text-3xl font-display font-black text-text-primary tracking-tight mb-2">
          {value}
        </div>
        
        {trend !== undefined && (
          <div className="flex items-center gap-2 mt-2">
            <span
              className={`text-sm font-bold flex items-center ${
                isPositive ? 'text-success' : 'text-error'
              }`}
            >
              {isPositive ? (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              )}
              {Math.abs(trend)}%
            </span>
            {trendLabel && (
              <span className="text-sm text-text-muted">{trendLabel}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatCard;
