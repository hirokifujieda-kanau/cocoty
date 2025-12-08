'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';

interface AuthContextType {
  user: User | null;
  idToken: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      
      if (user) {
        try {
          // IDトークンを取得（強制更新）
          const token = await user.getIdToken(true);
          setIdToken(token);
          console.log('✅ Firebase Auth: User signed in', user.email);
        } catch (error) {
          console.error('❌ Failed to get ID token:', error);
          setIdToken(null);
        }
      } else {
        setIdToken(null);
        console.log('⚠️ Firebase Auth: No user signed in');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIdToken(null);
      console.log('✅ User signed out');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      throw error;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      console.log('🔐 Logging in with email:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Login successful:', userCredential.user.email);
      
      // Get ID token
      const token = await userCredential.user.getIdToken(true);
      setIdToken(token);
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw error;
    }
  };

  const handleSignup = async (email: string, password: string) => {
    try {
      console.log('🔐 Creating account with email:', email);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('✅ Signup successful:', userCredential.user.email);
      
      // Get ID token
      const token = await userCredential.user.getIdToken(true);
      setIdToken(token);
    } catch (error: any) {
      console.error('❌ Signup error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      idToken, 
      loading, 
      login: handleLogin,
      signup: handleSignup,
      signOut: handleSignOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * useAuth Hook
 * Firebase認証の状態とIDトークンを取得
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
