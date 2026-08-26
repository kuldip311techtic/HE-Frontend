import React from 'react';

interface RevenueOverviewProps {
  revenue: number;
}

const RevenueOverview: React.FC<RevenueOverviewProps> = ({ revenue }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <h2 className="text-lg font-semibold">Revenue Overview</h2>
      <p className="text-2xl">${revenue.toLocaleString()}</p>
    </div>
  );
};

export default RevenueOverview;
