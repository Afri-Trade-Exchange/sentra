import React, { useEffect, useState } from 'react';
import { FaUpload, FaPlus, FaDownload, FaBox, FaBell, FaUser, FaSignOutAlt, FaClipboardList, FaArchive, FaFileInvoice, FaHistory, FaCog } from 'react-icons/fa';
import Footer from './Footer';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import UploadModal from './UploadModal';
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

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
    setActivities([
      { id: '001', category: 'Order', date: '2023-05-01', status: 'Completed', amount: 5500 },
      { id: '002', category: 'Shipment', date: '2023-05-02', status: 'In Transit', amount: 750 },
      { id: '003', category: 'Payment', date: '2023-05-03', status: 'Pending', amount: 1000 },
      { id: '004', category: 'Order', date: '2023-05-04', status: 'Completed', amount: 500 },
      { id: '005', category: 'Shipment', date: '2023-05-05', status: 'In Transit', amount: 750 },
      { id: '006', category: 'Payment', date: '2023-05-06', status: 'Pending', amount: 1000 },
      { id: '007', category: 'Order', date: '2023-05-07', status: 'Completed', amount: 500 },
      { id: '008', category: 'Shipment', date: '2023-05-08', status: 'In Transit', amount: 750 },
      { id: '009', category: 'Payment', date: '2023-05-09', status: 'Pending', amount: 1000 },
      { id: '010', category: 'Order', date: '2023-05-10', status: 'Completed', amount: 500 },
      { id: '011', category: 'Shipment', date: '2023-05-11', status: 'In Transit', amount: 750 },
      { id: '012', category: 'Payment', date: '2023-05-12', status: 'Pending', amount: 1000 },
      { id: '013', category: 'Order', date: '2023-05-13', status: 'Completed', amount: 500 },
      { id: '014', category: 'Shipment', date: '2023-05-14', status: 'In Transit', amount: 750 },
      { id: '015', category: 'Payment', date: '2023-05-15', status: 'Pending', amount: 1300 },
    ]);
  }, []);

  const navItems = [
    { label: 'Current Requests', icon: FaClipboardList },
    { label: 'Closed Requests', icon: FaArchive },
    { label: 'Invoices', icon: FaFileInvoice },
    { label: 'Order History', icon: FaHistory },
    { label: 'Settings', icon: FaCog },
    { label: 'Sign Out', icon: FaSignOutAlt },
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      Top Navigation Bar
      <nav className="bg-white shadow-md fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img className="h-8 w-auto" src="/src/assets/images/africa.png" alt="Afritrade-Xchange Logo" />
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button type="button" className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <FaBell className="h-6 w-6" />
                </button>
              </div>
              <div className="ml-3 relative">
                <div>
                  <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <FaUser className="h-8 w-8 rounded-full" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 shadow-md fixed h-full left-0 top-16 overflow-y-auto p-4 flex flex-col">
          {/* Existing logo section */}
          <div className="flex items-center gap-2 mb-8">
            <img className="h-8 w-8" src="/src/assets/images/africa.png" alt="Dabang" />
            <span className="text-xl font-semibold">Dabang</span>
          </div>

          {/* Main navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href="#"
                className="flex items-center w-full p-3 text-white hover:text-indigo-600 hover:bg-indigo-50 rounded-[15px] transition-all duration-200 group"
              >
                <item.icon className="w-5 h-5 mr-3 text-current" />
                <span className="text-sm font-medium">{item.label}</span>
              </a>
            ))}
          </nav>

          {/* Create Consignment button */}
          <button
            className="w-full mt-4 mb-14 bg-indigo-600 text-white p-3 rounded-[15px] flex items-center justify-center hover:bg-indigo-700 transition-colors"
          >
            <FaBox className="w-5 h-5 mr-2" />
            <span className="font-medium">Create Consignment</span>
          </button>

          {/* Pro upgrade card */}
          <div className="p-4 bg-indigo-600 rounded-[15px] text-center text-white">
            {/* ... existing Pro card content ... */}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 ml-64">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Welcome, {user?.name || 'Guest'}
            </p>
          </header>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="bg-blue-500 text-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300 flex items-center justify-center"
            >
              <FaUpload className="mr-2" />
              Upload Documents
            </button>
            <button
              className="bg-green-500 text-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300 flex items-center justify-center"
            >
              <FaPlus className="mr-2" />
              Create Request
            </button>
            <button
              onClick={downloadActivitiesReport}
              className="bg-yellow-500 text-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300 flex items-center justify-center"
            >
              <FaDownload className="mr-2" />
              Download Report
            </button>
            <button
              className="bg-purple-500 text-white p-4 rounded-lg shadow hover:shadow-lg transition duration-300 flex items-center justify-center"
            >
              <FaBox className="mr-2" />
              Create Consignment
            </button>
          </section>

          {/* Orders Database */}
          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Orders Database</h2>
              <span className="text-red-500 font-medium">5 pending consignments</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={orderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="orders" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          {/* Analytic View */}
          <section className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Analytic View</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* Recent Activities */}
          <section className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activities</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.map((activity) => (
                    <tr key={activity.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          activity.status === 'Completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'In Transit' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${activity.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
      <Footer />
      <UploadModal 
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
