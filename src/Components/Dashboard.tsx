import { useEffect, useState, useCallback } from 'react';
import { FaUpload, FaDownload, FaBox } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AnimatePresence, motion } from 'framer-motion';
import UploadModal from './UploadModal';
import InvoiceDetailModal from './InvoiceDetailModal';
import { useAuth } from './AuthContext';
import InvoiceViewButton from './Dashboard/InvoiceViewButton';
import ContextualHelp from './Dashboard/ContextualHelp';
import StatusBadge from './Dashboard/StatusBadge';
import StatusNotification from './Dashboard/StatusNotification';
import StatusTimeline from './Dashboard/StatusTimeline';
import ConsignmentCreationModal from './Dashboard/ConsignmentCreationModal';
import CreateRequestModal, { RequestFormData } from './Dashboard/CreateRequestModal';
import Card from './ui/Card';
import {
  Activity,
  ActivityStatus,
  EnhancedInsights,
  Invoice,
  RiskAssessment,
  StatusUpdate,
} from '../types/dashboard';
import {
  calculateAverageProcessingTime,
  calculateCustomerSatisfaction,
  calculateProcessingEfficiency,
  calculateRevenueGrowth,
  calculateRiskLevel,
  generateInvoice,
} from './Dashboard/dashboardUtils';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const EMPTY_INVOICE: Invoice = {
  id: '',
  invoiceNumber: '',
  customerName: '',
  businessName: '',
  activity: {
    id: '',
    category: '',
    date: '',
    status: '',
    amount: 0,
  },
  invoiceDate: '',
  dueDate: '',
  totalAmount: 0,
  status: 'Pending',
  items: [],
  taxRate: 0,
};

export default function Dashboard() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showAllInvoices, setShowAllInvoices] = useState(false);
  const [enhancedInsights, setEnhancedInsights] = useState<EnhancedInsights | null>(null);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [isConsignmentModalOpen, setIsConsignmentModalOpen] = useState(false);
  const [activeConsignmentId, setActiveConsignmentId] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [statusHistory, setStatusHistory] = useState<StatusUpdate[]>([]);
  const [statusUpdateNotification, setStatusUpdateNotification] = useState<string | null>(null);
  const [showStatusHistory, setShowStatusHistory] = useState(false);

  const calculateInsights = useCallback((activityList: Activity[]) => {
    const baseInsights = {
      totalRevenue: activityList.reduce((sum, activity) => sum + activity.amount, 0),
      pendingRequests: activityList.filter(a => a.status === 'Pending').length,
      completedRequests: activityList.filter(a => a.status === 'Completed').length,
      averageProcessingTime: calculateAverageProcessingTime(activityList)
    };

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
  }, []);

  useEffect(() => {
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

    const { insightsData, riskLevel } = calculateInsights(initialActivities);
    setEnhancedInsights(insightsData);
    setRiskAssessment(riskLevel);

    const generatedInvoices: Invoice[] = initialActivities.map(activity => generateInvoice(activity, user));
    setInvoices(generatedInvoices);
  }, [user, calculateInsights]);

  useEffect(() => {
    const { insightsData, riskLevel } = calculateInsights(activities);
    setEnhancedInsights(insightsData);
    setRiskAssessment(riskLevel);
  }, [activities, calculateInsights]);

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
      customerName: user?.displayName || 'Customer',
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

    setActivities(prev => [newActivity, ...prev]);
    setInvoices(prev => [newInvoice, ...prev]);
    setIsRequestModalOpen(false);
  };

  const updateActivityStatus = (
    activityId: string,
    newStatus: ActivityStatus
  ) => {
    const update: StatusUpdate = {
      activityId,
      status: newStatus,
      updatedBy: user?.displayName || 'Unknown Officer',
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

    setStatusUpdateNotification(`Status updated to ${newStatus} by ${update.updatedBy}`);
    setTimeout(() => setStatusUpdateNotification(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pt-8 space-y-6">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome {user?.displayName || user?.email?.split('@')[0] || ''}
            </h1>
            <p className="text-sm text-gray-600">
              {user?.email || 'Manage and track your customs declarations and documents'}
            </p>
          </div>
        </div>

        <section id="overview" className="scroll-mt-20 space-y-6">
            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: FaUpload,
                  label: 'Upload',
                  action: () => setIsUploadModalOpen(true)
                },
                {
                  icon: FaBox,
                  label: 'Create Consignment',
                  action: () => setIsConsignmentModalOpen(true)
                },
                {
                  icon: FaDownload,
                  label: 'Download Report',
                  action: downloadActivitiesReport
                }
              ].map((card) => (
                <button
                  key={card.label}
                  onClick={card.action}
                  className="bg-teal-600 text-white p-4 rounded-xl shadow-sm hover:bg-teal-700 hover:shadow-md transition-colors flex flex-col items-center justify-center space-y-2"
                >
                  <card.icon className="text-2xl" />
                  <span className="text-sm font-medium">{card.label}</span>
                </button>
              ))}
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {enhancedInsights && (
                <>
                  <Card padding="sm">
                    <h3 className="text-lg font-medium">Revenue Growth</h3>
                    <p className="text-2xl">{enhancedInsights.revenueGrowth}%</p>
                  </Card>
                  <Card padding="sm">
                    <h3 className="text-lg font-medium">Processing Efficiency</h3>
                    <p className="text-2xl">{enhancedInsights.processingEfficiency}%</p>
                  </Card>
                  <Card padding="sm">
                    <h3 className="text-lg font-medium">Customer Satisfaction</h3>
                    <p className="text-2xl">{enhancedInsights.customerSatisfaction}%</p>
                  </Card>
                </>
              )}
            </section>

            {riskAssessment && (
              <Card padding="sm">
                <h3 className="text-lg font-medium">Risk Assessment</h3>
                <p className="text-2xl">{riskAssessment.level} Risk</p>
                <p className="text-sm text-gray-600">{riskAssessment.description}</p>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card padding="md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Order Trends</h2>
                  <span className="text-sm text-red-500">5 Pending</span>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={orderData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="orders"
                      stroke="#0d9488"
                      fillOpacity={0.15}
                      fill="#0d9488"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Card>

              <Card padding="md">
                <h2 className="text-xl font-medium mb-4">Category Distribution</h2>
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
              </Card>
            </div>
        </section>

        <section id="activity" className="scroll-mt-20 space-y-6">
            <Card padding="md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium flex items-center">
                  Recent Activities
                  <ContextualHelp
                    content="This section shows your most recent business activities, including orders, shipments, and payments."
                  />
                </h2>
                <button
                  onClick={() => setShowAllInvoices(!showAllInvoices)}
                  className="text-base text-teal-600 hover:text-teal-700 transition-colors"
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
                              hasInvoice={true}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
        </section>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        consignmentId={activeConsignmentId}
      />
      <InvoiceDetailModal
        invoice={selectedInvoice ?? EMPTY_INVOICE}
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedInvoice(null);
        }}
      />
      <ConsignmentCreationModal
        isOpen={isConsignmentModalOpen}
        onClose={() => setIsConsignmentModalOpen(false)}
        onCreated={(consignmentId) => {
          setActiveConsignmentId(consignmentId);
          setIsUploadModalOpen(true);
        }}
      />
      <CreateRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onCreate={createNewRequest}
      />

      <AnimatePresence>
        <StatusNotification message={statusUpdateNotification} />
      </AnimatePresence>

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
