'use client';

import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CustomAlertAPI } from './AlertContext';

export type NetworkStatus = 'online' | 'offline' | 'back-online';

interface NetworkContextValue {
  isOnline: boolean;
  isOffline: boolean;
  status: NetworkStatus;
  /** Call this before any network action. Returns true if online, shows alert and returns false if offline. */
  assertOnline: (message?: string) => boolean;
}

const NetworkContext = createContext<NetworkContextValue>({
  isOnline: true,
  isOffline: false,
  status: 'online',
  assertOnline: () => true,
});

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<NetworkStatus>('online');
  const backOnlineTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Set real initial state
    if (!navigator.onLine) setStatus('offline');

    const handleOnline = () => {
      setStatus('back-online');
      if (backOnlineTimer.current) clearTimeout(backOnlineTimer.current);
      backOnlineTimer.current = setTimeout(() => setStatus('online'), 2500);
    };

    const handleOffline = () => {
      if (backOnlineTimer.current) {
        clearTimeout(backOnlineTimer.current);
        backOnlineTimer.current = null;
      }
      setStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (backOnlineTimer.current) clearTimeout(backOnlineTimer.current);
    };
  }, []);

  const isOffline = status === 'offline';
  const isOnline = !isOffline;

  const assertOnline = (message = "You're offline. Please connect to the internet to continue.") => {
    if (isOffline) {
      CustomAlertAPI.alert('No Connection', message);
      return false;
    }
    return true;
  };

  return (
    <NetworkContext.Provider value={{ isOnline, isOffline, status, assertOnline }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  return useContext(NetworkContext);
}
