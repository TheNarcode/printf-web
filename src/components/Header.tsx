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
  transparent?: boolean;
}

export default function Header({ title, subtitle, showBack, onBack, rightElement, showBrand, transparent = false }: HeaderProps) {
  const { colors } = useTheme();

  return (
    <header
      className={`sticky top-0 z-50 px-6 pt-4 ${transparent ? '' : 'backdrop-blur-md'}`}
      style={transparent ? {
        backgroundColor: 'transparent',
      } : {
        backgroundColor: colors.background + 'EE',
      }}
    >
      <div 
        className={`flex items-center justify-between w-full pb-4 ${transparent ? '' : 'border-b-[1.5px]'}`}
        style={transparent ? {} : { borderColor: colors.border }}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
        {showBack && (
          <button
            onClick={onBack}
            className="p-2 rounded-lg transition-colors  flex-shrink-0"
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
          <span className="text-[10px] font-medium opacity-60" style={{ color: colors.textMuted }}>
            {subtitle}
          </span>
        )}
        {rightElement}
      </div>
      </div>
    </header>
  );
}
