import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';

export async function sendContactMessage(message: { name: string; email: string; message: string }) {
  await addDoc(collection(db, 'contactMessages'), { ...message, createdAt: Timestamp.now() });
}
