'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

interface AlertState {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
}

interface AlertContextValue {
  alert: (title: string, message: string, buttons?: AlertButton[]) => void;
}

const AlertContext = createContext<AlertContextValue>({ alert: () => {} });

// Global singleton for imperative usage (like RN's CustomAlertAPI)
let _alertFn: ((title: string, message: string, buttons?: AlertButton[]) => void) | null = null;

export const CustomAlertAPI = {
  alert: (title: string, message: string, buttons?: AlertButton[]) => {
    _alertFn?.(title, message, buttons);
  },
};

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AlertState>({
    visible: false, title: '', message: '', buttons: [],
  });

  const alert = useCallback((title: string, message: string, buttons?: AlertButton[]) => {
    setState({ visible: true, title, message, buttons: buttons || [{ text: 'OK' }] });
  }, []);

  useEffect(() => {
    _alertFn = alert;
    
    // Listen for FCM foreground notifications
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { title, body } = customEvent.detail;
      alert(title || 'Notification', body || '');
    };
    window.addEventListener('printf-notification', handleNotification);
    
    return () => { 
      _alertFn = null; 
      window.removeEventListener('printf-notification', handleNotification);
    };
  }, [alert]);

  const hide = useCallback(() => setState(s => ({ ...s, visible: false })), []);

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      {state.visible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div
            className="w-full rounded-2xl border p-6 shadow-2xl"
            style={{
              maxWidth: 360,
              backgroundColor: 'var(--color-card)',
              borderColor: 'var(--color-border)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--color-text)' }}>
              {state.title}
            </h3>
            {state.message && (
              <p className="text-sm leading-6 mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                {state.message}
              </p>
            )}
            <div className="flex justify-end gap-3">
              {state.buttons.map((btn, idx) => {
                const isCancel = btn.style === 'cancel';
                const isDestructive = btn.style === 'destructive';
                return (
                  <button
                    key={idx}
                    onClick={() => { hide(); if (btn.onPress) setTimeout(btn.onPress, 50); }}
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: isCancel ? 'transparent' : isDestructive ? 'var(--color-danger)' : 'var(--color-primary)',
                      color: isCancel ? 'var(--color-text-secondary)' : 'var(--color-background)',
                    }}
                  >
                    {btn.text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  return useContext(AlertContext);
}
