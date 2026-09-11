import { Timestamp } from 'firebase/firestore';

export enum ConsignmentStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export interface Consignment {
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

export interface Activity {
  id: string;
  description: string;
  timestamp: Date;
  type: 'status_change' | 'document_upload' | 'comment' | 'review';
  userId: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  timestamp: Date;
  status: ConsignmentStatus;
  description: string;
}

export interface NotificationType {
  id: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface DashboardState {
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

export type DashboardAction =
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_STATUS_FILTER'; payload: ConsignmentStatus | null }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SELECT_CONSIGNMENT'; payload: Consignment | null }
  | { type: 'UPDATE_CONSIGNMENT_STATUS'; payload: { id: string; status: ConsignmentStatus } }
  | { type: 'SET_SELECTED_ITEMS'; payload: string[] }
  | { type: 'BULK_UPDATE_STATUS'; payload: { ids: string[]; status: ConsignmentStatus } }
  | { type: 'TOGGLE_SELECTED_ITEM'; payload: string };

export interface NewConsignmentFormData {
  traderName: string;
  traderEmail: string;
  documentType: string;
  description: string;
  estimatedValue: number;
  goodsOrdered: string[];
  goodsStatus: string;
}

export interface QrScannerData {
  consignmentId: string;
  traderName: string;
  traderEmail: string;
  documentType: string;
  goodsStatus: string;
  goodsOrdered: string[];
  estimatedValue: number;
  description: string;
  documents?: { type: string; fileName: string; sizeKb: number }[];
}

export interface ExportSettings {
  format: 'csv' | 'pdf' | 'excel';
  includeFields: string[];
  dateRange?: { start: Date; end: Date };
  orientation?: 'portrait' | 'landscape';
  customFileName?: string;
}

export interface TourStep {
  element: string;
  title: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}
