import { auth, firestore } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile, type User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { FirebaseError } from 'firebase/app';

// Define user roles
export type UserRole = 'trader' | 'customs';

// Update the LoginUserParams type to only include email and password
export type LoginUserParams = {
  email: string;
  password: string;
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
  role: UserRole;
}) => {
  try {
    // Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userData.email,
      userData.password
    );

    if (userData.name) {
      await updateProfile(userCredential.user, { displayName: userData.name });
    }

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

// Resolve the Firestore role for an OAuth-authenticated user (Google, Apple, ...),
// provisioning a trader account on first sign-in (customs officers are provisioned separately).
export async function resolveOAuthUserRole(user: User): Promise<UserRole> {
  const userDocRef = doc(firestore, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data().role as UserRole;
  }

  const role: UserRole = 'trader';
  await setDoc(userDocRef, {
    name: user.displayName || '',
    email: user.email || '',
    role,
    createdAt: new Date()
  });
  return role;
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// Translate Firebase auth error codes into copy safe to show a signing-up user.
// (Login intentionally stays generic — see LoginPage — to avoid leaking whether
// an email is registered; signup errors don't have that concern.)
export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Try signing in instead.';
      case 'auth/invalid-email':
        return 'That email address looks invalid.';
      case 'auth/weak-password':
        return 'Please choose a stronger password (at least 8 characters).';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection and try again.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in was cancelled.';
      default:
        return fallback;
    }
  }
  return fallback;
}

// Keep only the email validation function for potential reuse
export const isValidEmail = (email: string): boolean => {
  // More comprehensive email regex that matches Firebase's validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
}; 