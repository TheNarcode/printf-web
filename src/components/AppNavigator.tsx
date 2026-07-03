'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScreenId =
  | 'home'
  | 'orders'
  | 'order_detail'
  | 'profile'
  | 'terms'
  | 'privacy'
  | 'upload'
  | 'settings'
  | 'payment';

export type TransitionType = 'push' | 'modal';

export interface AppScreen {
  id: ScreenId;
  transition: TransitionType;
  params?: { filter?: string; orderId?: string };
}

export interface NavFrame {
  screen: AppScreen;
  key: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppNavCtx {
  push: (screen: AppScreen) => void;
  pop: () => void;
  reset: () => void;
  currentScreen: AppScreen;
}

const AppNavContext = createContext<AppNavCtx>({
  push: () => {},
  pop: () => {},
  reset: () => {},
  currentScreen: { id: 'home', transition: 'push' },
});

export function useAppNav(): AppNavCtx {
  return useContext(AppNavContext);
}

// ─── Navigator ────────────────────────────────────────────────────────────────

const DURATION = 0.5;

interface AppNavigatorProps {
  renderScreen: (frame: NavFrame) => React.ReactNode;
}

export function AppNavigator({ renderScreen }: AppNavigatorProps) {
  const [stack, setStack] = useState<NavFrame[]>([
    { screen: { id: 'home', transition: 'push' }, key: 'home-root' },
  ]);
  const animating = useRef(false);

  const push = useCallback((screen: AppScreen) => {
    if (animating.current) return;
    animating.current = true;
    const newKey = `${screen.id}-${Date.now()}`;
    setStack(prev => [...prev, { screen, key: newKey }]);
    setTimeout(() => { animating.current = false; }, DURATION * 1000 + 50);
  }, []);

  const pop = useCallback(() => {
    if (animating.current || stack.length <= 1) return;
    animating.current = true;
    setStack(prev => prev.slice(0, prev.length - 1));
    setTimeout(() => { animating.current = false; }, DURATION * 1000 + 50);
  }, [stack.length]);

  const reset = useCallback(() => {
    if (animating.current) return;
    animating.current = true;
    setStack([{ screen: { id: 'home', transition: 'push' }, key: `home-root-${Date.now()}` }]);
    setTimeout(() => { animating.current = false; }, DURATION * 1000 + 50);
  }, []);

  return (
    <AppNavContext.Provider value={{ push, pop, reset, currentScreen: stack[stack.length - 1].screen }}>
      <div className="relative w-full h-[100dvh] overflow-hidden bg-black">
        <AnimatePresence>
          {stack.map((frame, index) => {
            const isRoot = index === 0;

            return (
              <motion.div
                key={frame.key}
                className="absolute inset-0 overflow-hidden bg-[var(--color-background)]"
                style={{ zIndex: index }}
                initial={isRoot ? false : { x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', ease: 'easeInOut', duration: DURATION }}
              >
                {renderScreen(frame)}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </AppNavContext.Provider>
  );
}
