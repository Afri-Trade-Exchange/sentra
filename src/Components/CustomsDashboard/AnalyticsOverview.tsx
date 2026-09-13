import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { Consignment, ConsignmentStatus } from './types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

// Mirrors statusConfig.ts so the chart's colors mean the same thing as the
// status badges everywhere else on the page (Pending/Approved/Rejected).
const STATUS_COLORS: Record<ConsignmentStatus, { fill: string; border: string }> = {
  [ConsignmentStatus.Pending]: { fill: 'rgba(245, 158, 11, 0.2)', border: 'rgb(245, 158, 11)' },
  [ConsignmentStatus.Approved]: { fill: 'rgba(34, 197, 94, 0.2)', border: 'rgb(34, 197, 94)' },
  [ConsignmentStatus.Rejected]: { fill: 'rgba(239, 68, 68, 0.2)', border: 'rgb(239, 68, 68)' },
};

const AnalyticsOverview: React.FC<{ consignments: Consignment[] }> = ({ consignments }) => {
  const chartData = useMemo(() => {
    const statuses = Object.values(ConsignmentStatus);
    const statusCounts = statuses.reduce((acc, status) => {
      acc[status] = consignments.filter(c => c.status === status).length;
      return acc;
    }, {} as Record<ConsignmentStatus, number>);

    return {
      labels: statuses,
      datasets: [
        {
          data: statuses.map(status => statusCounts[status]),
          backgroundColor: statuses.map(status => STATUS_COLORS[status].fill),
          borderColor: statuses.map(status => STATUS_COLORS[status].border),
          borderWidth: 1,
        },
      ],
    };
  }, [consignments]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="min-w-0 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
        <div className="h-64 w-full">
          <Pie data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="min-w-0 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Processing Timeline</h3>
        <div className="h-64 w-full">
          <Line
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                {
                  label: 'Processing Time (days)',
                  data: [5, 3, 4, 2, 3, 2],
                  borderColor: 'rgb(13, 148, 136)',
                  backgroundColor: 'rgba(13, 148, 136, 0.15)',
                  tension: 0.3,
                },
              ],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
