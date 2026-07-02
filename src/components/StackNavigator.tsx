'use client';

import React, {
  createContext, useCallback, useContext, useRef, useState,
} from 'react';

type ScreenName = 'upload' | 'settings' | 'payment';

interface StackFrame {
  name: ScreenName;
  key: string;
}

interface StackCtx {
  push: (screen: ScreenName) => void;
  pop: () => void;
}

const StackContext = createContext<StackCtx>({ push: () => {}, pop: () => {} });

export function useStackNav() {
  return useContext(StackContext);
}

interface StackNavigatorProps {
  screens: Record<ScreenName, React.ReactNode>;
  initialScreen: ScreenName;
}

export function StackNavigator({ screens, initialScreen }: StackNavigatorProps) {
  const [stack, setStack] = useState<StackFrame[]>([
    { name: initialScreen, key: `${initialScreen}-0` },
  ]);
  const containerRef = useRef<HTMLDivElement>(null);
  const animating = useRef(false);

  const getEl = useCallback((key: string) =>
    containerRef.current?.querySelector<HTMLElement>(`[data-key="${key}"]`), []);

  const push = useCallback((screen: ScreenName) => {
    if (animating.current) return;
    animating.current = true;

    const newFrame: StackFrame = { name: screen, key: `${screen}-${Date.now()}` };

    setStack(prev => {
      const outgoing = prev[prev.length - 1];

      // After React renders the new screen (enters at translateX(100%)), trigger transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const inEl = getEl(newFrame.key);
          const outEl = getEl(outgoing.key);
          if (inEl) inEl.dataset.state = 'active';
          if (outEl) outEl.dataset.state = 'behind';
          setTimeout(() => { animating.current = false; }, 560);
        });
      });

      return [...prev, newFrame];
    });
  }, [getEl]);

  const pop = useCallback(() => {
    if (animating.current) return;

    setStack(prev => {
      if (prev.length <= 1) return prev;
      animating.current = true;

      const outgoing = prev[prev.length - 1];
      const incoming = prev[prev.length - 2];

      requestAnimationFrame(() => {
        const outEl = getEl(outgoing.key);
        const inEl = getEl(incoming.key);
        if (outEl) outEl.dataset.state = 'exit';
        if (inEl) inEl.dataset.state = 'active';
      });

      // Remove after animation finishes
      setTimeout(() => {
        setStack(s => s.length > 1 ? s.slice(0, -1) : s);
        animating.current = false;
      }, 560);

      return prev; // keep in DOM during animation
    });
  }, [getEl]);

  return (
    <StackContext.Provider value={{ push, pop }}>
      <div
        ref={containerRef}
        style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
      >
        {stack.map((frame, idx) => {
          const isTop = idx === stack.length - 1;
          const initialState = idx === 0 ? 'active' : (isTop ? 'enter' : 'behind');
          return (
            <div
              key={frame.key}
              data-key={frame.key}
              data-state={initialState}
              style={{ position: 'absolute', inset: 0, zIndex: idx + 1 }}
              className="stack-screen"
            >
              {screens[frame.name]}
            </div>
          );
        })}
      </div>
    </StackContext.Provider>
  );
}
