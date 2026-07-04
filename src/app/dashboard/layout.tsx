'use client';

import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

export type ScreenId = 'home' | 'orders' | 'order_detail' | 'profile' | 'terms' | 'privacy' | 'upload' | 'settings' | 'payment';
export interface AppScreen { id: ScreenId; transition?: 'push' | 'modal'; params?: any; }

const AppNavContext = createContext({
  push: (screen: AppScreen) => {},
  pop: () => {},
  reset: () => {}
});

export function useAppNav() { return useContext(AppNavContext); }

import { useTheme } from '../../theme/ThemeContext';

export function AppNavigatorProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { colors } = useTheme();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [isNavigating, setIsNavigating] = useState(false);
  const minLoadingTimeRef = useRef(0);

  useEffect(() => {
    const now = Date.now();
    const timeToWait = Math.max(0, minLoadingTimeRef.current - now);
    if (timeToWait > 0) {
      const timer = setTimeout(() => setIsNavigating(false), timeToWait);
      return () => clearTimeout(timer);
    } else {
      setIsNavigating(false);
    }
  }, [pathname, searchParams]);

  const triggerNav = () => {
    setIsNavigating(true);
    minLoadingTimeRef.current = Date.now() + 200;
  };
  
  const push = useCallback((screen: AppScreen) => {
    triggerNav();
    let url = '/dashboard';
    if (screen.id !== 'home') {
      if (screen.id === 'order_detail') url = `/dashboard/orders/${screen.params.orderId}`;
      else url = `/dashboard/${screen.id}`;
    }
    
    if (screen.params && screen.id !== 'order_detail') {
      const q = new URLSearchParams(screen.params as Record<string, string>).toString();
      if (q) url += `?${q}`;
    }
    
    router.push(url);
  }, [router]);

  const pop = useCallback(() => {
    triggerNav();
    router.back();
  }, [router]);
  
  const reset = useCallback(() => {
    triggerNav();
    router.push('/dashboard');
  }, [router]);

  return (
    <AppNavContext.Provider value={{ push, pop, reset }}>
      {children}
      {isNavigating && (
        <div className="absolute inset-0 z-[100] flex flex-col items-center justify-center bg-(--color-background) bg-opacity-80 backdrop-blur-sm">
          <div className="w-8 h-8 rounded-full border-[3px] border-t-transparent animate-spin border-(--color-primary)" />
          <span className="mt-4 text-sm font-medium" style={{ color: colors.textSecondary }}>Loading...</span>
        </div>
      )}
    </AppNavContext.Provider>
  );
}

function DeepLinkHandler() {
  const { push } = useAppNav();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    
    if (orderId) {
      window.history.replaceState({}, '', '/dashboard' + window.location.hash);
      setTimeout(() => {
        push({ id: 'order_detail', transition: 'push', params: { orderId } });
      }, 50);
    }
  }, [push]);

  return null;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppNavigatorProvider>
      <DeepLinkHandler />
      <div className="flex-1 flex flex-col relative w-full h-[100dvh] overflow-hidden">
        {children}
      </div>
    </AppNavigatorProvider>
  );
}
