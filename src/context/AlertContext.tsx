'use client';

import React, { createContext, useCallback, useContext, useEffect, useState, useRef } from 'react';

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

interface ToastState {
  visible: boolean;
  title: string;
  message: string;
  orderId?: string;
}

interface AlertContextValue {
  alert: (title: string, message: string, buttons?: AlertButton[]) => void;
}

const AlertContext = createContext<AlertContextValue>({ alert: () => {} });

// Global singleton for imperative usage
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

  const [toast, setToast] = useState<ToastState>({
    visible: false, title: '', message: '', orderId: undefined,
  });

  const alert = useCallback((title: string, message: string, buttons?: AlertButton[]) => {
    setState({ visible: true, title, message, buttons: buttons || [{ text: 'OK' }] });
  }, []);

  const alertHistoryRef = useRef(false);

  const hide = useCallback(() => {
    setState(s => ({ ...s, visible: false }));
    if (alertHistoryRef.current) {
      alertHistoryRef.current = false;
      window.history.back();
    }
  }, []);

  useEffect(() => {
    _alertFn = alert;
    
    // Listen for FCM foreground notifications
    const handleNotification = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { title, body, orderId } = customEvent.detail;
      setToast({ visible: true, title: title || 'Notification', message: body || '', orderId });
      
      // Auto-hide toast after 4 seconds
      setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 4000);
    };
    window.addEventListener('printf-notification', handleNotification);
    
    return () => { 
      _alertFn = null; 
      window.removeEventListener('printf-notification', handleNotification);
    };
  }, [alert]);

  useEffect(() => {
    if (!state.visible) return;
    window.history.pushState({ alert: true }, '');
    alertHistoryRef.current = true;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') hide();
    };

    const onPop = () => {
      alertHistoryRef.current = false;
      setState(s => ({ ...s, visible: false }));
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('popstate', onPop);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onPop);
    };
  }, [state.visible, hide]);

  const handleToastClick = useCallback(() => {
    setToast(prev => ({ ...prev, visible: false }));
    if (toast.orderId) {
      window.dispatchEvent(new CustomEvent('printf-open-order', { detail: { orderId: toast.orderId } }));
    }
  }, [toast.orderId]);

  return (
    <AlertContext.Provider value={{ alert }}>
      {children}
      
      {/* Toast Notification (Slide down from top) */}
      <div 
        className="fixed left-0 right-0 z-[9999] flex justify-center px-4 pointer-events-none transition-all duration-300 ease-out"
        style={{ 
          top: toast.visible ? 24 : -100,
          opacity: toast.visible ? 1 : 0
        }}
      >
        <div 
          onClick={handleToastClick}
          className="pointer-events-auto cursor-pointer rounded-2xl shadow-xl border overflow-hidden backdrop-blur-md"
          style={{ 
            width: '100%', maxWidth: 360, 
            backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)' 
          }}
        >
          <div className="px-4 py-3">
            <h4 className="text-sm font-bold truncate" style={{ color: 'var(--color-text)' }}>{toast.title}</h4>
            {toast.message && (
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-text-secondary)' }}>{toast.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Full Screen Alert */}
      {state.visible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-5" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={hide}>
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
                    className="px-4 py-2 rounded-lg text-sm font-semibold transition-opacity "
                    style={{
                      backgroundColor: isCancel ? 'transparent' : isDestructive ? 'var(--color-danger)' : 'var(--color-primary)',
                      color: isCancel ? 'var(--color-text-secondary)' : isDestructive ? '#FFFFFF' : 'var(--color-background)',
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
