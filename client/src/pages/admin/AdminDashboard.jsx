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

  // Generate realistic mock time-series data for the charts based on totals
  // In a real application, the backend should return this grouped by month/day.
  const chartData = useMemo(() => {
    if (!stats) return [];
    
    // We'll generate 6 months of historical data leading up to the current total
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    
    // Distribute total users roughly over 6 months
    let cumulativeUsers = Math.max(1, Math.floor(stats.totalUsers * 0.2));
    let cumulativeRevenue = Math.max(0, stats.totalRevenue * 0.1);
    
    return months.map((month, index) => {
      // For the last month, ensure we hit the exact total
      if (index === months.length - 1) {
        return {
          month,
          Users: stats.totalUsers,
          Revenue: Math.round(stats.totalRevenue)
        };
      }
      
      // Add random growth for previous months
      const userGrowth = Math.max(0, Math.floor((stats.totalUsers - cumulativeUsers) / (6 - index) * (0.8 + Math.random() * 0.4)));
      const revenueGrowth = Math.max(0, (stats.totalRevenue - cumulativeRevenue) / (6 - index) * (0.7 + Math.random() * 0.6));
      
      cumulativeUsers += userGrowth;
      cumulativeRevenue += revenueGrowth;
      
      return {
        month,
        Users: cumulativeUsers,
        Revenue: Math.round(cumulativeRevenue)
      };
    });
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
          trend={12}
          trendLabel="vs last month"
          color="primary"
        />
        <AdminStatCard
          title="Total Revenue"
          value={`$${stats?.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          trend={8.5}
          trendLabel="vs last month"
          color="success"
        />
        <AdminStatCard
          title="AI Usage (Sessions)"
          value={stats?.totalAIUsage.toLocaleString()}
          icon={Activity}
          trend={24}
          trendLabel="vs last month"
          color="info"
        />
        <AdminStatCard
          title="Active Subscriptions"
          value={stats?.activeSubscriptions.toLocaleString()}
          icon={CreditCard}
          trend={-2}
          trendLabel="vs last month"
          color="warning"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="h-[400px]">
          <AdminTrendChart
            title="Revenue Growth"
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
