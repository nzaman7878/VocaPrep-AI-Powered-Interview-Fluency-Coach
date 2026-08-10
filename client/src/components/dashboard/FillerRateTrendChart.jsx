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

const FillerRateTrendChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-6 h-full flex flex-col items-center justify-center min-h-[300px]">
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
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
        </div>
        <p className="text-text-muted font-medium">Complete more interviews to unlock trends.</p>
      </div>
    );
  }

  return (
    <div className="glass-panel shadow-premium rounded-3xl p-6 h-full flex flex-col min-h-[300px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-text-primary font-display">Filler Word Usage Trend</h3>
          <p className="text-sm text-text-muted">Percentage of filler words vs total words</p>
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
            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
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
              itemStyle={{ color: 'var(--color-accent)', fontWeight: 'bold' }}
            />
            <Line
              type="monotone"
              dataKey="fillerCount"
              name="Filler Words"
              stroke="var(--color-accent)"
              strokeWidth={4}
              dot={{ r: 5, fill: 'var(--color-accent)', strokeWidth: 2, stroke: 'var(--color-surface)' }}
              activeDot={{ r: 8, fill: 'var(--color-accent)', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default FillerRateTrendChart;
