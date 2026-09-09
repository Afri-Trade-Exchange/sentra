import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

//  Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBP5Sidb2-STGpvL3jnh5QFKyCoRKfn858",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "afritrade-4ed4c.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "afritrade-4ed4c",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "afritrade-4ed4c.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "604766264109",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:604766264109:web:20a25856f8071d2800d1a4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app); 