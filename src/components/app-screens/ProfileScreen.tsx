'use client';

import React, { useCallback } from 'react';
import { LogOut, Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { usePrintJob } from '../../context/PrintJobContext';
import { CustomAlertAPI } from '../../context/AlertContext';
import Header from '../Header';
import SpendingSummary from '../SpendingSummary';
import { useAppNav } from '../AppNavigator';
import type { ThemeMode } from '../../types';

const THEME_OPTIONS: { key: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { key: 'light', label: 'Light', Icon: Sun },
  { key: 'dark', label: 'Dark', Icon: Moon },
  { key: 'system', label: 'Auto', Icon: Monitor },
];

export default function ProfileScreen() {
  const { colors, mode, setMode } = useTheme();
  const { user, signOut } = useAuth();
  const { orders } = usePrintJob();
  const { pop, push } = useAppNav();

  const handleSignOut = useCallback(() => {
    CustomAlertAPI.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut() },
    ]);
  }, [signOut]);

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: colors.background }}>
      <Header title="Profile" showBack onBack={pop} />

      <main className="flex-1 overflow-y-auto pb-10">
        <div className="page-container px-5 py-4 flex flex-col gap-6">

          {/* Profile card */}
          <div className="rounded-2xl border p-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0" style={{ backgroundColor: colors.surface }}>
                {user?.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.photo} alt={user.name || 'Profile'} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-bold" style={{ color: colors.text }}>{initial}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold truncate" style={{ color: colors.text }}>{user?.name || 'User'}</p>
                <p className="text-xs truncate" style={{ color: colors.textMuted }}>{user?.email || 'user@example.com'}</p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-70"
                style={{ backgroundColor: colors.dangerBg }}
                aria-label="Sign out"
              >
                <LogOut size={14} color={colors.danger} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* Activity */}
          <div className="flex flex-col gap-2.5">
            <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: colors.textMuted }}>ACTIVITY</p>
            <SpendingSummary orders={orders} />
          </div>

          {/* Appearance */}
          <div className="flex flex-col gap-2.5">
            <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: colors.textMuted }}>APPEARANCE</p>
            <div className="flex rounded-xl p-0.5" style={{ backgroundColor: colors.surface }}>
              {THEME_OPTIONS.map(({ key, label, Icon }) => {
                const active = mode === key;
                return (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg transition-all"
                    style={{
                      backgroundColor: active ? colors.card : 'transparent',
                      boxShadow: active ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    <Icon size={14} color={active ? colors.text : colors.textMuted} strokeWidth={2} />
                    <span className="text-xs" style={{ color: active ? colors.text : colors.textMuted, fontWeight: active ? 600 : 500 }}>
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 flex-wrap" style={{ color: colors.textMuted }}>
            <p className="text-[10px]">printf v1.0.0</p>
            <span className="text-[10px] opacity-40">·</span>
            <button
              onClick={() => push({ id: 'terms', transition: 'push' })}
              className="text-[10px] hover:underline transition-opacity hover:opacity-100 opacity-60"
            >
              Terms
            </button>
            <span className="text-[10px] opacity-40">·</span>
            <button
              onClick={() => push({ id: 'privacy', transition: 'push' })}
              className="text-[10px] hover:underline transition-opacity hover:opacity-100 opacity-60"
            >
              Privacy
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
