'use client';

import React, { memo, useState } from 'react';
import { FileText, Layers } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';
import type { Order } from '../types';
import { calculateSpending, formatCurrency } from '../utils/formatters';

interface SpendingSummaryProps {
  orders: Order[];
}

type Period = 'day' | 'week' | 'month';

const SpendingSummary = memo(({ orders }: SpendingSummaryProps) => {
  const { colors } = useTheme();
  const [period, setPeriod] = useState<Period>('month');
  const summary = calculateSpending(orders, period);
  const periodLabels: Record<Period, string> = { day: 'Today', week: 'This Week', month: 'This Month' };
  const periods: Period[] = ['day', 'week', 'month'];

  return (
    <div className="rounded-[14px] border p-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <span className="text-[9px] font-bold tracking-[1px] uppercase mb-3 block" style={{ color: colors.textMuted }}>
        SPENDING
      </span>

      <div className="flex rounded-full p-0.5 mb-4" style={{ backgroundColor: colors.surface }}>
        {periods.map(p => {
          const active = period === p;
          return (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="flex-1 py-1.5 text-[11px] font-medium rounded-full transition-all"
              style={{
                backgroundColor: active ? colors.card : 'transparent',
                color: active ? colors.text : colors.textMuted,
                fontWeight: active ? 600 : 500,
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              {periodLabels[p]}
            </button>
          );
        })}
      </div>

      <div className="text-3xl font-bold mb-0.5" style={{ color: colors.text }}>
        {formatCurrency(summary.totalSpent)}
      </div>
      <div className="text-xs mb-3" style={{ color: colors.textMuted }}>
        Total spent {periodLabels[period].toLowerCase()}
      </div>

      <div className="flex items-center pt-3 border-t" style={{ borderColor: colors.border }}>
        <div className="flex-1 flex items-center justify-center gap-1">
          <FileText size={12} color={colors.textMuted} strokeWidth={1.5} />
          <span className="text-sm font-semibold" style={{ color: colors.text }}>{summary.orderCount}</span>
          <span className="text-xs" style={{ color: colors.textMuted }}>orders</span>
        </div>
        <div className="w-px h-4.5" style={{ backgroundColor: colors.border }} />
        <div className="flex-1 flex items-center justify-center gap-1">
          <Layers size={12} color={colors.textMuted} strokeWidth={1.5} />
          <span className="text-sm font-semibold" style={{ color: colors.text }}>{summary.pageCount}</span>
          <span className="text-xs" style={{ color: colors.textMuted }}>pages</span>
        </div>
      </div>
    </div>
  );
});

SpendingSummary.displayName = 'SpendingSummary';
export default SpendingSummary;
