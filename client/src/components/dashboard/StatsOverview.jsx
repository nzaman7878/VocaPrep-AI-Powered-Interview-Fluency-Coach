import React from 'react';

const StatCard = ({ title, value, subtitle, trend, trendLabel, icon }) => (
  <div className="glass-panel rounded-3xl p-6 flex flex-col justify-between hover:shadow-premium transition-all hover:-translate-y-1">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-primary/10 text-primary rounded-2xl">{icon}</div>
      {trend && (
        <div
          className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
            trend > 0
              ? 'bg-emerald-100 text-emerald-700'
              : trend < 0
                ? 'bg-rose-100 text-rose-700'
                : 'bg-slate-100 text-slate-700'
          }`}
        >
          {trend > 0 ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          ) : trend < 0 ? (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
            </svg>
          )}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div>
      <h3 className="text-slate-500 font-medium text-sm mb-1">{title}</h3>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-black text-slate-800 tracking-tight font-display">
          {value}
        </span>
        {subtitle && <span className="text-slate-400 font-medium text-sm">{subtitle}</span>}
      </div>
      {trendLabel && <p className="text-xs text-slate-400 mt-2 font-medium">{trendLabel}</p>}
    </div>
  </div>
);

const StatsOverview = ({
  totalSessions = 0,
  averageWpm = 0,
  bestContentScore = 0,
  improvement = 0,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total Interviews"
        value={totalSessions}
        icon={
          <svg
            className="w-6 h-6 text-indigo-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        }
      />
      <StatCard
        title="Best Content Score"
        value={bestContentScore}
        subtitle="/ 100"
        trend={improvement}
        trendLabel="vs previous average"
        icon={
          <svg
            className="w-6 h-6 text-emerald-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
        }
      />
      <StatCard
        title="Average Pacing"
        value={averageWpm}
        subtitle="WPM"
        icon={
          <svg
            className="w-6 h-6 text-sky-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        }
      />
      <StatCard
        title="Fluency Rank"
        value={averageWpm >= 130 && averageWpm <= 160 ? 'Pro' : 'Novice'}
        icon={
          <svg
            className="w-6 h-6 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        }
      />
    </div>
  );
};

export default StatsOverview;
