import { auth, firestore } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Define user roles
export type UserRole = 'trader' | 'customs';

// Update the loginUser function type definition
export type LoginUserParams = {
  email: string;
  password: string;
  name: string;
  role: UserRole;
};

export async function loginUser(params: LoginUserParams) {
  try {
    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      params.email, 
      params.password
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

// Keep only the email validation function for potential reuse
export const isValidEmail = (email: string): boolean => {
  // More comprehensive email regex that matches Firebase's validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}; 