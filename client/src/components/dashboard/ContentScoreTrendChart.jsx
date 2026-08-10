import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const ContentScoreTrendChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-6 h-80 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        </div>
        <p className="text-text-muted font-medium">Complete more interviews to unlock trends.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel shadow-premium rounded-3xl p-6 h-80 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary font-display">Content Score Trend</h3>
          <p className="text-sm text-text-muted">AI evaluation of your answers</p>
        </div>
      </div>

      <div className="flex-1 w-full h-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-surface-elevated)" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip
              cursor={{ stroke: 'var(--color-surface-elevated)', strokeWidth: 2, strokeDasharray: '3 3' }}
              contentStyle={{
                backgroundColor: 'var(--color-surface)',
                borderRadius: '12px',
                border: '1px solid var(--color-surface-elevated)',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                padding: '12px 16px',
                fontWeight: '500',
                color: 'var(--color-text-primary)'
              }}
              itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
            />
            <Line
              type="monotone"
              dataKey="contentScore"
              name="Avg Score"
              stroke="var(--color-primary)"
              strokeWidth={4}
              dot={{ r: 5, fill: 'var(--color-primary)', strokeWidth: 2, stroke: 'var(--color-surface)' }}
              activeDot={{ r: 8, fill: 'var(--color-primary)', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContentScoreTrendChart;
