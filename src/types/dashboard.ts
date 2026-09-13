export interface Activity {
  id: string;
  category: string;
  date: string;
  status: string;
  amount: number;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  businessName: string;
  activity: Activity;
  invoiceDate: string;
  dueDate: string;
  totalAmount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  items: InvoiceItem[];
  taxRate: number;
  notes?: string;
}

export enum ActivityStatus {
  Pending = 'Pending',
  InTransit = 'In Transit',
  Completed = 'Completed',
}

export function isValidStatus(status: string): status is ActivityStatus {
  return Object.values(ActivityStatus).includes(status as ActivityStatus);
}

export interface DashboardInsights {
  totalRevenue: number;
  pendingRequests: number;
  completedRequests: number;
  averageProcessingTime: number;
}

export interface EnhancedInsights extends DashboardInsights {
  revenueGrowth: number;
  processingEfficiency: number;
  customerSatisfaction: number;
}

export interface RiskAssessment {
  level: 'Low' | 'Medium' | 'High';
  description: string;
  impactScore: number;
}

export interface StatusUpdate {
  activityId: string;
  status: ActivityStatus;
  updatedBy: string;
  timestamp: Date;
}
