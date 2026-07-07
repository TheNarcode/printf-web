'use client';

import React, { memo } from 'react';
import { Plus } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface FABProps {
  onClick: () => void;
}

const FAB = memo(({ onClick }: FABProps) => {
  const { colors } = useTheme();

  return (
    <button
      onClick={onClick}
      className="fixed bottom-10 right-10 w-14 h-14 rounded-[14px] flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 z-40"
      style={{ backgroundColor: colors.primary }}
      aria-label="New print order"
    >
      <Plus size={22} color={colors.background} strokeWidth={2.5} />
    </button>
  );
});

FAB.displayName = 'FAB';
export default FAB;
