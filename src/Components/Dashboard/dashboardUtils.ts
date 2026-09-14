import {
  Activity,
  Invoice,
  RiskAssessment,
} from '../../types/dashboard';
import { ConsignmentStatus } from '../CustomsDashboard/types';
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
      description: `${activity.category} declaration`,
      quantity: 1,
      unitPrice: activity.amount,
      total: activity.amount,
    },
  ],
  taxRate: 0.16,
  notes: `Declared value summary for ${activity.category} - ${activity.id}`,
});

export const getStatusStyles = (status: string) => {
  switch (status) {
    case ConsignmentStatus.Approved:
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800';
    case ConsignmentStatus.Rejected:
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800';
    case ConsignmentStatus.Pending:
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-600';
  }
};

export const calculateProcessingEfficiency = (consignments: { status: ConsignmentStatus }[]): number => {
  if (consignments.length === 0) return 0;
  const approved = consignments.filter((c) => c.status === ConsignmentStatus.Approved).length;
  return Number(((approved / consignments.length) * 100).toFixed(1));
};

export const calculateValueGrowth = (consignments: { estimatedValue: number; createdAt: Date }[]): number => {
  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthKey = `${lastMonthDate.getFullYear()}-${lastMonthDate.getMonth()}`;

  const sumFor = (key: string) =>
    consignments
      .filter((c) => `${c.createdAt.getFullYear()}-${c.createdAt.getMonth()}` === key)
      .reduce((sum, c) => sum + c.estimatedValue, 0);

  const current = sumFor(thisMonthKey);
  const previous = sumFor(lastMonthKey);

  if (previous === 0) return current > 0 ? 100 : 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
};

// Only meaningful once some consignments have actually been decided - a
// trader whose submissions are all still Pending isn't "risky", they just
// haven't been reviewed yet. Callers should check decided.length > 0 before
// showing this (there's no honest risk level to report otherwise).
export const calculateRejectionRate = (consignments: { status: ConsignmentStatus }[]): number => {
  const decided = consignments.filter((c) => c.status !== ConsignmentStatus.Pending);
  if (decided.length === 0) return 0;
  const rejected = decided.filter((c) => c.status === ConsignmentStatus.Rejected).length;
  return Number(((rejected / decided.length) * 100).toFixed(1));
};

export const calculateRiskLevel = (rejectionRate: number): RiskAssessment => {
  return {
    level: rejectionRate >= 40 ? 'High' : rejectionRate >= 15 ? 'Medium' : 'Low',
    description: 'Based on the share of your reviewed consignments that customs has rejected',
    impactScore: rejectionRate,
  };
};
