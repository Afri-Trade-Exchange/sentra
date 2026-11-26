import { collection, collectionGroup, doc, onSnapshot, orderBy, query, runTransaction, serverTimestamp, where } from 'firebase/firestore';
import type { Timestamp } from 'firebase/firestore';
import { deleteObject, getBlob, ref, uploadBytes } from 'firebase/storage';
import { auth, db, storage } from './firebaseConfig';

export const MAX_PACKET_FILES = 10;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;
export const PACKET_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];

export type PacketDecision = 'correction_requested' | 'ready_to_file';
export interface DocumentPacket {
  ownerId: string;
  reviewerId: string;
  revisionId: string;
  version: number;
  status: 'submitted' | PacketDecision;
}

export interface PacketRevision {
  id: string;
  ownerId: string;
  reviewerId: string;
  version: number;
  fileNames: string[];
  submittedAt: Timestamp | null;
  decision?: { status: PacketDecision; reason: string; at: Timestamp | null };
}

const packetRef = (id: string) => doc(db, 'consignments', id, 'packet', 'current');
const revisionList = (id: string) => collection(packetRef(id), 'revisions');
const fileRef = (id: string, ownerId: string, revisionId: string, index: number) =>
  ref(storage, `packetFiles/${ownerId}/${id}/${revisionId}/${index}`);

export const watchPacket = (id: string, receive: (packet: DocumentPacket | null) => void, error: (e: Error) => void) =>
  onSnapshot(packetRef(id), (snapshot) => receive(snapshot.exists() ? snapshot.data() as DocumentPacket : null), error);

export const watchPacketRevisions = (id: string, receive: (revisions: PacketRevision[]) => void, error: (e: Error) => void) =>
  onSnapshot(query(revisionList(id), orderBy('version', 'desc')), (snapshot) =>
    receive(snapshot.docs.map((item) => ({ ...item.data(), id: item.id }) as PacketRevision)), error);

export interface AssignedPacket extends Pick<DocumentPacket, 'version' | 'status'> {
  consignmentId: string;
}

export function watchAssignedPackets(
  reviewerId: string, receive: (packets: AssignedPacket[]) => void, error: (e: Error) => void,
) {
  const assigned = query(collectionGroup(db, 'packet'), where('reviewerId', '==', reviewerId));
  return onSnapshot(assigned, (snapshot) => {
    receive(snapshot.docs.flatMap((item) => {
      const [collectionId, consignmentId, packetCollection, packetId, ...tail] = item.ref.path.split('/');
      if (collectionId !== 'consignments' || packetCollection !== 'packet' || packetId !== 'current' || tail.length) {
        return [];
      }
      const { version, status } = item.data() as DocumentPacket;
      return [{ consignmentId, version, status }];
    }));
  }, error);
}

export function validatePacketFiles(files: File[]) {
  if (!files.length || files.length > MAX_PACKET_FILES) throw new Error('Select 1 to 10 files.');
  for (const file of files) {
    if (!PACKET_FILE_TYPES.includes(file.type) || !file.size || file.size > MAX_FILE_BYTES || file.name.length > 200) {
      throw new Error('Use non-empty PDF, JPEG or PNG files up to 10 MB each, with names up to 200 characters.');
    }
  }
}

export async function submitPacket(
  id: string, reviewerId: string, files: File[], expected: DocumentPacket | null,
) {
  const ownerId = auth.currentUser?.uid;
  if (!ownerId) throw new Error('Sign in again to submit documents.');
  if (!/^[^/\s]{1,128}$/.test(reviewerId) || reviewerId === ownerId) {
    throw new Error('Enter the reviewer ID shared by your clearing agent.');
  }
  validatePacketFiles(files);

  const current = packetRef(id);
  const revision = doc(revisionList(id));
  const uploaded: ReturnType<typeof fileRef>[] = [];

  try {
    for (const [index, file] of files.entries()) {
      const destination = fileRef(id, ownerId, revision.id, index);
      uploaded.push(destination);
      await uploadBytes(destination, file, {
        contentType: file.type,
        contentDisposition: 'attachment',
      });
    }

    await runTransaction(db, async (transaction) => {
      const snapshot = await transaction.get(current);
      const packet = snapshot.exists() ? snapshot.data() as DocumentPacket : null;
      if (packet?.revisionId !== expected?.revisionId || (packet && packet.status !== 'correction_requested')) {
        throw new Error('The packet changed. Refresh the review and try again.');
      }
      if (packet && packet.reviewerId !== reviewerId) throw new Error('The assigned reviewer changed.');
      const version = (packet?.version ?? 0) + 1;
      transaction.set(current, { ownerId, reviewerId, revisionId: revision.id, version, status: 'submitted' });
      transaction.set(revision, { ownerId, reviewerId, version, fileNames: files.map((file) => file.name), submittedAt: serverTimestamp() });
    });
  } catch (error) {
    // Storage rules only allow cleaning up unpublished revisions, including if
    // the transaction committed but the client did not receive its response.
    await Promise.allSettled(uploaded.map(deleteObject));
    throw error;
  }
}

export async function reviewPacket(id: string, expected: DocumentPacket, status: PacketDecision, note: string) {
  const reason = note.trim();
  if (reason.length > 1000 || (status === 'correction_requested' && !reason)) {
    throw new Error('Enter a correction note between 1 and 1,000 characters.');
  }
  const current = packetRef(id);
  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(current);
    const packet = snapshot.data() as DocumentPacket | undefined;
    if (!packet || packet.revisionId !== expected.revisionId || packet.status !== 'submitted') {
      throw new Error('This version has already changed. Review the current version.');
    }
    transaction.update(current, { status });
    transaction.update(doc(revisionList(id), packet.revisionId), {
      decision: { status, reason, at: serverTimestamp() },
    });
  });
}

export function downloadPacketFile(id: string, revision: PacketRevision, index: number) {
  return getBlob(fileRef(id, revision.ownerId, revision.id, index), MAX_FILE_BYTES);
}
