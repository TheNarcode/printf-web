'use client';

import React from 'react';
import { useTheme } from '../../theme/ThemeContext';

export default function Loading() {
  const { colors } = useTheme();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-(--color-background)">
      <div className="w-8 h-8 rounded-full border-[3px] animate-spin" style={{ borderBottomColor: colors.primary, borderLeftColor: colors.primary, borderRightColor: colors.primary, borderTopColor: 'transparent' }} />
      <span className="mt-4 text-sm font-medium" style={{ color: colors.textSecondary }}>Loading...</span>
    </div>
  );
}
