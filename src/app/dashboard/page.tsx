'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import HomeScreen from '../../components/screens/HomeScreen';

// ─── Main Print Page ──────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center z-50" style={{ backgroundColor: colors.background }}>
        <div className="w-8 h-8 rounded-full border-[3px] animate-spin" style={{ borderBottomColor: colors.primary, borderLeftColor: colors.primary, borderRightColor: colors.primary, borderTopColor: 'transparent' }} />
        <span className="mt-4 text-sm font-medium" style={{ color: colors.textSecondary }}>Loading...</span>
      </div>
    );
  }

  return <HomeScreen />;
}
