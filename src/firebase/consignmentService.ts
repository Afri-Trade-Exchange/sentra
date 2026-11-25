import { collection, onSnapshot, query, Timestamp, where } from 'firebase/firestore';
import type { FirestoreError, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { ConsignmentStatus } from '../types/consignment';
import type { Consignment } from '../types/consignment';

type ConsignmentScope = { all: true; traderId?: never } | { traderId: string; all?: never };

export function mapConsignment(snapshot: Pick<QueryDocumentSnapshot, 'id' | 'data'>): Consignment {
  const data = snapshot.data();
  return {
    id: snapshot.id,
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
    // Pending server timestamps must not break dashboard sorting or charts.
    createdAt: data.createdAt ?? Timestamp.now(),
  };
}

export function subscribeToConsignments(
  scope: ConsignmentScope,
  onData: (consignments: Consignment[]) => void,
  onError: (error: FirestoreError) => void,
) {
  const consignments = collection(db, 'consignments');
  const source = scope.all
    ? consignments
    : query(consignments, where('traderId', '==', scope.traderId));

  return onSnapshot(source, (snapshot) => onData(snapshot.docs.map(mapConsignment)), onError);
}
