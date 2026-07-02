'use client';

import React from 'react';
import { useTheme } from '../theme/ThemeContext';

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export default function Btn({
  variant = 'solid',
  size = 'md',
  fullWidth = false,
  loading = false,
  children,
  className = '',
  disabled,
  style,
  ...props
}: BtnProps) {
  const { colors } = useTheme();

  const sizeClasses: Record<string, string> = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-5 py-2.5 text-sm rounded-xl',
  };

  const variantStyle: React.CSSProperties = (() => {
    switch (variant) {
      case 'solid':
        return {
          backgroundColor: colors.primary,
          color: colors.background,
          border: `1.5px solid ${colors.primary}`,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: colors.text,
          border: `1.5px solid ${colors.border}`,
        };
      case 'ghost':
        return {
          backgroundColor: colors.surface,
          color: colors.text,
          border: `1.5px solid ${colors.border}`,
        };
      case 'danger':
        return {
          backgroundColor: colors.dangerBg,
          color: colors.danger,
          border: `1.5px solid transparent`,
        };
      default:
        return {};
    }
  })();

  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2.5 font-semibold',
        'transition-all active:scale-[0.97] cursor-pointer',
        'hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed',
        sizeClasses[size],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      style={{ ...variantStyle, ...style }}
      {...props}
    >
      {loading && (
        <div
          className="w-4 h-4 rounded-full border-2 animate-spin flex-shrink-0"
          style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }}
        />
      )}
      {children}
    </button>
  );
}
