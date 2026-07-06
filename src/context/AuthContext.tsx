'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '../types';
import { registerFCMToken, setupForegroundListener } from '../services/notifications';
import { clearAllStorage } from '../services/storage';
import { getFirebaseAuth } from '../services/firebase';
import { signInWithRedirect, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged, getRedirectResult } from 'firebase/auth';

interface AuthContextValue {
  user: UserProfile | null;
  idToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
  getValidToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  idToken: null,
  isAuthenticated: false,
  isLoading: true,
  signInWithGoogle: () => {},
  signOut: () => {},
  getValidToken: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [foregroundUnsubscribe, setForegroundUnsubscribe] = useState<(() => void) | null>(null);
  const router = useRouter();

  // Restore session via Firebase Auth listener
  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const token = await fbUser.getIdToken();
          setUser({
            id: fbUser.uid,
            name: fbUser.displayName || 'User',
            email: fbUser.email || '',
            photo: fbUser.photoURL || null,
          });
          setIdToken(token);
        } catch (error) {
          console.error("Failed to get Firebase token:", error);
          setUser(null);
          setIdToken(null);
        }
      } else {
        setUser(null);
        setIdToken(null);
      }
      setIsLoading(false);
    });

    // Handle any errors that might have occurred during the redirect flow
    getRedirectResult(auth).catch((error) => {
      console.error("Redirect sign-in error:", error);
    });

    return () => unsubscribe();
  }, []);

  // Register FCM token when authenticated
  useEffect(() => {
    if (!user || !idToken) return;

    const getToken = async () => {
      const auth = getFirebaseAuth();
      return auth?.currentUser ? await auth.currentUser.getIdToken() : null;
    };
    registerFCMToken(getToken);

    return () => {
      if (foregroundUnsubscribe) foregroundUnsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, idToken]);

  // Setup foreground notification listener
  useEffect(() => {
    if (!user || !idToken) return;

    const unsub = setupForegroundListener((title, body, orderId) => {
      window.dispatchEvent(new CustomEvent('printf-notification', {
        detail: { title, body, orderId },
      }));
    });
    setForegroundUnsubscribe(() => unsub);

    return () => { unsub(); };
  }, [user, idToken]);

  const signInWithGoogle = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error('Sign in popup failed:', error);
      
      let message = 'An error occurred during Google Sign-In. Please try again.';
      if (error.code === 'auth/popup-closed-by-user' || error.message?.includes('closed')) {
        message = 'Sign in was cancelled.';
      } else if (error.code === 'auth/cancelled-popup-request') {
        message = 'Sign in is already in progress.';
      }
      
      import('./AlertContext').then(({ CustomAlertAPI }) => {
        CustomAlertAPI.alert('Login Failed', message);
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (auth) {
      await firebaseSignOut(auth);
    }
    setUser(null);
    setIdToken(null);
    clearAllStorage();
    router.push('/');
  }, [router]);

  const getValidToken = useCallback(async (): Promise<string | null> => {
    const auth = getFirebaseAuth();
    if (!auth || !auth.currentUser) return null;
    try {
      // getIdToken(false) gets a valid token, auto-refreshing it if it's expired in the background
      return await auth.currentUser.getIdToken(false);
    } catch {
      signOut();
      return null;
    }
  }, [signOut]);

  const value = useMemo(
    () => ({
      user,
      idToken,
      isAuthenticated: user !== null,
      isLoading,
      signInWithGoogle,
      signOut,
      getValidToken,
    }),
    [user, idToken, isLoading, signInWithGoogle, signOut, getValidToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}
