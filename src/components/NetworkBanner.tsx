'use client';

import React from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useNetwork } from '../context/NetworkContext';
import { useTheme } from '../theme/ThemeContext';

export default function NetworkBanner() {
  const { status } = useNetwork();
  const { colors } = useTheme();

  const visible = status === 'offline' || status === 'back-online';
  const isBackOnline = status === 'back-online';

  const bg = isBackOnline ? colors.successBg : '#3f3f46';
  const border = isBackOnline ? colors.successBorder : '#52525b';
  const color = isBackOnline ? colors.success : '#e4e4e7';

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        className="flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-medium"
        style={{
          backgroundColor: bg,
          borderTop: `1px solid ${border}`,
          color,
        }}
      >
        {isBackOnline ? (
          <Wifi size={13} strokeWidth={2} />
        ) : (
          <WifiOff size={13} strokeWidth={2} />
        )}
        <span>
          {isBackOnline
            ? 'Back online'
            : 'No connection — some features may be limited'}
        </span>
      </div>
    </div>
  );
}
