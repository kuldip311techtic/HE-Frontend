import React from 'react';
import { useAdminDashboardData } from '../hooks/useAdminDashboardData';
import DashboardMetrics from '../components/ui/DashboardMetrics';
import RevenueOverview from '../components/ui/RevenueOverview';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import EmptyState from '../components/ui/EmptyState';
import ErrorMessage from '../components/ui/ErrorMessage';

const AdminDashboard: React.FC = () => {
  const { data, isLoading, isError, error } = useAdminDashboardData();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorMessage message={error.message} description={error.description} />;
  }

  if (!data || data.length === 0) {
    return <EmptyState message="No data available" />;
  }

  return (
    <div className="p-4">
      <DashboardMetrics data={data} />
      <RevenueOverview revenue={data.revenue_overview} />
    </div>
  );
};

export default AdminDashboard;
