'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScreenId =
  | 'home'
  | 'orders'
  | 'order_detail'
  | 'profile'
  | 'terms'
  | 'privacy';

export type TransitionType = 'push' | 'modal';
export type DataState = 'enter' | 'active' | 'behind-push' | 'behind-modal' | 'exit';

export interface AppScreen {
  id: ScreenId;
  transition: TransitionType;
  params?: { filter?: string; orderId?: string };
}

export interface NavFrame {
  screen: AppScreen;
  key: string;
  state: DataState;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppNavCtx {
  push: (screen: AppScreen) => void;
  pop: () => void;
  currentScreen: AppScreen;
}

const AppNavContext = createContext<AppNavCtx>({
  push: () => {},
  pop: () => {},
  currentScreen: { id: 'home', transition: 'push' },
});

export function useAppNav(): AppNavCtx {
  return useContext(AppNavContext);
}

// ─── Navigator ────────────────────────────────────────────────────────────────

const ANIM_MS = 500;

function getBehindState(topTransition: TransitionType): DataState {
  return topTransition === 'modal' ? 'behind-modal' : 'behind-push';
}

interface AppNavigatorProps {
  renderScreen: (frame: NavFrame) => React.ReactNode;
}

export function AppNavigator({ renderScreen }: AppNavigatorProps) {
  const [stack, setStack] = useState<NavFrame[]>([
    { screen: { id: 'home', transition: 'push' }, key: 'home-root', state: 'active' },
  ]);
  const animating = useRef(false);

  const push = useCallback((screen: AppScreen) => {
    if (animating.current) return;
    animating.current = true;

    const newKey = `${screen.id}-${Date.now()}`;
    const behindState = getBehindState(screen.transition);

    // Step 1: add new frame as 'enter', move current top to 'behind-*'
    setStack(prev => [
      ...prev.map((f, i) =>
        i === prev.length - 1 ? { ...f, state: behindState } : f,
      ),
      { screen, key: newKey, state: 'enter' as DataState },
    ]);

    // Step 2: after enter state is painted, transition to active
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setStack(prev =>
          prev.map((f, i) =>
            i === prev.length - 1 ? { ...f, state: 'active' as DataState } : f,
          ),
        );
        setTimeout(() => { animating.current = false; }, ANIM_MS);
      });
    });
  }, []);

  const pop = useCallback(() => {
    if (animating.current) return;

    setStack(prev => {
      if (prev.length <= 1) return prev;
      animating.current = true;

      const updated = prev.map((f, i) => {
        if (i === prev.length - 1) return { ...f, state: 'exit' as DataState };
        if (i === prev.length - 2) return { ...f, state: 'active' as DataState };
        return f;
      });

      setTimeout(() => {
        setStack(s => (s.length > 1 ? s.slice(0, -1) : s));
        animating.current = false;
      }, ANIM_MS + 60);

      return updated;
    });
  }, []);

  const currentScreen = useMemo(() => stack[stack.length - 1].screen, [stack]);
  const value = useMemo(() => ({ push, pop, currentScreen }), [push, pop, currentScreen]);

  return (
    <AppNavContext.Provider value={value}>
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden' }}>
        {stack.map((frame, idx) => (
          <div
            key={frame.key}
            className="app-screen"
            data-state={frame.state}
            data-transition={frame.screen.transition}
            style={{ zIndex: idx + 1 }}
          >
            {renderScreen(frame)}
          </div>
        ))}
      </div>
    </AppNavContext.Provider>
  );
}
