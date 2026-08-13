import React, { useEffect, useState, useMemo } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminTrendChart from '../../components/admin/AdminTrendChart';
import RecentUsersTable from '../../components/admin/RecentUsersTable';
import { adminApi } from '../../api/adminApi';
import Spinner from '../../components/ui/Spinner';
import ErrorMessage from '../../components/ui/ErrorMessage';
import { Users, DollarSign, Activity, CreditCard } from 'lucide-react';

const AdminDashboard = () => {
  useDocumentTitle('Admin Dashboard Overview');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, usersRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getUsers({ limit: 5 }), // Just fetch 5 for recent users
        ]);
        
        setStats(statsRes.data);
        setRecentUsers(usersRes.data.users);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Consume the real time-series data from the backend payload
  const chartData = useMemo(() => {
    if (!stats || !stats.timeSeriesData) return [];
    return stats.timeSeriesData;
  }, [stats]);

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
            message="Failed to load admin dashboard data."
            error={error}
            onRetry={() => window.location.reload()}
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-text-primary font-display tracking-tight mb-2">
            Admin Overview
          </h1>
          <p className="text-text-muted font-medium">
            High-level metrics and platform statistics.
          </p>
        </div>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <AdminStatCard
          title="Total Users"
          value={stats?.totalUsers.toLocaleString()}
          icon={Users}
          trend={(() => {
            if (!chartData || chartData.length < 2) return 0;
            const current = chartData[chartData.length - 1].Users;
            const previous = chartData[chartData.length - 2].Users;
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
          })()}
          trendLabel="vs last month"
          color="primary"
        />
        <AdminStatCard
          title="Estimated MRR"
          value={`$${stats?.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend={(() => {
            if (!chartData || chartData.length < 2) return 0;
            const current = chartData[chartData.length - 1].Revenue;
            const previous = chartData[chartData.length - 2].Revenue;
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
          })()}
          trendLabel="vs last month"
          color="success"
        />
        <AdminStatCard
          title="AI Usage (Sessions)"
          value={stats?.totalAIUsage.toLocaleString()}
          icon={Activity}
          trend={10} // Backend doesn't split sessions by month yet, leaving placeholder
          trendLabel="vs last month"
          color="info"
        />
        <AdminStatCard
          title="Active Subscriptions"
          value={stats?.activeSubscriptions.toLocaleString()}
          icon={CreditCard}
          trend={0} // Active subs is a static current snapshot, leaving 0% for now
          trendLabel="vs last month"
          color="warning"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="h-[400px]">
          <AdminTrendChart
            title="MRR Growth"
            data={chartData}
            dataKey="Revenue"
            xAxisKey="month"
            color="#10B981" // Success color
            prefix="$"
          />
        </div>
        <div className="h-[400px]">
          <AdminTrendChart
            title="User Acquisition"
            data={chartData}
            dataKey="Users"
            xAxisKey="month"
            color="#6366F1" // Primary color
          />
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="grid grid-cols-1 gap-6">
        <RecentUsersTable users={recentUsers} />
      </div>

    </AdminLayout>
  );
};

export default AdminDashboard;
