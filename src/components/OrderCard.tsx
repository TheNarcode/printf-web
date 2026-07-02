'use client';

import React, { memo } from 'react';
import { FileText, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import type { Order } from '../types';
import { formatDateTime, formatTime } from '../utils/formatters';

interface OrderCardProps {
  order: Order;
  onPress: (order: Order) => void;
  variant?: 'home' | 'list';
}

export const getStatusStyle = (status: number, colors: Record<string, string>) => {
  switch (status) {
    case 0: return { bg: colors.warningBg, text: colors.warning, border: colors.warningBorder, dot: colors.warning, label: 'Pending' };
    case 1: return { bg: colors.successBg, text: colors.success, border: colors.successBorder, dot: colors.success, label: 'Completed' };
    case 2: return { bg: colors.dangerBg, text: colors.danger, border: colors.dangerBorder, dot: colors.danger, label: 'Error' };
    case 3: return { bg: colors.collectedBg, text: colors.collected, border: colors.collectedBorder, dot: colors.collected, label: 'Collected' };
    default: return { bg: colors.surface, text: colors.textMuted, border: colors.border, dot: colors.textMuted, label: 'Unknown' };
  }
};

const OrderCard = memo(({ order, onPress, variant = 'list' }: OrderCardProps) => {
  const { colors } = useTheme();
  const statusStyle = getStatusStyle(order.status, colors);
  const firstFile = order.files[0]?.file;
  const isImage = firstFile?.type.includes('image');
  const Icon = order.status === 2 ? AlertTriangle : isImage ? ImageIcon : FileText;
  const iconBg = order.status === 2 ? colors.dangerBg : colors.primaryBg;
  const iconColor = order.status === 2 ? colors.danger : colors.primary;

  const listBadgeStyle = order.status === 2
    ? { bg: colors.dangerBg, text: colors.danger, label: 'Failed' }
    : order.status === 1
    ? { bg: colors.successBg, text: colors.success, label: 'Completed' }
    : order.status === 3
    ? { bg: colors.collectedBg, text: colors.collected, label: 'Collected' }
    : { bg: colors.warningBg, text: colors.warning, label: 'Pending' };

  if (variant === 'home') {
    return (
      <button
        onClick={() => onPress(order)}
        className="w-full flex items-center gap-2.5 px-3.5 py-3 border-b text-left transition-all hover:opacity-80 active:opacity-60"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}
      >
        <div className="w-10 h-10 rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ backgroundColor: iconBg }}>
          <Icon size={18} color={iconColor} strokeWidth={1.5} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold truncate" style={{ color: colors.text }}>{order.orderRef}</span>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full border flex-shrink-0 text-[9px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: statusStyle.bg, borderColor: statusStyle.border, color: statusStyle.text }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusStyle.dot }} />
              {statusStyle.label}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs truncate" style={{ color: colors.textMuted }}>{order.totalCopies} {order.totalCopies === 1 ? 'Copy' : 'Copies'} • {order.printerName}</span>
            <span className="text-[10px] font-medium flex-shrink-0" style={{ color: colors.textSecondary }}>{formatTime(order.createdAt)}</span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={() => onPress(order)}
      className="w-full rounded-xl border p-3.5 flex flex-col gap-2 text-left transition-all hover:opacity-80 active:scale-[0.99]"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.surface }}>
          <Icon size={16} color={colors.textSecondary} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold truncate" style={{ color: colors.text }}>{order.orderRef}</span>
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-bold flex-shrink-0 uppercase tracking-wide"
              style={{ backgroundColor: listBadgeStyle.bg, color: listBadgeStyle.text }}>
              {listBadgeStyle.label}
            </span>
          </div>
          <span className="text-xs" style={{ color: colors.textMuted }}>
            {order.totalCopies} {order.totalCopies === 1 ? 'Copy' : 'Copies'} • {formatDateTime(order.createdAt)}
          </span>
        </div>
      </div>
    </button>
  );
});

OrderCard.displayName = 'OrderCard';
export default OrderCard;
