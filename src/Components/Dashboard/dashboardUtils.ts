import {
  Activity,
  ActivityStatus,
  EnhancedInsights,
  Invoice,
  RiskAssessment,
} from '../../types/dashboard';
import type { User } from 'firebase/auth';

export const generateInvoice = (activity: Activity, user?: User | null): Invoice => ({
  id: `INV-${activity.id}`,
  invoiceNumber: `INV-${activity.id}`,
  customerName: user?.displayName || 'Customer',
  businessName: 'Afritrade',
  activity,
  invoiceDate: activity.date,
  dueDate: new Date(new Date(activity.date).setDate(new Date(activity.date).getDate() + 30))
    .toISOString()
    .split('T')[0],
  totalAmount: activity.amount,
  status: 'Pending',
  items: [
    {
      description: `${activity.category} Service`,
      quantity: 1,
      unitPrice: activity.amount,
      total: activity.amount,
    },
  ],
  taxRate: 0.16,
  notes: `Invoice for ${activity.category} - ${activity.id}`,
});

export const getStatusStyles = (status: ActivityStatus) => {
  switch (status) {
    case ActivityStatus.Completed:
      return 'bg-green-100 text-green-800 border-green-200';
    case ActivityStatus.InTransit:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case ActivityStatus.Pending:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusColor = (status: ActivityStatus) => {
  switch (status) {
    case ActivityStatus.Completed:
      return 'bg-green-500';
    case ActivityStatus.InTransit:
      return 'bg-yellow-500';
    case ActivityStatus.Pending:
      return 'bg-gray-500';
    default:
      return 'bg-gray-500';
  }
};

export const calculateAverageProcessingTime = (activities: Activity[]): number => {
  // Placeholder until real processing-time tracking exists.
  return activities.length * 0.5;
};

export const calculateRevenueGrowth = (activities: Activity[]): number => {
  const currentRevenue = activities.reduce((sum, act) => sum + act.amount, 0);
  const previousRevenue = currentRevenue * 0.9; // Placeholder calculation
  return Number((((currentRevenue - previousRevenue) / previousRevenue) * 100).toFixed(1));
};

export const calculateProcessingEfficiency = (activities: Activity[]): number => {
  const completedActivities = activities.filter((act) => act.status === ActivityStatus.Completed);
  return Number(((completedActivities.length / activities.length) * 100).toFixed(1));
};

export const calculateCustomerSatisfaction = (): number => {
  // Placeholder implementation
  return 85;
};

export const calculateRiskLevel = (insights: EnhancedInsights): RiskAssessment => {
  const score = insights.processingEfficiency + insights.revenueGrowth * 0.5;

  return {
    level: score > 80 ? 'Low' : score > 50 ? 'Medium' : 'High',
    description: 'Risk assessment based on processing efficiency and revenue growth',
    impactScore: score,
  };
};
