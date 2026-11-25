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
  goodsStatus: string;
  description: string;
  estimatedValue: number;
  declarationNumber: string;
  goodsOrdered: string[];
  documents: { type: string; fileName: string; sizeKb: number }[];
  createdAt: Timestamp;
}

