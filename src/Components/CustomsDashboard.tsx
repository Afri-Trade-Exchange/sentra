import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import TraderDetailsModal from './TraderDetailsModal';
import { Consignment, ConsignmentStatus, DashboardState, NewConsignmentFormData } from './CustomsDashboard/types';
import { dashboardReducer } from './CustomsDashboard/reducer';
import {
  generateMockActivities,
  generateMockConsignments,
  generateMockNotifications,
  generateMockTimelineEvents,
} from './CustomsDashboard/mockData';
import ConsignmentCard from './CustomsDashboard/ConsignmentCard';
import SearchInput from './CustomsDashboard/SearchInput';
import StatusFilterDropdown from './CustomsDashboard/StatusFilterDropdown';
import QuickActions from './CustomsDashboard/QuickActions';
import AnalyticsOverview from './CustomsDashboard/AnalyticsOverview';
import RecentActivity from './CustomsDashboard/RecentActivity';
import AdvancedFilters from './CustomsDashboard/AdvancedFilters';
import NotificationCenter from './CustomsDashboard/NotificationCenter';
import BulkActions from './CustomsDashboard/BulkActions';
import ConsignmentTimeline from './CustomsDashboard/ConsignmentTimeline';
import GuidedTour from './CustomsDashboard/GuidedTour';
import LoadingState from './CustomsDashboard/LoadingState';
import HelpButton from './CustomsDashboard/HelpButton';

export const CustomsDashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

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

  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  const paginatedConsignments = useMemo(() => {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    return state.filteredConsignments.slice(
      startIndex,
      startIndex + state.itemsPerPage
    );
  }, [state.filteredConsignments, state.currentPage, state.itemsPerPage]);

  const handleStatusChange = useCallback((id: string, status: ConsignmentStatus) => {
    dispatch({
      type: 'UPDATE_CONSIGNMENT_STATUS',
      payload: { id, status }
    });
  }, []);

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
        console.log('Exporting selected items:', state.selectedItems);
        break;
    }
  }, [state.selectedItems]);

  const handleSubmitNewConsignment = (formData: NewConsignmentFormData) => {
    console.log('New consignment:', formData);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <GuidedTour />
      <div className="flex-grow px-6 py-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {user?.displayName || user?.email?.split('@')[0] || 'Guest'}
            </h1>
            <p className="text-sm text-gray-600">
              Manage and track your customs declarations and documents
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium hover:bg-red-100 transition-colors"
          >
            Logout
          </button>
        </div>

        <QuickActions
          consignments={state.consignments}
          selectedItems={state.selectedItems}
          onSubmitNewConsignment={handleSubmitNewConsignment}
        />

        <AnalyticsOverview consignments={state.consignments} />

        <AdvancedFilters />

        <BulkActions
          selectedItems={state.selectedItems}
          onSelectAll={handleSelectAll}
          onAction={handleBulkAction}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="grid md:grid-cols-2 gap-4">
                <SearchInput
                  searchTerm={state.searchTerm}
                  onSearchChange={(value) => dispatch({ type: 'SET_SEARCH_TERM', payload: value })}
                />
                <StatusFilterDropdown
                  statusFilter={state.statusFilter}
                  onStatusFilterChange={(value) => dispatch({ type: 'SET_STATUS_FILTER', payload: value })}
                />
              </div>
            </div>

            {paginatedConsignments.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
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

            {paginatedConsignments.length > 0 && (
              <div className="flex justify-center mt-8">
                <nav className="flex space-x-2" aria-label="Pagination">
                  {Array.from({
                    length: Math.ceil(state.filteredConsignments.length / state.itemsPerPage)
                  }).map((_, index) => (
                    <button
                      type="button"
                      key={index}
                      onClick={() => dispatch({ type: 'SET_PAGE', payload: index + 1 })}
                      className={`
                        px-3 py-2 text-sm font-medium rounded-xl
                        ${state.currentPage === index + 1
                          ? 'bg-teal-600 text-white'
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

          <div className="space-y-6">
            <RecentActivity activities={state.activities} />
            <ConsignmentTimeline timelineEvents={state.timelineEvents} />
          </div>
        </div>
      </div>

      <NotificationCenter notifications={state.notifications} />

      <TraderDetailsModal
        traderName={selectedTrader?.name || ''}
        traderEmail={selectedTrader?.email || ''}
        goodsOrdered={selectedTrader?.goodsOrdered || []}
        goodsStatus={selectedTrader?.goodsStatus || ''}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <HelpButton />
    </div>
  );
};

export default CustomsDashboard;
