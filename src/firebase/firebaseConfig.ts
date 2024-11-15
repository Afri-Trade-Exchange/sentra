import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

//  Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBP5Sidb2-STGpvL3jnh5QFKyCoRKfn858",
  authDomain: "afritrade-4ed4c.firebaseapp.com",

  projectId: "afritrade-4ed4c",
  storageBucket: "afritrade-4ed4c.firebasestorage.app",
  messagingSenderId: "604766264109",
  appId: "1:604766264109:web:20a25856f8071d2800d1a4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const firestore = getFirestore(app); 