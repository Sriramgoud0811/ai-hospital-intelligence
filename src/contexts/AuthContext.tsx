/**
 * Authentication Context & Provider
 * Supports real Firebase Authentication with seamless local preview fallback
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { AppUser } from '../types/auth';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
  isDemoMode: boolean;
  signIn: (email: string, pass: string) => Promise<void>;
  signUp: (email: string, pass: string, displayName?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithDemo: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER_STORAGE_KEY = 'ai_hospital_demo_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isDemoMode = !isFirebaseConfigured;

  // Listen to auth state changes
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          setUser({
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || 'Healthcare Professional',
            photoURL: fbUser.photoURL,
            emailVerified: fbUser.emailVerified,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Demo preview mode: read from sessionStorage
      try {
        const stored = sessionStorage.getItem(DEMO_USER_STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } catch {
        // ignore
      }
      setLoading(false);
    }
  }, []);

  const mapFirebaseError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/invalid-email':
        return 'The provided email address format is invalid.';
      case 'auth/user-disabled':
        return 'This clinician account has been deactivated.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email address or password. Please recheck your credentials.';
      case 'auth/email-already-in-use':
        return 'An account with this email address already exists.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 8 characters with numbers and symbols.';
      case 'auth/popup-closed-by-user':
        return 'Google Sign-In popup was closed before completing verification.';
      case 'auth/too-many-requests':
        return 'Access to this account has been temporarily disabled due to many failed attempts. Try again later.';
      default:
        return err?.message || 'An unexpected authentication error occurred.';
    }
  };

  const signIn = async (email: string, pass: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await signInWithEmailAndPassword(auth, email, pass);
      } else {
        // Demo authentication simulation
        await new Promise((resolve) => setTimeout(resolve, 600));
        const demoUser: AppUser = {
          uid: 'demo-clinician-101',
          email,
          displayName: email.split('@')[0].replace('.', ' ') || 'Clinician Demo',
          photoURL: null,
          emailVerified: true,
          createdAt: new Date().toISOString(),
        };
        setUser(demoUser);
        sessionStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
      }
    } catch (err: any) {
      setError(mapFirebaseError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, pass: string, displayName?: string) => {
    setError(null);
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        if (displayName && cred.user) {
          await updateProfile(cred.user, { displayName });
        }
      } else {
        // Demo signup simulation
        await new Promise((resolve) => setTimeout(resolve, 600));
        const demoUser: AppUser = {
          uid: `demo-user-${Date.now()}`,
          email,
          displayName: displayName || email.split('@')[0],
          photoURL: null,
          emailVerified: true,
          createdAt: new Date().toISOString(),
        };
        setUser(demoUser);
        sessionStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
      }
    } catch (err: any) {
      setError(mapFirebaseError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth && googleProvider) {
        await signInWithPopup(auth, googleProvider);
      } else {
        // Demo Google sign-in simulation
        await new Promise((resolve) => setTimeout(resolve, 600));
        const demoUser: AppUser = {
          uid: 'google-demo-clinician',
          email: 'clinician.reviewer@hospital-ai.org',
          displayName: 'Clinical Reviewer (Google Verified)',
          photoURL: null,
          emailVerified: true,
          createdAt: new Date().toISOString(),
        };
        setUser(demoUser);
        sessionStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
      }
    } catch (err: any) {
      setError(mapFirebaseError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured && auth) {
        await fbSignOut(auth);
      } else {
        sessionStorage.removeItem(DEMO_USER_STORAGE_KEY);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setError(null);
    try {
      if (isFirebaseConfigured && auth) {
        await sendPasswordResetEmail(auth, email);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // simulated demo reset
      }
    } catch (err: any) {
      setError(mapFirebaseError(err));
      throw err;
    }
  };

  const signInWithDemo = async () => {
    setError(null);
    const demoUser: AppUser = {
      uid: 'demo-lead-clinician-001',
      email: 'lead.clinician@hospital-demo.org',
      displayName: 'Dr. Sarah Lin (Lead Clinician)',
      photoURL: null,
      emailVerified: true,
      createdAt: new Date().toISOString(),
    };
    setUser(demoUser);
    sessionStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isDemoMode,
        signIn,
        signUp,
        signInWithGoogle,
        signInWithDemo,
        signOut,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
