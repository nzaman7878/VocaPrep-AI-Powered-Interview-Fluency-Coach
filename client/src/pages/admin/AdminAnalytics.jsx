import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import { adminApi } from '../../api/adminApi';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import AdminStatCard from '../../components/admin/AdminStatCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Target, MessageSquare, Zap } from 'lucide-react';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AdminAnalytics = () => {
  useDocumentTitle('Admin | Platform Analytics');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setIsLoading(true);
        const res = await adminApi.getAnalytics();
        setAnalytics(res.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-4xl mx-auto mt-8">
          <ErrorMessage
            message="Failed to load analytics data."
            error={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </AdminLayout>
    );
  }

  const { sessionsByRole, globalAverages } = analytics;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary font-display tracking-tight mb-2">
          Platform Analytics
        </h1>
        <p className="text-text-muted font-medium">
          Deep dive into user performance and AI engagement metrics.
        </p>
      </div>

      {/* Global Averages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <AdminStatCard
          title="Avg. Speech Speed (WPM)"
          value={globalAverages.wpm}
          icon={Zap}
          color="primary"
          trendLabel="Ideal range: 130-160"
        />
        <AdminStatCard
          title="Avg. Content Score"
          value={`${globalAverages.contentScore} / 10`}
          icon={Target}
          color="success"
        />
        <AdminStatCard
          title="Avg. Filler Words Rate"
          value={`${globalAverages.fillerRate}%`}
          icon={MessageSquare}
          color="warning"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessions By Role (Pie Chart) */}
        <div className="bg-surface border border-surface-elevated rounded-xl p-6 shadow-sm flex flex-col h-[400px]">
          <h3 className="text-lg font-bold text-text-primary mb-6">Interviews by Role</h3>
          <div className="flex-1 w-full">
            {sessionsByRole.length === 0 ? (
              <div className="h-full flex items-center justify-center text-text-muted">
                No interview sessions recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sessionsByRole}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {sessionsByRole.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#F8FAFC' }}
                  />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ paddingTop: '20px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Sessions By Role (Bar Chart) */}
        <div className="bg-surface border border-surface-elevated rounded-xl p-6 shadow-sm flex flex-col h-[400px]">
          <h3 className="text-lg font-bold text-text-primary mb-6">Role Popularity Breakdown</h3>
          <div className="flex-1 w-full">
            {sessionsByRole.length === 0 ? (
              <div className="h-full flex items-center justify-center text-text-muted">
                No interview sessions recorded yet.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionsByRole} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.3} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '0.5rem' }}
                    itemStyle={{ color: '#F8FAFC' }}
                    cursor={{ fill: '#334155', opacity: 0.4 }}
                  />
                  <Bar dataKey="value" name="Sessions" fill="#6366F1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
