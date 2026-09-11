import { Consignment, ConsignmentStatus, DashboardAction, DashboardState } from './types';

export const filterConsignments = (
  consignments: Consignment[],
  searchTerm: string,
  statusFilter: ConsignmentStatus | null
): Consignment[] => {
  const normalizedSearchTerm = searchTerm.trim().toLowerCase();

  return consignments.filter(consignment => {
    if (!normalizedSearchTerm) return true;

    const searchableFields = [
      consignment.traderName,
      consignment.documentType,
      consignment.status,
      consignment.details?.declarationNumber,
      consignment.details?.description,
      consignment.details?.estimatedValue?.toString()
    ];

    const matchesSearch = searchableFields.some(field =>
      field && String(field).toLowerCase().includes(normalizedSearchTerm)
    );

    const matchesStatus = statusFilter
      ? consignment.status === statusFilter
      : true;

    return matchesSearch && matchesStatus;
  });
};

export const dashboardReducer = (state: DashboardState, action: DashboardAction): DashboardState => {
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
