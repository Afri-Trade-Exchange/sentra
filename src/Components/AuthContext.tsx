import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, firestore } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import type { UserRole } from '../firebase/authService';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, role: null, signOut: async () => {}, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (nextUser) => {
      setUser(nextUser);

      if (nextUser) {
        try {
          const userDoc = await getDoc(doc(firestore, 'users', nextUser.uid));
          setRole(userDoc.exists() ? (userDoc.data().role as UserRole) : null);
        } catch (error) {
          console.error('Failed to load user role:', error);
          setRole(null);
        }
      } else {
        setRole(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signOut = async () => {
    await auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, role, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
