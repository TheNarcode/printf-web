'use client';

import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
  showBrand?: boolean;
}

export default function Header({ title, subtitle, showBack, onBack, rightElement, showBrand }: HeaderProps) {
  const { colors } = useTheme();

  return (
    <header
      className="flex items-center justify-between px-6 py-4 border-b sticky top-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: colors.background + 'EE',
        borderColor: colors.border,
      }}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-lg transition-colors hover:opacity-70 flex-shrink-0"
            style={{ color: colors.text }}
            aria-label="Go back"
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
        )}
        {showBrand ? (
          <div className="flex items-center gap-2">
            <Printer size={18} strokeWidth={1.8} style={{ color: colors.text }} />
            <span className="text-lg font-bold tracking-tight" style={{ color: colors.text }}>
              printf
            </span>
          </div>
        ) : title ? (
          <span className="text-lg font-semibold truncate" style={{ color: colors.text }}>
            {title}
          </span>
        ) : null}
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {subtitle && (
          <span className="text-xs font-medium opacity-60" style={{ color: colors.textMuted }}>
            {subtitle}
          </span>
        )}
        {rightElement}
      </div>
    </header>
  );
}
