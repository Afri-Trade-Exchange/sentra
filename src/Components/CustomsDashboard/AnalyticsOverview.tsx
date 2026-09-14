import React, { useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { Consignment, ConsignmentStatus } from './types';
import Card from '../ui/Card';
import { useTheme } from '../ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

// Mirrors statusConfig.ts so the chart's colors mean the same thing as the
// status badges everywhere else on the page (Pending/Approved/Rejected).
const STATUS_COLORS: Record<ConsignmentStatus, { fill: string; border: string }> = {
  [ConsignmentStatus.Pending]: { fill: 'rgba(245, 158, 11, 0.2)', border: 'rgb(245, 158, 11)' },
  [ConsignmentStatus.Approved]: { fill: 'rgba(34, 197, 94, 0.2)', border: 'rgb(34, 197, 94)' },
  [ConsignmentStatus.Rejected]: { fill: 'rgba(239, 68, 68, 0.2)', border: 'rgb(239, 68, 68)' },
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const AnalyticsOverview: React.FC<{ consignments: Consignment[] }> = ({ consignments }) => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const tickColor = isDark ? '#9ca3af' : '#6b7280';
  const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

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

  // Volume of consignments received per month, for the last 6 months
  // (including months with zero), computed from real createdAt timestamps.
  const volumeData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_LABELS[d.getMonth()] };
    });

    const counts = months.map(({ key }) =>
      consignments.filter((c) => {
        const created = c.createdAt.toDate();
        return `${created.getFullYear()}-${created.getMonth()}` === key;
      }).length
    );

    return {
      labels: months.map((m) => m.label),
      datasets: [
        {
          label: 'Consignments received',
          data: counts,
          borderColor: 'rgb(13, 148, 136)',
          backgroundColor: 'rgba(13, 148, 136, 0.15)',
          tension: 0.3,
        },
      ],
    };
  }, [consignments]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="min-w-0">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Status Distribution</h3>
        <div className="h-64 w-full">
          <Pie
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { color: tickColor } } },
            }}
          />
        </div>
      </Card>
      <Card className="min-w-0">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Monthly Volume</h3>
        <div className="h-64 w-full">
          <Line
            data={volumeData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { color: tickColor } } },
              scales: {
                x: { ticks: { color: tickColor }, grid: { color: gridColor } },
                y: { beginAtZero: true, ticks: { stepSize: 1, color: tickColor }, grid: { color: gridColor } },
              },
            }}
          />
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsOverview;
