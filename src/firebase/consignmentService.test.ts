import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Timestamp, collection, onSnapshot, query, where } from 'firebase/firestore';
import { mapConsignment, subscribeToConsignments } from './consignmentService';
import { ConsignmentStatus } from '../types/consignment';

vi.mock('./firebaseConfig', () => ({ db: {} }));
vi.mock('firebase/firestore', async (importOriginal) => ({
  ...await importOriginal<typeof import('firebase/firestore')>(),
  collection: vi.fn(() => 'collection'),
  where: vi.fn(() => 'owner-filter'),
  query: vi.fn(() => 'trader-query'),
  onSnapshot: vi.fn(),
}));

describe('consignment data service', () => {
  beforeEach(() => vi.clearAllMocks());

  it('preserves stored fields and takes the ID from the document', () => {
    const data = {
      id: 'untrusted-id', traderName: 'Trader', traderEmail: 'trader@example.com',
      documentType: 'Import', status: ConsignmentStatus.Approved, goodsStatus: 'In transit',
      description: 'Goods', estimatedValue: 1200, declarationNumber: 'DEC-1',
      goodsOrdered: ['Coffee'], documents: [{ type: 'Invoice', fileName: 'invoice.pdf', sizeKb: 12 }],
      createdAt: Timestamp.fromMillis(1000),
    };
    expect(mapConsignment({ id: 'record-1', data: () => data })).toEqual({ ...data, id: 'record-1' });
  });

  it('supplies defaults usable by charts and sorting for incomplete documents', () => {
    const result = mapConsignment({ id: 'pending', data: () => ({ estimatedValue: 0, createdAt: null }) });
    expect(result).toEqual({
      id: 'pending', traderName: '', traderEmail: '', documentType: '',
      status: ConsignmentStatus.Pending, goodsStatus: '', description: '',
      estimatedValue: 0, declarationNumber: '', goodsOrdered: [], documents: [],
      createdAt: expect.any(Timestamp),
    });
    expect(Number.isFinite(result.createdAt.toMillis())).toBe(true);
  });

  it('restricts trader subscriptions by owner UID and returns the cleanup function', () => {
    const cleanup = vi.fn();
    vi.mocked(onSnapshot).mockReturnValue(cleanup);
    const receive = vi.fn();
    const onError = vi.fn();
    expect(subscribeToConsignments({ traderId: 'trader-uid' }, receive, onError)).toBe(cleanup);
    expect(where).toHaveBeenCalledWith('traderId', '==', 'trader-uid');
    expect(query).toHaveBeenCalledWith('collection', 'owner-filter');
    expect(onSnapshot).toHaveBeenCalledWith('trader-query', expect.any(Function), onError);
  });

  it('subscribes customs to the collection and maps snapshot records', () => {
    const receive = vi.fn();
    const onError = vi.fn();
    subscribeToConsignments({ all: true }, receive, onError);
    expect(collection).toHaveBeenCalledWith({}, 'consignments');
    expect(query).not.toHaveBeenCalled();
    expect(onSnapshot).toHaveBeenCalledWith('collection', expect.any(Function), onError);
    const callback = vi.mocked(onSnapshot).mock.calls[0][1] as unknown as
      (snapshot: { docs: { id: string; data: () => object }[] }) => void;
    callback({ docs: [{ id: 'record-1', data: () => ({}) }] });
    expect(receive).toHaveBeenCalledWith([expect.objectContaining({ id: 'record-1', status: 'Pending' })]);
    callback({ docs: [] });
    expect(receive).toHaveBeenLastCalledWith([]);
  });
});
