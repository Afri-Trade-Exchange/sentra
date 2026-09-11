import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { Consignment, ConsignmentStatus } from './types';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const AnalyticsOverview: React.FC<{ consignments: Consignment[] }> = ({ consignments }) => {
  const chartData = useMemo(() => {
    const statusCounts = Object.values(ConsignmentStatus).reduce((acc, status) => {
      acc[status] = consignments.filter(c => c.status === status).length;
      return acc;
    }, {} as Record<ConsignmentStatus, number>);

    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          data: Object.values(statusCounts),
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  }, [consignments]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
        <div className="h-64">
          <Pie data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Processing Timeline</h3>
        <div className="h-64">
          <Line
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                {
                  label: 'Processing Time (days)',
                  data: [5, 3, 4, 2, 3, 2],
                  borderColor: 'rgb(75, 192, 192)',
                  tension: 0.1,
                },
              ],
            }}
            options={{ maintainAspectRatio: false }}
          />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsOverview;
