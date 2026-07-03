import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getMessaging, getToken, onMessage, type Messaging } from 'firebase/messaging';

/**
 * Firebase web config.
 * Add these to your .env.local file:
 *   NEXT_PUBLIC_FIREBASE_API_KEY=...
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
 *   NEXT_PUBLIC_FIREBASE_APP_ID=...
 *   NEXT_PUBLIC_FIREBASE_VAPID_KEY=...
 *
 * Get these from Firebase Console → Project Settings → General → Your apps (Web app)
 * Get VAPID key from: Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
 */
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let messaging: Messaging | null = null;

function isFirebaseConfigured(): boolean {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.projectId &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
}

export function initFirebase(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (getApps().length > 0) {
    app = getApps()[0];
    return app;
  }
  app = initializeApp(firebaseConfig);
  return app;
}

export function getFirebaseAuth(): Auth | null {
  if (typeof window === 'undefined') return null;
  if (!isFirebaseConfigured()) return null;
  if (auth) return auth;
  const fbApp = initFirebase();
  if (!fbApp) return null;
  try {
    auth = getAuth(fbApp);
    return auth;
  } catch {
    return null;
  }
}

export function getFirebaseMessaging(): Messaging | null {
  if (typeof window === 'undefined') return null;
  if (!isFirebaseConfigured()) return null;
  if (messaging) return messaging;
  const fbApp = initFirebase();
  if (!fbApp) return null;
  try {
    messaging = getMessaging(fbApp);
    return messaging;
  } catch {
    return null;
  }
}

/**
 * Get FCM registration token for web push.
 * Requires notification permission to be granted.
 */
export async function getFCMToken(): Promise<string | null> {
  const m = getFirebaseMessaging();
  if (!m || !VAPID_KEY) return null;

  try {
    // Register the service worker first
    const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    const token = await getToken(m, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
    return token || null;
  } catch (err) {
    console.warn('Failed to get FCM token:', err);
    return null;
  }
}

/**
 * Listen for foreground messages (when tab is open and focused).
 */
export function onForegroundMessage(callback: (payload: unknown) => void): (() => void) | null {
  const m = getFirebaseMessaging();
  if (!m) return null;
  return onMessage(m, callback);
}
