import { useEffect, useMemo, useState } from 'react';
import { FaUpload, FaDownload, FaBox } from 'react-icons/fa';
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
import { getStatusStyles, generateInvoice, calculateProcessingEfficiency, calculateValueGrowth, calculateRiskLevel } from './Dashboard/dashboardUtils';
import { Activity, EnhancedInsights, Invoice } from '../types/dashboard';
import { Consignment, ConsignmentStatus } from './CustomsDashboard/types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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

  const riskAssessment = useMemo(() => calculateRiskLevel(enhancedInsights), [enhancedInsights]);

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
              <Card padding="sm">
                <h3 className="text-lg font-medium">Total Declared Value</h3>
                <p className="text-2xl">${enhancedInsights.totalDeclaredValue.toLocaleString()}</p>
              </Card>
              <Card padding="sm">
                <h3 className="text-lg font-medium">Approval Rate</h3>
                <p className="text-2xl">{enhancedInsights.processingEfficiency}%</p>
              </Card>
              <Card padding="sm">
                <h3 className="text-lg font-medium">Value Growth (MoM)</h3>
                <p className="text-2xl">{enhancedInsights.valueGrowth}%</p>
              </Card>
            </section>

            {consignments.length > 0 && (
              <Card padding="sm">
                <h3 className="text-lg font-medium">Risk Assessment</h3>
                <p className="text-2xl">{riskAssessment.level} Risk</p>
                <p className="text-sm text-gray-600">{riskAssessment.description}</p>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card padding="md">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-medium">Consignment Volume</h2>
                  <span className="text-sm text-red-500">{pendingCount} Pending</span>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={orderData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
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
                <h2 className="text-xl font-medium mb-4">Document Type Breakdown</h2>
                {categoryData.length === 0 ? (
                  <div className="h-[250px] flex items-center justify-center text-sm text-gray-500">
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
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Card>
            </div>
        </section>

        <section id="activity" className="scroll-mt-20 space-y-6">
            <Card padding="md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium flex items-center">
                  Recent Consignments
                  <ContextualHelp
                    content="This section shows the consignments you've submitted, most recent first."
                  />
                </h2>
                {allActivities.length > 5 && (
                  <button
                    onClick={() => setShowAllActivities(!showAllActivities)}
                    className="text-base text-teal-600 hover:text-teal-700 transition-colors"
                  >
                    {showAllActivities ? 'Show Recent' : 'View All'}
                  </button>
                )}
              </div>

              {visibleActivities.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">
                  You haven't submitted any consignments yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-base">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Consignment', 'Type', 'Date', 'Status', 'Declared Value', 'Action'].map((header) => (
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
                      {visibleActivities.map((activity) => (
                        <tr
                          key={activity.id}
                          className="hover:bg-gray-50 transition-colors border-b last:border-b-0"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{activity.id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500">{activity.category}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500">{activity.date}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500">
                            <span className={`inline-block px-3 py-1 rounded-md border text-sm font-medium ${getStatusStyles(activity.status)}`}>
                              {activity.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-base text-gray-500">${activity.amount.toLocaleString()}</td>
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
