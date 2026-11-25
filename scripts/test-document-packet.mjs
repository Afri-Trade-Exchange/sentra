// Run with the Auth, Firestore and Storage emulators for demo-sentra.
import assert from 'node:assert/strict';
import { initializeApp, deleteApp } from 'firebase/app';
import { connectAuthEmulator, createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import {
  collection, connectFirestoreEmulator, doc, getDoc, getDocs, getFirestore, query, serverTimestamp,
  setDoc, terminate, where, writeBatch,
} from 'firebase/firestore';
import { connectStorageEmulator, getBytes, getStorage, ref, uploadBytes } from 'firebase/storage';

const projectId = 'demo-sentra';
const apps = [];
const suffix = Date.now();
const storageMetadata = { contentType: 'application/pdf', contentDisposition: 'attachment' };
const bytes = new TextEncoder().encode('%PDF-1.4\nSentra emulator fixture');

async function account(name, role = 'trader') {
  const app = initializeApp({ projectId, apiKey: 'demo-key', storageBucket: `${projectId}.appspot.com` }, name);
  const db = getFirestore(app);
  apps.push({ app, db });
  const auth = getAuth(app);
  const storage = getStorage(app);
  connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(db, '127.0.0.1', 8080);
  connectStorageEmulator(storage, '127.0.0.1', 9199);
  const { user } = await createUserWithEmailAndPassword(auth, `${name}-${suffix}@example.test`, 'emulator-only');
  if (role === 'customs') {
    const endpoint = `http://127.0.0.1:8080/v1/projects/${projectId}/databases/(default)/documents/users/${user.uid}`;
    const response = await fetch(endpoint, {
      method: 'PATCH',
      headers: { Authorization: 'Bearer owner', 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { role: { stringValue: role } } }),
    });
    assert.equal(response.ok, true, await response.text());
  } else {
    await setDoc(doc(db, 'users', user.uid), { role });
  }
  return { db, storage, uid: user.uid };
}

try {
  const trader = await account('trader');
  const stranger = await account('other-trader');
  const reviewer = await account('reviewer', 'customs');
  const otherReviewer = await account('other-reviewer', 'customs');
  const consignment = doc(collection(trader.db, 'consignments'));
  await setDoc(consignment, { traderId: trader.uid, status: 'Pending' });
  const owned = await getDocs(query(collection(trader.db, 'consignments'), where('traderId', '==', trader.uid)));
  assert.equal(owned.docs[0].id, consignment.id);

  const packet = (account) => doc(account.db, consignment.path, 'packet', 'current');
  const revision = (account, id) => doc(packet(account), 'revisions', id);
  const file = (account, id) => ref(account.storage, `packetFiles/${trader.uid}/${consignment.id}/${id}/0`);
  const versionOne = doc(collection(packet(trader), 'revisions')).id;
  const versionTwo = doc(collection(packet(trader), 'revisions')).id;

  async function submit(id, version) {
    await uploadBytes(file(trader, id), bytes, storageMetadata);
    await assert.rejects(getBytes(file(reviewer, id)), { code: 'storage/unauthorized' });
    const batch = writeBatch(trader.db);
    const parties = { ownerId: trader.uid, reviewerId: reviewer.uid };
    batch.set(packet(trader), { ...parties, revisionId: id, version, status: 'submitted' });
    batch.set(revision(trader, id), { ...parties, version, fileNames: ['invoice.pdf'], submittedAt: serverTimestamp() });
    await batch.commit();
  }

  async function decide(account, id, status, reason) {
    const batch = writeBatch(account.db);
    batch.update(packet(account), { status });
    batch.update(revision(account, id), { decision: { status, reason, at: serverTimestamp() } });
    await batch.commit();
  }

  await submit(versionOne, 1);
  assert.deepEqual(new Uint8Array(await getBytes(file(reviewer, versionOne))), bytes);
  await assert.rejects(getDoc(packet(stranger)), { code: 'permission-denied' });
  await assert.rejects(getDoc(packet(otherReviewer)), { code: 'permission-denied' });
  await assert.rejects(getBytes(file(otherReviewer, versionOne)), { code: 'storage/unauthorized' });
  await assert.rejects(decide(trader, versionOne, 'ready_to_file', ''), { code: 'permission-denied' });
  await assert.rejects(decide(reviewer, versionOne, 'correction_requested', ''), { code: 'permission-denied' });
  await decide(reviewer, versionOne, 'correction_requested', 'Replace the invoice.');
  assert.equal((await getDoc(revision(trader, versionOne))).data().decision.reason, 'Replace the invoice.');

  await submit(versionTwo, 2);
  await assert.rejects(decide(reviewer, versionOne, 'ready_to_file', ''), { code: 'permission-denied' });
  await decide(reviewer, versionTwo, 'ready_to_file', '');
  assert.equal((await getDoc(packet(trader))).data().status, 'ready_to_file');
  assert.equal((await getDocs(collection(packet(reviewer), 'revisions'))).size, 2);
  assert.deepEqual(new Uint8Array(await getBytes(file(reviewer, versionOne))), bytes);
  assert.deepEqual(new Uint8Array(await getBytes(file(reviewer, versionTwo))), bytes);
  console.log('Document packet lifecycle and access rules passed.');
} finally {
  await Promise.all(apps.map(async ({ db, app }) => {
    await terminate(db);
    await deleteApp(app);
  }));
}
