'use client';

import { useEffect, useState } from 'react';

export type NetworkStatus = 'online' | 'offline' | 'back-online';

export function useNetworkStatus() {
  const [status, setStatus] = useState<NetworkStatus>('online');

  useEffect(() => {
    // Init from real value once mounted
    if (!navigator.onLine) setStatus('offline');

    let backOnlineTimer: ReturnType<typeof setTimeout> | null = null;

    const handleOnline = () => {
      setStatus('back-online');
      backOnlineTimer = setTimeout(() => setStatus('online'), 2500);
    };

    const handleOffline = () => {
      if (backOnlineTimer) {
        clearTimeout(backOnlineTimer);
        backOnlineTimer = null;
      }
      setStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (backOnlineTimer) clearTimeout(backOnlineTimer);
    };
  }, []);

  return {
    isOnline: status !== 'offline',
    isOffline: status === 'offline',
    status,
  };
}
