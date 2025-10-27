"use client";

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { AppUser } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchUserData = useCallback(async (firebaseUser: User | null) => {
    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser({
          ...firebaseUser,
          name: userData.name,
          role: userData.role,
          approved: userData.approved,
          createdAt: userData.createdAt,
          year: userData.year,
        } as AppUser);
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      fetchUserData(firebaseUser);
    });

    return () => unsubscribe();
  }, [fetchUserData]);
  
  const logout = async () => {
    await auth.signOut();
    setUser(null);
    router.push('/login');
  };

  const refreshUser = useCallback(async () => {
    setLoading(true);
    await fetchUserData(auth.currentUser);
    setLoading(false);
  },[fetchUserData]);

  const value = { user, loading, logout, refreshUser };

  return (
    <AuthContext.Provider value={value}>
        <FirebaseErrorListener />
        {children}
    </AuthContext.Provider>
  );
};
