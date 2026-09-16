import { useEffect, useMemo, useState } from 'react';
import { FaUpload, FaDownload, FaBox, FaWallet, FaCheckCircle, FaChartLine, FaShieldAlt, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import UploadModal from './UploadModal';
import InvoiceDetailModal from './InvoiceDetailModal';
import { useAuth } from './AuthContext';
import InvoiceViewButton from './Dashboard/InvoiceViewButton';
import ContextualHelp from './Dashboard/ContextualHelp';
import ConsignmentCreationModal from './Dashboard/ConsignmentCreationModal';
import Card from './ui/Card';
import SectionHeader from './ui/SectionHeader';
import { useTheme } from './ThemeContext';
import { getStatusStyles, generateInvoice, calculateProcessingEfficiency, calculateValueGrowth, calculateRejectionRate, calculateRiskLevel } from './Dashboard/dashboardUtils';
import { Activity, EnhancedInsights, Invoice } from '../types/dashboard';
import { Consignment, ConsignmentStatus } from './CustomsDashboard/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RISK_STYLES = {
  Low: 'border-l-green-500 bg-green-50/60 dark:bg-green-900/10',
  Medium: 'border-l-yellow-500 bg-yellow-50/60 dark:bg-yellow-900/10',
  High: 'border-l-red-500 bg-red-50/60 dark:bg-red-900/10',
} as const;

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
  const { resolvedTheme } = useTheme();
  const axisColor = resolvedTheme === 'dark' ? '#9ca3af' : '#6b7280';
  const tooltipStyle = resolvedTheme === 'dark'
    ? { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#f3f4f6' }
    : undefined;
  const [consignments, setConsignments] = useState<Consignment[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [showAllActivities, setShowAllActivities] = useState(false);
  const [isConsignmentModalOpen, setIsConsignmentModalOpen] = useState(false);
  const [activeConsignmentId, setActiveConsignmentId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.email) return;

    const consignmentsQuery = query(collection(db, 'consignments'), where('traderEmail', '==', user.email));
    const unsubscribe = onSnapshot(
      consignmentsQuery,
      (snapshot) => {
        setConsignments(
          snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              traderName: data.traderName ?? '',
              traderEmail: data.traderEmail ?? '',
              documentType: data.documentType ?? '',
              status: (data.status as ConsignmentStatus) ?? ConsignmentStatus.Pending,
              goodsStatus: data.goodsStatus ?? '',
              description: data.description ?? '',
              estimatedValue: data.estimatedValue ?? 0,
              declarationNumber: data.declarationNumber ?? '',
              goodsOrdered: data.goodsOrdered ?? [],
              documents: data.documents ?? [],
              createdAt: data.createdAt,
            } as Consignment;
          })
        );
      },
      (error) => console.error('Failed to load consignments:', error)
    );

    return () => unsubscribe();
  }, [user?.email]);

  const sortedConsignments = useMemo(
    () => [...consignments].sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()),
    [consignments]
  );

  const allActivities = useMemo<Activity[]>(
    () =>
      sortedConsignments.map((c) => ({
        id: c.declarationNumber || c.id,
        category: c.documentType,
        date: c.createdAt.toDate().toISOString().split('T')[0],
        status: c.status,
        amount: c.estimatedValue,
      })),
    [sortedConsignments]
  );

  const visibleActivities = showAllActivities ? allActivities : allActivities.slice(0, 5);

  const pendingCount = consignments.filter((c) => c.status === ConsignmentStatus.Pending).length;

  const enhancedInsights: EnhancedInsights = useMemo(() => {
    const baseInsights = {
      totalDeclaredValue: consignments.reduce((sum, c) => sum + c.estimatedValue, 0),
      pendingRequests: pendingCount,
      completedRequests: consignments.filter((c) => c.status === ConsignmentStatus.Approved).length,
    };

    return {
      ...baseInsights,
      valueGrowth: calculateValueGrowth(
        consignments.map((c) => ({ estimatedValue: c.estimatedValue, createdAt: c.createdAt.toDate() }))
      ),
      processingEfficiency: calculateProcessingEfficiency(consignments),
    };
  }, [consignments, pendingCount]);

  const decidedCount = consignments.filter((c) => c.status !== ConsignmentStatus.Pending).length;
  const riskAssessment = useMemo(
    () => calculateRiskLevel(calculateRejectionRate(consignments)),
    [consignments]
  );

  // Consignments received per month, for the last 6 months (including zero months).
  const orderData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      return { key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_LABELS[d.getMonth()] };
    });

    return months.map(({ key, label }) => ({
      month: label,
      orders: consignments.filter((c) => {
        const created = c.createdAt.toDate();
        return `${created.getFullYear()}-${created.getMonth()}` === key;
      }).length,
    }));
  }, [consignments]);

  // Breakdown of the trader's consignments by document type.
  const categoryData = useMemo(() => {
    const counts = consignments.reduce((acc, c) => {
      const key = c.documentType || 'Other';
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [consignments]);

  const downloadActivitiesReport = () => {
    const headers = ['Consignment,Category,Date,Status,Declared Value\n'];
    const csvContent = allActivities
      .map((activity) => `${activity.id},${activity.category},${activity.date},${activity.status},${activity.amount}`)
      .join('\n');

    const blob = new Blob([headers + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'consignments-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const viewInvoiceDetails = (activity: Activity) => {
    setSelectedInvoice(generateInvoice(activity, user));
    setIsInvoiceModalOpen(true);
  };

  const growthIsPositive = enhancedInsights.valueGrowth >= 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-16">
        <section id="overview" className="scroll-mt-20 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Welcome{(user?.displayName || user?.email?.split('@')[0]) ? `, ${user?.displayName || user?.email?.split('@')[0]}` : ''}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user?.email || 'Manage and track your customs declarations and documents'}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              { icon: FaUpload, label: 'Upload', action: () => setIsUploadModalOpen(true) },
              { icon: FaBox, label: 'Create Consignment', action: () => setIsConsignmentModalOpen(true) },
              { icon: FaDownload, label: 'Download Report', action: downloadActivitiesReport },
            ].map((card) => (
              <button
                key={card.label}
                onClick={card.action}
                className="flex items-center px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors"
              >
                <card.icon className="mr-2" /> {card.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card padding="sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                  <FaWallet className="text-teal-600 dark:text-teal-400 text-sm" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Declared Value</h3>
              </div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">${enhancedInsights.totalDeclaredValue.toLocaleString()}</p>
            </Card>
            <Card padding="sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                  <FaCheckCircle className="text-teal-600 dark:text-teal-400 text-sm" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Approval Rate</h3>
              </div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{enhancedInsights.processingEfficiency}%</p>
            </Card>
            <Card padding="sm">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center shrink-0">
                  <FaChartLine className="text-teal-600 dark:text-teal-400 text-sm" />
                </div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Value Growth (MoM)</h3>
              </div>
              <p className={`text-2xl font-semibold flex items-center gap-1.5 ${growthIsPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {growthIsPositive ? <FaArrowUp className="text-base" /> : <FaArrowDown className="text-base" />}
                {Math.abs(enhancedInsights.valueGrowth)}%
              </p>
            </Card>
          </div>

          {decidedCount > 0 && (
            <div className={`rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 border-l-4 bg-white dark:bg-gray-800 p-4 ${RISK_STYLES[riskAssessment.level]}`}>
              <div className="flex items-center gap-2 mb-1">
                <FaShieldAlt className="text-gray-400 dark:text-gray-500 text-sm" />
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Assessment</h3>
              </div>
              <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{riskAssessment.level} Risk</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{riskAssessment.description}</p>
            </div>
          )}
        </section>

        <section id="analytics" className="scroll-mt-20 space-y-6">
          <SectionHeader title="Analytics" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card padding="md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Consignment Volume</h3>
                <span className="text-sm text-red-500 dark:text-red-400">{pendingCount} Pending</span>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={orderData}>
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: axisColor }} />
                  <YAxis axisLine={false} tickLine={false} allowDecimals={false} tick={{ fill: axisColor }} />
                  <Tooltip contentStyle={tooltipStyle} />
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
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Document Type Breakdown</h3>
              {categoryData.length === 0 ? (
                <div className="h-[250px] flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
                  Your consignments will show up here once submitted.
                </div>
              ) : (
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
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card>
          </div>
        </section>

        <section id="activity" className="scroll-mt-20 space-y-6">
          <SectionHeader title="Activity" />
          <Card padding="md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold flex items-center text-gray-900 dark:text-gray-100">
                  Recent Consignments
                  <ContextualHelp
                    content="This section shows the consignments you've submitted, most recent first."
                  />
                </h3>
                {allActivities.length > 5 && (
                  <button
                    onClick={() => setShowAllActivities(!showAllActivities)}
                    className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                  >
                    {showAllActivities ? 'Show Recent' : 'View All'}
                  </button>
                )}
              </div>

              {visibleActivities.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">
                  You haven't submitted any consignments yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-base">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                      <tr>
                        {['Consignment', 'Type', 'Date', 'Status', 'Declared Value', 'Action'].map((header) => (
                          <th
                            key={header}
                            className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {visibleActivities.map((activity) => (
                        <tr
                          key={activity.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{activity.id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500 dark:text-gray-400">{activity.category}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500 dark:text-gray-400">{activity.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500">
                            <span className={`inline-block px-3 py-1 rounded-md border text-sm font-medium ${getStatusStyles(activity.status)}`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500 dark:text-gray-400">${activity.amount.toLocaleString()}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500 space-x-2">
                            <InvoiceViewButton
                              onClick={() => viewInvoiceDetails(activity)}
                              hasInvoice={true}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
    </div>
  );
}
