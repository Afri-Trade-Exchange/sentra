import React, { useState, useMemo, useReducer, useCallback } from 'react';
import { Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaUserCircle, 
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaChevronDown,
  FaPlus,
  FaFileExport,
  FaChartBar,
  FaHistory,
  FaBell,
  FaClock
} from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import Footer from './Footer';
import { useAuth } from './AuthContext';
import TraderDetailsModal from './TraderDetailsModal';
// import QrScanner from 'react-qr-scanner';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

// Enhanced Type Definitions
enum ConsignmentStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

// Add this enum definition
enum ActivityStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Failed = 'Failed'
}

// Interfaces
interface Consignment {
  id: string;
  traderName: string;
  traderEmail: string;
  documentType: string;
  status: ConsignmentStatus;
  uploadDate: Timestamp;
  details?: {
    declarationNumber?: string;
    description?: string;
    estimatedValue?: number;
    goodsOrdered?: string[];
    goodsStatus?: string;
  };
}

// Additional Types
interface Activity {
  id: string;
  description: string;
  timestamp: Date;
  type: 'status_change' | 'document_upload' | 'comment' | 'review';
  userId: string;
}

interface TimelineEvent {
  id: string;
  title: string;
  timestamp: Date;
  status: ConsignmentStatus;
  description: string;
}

interface NotificationType {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

// Add this near the top of the file where other interfaces are defined
// interface User {
//   displayName: string | null;
// }

// State Interface
interface DashboardState {
  consignments: Consignment[];
  filteredConsignments: Consignment[];
  searchTerm: string;
  statusFilter: ConsignmentStatus | null;
  currentPage: number;
  itemsPerPage: number;
  selectedConsignment: Consignment | null;
  selectedItems: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
  documentTypeFilter: string | null;
  valueRange: {
    min: number | null;
    max: number | null;
  };
  notifications: NotificationType[];
  activities: Activity[];
  showAdvancedFilters: boolean;
  timelineEvents: TimelineEvent[];
}

// Action Types
type DashboardAction = 
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_STATUS_FILTER'; payload: ConsignmentStatus | null }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SELECT_CONSIGNMENT'; payload: Consignment | null }
  | { type: 'UPDATE_CONSIGNMENT_STATUS'; payload: { id: string; status: ConsignmentStatus } }
  | { type: 'SET_SELECTED_ITEMS'; payload: string[] }
  | { type: 'BULK_UPDATE_STATUS'; payload: { ids: string[]; status: ConsignmentStatus } }
  | { type: 'TOGGLE_SELECTED_ITEM'; payload: string }
  | { type: 'UPDATE_ACTIVITY_STATUS'; payload: { activityId: string; newStatus: ActivityStatus } };

// Reducer Function
const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
  switch (action.type) {
    case 'UPDATE_CONSIGNMENT_STATUS':
      return {
        ...state,
        consignments: state.consignments.map(consignment => 
          consignment.id === action.payload.id 
            ? { ...consignment, status: action.payload.status }
            : consignment
        ),
        filteredConsignments: state.filteredConsignments.map(consignment => 
          consignment.id === action.payload.id 
            ? { ...consignment, status: action.payload.status }
            : consignment
        )
      };
    case 'SET_SEARCH_TERM': {
      const trimmedSearchTerm = action.payload.trim();
      return {
        ...state,
        searchTerm: action.payload,
        filteredConsignments: filterConsignments(
          state.consignments, 
          trimmedSearchTerm, 
          state.statusFilter
        ),
        currentPage: 1
      };
    }
    case 'SET_STATUS_FILTER':
      return {
        ...state,
        statusFilter: action.payload,
        filteredConsignments: filterConsignments(
          state.consignments, 
          state.searchTerm, 
          action.payload
        )
      };
    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SELECT_CONSIGNMENT':
      return { ...state, selectedConsignment: action.payload };
    case 'SET_SELECTED_ITEMS':
      return { ...state, selectedItems: action.payload };
    case 'BULK_UPDATE_STATUS':
      return {
        ...state,
        consignments: state.consignments.map(consignment => 
          action.payload.ids.includes(consignment.id) 
            ? { ...consignment, status: action.payload.status }
            : consignment
        ),
        filteredConsignments: state.filteredConsignments.map(consignment => 
          action.payload.ids.includes(consignment.id) 
            ? { ...consignment, status: action.payload.status }
            : consignment
        )
      };
    case 'TOGGLE_SELECTED_ITEM':
      return {
        ...state,
        selectedItems: state.selectedItems.includes(action.payload)
          ? state.selectedItems.filter(id => id !== action.payload)
          : [...state.selectedItems, action.payload]
      };
    default:
      return state;
  }
};

// Improved utility function for filtering
const filterConsignments = (
  consignments: Consignment[], 
  searchTerm: string, 
  statusFilter: ConsignmentStatus | null
): Consignment[] => {
  // Trim and convert search term to lowercase
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  return consignments.filter(consignment => {
    // If no search term, return all consignments
    if (!normalizedSearchTerm) return true;

    // Comprehensive search across multiple fields
    const searchableFields = [
      consignment.traderName,
      consignment.documentType,
      consignment.status,
      consignment.details?.declarationNumber,
      consignment.details?.description,
      consignment.details?.estimatedValue?.toString()
    ];

    // Check if any field contains the search term
    const matchesSearch = searchableFields.some(field => 
      field && String(field).toLowerCase().includes(normalizedSearchTerm)
    );
    
    // Status filter check
    const matchesStatus = statusFilter 
      ? consignment.status === statusFilter 
      : true;
    
    return matchesSearch && matchesStatus;
  });
};

// Mock Data Generation
const generateMockConsignments = (): Consignment[] => {
  const statuses = Object.values(ConsignmentStatus);
  const documentTypes = ['Import', 'Export', 'Transit'];
  const traderNames = [
    { name: 'John Oludhe', email: 'Oludhe@gmail.com' },
    { name: 'Bob Smith', email: 'bob@gmail.com' },
    { name: 'Cynthia Wanjiru', email: 'cynthia@gmail.com' },
    { name: 'Diana Induli', email: 'diana@gmail.com' },
    { name: 'Ethan Kajala', email: 'ethan@gmail.com' },
    { name: 'Fiona Wangari', email: 'fiona@gmail.com' },
    { name: 'George Ouko', email: 'george@gmail.com' },
    { name: 'Hannah Aoko', email: 'hannah@gmail.com' },
    { name: 'Ian Malcolm', email: 'ian@gmail.com' },
    { name: 'Jessica Wambui', email: 'jessica@gmail.com' }
  ];
  
  return Array.from({ length: 20 }).map((_, index) => ({
    id: `consignment-${index + 1}`,
    traderName: traderNames[index % traderNames.length].name,
    traderEmail: traderNames[index % traderNames.length].email,
    documentType: documentTypes[index % documentTypes.length],
    status: statuses[index % statuses.length] as ConsignmentStatus,
    uploadDate: Timestamp.now(),
    details: {
      declarationNumber: `DCL-${index + 1000}`,
      description: 'Commercial goods',
      estimatedValue: Math.floor(Math.random() * 100000),
      goodsOrdered: ['Item A', 'Item B', 'Item C'],
      goodsStatus: 'In Transit'
    }
  }));
};

// Status Configuration
const STATUS_CONFIG = {
  [ConsignmentStatus.Pending]: {
    icon: FaExclamationTriangle,
    color: 'text-yellow-500 bg-yellow-50',
    bgColor: 'bg-yellow-100'
  },
  [ConsignmentStatus.Approved]: {
    icon: FaCheckCircle,
    color: 'text-green-500 bg-green-50',
    bgColor: 'bg-green-100'
  },
  [ConsignmentStatus.Rejected]: {
    icon: FaTimesCircle,
    color: 'text-red-500 bg-red-50',
    bgColor: 'bg-red-100'
  }
};

// Status Dropdown Component
const StatusDropdown: React.FC<{
  currentStatus: ConsignmentStatus;
  onStatusChange: (newStatus: ConsignmentStatus) => void;
}> = ({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter out current status from dropdown options
  const statusOptions = Object.values(ConsignmentStatus)
    .filter(status => status !== currentStatus);

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`
            inline-flex justify-center w-full px-4 py-2 text-sm font-medium 
            rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75
            ${STATUS_CONFIG[currentStatus].color} 
            ${STATUS_CONFIG[currentStatus].bgColor}
          `}
        >
          <div className="flex items-center">
            {React.createElement(STATUS_CONFIG[currentStatus].icon, {
              className: "mr-2 h-5 w-5"
            })}
            {currentStatus}
            <FaChevronDown className="ml-2 -mr-1 h-4 w-4" />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute z-10 w-full mt-2 origin-top-right bg-white 
              rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <div className="py-1">
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(status);
                    setIsOpen(false);
                  }}
                  className={`
                    group flex items-center w-full px-4 py-2 text-sm 
                    hover:bg-gray-100 transition-colors
                    ${STATUS_CONFIG[status].color}
                  `}
                >
                  {React.createElement(STATUS_CONFIG[status].icon, {
                    className: "mr-3 h-5 w-5"
                  })}
                  {status}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Consignment Card Component
const ConsignmentCard: React.FC<{
  consignment: Consignment;
  onStatusChange: (id: string, status: ConsignmentStatus) => void;
  onViewDetails: (consignment: Consignment) => void;
  isSelected: boolean;
  onSelect: (id: string) => void;
}> = ({ consignment, onStatusChange, onViewDetails, isSelected, onSelect }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-all space-y-4 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={() => onSelect(consignment.id)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">
            {consignment.traderName}
          </h3>
          <p className="text-sm text-gray-500">
            {consignment.documentType}
          </p>
        </div>
        
        <StatusDropdown 
          currentStatus={consignment.status}
          onStatusChange={(newStatus) => 
            onStatusChange(consignment.id, newStatus)
          }
        />
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          {consignment.uploadDate.toDate().toLocaleDateString()}
        </span>
        <button 
          onClick={() => onViewDetails(consignment)}
          className="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <FaEye className="h-5 w-5 mr-1" />
          View Details
        </button>
      </div>
    </motion.div>
  );
};

// Mock data generators
const generateMockActivities = (): Activity[] => {
  return Array.from({ length: 5 }).map((_, index) => ({
    id: `activity-${index}`,
    description: `Activity ${index + 1} description`,
    timestamp: new Date(Date.now() - index * 86400000),
    type: ['status_change', 'document_upload', 'comment', 'review'][index % 4] as Activity['type'],
    userId: `user-${index}`
  }));
};

const generateMockNotifications = (): NotificationType[] => {
  return Array.from({ length: 3 }).map((_, index) => ({
    id: `notification-${index}`,
    message: `Notification ${index + 1} message`,
    timestamp: new Date(Date.now() - index * 3600000),
    read: index > 0,
    type: ['info', 'warning', 'success', 'error'][index % 4] as NotificationType['type']
  }));
};

const generateMockTimelineEvents = (): TimelineEvent[] => {
  return Array.from({ length: 4 }).map((_, index) => ({
    id: `timeline-${index}`,
    title: `Event ${index + 1}`,
    timestamp: new Date(Date.now() - index * 86400000),
    status: Object.values(ConsignmentStatus)[index % 3],
    description: `Timeline event ${index + 1} description`
  }));
};

// Main Dashboard Component
import { useNavigate } from 'react-router-dom';

export const CustomsDashboard: React.FC = () => {
  const { user, signOut } = useAuth(); 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');  // Redirects to home page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Initial State Setup
  const initialState: DashboardState = {
    consignments: generateMockConsignments(),
    filteredConsignments: generateMockConsignments(),
    searchTerm: '',
    statusFilter: null,
    currentPage: 1,
    itemsPerPage: 9,
    selectedConsignment: null,
    selectedItems: [],
    dateRange: {
      start: null,
      end: null
    },
    documentTypeFilter: null,
    valueRange: {
      min: null,
      max: null
    },
    notifications: generateMockNotifications(),
    activities: generateMockActivities(),
    showAdvancedFilters: false,
    timelineEvents: generateMockTimelineEvents()
  };

  // Using Reducer for State Management
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  // Pagination Calculations
  const paginatedConsignments = useMemo(() => {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    return state.filteredConsignments.slice(
      startIndex, 
      startIndex + state.itemsPerPage
    );
  }, [state.filteredConsignments, state.currentPage, state.itemsPerPage]);

  // Handler for changing consignment status
  const handleStatusChange = useCallback((id: string, status: ConsignmentStatus) => {
    dispatch({
      type: 'UPDATE_CONSIGNMENT_STATUS',
      payload: { id, status }
    });
    // Potential side effect for backend sync
  }, []);

  // Handler for selecting consignment details
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<{ name: string; email: string; goodsOrdered: string[]; goodsStatus: string } | null>(null);

  const handleViewDetails = useCallback((consignment: Consignment) => {
    setSelectedTrader({
      name: consignment.traderName,
      email: consignment.traderEmail,
      goodsOrdered: consignment.details?.goodsOrdered || [],
      goodsStatus: consignment.details?.goodsStatus || ''
    });
    setIsModalOpen(true);
  }, []);

  // Enhanced Search Input Component
  const SearchInput: React.FC = () => {
    return (
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400 h-4 w-4" />
        </div>
        <input
          type="text"
          placeholder="Search consignments..."
          value={state.searchTerm}
          onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
          className="
            w-full pl-11 pr-4 py-2.5 
            bg-white border border-gray-200 
            rounded-lg shadow-sm text-sm
            focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-blue-400
            transition-all duration-200
          "
        />
        {state.searchTerm && (
          <button
            onClick={() => dispatch({ type: 'SET_SEARCH_TERM', payload: '' })}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <span className="text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
        )}
      </div>
    );
  };

  // Improved Status Filter Dropdown
  const StatusFilterDropdown: React.FC = () => {
    return (
      <div className="relative">
        <select
          value={state.statusFilter || ''}
          onChange={(e) => dispatch({ 
            type: 'SET_STATUS_FILTER', 
            payload: e.target.value as ConsignmentStatus | null 
          })}
          aria-label="Filter by status"
          name="status-filter"
          className="
            appearance-none w-full pl-4 pr-10 py-2.5
            bg-white border border-gray-200
            rounded-lg shadow-sm text-sm
            focus:outline-none focus:ring-2
            focus:ring-blue-500 focus:border-blue-400
            transition-all duration-200
          "
        >
          <option value="" className="text-sm">All Statuses</option>
          {Object.values(ConsignmentStatus).map(status => (
            <option key={status} value={status} className="text-sm">
              {status}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
          <FaChevronDown className="h-3 w-3 text-gray-500" />
        </div>
      </div>
    );
  };

  const QuickActions: React.FC = () => {
    const handleNewConsignment = () => {
      // Implement new consignment creation logic
    };

    const handleExportData = () => {
      // Implement export functionality
    };

    const handleGenerateReport = () => {
      // Implement report generation
    };

    return (
      <div className="flex flex-wrap gap-4 mb-8">
        <button 
          onClick={handleNewConsignment}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" /> New Consignment
        </button>
        <button 
          onClick={handleExportData}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FaFileExport className="mr-2" /> Export Data
        </button>
        <button 
          onClick={handleGenerateReport}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FaChartBar className="mr-2" /> Generate Report
        </button>
      </div>
    );
  };

  const AnalyticsOverview: React.FC<{ consignments: Consignment[] }> = ({ consignments }) => {
    const chartData = useMemo(() => {
      const statusCounts = Object.values(ConsignmentStatus).reduce((acc, status) => {
        acc[status] = consignments.filter(c => c.status === status).length;
        return acc;
      }, {} as Record<ConsignmentStatus, number>);

      return {
        labels: Object.keys(statusCounts),
        datasets: [
          {
            data: Object.values(statusCounts),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    }, [consignments]);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
          <div className="h-64">
            <Pie data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Processing Timeline</h3>
          <div className="h-64">
            <Line 
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                  {
                    label: 'Processing Time (days)',
                    data: [5, 3, 4, 2, 3, 2],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1,
                  },
                ],
              }}
              options={{ maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    );
  };

  const RecentActivity: React.FC<{ activities: Activity[] }> = ({ activities }) => {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div 
              key={activity.id} 
              className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-md transition-colors"
            >
              <div className="mt-1">
                {activity.type === 'status_change' && (
                  <FaHistory className="w-5 h-5 text-blue-500" />
                )}
                {activity.type === 'document_upload' && (
                  <FaClipboardList className="w-5 h-5 text-green-500" />
                )}
                {activity.type === 'comment' && (
                  <FaUserCircle className="w-5 h-5 text-purple-500" />
                )}
                {activity.type === 'review' && (
                  <FaEye className="w-5 h-5 text-teal-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <FaClock className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-500">
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AdvancedFilters: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="bg-white rounded-lg shadow-sm mb-8">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-6 py-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <FaFilter className="text-gray-400" />
            <span className="font-medium">Advanced Filters</span>
          </div>
          <FaChevronDown
            className={`transform transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date Range
                    </label>
                    <div className="space-y-2">
                      <input
                        type="date"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Start Date"
                      />
                      <input
                        type="date"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="End Date"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
                      Document Type
                    </label>
                    <select 
                      id="documentType"
                      name="documentType"
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">All Types</option>
                      <option value="import">Import</option>
                      <option value="export">Export</option>
                      <option value="transit">Transit</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value Range
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mt-6 gap-3">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    Reset
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const NotificationCenter: React.FC<{ notifications: NotificationType[] }> = ({ notifications }) => {
    const [isOpen, setIsOpen] = useState(false);
    const unreadCount = notifications.filter(n => !n.read).length;

    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
        >
          <FaBell className="w-6 h-6 text-gray-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute bottom-full right-0 mb-2 w-80 bg-white rounded-lg shadow-xl"
            >
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold">Notifications</h3>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <p className="text-sm text-gray-900">{notification.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <FaClock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const BulkActions: React.FC<{
    selectedItems: string[];
    onSelectAll: () => void;
    onAction: (action: string) => void;
  }> = ({ selectedItems, onSelectAll, onAction }) => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedItems.length > 0}
            onChange={onSelectAll}
            className="rounded text-blue-600 focus:ring-blue-500"
            aria-label="Select all items"
          />
          <span className="text-sm text-gray-600">
            {selectedItems.length} selected
          </span>
        </div>
        
        <select
          aria-label="Select bulk action"
          onChange={(e) => onAction(e.target.value)}
          className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
          disabled={selectedItems.length === 0}
        >
          <option value="">Bulk Actions</option>
          <option value="approve">Approve Selected</option>
          <option value="reject">Reject Selected</option>
          <option value="export">Export Selected</option>
        </select>
        
        <button
          disabled={selectedItems.length === 0}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Apply
        </button>
      </div>
    );
  };

  const ConsignmentTimeline: React.FC<{ timelineEvents: TimelineEvent[] }> = ({ timelineEvents }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="text-lg font-semibold mb-4">Processing Timeline</h3>
        <div className="relative">
          <div className="border-l-2 border-blue-200 ml-4 space-y-6">
            {timelineEvents.map((event) => (
              <div key={event.id} className="relative">
                <div className="absolute -left-[9px] mt-2">
                  <div className={`
                    w-4 h-4 rounded-full border-2 border-white
                    ${event.status === ConsignmentStatus.Approved ? 'bg-green-500' :
                      event.status === ConsignmentStatus.Rejected ? 'bg-red-500' :
                      'bg-blue-500'}
                  `} />
                </div>
                <div className="ml-6 pb-6">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <span className="ml-2 text-xs text-gray-500">
                      {event.timestamp.toLocaleDateString()}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Add new handlers
  const handleSelectAll = useCallback(() => {
    const allIds = state.filteredConsignments.map(c => c.id);
    const newSelectedItems = state.selectedItems.length === allIds.length ? [] : allIds;
    dispatch({ type: 'SET_SELECTED_ITEMS', payload: newSelectedItems });
  }, [state.filteredConsignments, state.selectedItems]);

  const handleBulkAction = useCallback((action: string) => {
    switch (action) {
      case 'approve':
        dispatch({ 
          type: 'BULK_UPDATE_STATUS', 
          payload: { ids: state.selectedItems, status: ConsignmentStatus.Approved } 
        });
        break;
      case 'reject':
        dispatch({ 
          type: 'BULK_UPDATE_STATUS', 
          payload: { ids: state.selectedItems, status: ConsignmentStatus.Rejected } 
        });
        break;
      case 'export':
        // Implement export logic
        console.log('Exporting selected items:', state.selectedItems);
        break;
    }
  }, [state.selectedItems]);

  const updateActivityStatus = (activityId: string, newStatus: ActivityStatus) => {
    dispatch({
      type: 'UPDATE_ACTIVITY_STATUS',
      payload: { activityId, newStatus }
    });
  };

  // Call updateActivityStatus when needed, for example, in a button click handler
  const handleActivityStatusChange = (activityId: string, newStatus: ActivityStatus) => {
    updateActivityStatus(activityId, newStatus);
  };

  // Example usage in a button click (add this where appropriate)
  {state.activities.map(activity => (
    <button key={activity.id} onClick={() => handleActivityStatusChange(activity.id, ActivityStatus.Completed)}>
      Mark as Completed
    </button>
  ))}

  // Add a new state for handling QR code data
  // const [qrData, setQrData] = useState<string | null>(null);

  // QR Code Scanner Component
  // const QrCodeScanner: React.FC = () => {
  //   const handleScan = (data: string | null) => {
  //     if (data) {
  //       setQrData(data); // Set the scanned QR code data
  //       console.log('Scanned QR Code:', data); // Handle the scanned data
  //     }
  //   };

  //   const handleError = (err: unknown) => {
  //     console.error(err); // Handle any errors
  //   };

  //   return (
  //     <div className="bg-white p-4 rounded-lg shadow-md">
  //       <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
  //       <QrScanner
  //         onError={handleError}
  //         onScan={handleScan}
  //         style={{ width: '100%' }}
  //       />
  //       {qrData && <p className="mt-2">Scanned Data: {qrData}</p>}
  //     </div>
  //   );
  // };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-grow px-6 py-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {user?.displayName || user?.email?.split('@')[0] || 'Guest'}
            </h1>
            <p className="text-sm text-gray-600">
              Manage and track customs declarations and documents
            </p>
          </div>
          
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Analytics Overview */}
        <AnalyticsOverview consignments={state.consignments} />

        {/* Advanced Filters */}
        <AdvancedFilters />

        {/* Bulk Actions */}
        <BulkActions 
          selectedItems={state.selectedItems}
          onSelectAll={handleSelectAll}
          onAction={handleBulkAction}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Consignments Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <SearchInput />
                <StatusFilterDropdown />
              </div>
            </div>

            {/* Consignments Grid */}
            {paginatedConsignments.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                <div className="text-gray-400 mb-3">
                  <FaClipboardList className="w-8 h-8 mx-auto" />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">No consignments found</h3>
                <p className="text-gray-600 text-sm">
                  Try adjusting your search or filter to find what you're looking for
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {paginatedConsignments.map(consignment => (
                  <ConsignmentCard 
                    key={consignment.id}
                    consignment={consignment}
                    onStatusChange={handleStatusChange}
                    onViewDetails={handleViewDetails}
                    isSelected={state.selectedItems.includes(consignment.id)}
                    onSelect={(id) => dispatch({ type: 'TOGGLE_SELECTED_ITEM', payload: id })}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {paginatedConsignments.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="flex space-x-2" aria-label="Pagination">
                  {Array.from({ 
                    length: Math.ceil(state.filteredConsignments.length / state.itemsPerPage) 
                  }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => dispatch({ type: 'SET_PAGE', payload: index + 1 })}
                      className={`
                        px-3 py-2 text-sm font-medium rounded-md
                        ${state.currentPage === index + 1 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                        }
                        transition-colors duration-200
                      `}
                    >
                      {index + 1}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <RecentActivity activities={state.activities} />
            <ConsignmentTimeline timelineEvents={state.timelineEvents} />
          </div>
        </div>
      </div>

      {/* Notification Center */}
      <NotificationCenter notifications={state.notifications} />

      {/* Footer */}
      <Footer />

      <TraderDetailsModal
        traderName={selectedTrader?.name || ''}
        traderEmail={selectedTrader?.email || ''}
        goodsOrdered={selectedTrader?.goodsOrdered || []}
        goodsStatus={selectedTrader?.goodsStatus || ''}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* <div className="mb-8">
        <QrCodeScanner />
      </div> */}
    </div>
  );
};

export default CustomsDashboard; 