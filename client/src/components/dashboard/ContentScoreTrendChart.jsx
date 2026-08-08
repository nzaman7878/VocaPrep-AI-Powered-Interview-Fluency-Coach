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
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-80 flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-slate-300"
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
        </div>
        <p className="text-slate-500 font-medium">Complete more interviews to unlock trends.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-80 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 font-display">Content Quality Trend</h3>
          <p className="text-sm text-slate-500">Average content score out of 100</p>
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
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              domain={[0, 100]}
            />
            <Tooltip
              cursor={{ stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '3 3' }}
              contentStyle={{
                borderRadius: '16px',
                border: 'none',
                boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                padding: '12px 16px',
                fontWeight: '500',
              }}
              itemStyle={{ color: '#6366f1', fontWeight: 'bold' }}
            />
            <Line
              type="monotone"
              dataKey="contentScore"
              name="Avg Score"
              stroke="#6366f1"
              strokeWidth={4}
              dot={{ r: 5, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 8, fill: '#4f46e5', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContentScoreTrendChart;
