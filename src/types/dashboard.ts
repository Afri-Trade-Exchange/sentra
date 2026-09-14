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

export interface DashboardInsights {
  totalDeclaredValue: number;
  pendingRequests: number;
  completedRequests: number;
}

export interface EnhancedInsights extends DashboardInsights {
  valueGrowth: number;
  processingEfficiency: number;
}

export interface RiskAssessment {
  level: 'Low' | 'Medium' | 'High';
  description: string;
  impactScore: number;
}
