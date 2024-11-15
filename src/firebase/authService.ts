import { auth, firestore } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Define user roles
export type UserRole = 'trader' | 'customs';

// Update login function to return role
export const loginUser = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    // Fetch user document to get role
    const userDoc = await getDoc(
      doc(firestore, 'users', userCredential.user.uid)
    );
    
    if (userDoc.exists()) {
      return userDoc.data().role as UserRole;
    }
    
    throw new Error('User role not found');
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Update signup function to set role
export const signupUser = async (userData: {
  email: string;
  password: string;
  name: string;
  role: UserRole
}) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    // Create user document in Firestore with role
    await setDoc(
      doc(firestore, 'users', userCredential.user.uid), 
      {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: new Date()
      }
    );
    
    return userData.role;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
}; 