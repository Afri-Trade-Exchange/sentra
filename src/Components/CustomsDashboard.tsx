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
  FaChevronDown
} from 'react-icons/fa';

// Enhanced Type Definitions
enum ConsignmentStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected'
}

// Interfaces
interface Consignment {
  id: string;
  traderName: string;
  documentType: string;
  status: ConsignmentStatus;
  uploadDate: Timestamp;
  details?: {
    declarationNumber?: string;
    description?: string;
    estimatedValue?: number;
  };
}

// State Interface
interface DashboardState {
  consignments: Consignment[];
  filteredConsignments: Consignment[];
  searchTerm: string;
  statusFilter: ConsignmentStatus | null;
  currentPage: number;
  itemsPerPage: number;
  selectedConsignment: Consignment | null;
}

// Action Types
type DashboardAction = 
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_STATUS_FILTER'; payload: ConsignmentStatus | null }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SELECT_CONSIGNMENT'; payload: Consignment | null }
  | { type: 'UPDATE_CONSIGNMENT_STATUS'; payload: { id: string; status: ConsignmentStatus } };

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
    case 'SET_SEARCH_TERM':
      return {
        ...state,
        searchTerm: action.payload,
        filteredConsignments: filterConsignments(
          state.consignments, 
          action.payload, 
          state.statusFilter
        )
      };
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
    default:
      return state;
  }
};

// Utility function for filtering
const filterConsignments = (
  consignments: Consignment[], 
  searchTerm: string, 
  statusFilter: ConsignmentStatus | null
): Consignment[] => {
  return consignments.filter(consignment => {
    const matchesSearch = searchTerm 
      ? Object.values(consignment).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;
    
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
  
  return Array.from({ length: 20 }).map((_, index) => ({
    id: `consignment-${index + 1}`,
    traderName: `Trader ${index + 1}`,
    documentType: documentTypes[index % documentTypes.length],
    status: statuses[index % statuses.length] as ConsignmentStatus,
    uploadDate: Timestamp.now(),
    details: {
      declarationNumber: `DCL-${index + 1000}`,
      description: 'Commercial goods',
      estimatedValue: Math.floor(Math.random() * 100000)
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
}> = ({ consignment, onStatusChange, onViewDetails }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-all space-y-4"
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

// Main Dashboard Component
export const CustomsDashboard: React.FC = () => {
  // Initial State Setup
  const initialState: DashboardState = {
    consignments: generateMockConsignments(),
    filteredConsignments: generateMockConsignments(),
    searchTerm: '',
    statusFilter: null,
    currentPage: 1,
    itemsPerPage: 9,
    selectedConsignment: null
  };

  // Use Reducer for State Management
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
  const handleViewDetails = useCallback((consignment: Consignment) => {
    dispatch({
      type: 'SELECT_CONSIGNMENT',
      payload: consignment
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Customs Dashboard
      </h1>
      
      {/* Consignment Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedConsignments.map(consignment => (
          <ConsignmentCard 
            key={consignment.id}
            consignment={consignment}
            onStatusChange={handleStatusChange}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center space-x-2 mt-6">
        {Array.from({ 
          length: Math.ceil(
            state.filteredConsignments.length / state.itemsPerPage
          ) 
        }).map((_, index) => (
          <button
            key={index}
            onClick={() => dispatch({ 
              type: 'SET_PAGE', 
              payload: index + 1 
            })}
            className={`px-4 py-2 rounded-md transition-colors ${
              state.currentPage === index + 1 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CustomsDashboard; 