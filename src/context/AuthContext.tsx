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
import {
  getStoredUser, setStoredUser,
  getStoredIdToken, setStoredIdToken,
  clearAllStorage,
} from '../services/storage';
import { registerFCMToken, setupForegroundListener } from '../services/notifications';

// Google OAuth Web Client ID
// NOTE: Add http://localhost:3000 (and your production domain) to:
//   Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs
//   - Authorized JavaScript origins
//   - Authorized redirect URIs (add: http://localhost:3000/auth/callback)
const GOOGLE_CLIENT_ID = '5347000708-huid8jinh9am79lkn3fvuf8ddisdconv.apps.googleusercontent.com';
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

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

/**
 * Build the Google OAuth redirect URL using implicit flow to get id_token.
 * The id_token is returned in the URL hash after redirect.
 *
 * NOTE about the user's question "does this persist across other sites?":
 * NO — this merely redirects to accounts.google.com where the user selects
 * their account. Our app only receives a time-limited JWT (id_token) specific
 * to our app. Other Google services (Gmail, YouTube etc.) are completely
 * unaffected — we don't get access to them.
 */
function buildGoogleAuthUrl(redirectUri: string): string {
  const nonce = Math.random().toString(36).substring(2, 15);
  // Store nonce to validate on callback
  sessionStorage.setItem('oauth_nonce', nonce);

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: 'id_token',
    scope: 'openid email profile',
    nonce,
    prompt: 'select_account',
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

/** Decode a JWT payload without verification (server will verify) */
function decodeJWTPayload(token: string): Record<string, unknown> {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [foregroundUnsubscribe, setForegroundUnsubscribe] = useState<(() => void) | null>(null);
  const router = useRouter();

  // Restore session from localStorage on mount
  useEffect(() => {
    try {
      const storedUser = getStoredUser();
      const storedToken = getStoredIdToken();
      if (storedUser && storedToken) {
        setUser(storedUser);
        setIdToken(storedToken);
      }
    } catch (e) {
      console.warn('Failed to restore auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register FCM token when authenticated
  useEffect(() => {
    if (!user || !idToken) return;

    const getToken = async () => getStoredIdToken();
    registerFCMToken(getToken);

    return () => {
      if (foregroundUnsubscribe) foregroundUnsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, idToken]);

  /** Handle OAuth callback — called by the /auth/callback page */
  const handleOAuthCallback = useCallback((token: string) => {
    const payload = decodeJWTPayload(token);

    const profile: UserProfile = {
      id: String(payload.sub || ''),
      name: String(payload.name || 'User'),
      email: String(payload.email || ''),
      photo: (payload.picture as string) || null,
    };

    setUser(profile);
    setIdToken(token);
    setStoredUser(profile);
    setStoredIdToken(token);
  }, []);

  // Expose handleOAuthCallback globally for the callback page
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__printfHandleOAuthCallback = handleOAuthCallback;
    return () => {
      delete (window as unknown as Record<string, unknown>).__printfHandleOAuthCallback;
    };
  }, [handleOAuthCallback]);

  // Setup foreground notification listener
  useEffect(() => {
    if (!user || !idToken) return;

    const unsub = setupForegroundListener((title, body, orderId) => {
      // Dispatch a custom event that the layout can listen to for toast
      window.dispatchEvent(new CustomEvent('printf-notification', {
        detail: { title, body, orderId },
      }));
    });
    setForegroundUnsubscribe(() => unsub);

    return () => { unsub(); };
  }, [user, idToken]);

  const signInWithGoogle = useCallback(() => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    const url = buildGoogleAuthUrl(redirectUri);
    window.location.href = url;
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    setIdToken(null);
    clearAllStorage();
    router.push('/print');
  }, [router]);

  const getValidToken = useCallback(async (): Promise<string | null> => {
    // For web, we just return the stored token.
    // Token expiry is typically 1 hour — user will need to re-login.
    const token = getStoredIdToken();
    if (!token) {
      signOut();
      return null;
    }

    // Check if token is expired (Google id_token contains exp claim)
    try {
      const payload = decodeJWTPayload(token);
      const exp = payload.exp as number;
      if (exp && Date.now() / 1000 > exp) {
        console.warn('Token expired, signing out');
        signOut();
        return null;
      }
    } catch {
      // Can't decode, return as-is
    }

    return token;
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
