import { Timestamp } from 'firebase/firestore';
import { describe, expect, it } from 'vitest';
import { dashboardReducer, filterConsignments } from './reducer';
import { Consignment, ConsignmentStatus, DashboardState } from './types';

const makeConsignment = (overrides: Partial<Consignment> = {}): Consignment => ({
  id: '1',
  traderName: 'Acme Traders',
  traderEmail: 'acme@example.com',
  documentType: 'Import',
  status: ConsignmentStatus.Pending,
  goodsStatus: 'Pending',
  description: 'Assorted electronics',
  estimatedValue: 1000,
  declarationNumber: 'DCL-001',
  goodsOrdered: [],
  documents: [],
  createdAt: Timestamp.now(),
  ...overrides,
});

const baseState: DashboardState = {
  consignments: [],
  filteredConsignments: [],
  searchTerm: '',
  statusFilter: null,
  currentPage: 1,
  itemsPerPage: 10,
  selectedConsignment: null,
  selectedItems: [],
  dateRange: { start: null, end: null },
  documentTypeFilter: null,
  valueRange: { min: null, max: null },
  showAdvancedFilters: false,
};

describe('filterConsignments', () => {
  const consignments = [
    makeConsignment({ id: '1', traderName: 'Acme Traders', status: ConsignmentStatus.Pending }),
    makeConsignment({ id: '2', traderName: 'Beta Logistics', status: ConsignmentStatus.Approved, description: 'Steel beams' }),
    makeConsignment({ id: '3', traderName: 'Gamma Freight', status: ConsignmentStatus.Rejected, declarationNumber: 'DCL-999' }),
  ];

  it('returns everything when there is no search term or status filter', () => {
    expect(filterConsignments(consignments, '', null)).toHaveLength(3);
  });

  it('matches search term case-insensitively across searchable fields', () => {
    expect(filterConsignments(consignments, 'beta', null).map((c) => c.id)).toEqual(['2']);
    expect(filterConsignments(consignments, 'steel beams', null).map((c) => c.id)).toEqual(['2']);
    expect(filterConsignments(consignments, 'dcl-999', null).map((c) => c.id)).toEqual(['3']);
  });

  it('ignores leading/trailing whitespace in the search term', () => {
    expect(filterConsignments(consignments, '  acme  ', null).map((c) => c.id)).toEqual(['1']);
  });

  it('filters by status', () => {
    expect(filterConsignments(consignments, '', ConsignmentStatus.Approved).map((c) => c.id)).toEqual(['2']);
  });

  it('combines search term and status filter', () => {
    expect(filterConsignments(consignments, 'gamma', ConsignmentStatus.Approved)).toHaveLength(0);
    expect(filterConsignments(consignments, 'gamma', ConsignmentStatus.Rejected).map((c) => c.id)).toEqual(['3']);
  });
});

describe('dashboardReducer', () => {
  it('SET_CONSIGNMENTS stores consignments and re-derives the filtered list', () => {
    const consignments = [makeConsignment({ id: '1' }), makeConsignment({ id: '2', traderName: 'Other' })];
    const state = { ...baseState, searchTerm: 'other' };
    const next = dashboardReducer(state, { type: 'SET_CONSIGNMENTS', payload: consignments });

    expect(next.consignments).toEqual(consignments);
    expect(next.filteredConsignments.map((c) => c.id)).toEqual(['2']);
  });

  it('SET_SEARCH_TERM updates the term, re-filters, and resets to page 1', () => {
    const consignments = [makeConsignment({ id: '1' }), makeConsignment({ id: '2', traderName: 'Other' })];
    const state = { ...baseState, consignments, filteredConsignments: consignments, currentPage: 3 };
    const next = dashboardReducer(state, { type: 'SET_SEARCH_TERM', payload: 'other' });

    expect(next.searchTerm).toBe('other');
    expect(next.currentPage).toBe(1);
    expect(next.filteredConsignments.map((c) => c.id)).toEqual(['2']);
  });

  it('SET_STATUS_FILTER updates the filter and re-filters', () => {
    const consignments = [
      makeConsignment({ id: '1', status: ConsignmentStatus.Pending }),
      makeConsignment({ id: '2', status: ConsignmentStatus.Approved }),
    ];
    const state = { ...baseState, consignments, filteredConsignments: consignments };
    const next = dashboardReducer(state, { type: 'SET_STATUS_FILTER', payload: ConsignmentStatus.Approved });

    expect(next.statusFilter).toBe(ConsignmentStatus.Approved);
    expect(next.filteredConsignments.map((c) => c.id)).toEqual(['2']);
  });

  it('UPDATE_CONSIGNMENT_STATUS updates a single consignment in both lists', () => {
    const consignments = [makeConsignment({ id: '1', status: ConsignmentStatus.Pending })];
    const state = { ...baseState, consignments, filteredConsignments: consignments };
    const next = dashboardReducer(state, {
      type: 'UPDATE_CONSIGNMENT_STATUS',
      payload: { id: '1', status: ConsignmentStatus.Approved },
    });

    expect(next.consignments[0].status).toBe(ConsignmentStatus.Approved);
    expect(next.filteredConsignments[0].status).toBe(ConsignmentStatus.Approved);
  });

  it('BULK_UPDATE_STATUS updates only the matching ids', () => {
    const consignments = [
      makeConsignment({ id: '1', status: ConsignmentStatus.Pending }),
      makeConsignment({ id: '2', status: ConsignmentStatus.Pending }),
      makeConsignment({ id: '3', status: ConsignmentStatus.Pending }),
    ];
    const state = { ...baseState, consignments, filteredConsignments: consignments };
    const next = dashboardReducer(state, {
      type: 'BULK_UPDATE_STATUS',
      payload: { ids: ['1', '3'], status: ConsignmentStatus.Rejected },
    });

    expect(next.consignments.map((c) => c.status)).toEqual([
      ConsignmentStatus.Rejected,
      ConsignmentStatus.Pending,
      ConsignmentStatus.Rejected,
    ]);
  });

  it('TOGGLE_SELECTED_ITEM adds then removes an id', () => {
    const added = dashboardReducer(baseState, { type: 'TOGGLE_SELECTED_ITEM', payload: '1' });
    expect(added.selectedItems).toEqual(['1']);

    const removed = dashboardReducer(added, { type: 'TOGGLE_SELECTED_ITEM', payload: '1' });
    expect(removed.selectedItems).toEqual([]);
  });

  it('SET_PAGE and SELECT_CONSIGNMENT update their respective fields', () => {
    const consignment = makeConsignment({ id: '1' });
    expect(dashboardReducer(baseState, { type: 'SET_PAGE', payload: 4 }).currentPage).toBe(4);
    expect(
      dashboardReducer(baseState, { type: 'SELECT_CONSIGNMENT', payload: consignment }).selectedConsignment
    ).toEqual(consignment);
  });

  it('returns the same state for an unknown action', () => {
    // @ts-expect-error intentionally invalid action to verify the default branch
    expect(dashboardReducer(baseState, { type: 'NOT_REAL' })).toBe(baseState);
  });
});
