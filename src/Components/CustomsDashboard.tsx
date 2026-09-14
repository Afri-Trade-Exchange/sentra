import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { FaClipboardList } from 'react-icons/fa';
import { collection, addDoc, doc, updateDoc, onSnapshot, writeBatch, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { useAuth } from './AuthContext';
import TraderDetailsModal from './TraderDetailsModal';
import { Activity, Consignment, ConsignmentStatus, DashboardState, NewConsignmentFormData, NotificationType, TimelineEvent } from './CustomsDashboard/types';
import { dashboardReducer } from './CustomsDashboard/reducer';
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
import Card from './ui/Card';
import SectionHeader from './ui/SectionHeader';

const initialState: DashboardState = {
  consignments: [],
  filteredConsignments: [],
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
  showAdvancedFilters: false
};

export const CustomsDashboard: React.FC = () => {
  const { user } = useAuth();

  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'consignments'),
      (snapshot) => {
        const consignments: Consignment[] = snapshot.docs.map((docSnap) => {
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
            createdAt: data.createdAt ?? Timestamp.now(),
          };
        });
        dispatch({ type: 'SET_CONSIGNMENTS', payload: consignments });
        setIsLoading(false);
      },
      (error) => {
        console.error('Failed to load consignments:', error);
        setLoadError('Unable to load consignments right now. Please refresh the page.');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const paginatedConsignments = useMemo(() => {
    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    return state.filteredConsignments.slice(
      startIndex,
      startIndex + state.itemsPerPage
    );
  }, [state.filteredConsignments, state.currentPage, state.itemsPerPage]);

  // Recent activity and the timeline are derived straight from real consignment
  // records (creation + decision events) rather than a separate activity log,
  // since none exists yet.
  const activities = useMemo<Activity[]>(() => {
    const sorted = [...state.consignments].sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    );

    const events: Activity[] = [];
    sorted.forEach((consignment) => {
      events.push({
        id: `${consignment.id}-created`,
        description: `New ${consignment.documentType.toLowerCase()} consignment submitted by ${consignment.traderName}`,
        timestamp: consignment.createdAt.toDate(),
        type: 'document_upload',
        userId: consignment.traderEmail,
      });
      if (consignment.status !== ConsignmentStatus.Pending) {
        events.push({
          id: `${consignment.id}-status`,
          description: `${consignment.traderName}'s consignment was ${consignment.status.toLowerCase()}`,
          timestamp: consignment.createdAt.toDate(),
          type: 'status_change',
          userId: consignment.traderEmail,
        });
      }
    });

    return events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 6);
  }, [state.consignments]);

  const timelineEvents = useMemo<TimelineEvent[]>(() => {
    return [...state.consignments]
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
      .slice(0, 6)
      .map((consignment) => ({
        id: consignment.id,
        title: `${consignment.documentType} — ${consignment.traderName}`,
        timestamp: consignment.createdAt.toDate(),
        status: consignment.status,
        description: consignment.declarationNumber
          ? `Declaration ${consignment.declarationNumber}`
          : consignment.description || 'No description provided',
      }));
  }, [state.consignments]);

  const notifications = useMemo<NotificationType[]>(() => {
    return [...state.consignments]
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
      .slice(0, 5)
      .map((consignment) => ({
        id: consignment.id,
        message: consignment.status === ConsignmentStatus.Pending
          ? `New consignment from ${consignment.traderName} awaiting review`
          : `${consignment.traderName}'s consignment was ${consignment.status.toLowerCase()}`,
        timestamp: consignment.createdAt.toDate(),
        read: consignment.status !== ConsignmentStatus.Pending,
        type: consignment.status === ConsignmentStatus.Approved
          ? 'success'
          : consignment.status === ConsignmentStatus.Rejected
            ? 'error'
            : 'info',
      }));
  }, [state.consignments]);

  const handleStatusChange = useCallback(async (id: string, status: ConsignmentStatus) => {
    dispatch({ type: 'UPDATE_CONSIGNMENT_STATUS', payload: { id, status } });
    try {
      await updateDoc(doc(db, 'consignments', id), { status });
    } catch (error) {
      console.error('Failed to update consignment status:', error);
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState<{ id: string; name: string; email: string; goodsOrdered: string[]; goodsStatus: string } | null>(null);

  const handleViewDetails = useCallback((consignment: Consignment) => {
    setSelectedTrader({
      id: consignment.id,
      name: consignment.traderName,
      email: consignment.traderEmail,
      goodsOrdered: consignment.goodsOrdered,
      goodsStatus: consignment.goodsStatus
    });
    setIsModalOpen(true);
  }, []);

  const handleGoodsStatusChange = useCallback(async (id: string, goodsStatus: string) => {
    try {
      await updateDoc(doc(db, 'consignments', id), { goodsStatus });
    } catch (error) {
      console.error('Failed to update goods status:', error);
    }
  }, []);

  const handleSelectAll = useCallback(() => {
    const allIds = state.filteredConsignments.map(c => c.id);
    const newSelectedItems = state.selectedItems.length === allIds.length ? [] : allIds;
    dispatch({ type: 'SET_SELECTED_ITEMS', payload: newSelectedItems });
  }, [state.filteredConsignments, state.selectedItems]);

  const handleBulkAction = useCallback(async (action: string) => {
    switch (action) {
      case 'approve':
      case 'reject': {
        const status = action === 'approve' ? ConsignmentStatus.Approved : ConsignmentStatus.Rejected;
        dispatch({ type: 'BULK_UPDATE_STATUS', payload: { ids: state.selectedItems, status } });
        try {
          const batch = writeBatch(db);
          state.selectedItems.forEach((id) => {
            batch.update(doc(db, 'consignments', id), { status });
          });
          await batch.commit();
        } catch (error) {
          console.error(`Failed to ${action} selected consignments:`, error);
        }
        break;
      }
      case 'export':
        break;
    }
  }, [state.selectedItems]);

  const handleSubmitNewConsignment = useCallback(async (formData: NewConsignmentFormData) => {
    try {
      await addDoc(collection(db, 'consignments'), {
        traderName: formData.traderName,
        traderEmail: formData.traderEmail,
        documentType: formData.documentType,
        description: formData.description,
        estimatedValue: formData.estimatedValue,
        declarationNumber: '',
        goodsOrdered: formData.goodsOrdered,
        goodsStatus: formData.goodsStatus,
        documents: [],
        status: ConsignmentStatus.Pending,
        createdAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Failed to create consignment:', error);
    }
  }, []);

  if (isLoading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-stone-100">
      <GuidedTour />
      <div className="px-6 py-8 max-w-6xl mx-auto w-full space-y-16">
        <section id="overview" className="scroll-mt-20 space-y-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome, {user?.displayName || user?.email?.split('@')[0] || 'Guest'}
            </h1>
            <p className="text-sm text-gray-600">
              Manage and track your customs declarations and documents
            </p>
          </div>

          {loadError && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {loadError}
            </div>
          )}

          <QuickActions
            consignments={state.consignments}
            selectedItems={state.selectedItems}
            onSubmitNewConsignment={handleSubmitNewConsignment}
          />
        </section>

        <section id="consignments" className="scroll-mt-20 space-y-6">
          <SectionHeader title="Consignments" />

          <AdvancedFilters />

          <BulkActions
            selectedItems={state.selectedItems}
            onSelectAll={handleSelectAll}
            onAction={handleBulkAction}
          />

          <Card>
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
          </Card>

          {paginatedConsignments.length === 0 ? (
            <Card padding="xl" className="text-center">
              <div className="text-gray-400 mb-3">
                <FaClipboardList className="w-8 h-8 mx-auto" />
              </div>
              <h3 className="text-gray-900 font-medium mb-1">No consignments found</h3>
              <p className="text-gray-600 text-sm">
                {state.consignments.length === 0
                  ? 'Consignments submitted by traders will show up here.'
                  : "Try adjusting your search or filter to find what you're looking for"}
              </p>
            </Card>
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
            <div className="flex justify-center pt-2">
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
        </section>

        <section id="analytics" className="scroll-mt-20 space-y-6">
          <SectionHeader title="Analytics" />
          <AnalyticsOverview consignments={state.consignments} />
        </section>

        <section id="activity" className="scroll-mt-20 space-y-6">
          <SectionHeader title="Activity" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity activities={activities} />
            <ConsignmentTimeline timelineEvents={timelineEvents} />
          </div>
        </section>
      </div>

      <NotificationCenter notifications={notifications} />

      <TraderDetailsModal
        traderName={selectedTrader?.name || ''}
        traderEmail={selectedTrader?.email || ''}
        goodsOrdered={selectedTrader?.goodsOrdered || []}
        goodsStatus={selectedTrader?.goodsStatus || ''}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={(status) => {
          if (selectedTrader) handleGoodsStatusChange(selectedTrader.id, status);
        }}
      />

      <HelpButton />
    </div>
  );
};

export default CustomsDashboard;
