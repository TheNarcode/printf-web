'use client';

import React, { memo, useState } from 'react';
import { FileText, Layers, Palette, Circle } from 'lucide-react';
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
    <div className="rounded-2xl border p-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <div className="flex rounded-lg p-0.5 mb-5" style={{ backgroundColor: colors.surface }}>
        {periods.map(p => {
          const active = period === p;
          return (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="flex-1 py-2 text-[11px] font-medium rounded-md transition-all"
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

      <div className="flex flex-col items-center mb-6">
        <span className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: colors.textMuted }}>
          Total Spent
        </span>
        <div className="text-4xl font-bold tracking-tight mb-0.5" style={{ color: colors.text }}>
          {formatCurrency(summary.totalSpent)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border p-3 flex flex-col items-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="flex items-center gap-1.5 mb-1">
            <FileText size={12} color={colors.textMuted} strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.textMuted }}>Orders</span>
          </div>
          <span className="text-xl font-bold" style={{ color: colors.text }}>{summary.orderCount}</span>
        </div>

        <div className="rounded-xl border p-3 flex flex-col items-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Layers size={12} color={colors.textMuted} strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.textMuted }}>Pages</span>
          </div>
          <span className="text-xl font-bold" style={{ color: colors.text }}>{summary.pageCount}</span>
        </div>

        <div className="rounded-xl border p-3 flex flex-col items-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Circle size={12} color={colors.textMuted} strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.textMuted }}>B&W</span>
          </div>
          <span className="text-xl font-bold" style={{ color: colors.text }}>{summary.bwPages}</span>
        </div>

        <div className="rounded-xl border p-3 flex flex-col items-center" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
          <div className="flex items-center gap-1.5 mb-1">
            <Palette size={12} color={colors.textMuted} strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: colors.textMuted }}>Color</span>
          </div>
          <span className="text-xl font-bold" style={{ color: colors.text }}>{summary.colorPages}</span>
        </div>
      </div>
    </div>
  );
});

SpendingSummary.displayName = 'SpendingSummary';
export default SpendingSummary;
