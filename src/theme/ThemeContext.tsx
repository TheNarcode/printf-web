'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { darkColors, lightColors, type ThemeColors } from './colors';
import type { ThemeMode } from '../types';

interface ThemeContextValue {
  colors: ThemeColors;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: darkColors,
  mode: 'system',
  isDark: true,
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemIsDark, setSystemIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Restore persisted theme on mount + detect system preference
  useEffect(() => {
    const stored = localStorage.getItem('printf_theme_mode') as ThemeMode | null;
    if (stored) setModeState(stored);

    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    mq.addEventListener('change', handler);
    
    setMounted(true);
    
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isDark = useMemo(() => {
    if (mode === 'system') return systemIsDark;
    return mode === 'dark';
  }, [mode, systemIsDark]);

  // Apply dark/light class to <html> for Tailwind's dark: variant
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }
  }, [isDark]);

  const colors = useMemo(() => (isDark ? darkColors : lightColors), [isDark]);

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem('printf_theme_mode', newMode);
  }, []);

  const value = useMemo(
    () => ({ colors, mode, isDark, setMode }),
    [colors, mode, isDark, setMode],
  );

  return (
    <ThemeContext.Provider value={value}>
      {mounted ? children : null}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
