import React, { useEffect, useState } from 'react';
import { FaUpload, FaDownload, FaBox, FaSignOutAlt, FaFileInvoice, FaHistory, FaCog, FaApplePay, FaPlusCircle, FaClipboardCheck } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import UploadModal from './UploadModal';
import InvoiceDetailModal from './InvoiceDetailModal';
import Footer from './Footer';
// import { Link } from 'react-router-dom';

interface User {
  name: string;
  email: string;
}

interface Activity {
  id: string;
  category: string;
  date: string;
  status: string;
  amount: number;
}

interface Invoice {
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

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Additional imports
import { motion, AnimatePresence } from 'framer-motion';
// import { format, parseISO } from 'date-fns';

// New interfaces for enhanced data
interface DashboardInsights {
  totalRevenue: number;
  pendingRequests: number;
  completedRequests: number;
  averageProcessingTime: number;
}

interface RiskAssessment {
  level: 'Low' | 'Medium' | 'High';
  description: string;
  impactScore: number;
}

interface StatusUpdate {
  activityId: string;
  status: ActivityStatus;
  updatedBy: string;
  timestamp: Date;
}

import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as HeroIcons from '@heroicons/react/24/outline';

// Consignment Creation Schema
const ConsignmentSchema = z.object({
  traderName: z.string().min(2, "Trader name is required"),
  documentType: z.enum(['Import', 'Export', 'Transit', 'Temporary Entry', 'Bonded Warehouse']),
  goodsDescription: z.string().min(10, "Description must be at least 10 characters"),
  estimatedValue: z.number().min(0, "Value must be positive"),
  declarationNumber: z.string().optional(),
});

type ConsignmentFormData = z.infer<typeof ConsignmentSchema>;

// Add this schema for request creation
const RequestSchema = z.object({
  category: z.enum(['Order', 'Shipment', 'Payment']),
  description: z.string().min(5, "Description is required"),
  amount: z.number().min(0, "Amount must be positive"),
});

type RequestFormData = z.infer<typeof RequestSchema>;

// Enum for better type safety and readability
enum ActivityStatus {
  Pending = 'Pending',
  InTransit = 'In Transit',
  Completed = 'Completed'
}

// Type guard for status
function isValidStatus(status: string): status is ActivityStatus {
  return Object.values(ActivityStatus).includes(status as ActivityStatus);
}

// Improved invoice view button with Swiss minimalism
const InvoiceViewButton: React.FC<{ 
  onClick: () => void; 
  hasInvoice: boolean 
}> = ({ onClick, hasInvoice }) => {
  if (!hasInvoice) return null;

  return (
    <button 
      onClick={onClick}
      className="
        text-sm 
        font-medium 
        text-blue-600 
        hover:text-blue-800 
        transition-colors 
        flex 
        items-center 
        gap-1
        opacity-80 
        hover:opacity-100
      "
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
        />
      </svg>
      View Invoice
    </button>
  );
};

// Add this before the Dashboard component
const generateInvoice = (activity: Activity, user?: User | null): Invoice => ({
  id: `INV-${activity.id}`,
  invoiceNumber: `INV-${activity.id}`,
  customerName: user?.name || 'Customer',
  businessName: 'Afritrade',
  activity: activity,
  invoiceDate: activity.date,
  dueDate: new Date(new Date(activity.date).setDate(new Date(activity.date).getDate() + 30)).toISOString().split('T')[0],
  totalAmount: activity.amount,
  status: 'Pending',
  items: [{
    description: `${activity.category} Service`,
    quantity: 1,
    unitPrice: activity.amount,
    total: activity.amount
  }],
  taxRate: 0.16,
  notes: `Invoice for ${activity.category} - ${activity.id}`
});

// Add this utility function before the StatusBadge component
const getStatusStyles = (status: ActivityStatus) => {
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

const getStatusColor = (status: ActivityStatus) => {
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

// Add new interfaces for analytics
// interface AnalyticsData {
//   dailyStats: {
//     date: string;
//     value: number;
//     trend: 'up' | 'down' | 'stable';
//   }[];
//   performance: {
//     metric: string;
//     value: number;
//     target: number;
//     progress: number;
//   }[];
// }

// Add new interface for enhanced insights
interface EnhancedInsights extends DashboardInsights {
  revenueGrowth: number;
  processingEfficiency: number;
  customerSatisfaction: number;
}

const calculateRiskLevel = (insights: EnhancedInsights): RiskAssessment => {
  const score = insights.processingEfficiency + (insights.revenueGrowth * 0.5);
  
  return {
    level: score > 80 ? 'Low' : score > 50 ? 'Medium' : 'High',
    description: `Risk assessment based on processing efficiency and revenue growth`,
    impactScore: score
  };
};

// Add this component before the Dashboard component
const ContextualHelp: React.FC<{ content: string }> = ({ content }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative ml-2">
      <button
        type="button"
        aria-label="Help information"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="text-gray-400 hover:text-gray-600"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      {showTooltip && (
        <div className="absolute z-10 w-64 p-2 mt-2 text-sm text-white bg-gray-800 rounded-md shadow-lg">
          {content}
        </div>
      )}
    </div>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const [enhancedInsights, setEnhancedInsights] = useState<EnhancedInsights | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isConsignmentModalOpen, setIsConsignmentModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [statusHistory, setStatusHistory] = useState<StatusUpdate[]>([]);
  const [statusUpdateNotification, setStatusUpdateNotification] = useState<string | null>(null);
  const [showStatusHistory, setShowStatusHistory] = useState(false);

  // Enhance the calculateInsights function
  const calculateInsights = (activityList: Activity[]) => {
    const baseInsights = {
      totalRevenue: activityList.reduce((sum, activity) => sum + activity.amount, 0),
      pendingRequests: activityList.filter(a => a.status === 'Pending').length,
      completedRequests: activityList.filter(a => a.status === 'Completed').length,
      averageProcessingTime: calculateAverageProcessingTime(activityList)
    };

    // Add enhanced metrics
    const enhancedMetrics = {
      ...baseInsights,
      revenueGrowth: calculateRevenueGrowth(activityList),
      processingEfficiency: calculateProcessingEfficiency(activityList),
      customerSatisfaction: calculateCustomerSatisfaction(),
    };

    setEnhancedInsights(enhancedMetrics);

    return {
      insightsData: enhancedMetrics,
      riskLevel: calculateRiskLevel(enhancedMetrics),
    };
  };

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    // Simulating fetching activities from an API
    const initialActivities = [
      { id: 'ORD-001', category: 'Order', date: '2023-05-01', status: 'Completed', amount: 5500 },
      { id: 'ORD-002', category: 'Shipment', date: '2023-05-02', status: 'In Transit', amount: 750 },
      { id: 'ORD-003', category: 'Payment', date: '2023-05-03', status: 'Pending', amount: 1000 },
      { id: 'ORD-004', category: 'Order', date: '2023-05-04', status: 'Completed', amount: 500 },
      { id: 'ORD-005', category: 'Shipment', date: '2023-05-05', status: 'In Transit', amount: 750 },
      { id: 'ORD-006', category: 'Payment', date: '2023-05-06', status: 'Pending', amount: 1000 },
      { id: 'ORD-007', category: 'Order', date: '2023-05-07', status: 'Completed', amount: 500 },
      { id: 'ORD-008', category: 'Shipment', date: '2023-05-08', status: 'In Transit', amount: 750 },
      { id: 'ORD-009', category: 'Payment', date: '2023-05-09', status: 'Pending', amount: 1000 },
      { id: 'ORD-010', category: 'Order', date: '2023-05-10', status: 'Completed', amount: 500 },
      { id: 'ORD-011', category: 'Shipment', date: '2023-05-11', status: 'In Transit', amount: 750 },
      { id: 'ORD-012', category: 'Payment', date: '2023-05-12', status: 'Pending', amount: 1000 },
      { id: 'ORD-013', category: 'Order', date: '2023-05-13', status: 'Completed', amount: 500 },
      { id: 'ORD-014', category: 'Shipment', date: '2023-05-14', status: 'In Transit', amount: 750 },
      { id: 'ORD-015', category: 'Payment', date: '2023-05-15', status: 'Pending', amount: 1300 },
    ];
    setActivities(initialActivities);

    // Calculate dashboard insights
    const { insightsData, riskLevel } = calculateInsights(initialActivities);
    setEnhancedInsights(insightsData);
    setRiskAssessment(riskLevel);

    // Generate invoices for ALL activities
    const generatedInvoices: Invoice[] = initialActivities.map(activity => generateInvoice(activity, user));
    setInvoices(generatedInvoices);
  }, [user]);

  useEffect(() => {
    const { insightsData, riskLevel } = calculateInsights(activities);
    setEnhancedInsights(insightsData);
    setRiskAssessment(riskLevel);
  }, [activities]);

  // Add a sign out function
  const handleSignOut = () => {

    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Navigate back to home page
    navigate('/');
  };

  // Update navItems to be more concise
  const navItems = [
    { label: 'Requests', icon: FaPlusCircle },
    { label: 'Invoices', icon: FaFileInvoice },
    { label: 'Payments', icon: FaApplePay },
    { label: 'History', icon: FaHistory },
    { label: 'Settings', icon: FaCog },
    { label: 'Log Out', icon: FaSignOutAlt, action: handleSignOut },
  ];

  const orderData = [
    { month: 'Jan', orders: 65 },
    { month: 'Feb', orders: 85 },
    { month: 'Mar', orders: 120 },
    { month: 'Apr', orders: 90 },
    { month: 'May', orders: 150 },
    { month: 'Jun', orders: 110 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Clothing', value: 300 },
    { name: 'Food', value: 200 },
    { name: 'Others', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const downloadActivitiesReport = () => {
    const headers = ['Order ID,Category,Date,Status,Amount\n'];
    const csvContent = activities.map(activity => 
      `${activity.id},${activity.category},${activity.date},${activity.status},${activity.amount}`
    ).join('\n');
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'activities-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const viewInvoiceDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  // Add this to your existing navItems or quick action cards
  const createConsignmentHandler = () => {
    setIsConsignmentModalOpen(true);
  };

  // Consignment Creation Modal Component
  const ConsignmentCreationModal = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { 
      control, 
      handleSubmit, 
      formState: { errors }, 
      reset 
    } = useForm<ConsignmentFormData>({
      resolver: zodResolver(ConsignmentSchema),
      defaultValues: {
        traderName: '',
        documentType: 'Import',
        goodsDescription: '',
        estimatedValue: 0,
      }
    });

    const onSubmit = (data: ConsignmentFormData) => {
      console.log('Consignment Data:', data);
      
      // Set submitted state and show animation
      setIsSubmitted(true);

      // Close modal and reset after animation
      setTimeout(() => {
        setIsConsignmentModalOpen(false);
        setIsSubmitted(false);
        reset();
      }, 2000);
    };

    if (isSubmitted) {
      return (
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="bg-white rounded-2xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center"
            >
              <FaClipboardCheck className="h-20 w-20 text-green-500" />
              <h2 className="text-2xl font-bold mt-4 text-green-600">
                Consignment Created Successfully!
              </h2>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    return (
      <AnimatePresence>
        {isConsignmentModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative"
            >
              <button 
                type="button"
                onClick={() => setIsConsignmentModalOpen(false)}
                aria-label="Close Consignment Modal"
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <HeroIcons.XMarkIcon className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                <HeroIcons.DocumentIcon className="h-8 w-8 mr-3 text-blue-500" />
                Create New Consignment
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Trader Name
                  </label>
                  <Controller
                    name="traderName"
                    control={control}
                    render={({ field }) => (
                      <input 
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="Enter trader name"
                      />
                    )}
                  />
                  {errors.traderName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.traderName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Document Type
                  </label>
                  <Controller
                    name="documentType"
                    control={control}
                    render={({ field }) => (
                      <select 
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      >
                        <option value="Import">Import</option>
                        <option value="Export">Export</option>
                        <option value="Transit">Transit</option>
                        <option value="Temporary Entry">Temporary Entry</option>
                        <option value="Bonded Warehouse">Bonded Warehouse</option>
                      </select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Goods Description
                  </label>
                  <Controller
                    name="goodsDescription"
                    control={control}
                    render={({ field }) => (
                      <textarea 
                        {...field}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="Describe the goods in detail"
                      />
                    )}
                  />
                  {errors.goodsDescription && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.goodsDescription.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Estimated Value
                  </label>
                  <Controller
                    name="estimatedValue"
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                      <input 
                        {...field}
                        type="number"
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="Enter estimated value"
                      />
                    )}
                  />
                  {errors.estimatedValue && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.estimatedValue.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsConsignmentModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                  >
                    <FaClipboardCheck className="h-5 w-5 mr-2" />
                    Create Consignment
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );
  };

  // This Method is used to generate a new activity and invoice
  const createNewRequest = (data: RequestFormData) => {
    const newActivity: Activity = {
      id: `ORD-${activities.length + 1}`,
      category: data.category,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      amount: data.amount
    };

    const newInvoice: Invoice = {
      id: `INV-${newActivity.id}`,
      invoiceNumber: `INV-${newActivity.id}`,
      customerName: user?.name || 'Customer',
      businessName: 'Afritrade',
      activity: newActivity,
      invoiceDate: newActivity.date,
      dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      totalAmount: newActivity.amount,
      status: 'Pending',
      items: [{
        description: `${data.description}`,
        quantity: 1,
        unitPrice: newActivity.amount,
        total: newActivity.amount
      }],
      taxRate: 0.16
    };

    // Update activities and invoices
    setActivities(prev => [newActivity, ...prev]);
    setInvoices(prev => [newInvoice, ...prev]);
    
    // Close modal
    setIsRequestModalOpen(false);
  };

  // Create Request Modal Component
  const CreateRequestModal = () => {
    const { 
      control, 
      handleSubmit, 
      formState: { errors }, 
      reset 
    } = useForm<RequestFormData>({
      resolver: zodResolver(RequestSchema),
      defaultValues: {
        category: 'Order',
        description: '',
        amount: 0
      }
    });

    const onSubmit = (data: RequestFormData) => {
      createNewRequest(data);
      reset();
    };

    return (
      <AnimatePresence>
        {isRequestModalOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
              <button 
                onClick={() => setIsRequestModalOpen(false)}
                aria-label="Close Request Modal"
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <HeroIcons.XMarkIcon className="h-6 w-6" />
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                Create New Request
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <select 
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                      >
                        <option value="Order">Order</option>
                        <option value="Shipment">Shipment</option>
                        <option value="Payment">Payment</option>
                      </select>
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <input 
                        {...field}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="Enter request description"
                      />
                    )}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Amount
                  </label>
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field: { onChange, ...field } }) => (
                      <input 
                        {...field}
                        type="number"
                        onChange={(e) => onChange(Number(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                        placeholder="Enter amount"
                      />
                    )}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.amount.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
                  >
                    <FaClipboardCheck className="h-5 w-5 mr-2" />
                    Create Request
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  const updateActivityStatus = (
    activityId: string, 
    newStatus: ActivityStatus
  ) => {
    const update: StatusUpdate = {
      activityId,
      status: newStatus,
      updatedBy: user?.name || 'Unknown Officer',
      timestamp: new Date()
    };

    setActivities(prevActivities => 
      prevActivities.map(activity => 
        activity.id === activityId 
          ? { ...activity, status: newStatus } 
          : activity
      )
    );

    setStatusHistory(prev => [update, ...prev]);
    
    // Show notification
    setStatusUpdateNotification(`Status updated to ${newStatus} by ${update.updatedBy}`);
    setTimeout(() => setStatusUpdateNotification(null), 3000);
  };

  // Add this StatusBadge enhancement
  const StatusBadge: React.FC<{ 
    status: ActivityStatus; 
    onChange: (newStatus: ActivityStatus) => void;
    lastUpdated?: Date;
    updatedBy?: string;
  }> = ({ status, onChange, lastUpdated, updatedBy }) => {
    return (
      <div className="relative group">
        <select
          value={status}
          aria-label="Update activity status"
          onChange={(e) => {
            const newStatus = e.target.value;
            if (isValidStatus(newStatus)) {
              onChange(newStatus);
            }
          }}
          className={`
            appearance-none 
            w-full 
            px-3 
            py-1 
            rounded-md 
            border 
            font-medium 
            cursor-pointer 
            transition-all
            duration-200
            ${getStatusStyles(status)}
            hover:ring-2
            hover:ring-opacity-50
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
          `}
        >
          {Object.values(ActivityStatus).map((stat) => (
            <option key={stat} value={stat}>{stat}</option>
          ))}
        </select>
        
        {/* Status update tooltip */}
        {lastUpdated && (
          <div className="absolute z-10 -top-12 left-0 w-48 p-2 bg-gray-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Last updated: {lastUpdated.toLocaleString()}
            <br />
            By: {updatedBy}
          </div>
        )}
      </div>
    );
  };

  // Add this StatusNotification component
  const StatusNotification: React.FC<{ message: string | null }> = ({ message }) => {
    if (!message) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg"
      >
        {message}
      </motion.div>
    );
  };

  // Add this StatusTimeline component
  const StatusTimeline: React.FC<{ updates: StatusUpdate[] }> = ({ updates }) => {
    return (
      <div className="mt-4 space-y-3">
        {updates.map((update, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3 text-sm"
          >
            <div className={`w-2 h-2 rounded-full ${getStatusColor(update.status)}`} />
            <span className="font-medium">{update.status}</span>
            <span className="text-gray-500">by {update.updatedBy}</span>
            <span className="text-gray-400">
              {update.timestamp.toLocaleString()}
            </span>
          </motion.div>
        ))}
      </div>
    );
  };

  // Add new utility functions
  const calculateRevenueGrowth = (activities: Activity[]): number => {
    // Implementation for revenue growth calculation
    const currentRevenue = activities.reduce((sum, act) => sum + act.amount, 0);
    const previousRevenue = currentRevenue * 0.9; // Placeholder calculation
    return Number(((currentRevenue - previousRevenue) / previousRevenue * 100).toFixed(1));
  };

  const calculateProcessingEfficiency = (activities: Activity[]): number => {
    const completedActivities = activities.filter(act => act.status === ActivityStatus.Completed);
    return Number(((completedActivities.length / activities.length) * 100).toFixed(1));
  };

  const calculateCustomerSatisfaction = (): number => {
    // Placeholder implementation
    return 85;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 pt-8 space-y-6">
        {/* Add Welcome Header */}
        <div className="flex justify-between items-center bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5">
          <h1 className="text-2xl font-bold">Welcome, {user?.name || 'Guest'}</h1>
          <div className="text-gray-600">{user?.email}</div>
        </div>

        {/* Remove insights section and continue with rest of the layout */}
        <div className="grid grid-cols-12 gap-4">
          {/* Sidebar */}
          <aside className="col-span-2 space-y-2 p-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg">
            {navItems.map((item) => (
              <button
                type="button"
                key={item.label} 
                onClick={item.action}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors group"
              >
                <item.icon className="text-lg text-gray-600 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <main className="col-span-10 space-y-6">
            {/* Quick Action Cards */}
            <section className="grid grid-cols-4 gap-4">
              {[
                { 
                  icon: FaUpload, 
                  label: 'Upload', 
                  color: 'bg-blue-500', 
                  action: () => setIsUploadModalOpen(true) 
                },
                { 
                  icon: FaBox, 
                  label: 'Create Consignment', 
                  color: 'bg-purple-500', 
                  action: createConsignmentHandler 
                },
                { 
                  icon: FaDownload, 
                  label: 'Download Report', 
                  color: 'bg-yellow-500', 
                  action: downloadActivitiesReport 
                }

              ].map((card) => (
                <button 
                  key={card.label}
                  onClick={card.action}
                  className={`${card.color} text-white p-4 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all flex flex-col items-center justify-center space-y-2`}
                >
                  <card.icon className="text-2xl" />
                  <span className="text-sm font-medium">{card.label}</span>
                </button>
              ))}
            </section>

            {/* Add this after the Quick Action Cards section */}
            <section className="grid grid-cols-3 gap-4">
              {enhancedInsights && (
                <>
                  <div className="bg-white/80 backdrop-blur-md rounded-xl p-4">
                    <h3 className="text-lg font-medium">Revenue Growth</h3>
                    <p className="text-2xl">{enhancedInsights.revenueGrowth}%</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-md rounded-xl p-4">
                    <h3 className="text-lg font-medium">Processing Efficiency</h3>
                    <p className="text-2xl">{enhancedInsights.processingEfficiency}%</p>
                  </div>
                  <div className="bg-white/80 backdrop-blur-md rounded-xl p-4">
                    <h3 className="text-lg font-medium">Customer Satisfaction</h3>
                    <p className="text-2xl">{enhancedInsights.customerSatisfaction}%</p>
                  </div>
                </>
              )}
            </section>

            {/* Add Risk Assessment Display */}
            {riskAssessment && (
              <div className="bg-white/80 backdrop-blur-md rounded-xl p-4">
                <h3 className="text-lg font-medium">Risk Assessment</h3>
                <p className="text-2xl">{riskAssessment.level} Risk</p>
                <p className="text-sm text-gray-600">{riskAssessment.description}</p>
              </div>
            )}

            {/* Analytics Section - Modern Card Design */}
            <div className="grid grid-cols-2 gap-4">
              {/* Orders Chart */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Order Trends</h2>
                  <span className="text-sm text-red-500">5 Pending</span>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={orderData}>
                    <defs>
                      <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="#3b82f6" 
                      fillOpacity={1} 
                      fill="url(#colorOrders)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Category Distribution */}
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5">
                <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          className="hover:opacity-80 transition-opacity"
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Enhanced Recent Activities with More Context */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  Recent Activities
                  <ContextualHelp 
                    content="This section shows your most recent business activities, including orders, shipments, and payments." 
                  />
                </h2>
                <button 
                  onClick={() => setShowAllInvoices(!showAllInvoices)}
                  className="text-base text-blue-500 hover:text-blue-700 transition-colors"
                >
                  {showAllInvoices ? 'Show Recent' : 'View All'}
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-base">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Order ID', 'Category', 'Date', 'Status', 'Amount', 'Action'].map((header) => (
                        <th 
                          key={header} 
                          className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((activity) => {
                      // Ensure an invoice exists, create one if not
                      const correspondingInvoice = invoices.find(
                        inv => inv.activity?.id === activity.id
                      ) || generateInvoice(activity, user);

                      return (
                        <tr 
                          key={activity.id} 
                          className="hover:bg-gray-50 transition-colors border-b last:border-b-0"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{activity.id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500">{activity.category}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500">{activity.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500">
                            <StatusBadge 
                              status={activity.status as ActivityStatus} 
                              onChange={(newStatus) => updateActivityStatus(activity.id, newStatus)} 
                            />
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500">${activity.amount}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500 space-x-2">
                            <InvoiceViewButton 
                              onClick={() => viewInvoiceDetails(correspondingInvoice)}
                              hasInvoice={true} // Always true now
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
      <InvoiceDetailModal 
        invoice={selectedInvoice ?? {
          id: '',
          invoiceNumber: '',
          customerName: '',
          businessName: '',
          activity: {
            id: '',
            category: '',
            date: '',
            status: '',
            amount: 0
          },
          invoiceDate: '',
          dueDate: '',
          totalAmount: 0,
          status: 'Pending' as const,  // Use type assertion to match the union type
          items: [],
          taxRate: 0
        } as Invoice}  // Type assertion to Invoice
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedInvoice(null);
        }}
      />
      <ConsignmentCreationModal />
      <CreateRequestModal />

      {/* Add the notification component */}
      <AnimatePresence>
        <StatusNotification message={statusUpdateNotification} />
      </AnimatePresence>
      
      {/* Add status timeline in a collapsible panel */}
      <motion.div
        initial={false}
        animate={{ height: showStatusHistory ? 'auto' : 0 }}
        className="fixed bottom-0 right-0 w-80 bg-white shadow-lg rounded-t-lg overflow-hidden"
      >
        <button
          onClick={() => setShowStatusHistory(!showStatusHistory)}
          className="w-full px-4 py-2 flex items-center justify-between bg-gray-100"
        >
          <span className="font-medium">Status History</span>
          <motion.span
            animate={{ rotate: showStatusHistory ? 180 : 0 }}
          >
            ↑
          </motion.span>
        </button>
        <div className="p-4">
          <StatusTimeline updates={statusHistory} />
        </div>
      </motion.div>
    </div>
  );
}
// Utility Functions
function calculateAverageProcessingTime(activities: Activity[]): number {
  // Implement logic to calculate average processing time
  return activities.length * 0.5; // Placeholder
}

{/* Footer */}
<Footer />

