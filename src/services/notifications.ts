import { API_BASE_URL } from './api';
import { getFCMToken, onForegroundMessage } from './firebase';

/**
 * Request browser notification permission.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const result = await Notification.requestPermission();
  return result === 'granted';
}

/**
 * Get FCM token and register with backend.
 */
export async function registerFCMToken(
  getToken: () => Promise<string | null>,
): Promise<void> {
  try {
    const granted = await requestNotificationPermission();
    if (!granted) {
      console.warn('Notification permission not granted');
      return;
    }

    const fcmToken = await getFCMToken();
    if (!fcmToken) {
      console.warn('Failed to get FCM token — Firebase may not be configured');
      return;
    }

    const authToken = await getToken();
    if (!authToken) {
      console.warn('No auth token available for FCM registration');
      return;
    }

    await fetch(`${API_BASE_URL}/notification/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xxx-auth-token': authToken,
      },
      body: JSON.stringify({ token: fcmToken }),
    });

    console.log('FCM token registered with backend');
  } catch (err) {
    console.error('FCM registration failed:', err);
  }
}

/**
 * Listen for foreground notifications and show in-app toast.
 * Returns an unsubscribe function.
 */
export function setupForegroundListener(
  onNotification: (title: string, body: string, orderId?: string) => void,
): (() => void) {
  const unsubscribe = onForegroundMessage((payload: unknown) => {
    const msg = payload as { notification?: { title?: string; body?: string }; data?: Record<string, string> };
    const title = msg?.notification?.title || 'Notification';
    const body = msg?.notification?.body || '';
    const orderId = msg?.data?.orderId;
    onNotification(title, body, orderId);
  });

  return unsubscribe || (() => {});
}
