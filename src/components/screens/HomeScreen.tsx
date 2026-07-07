'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { ChevronRight, PrinterCheck, RefreshCw, ClipboardClock, PrinterX, Settings, BanknoteArrowUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import { usePrintJob } from '../../context/PrintJobContext';
import { useNetwork } from '../../context/NetworkContext';
import Header from '../Header';
import OrderCard from '../OrderCard';
import FAB from '../FAB';
import { useAppNav } from '../../app/dashboard/layout';
import type { Order } from '../../types';

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const { orders, refreshOrders } = usePrintJob();
  const { user } = useAuth();
  const { push } = useAppNav();
  const { assertOnline } = useNetwork();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (!assertOnline()) return;
    setRefreshing(true);
    try { await refreshOrders(); } finally { setRefreshing(false); }
  }, [refreshOrders, assertOnline]);

  const handleNewOrder = useCallback(() => {
    if (!assertOnline()) return;
    push({ id: 'upload', transition: 'push' });
  }, [push, assertOnline]);

  const handleOrderPress = useCallback((order: Order) => {
    push({ id: 'order_detail', transition: 'push', params: { orderId: order.id } });
  }, [push]);

  const recentOrders = useMemo(() => orders.slice(0, 4), [orders]);

  const counts = useMemo(() => ({
    paymentPending: orders.filter(o => o.status === 0 && !o.paid).length,
    inProgress: orders.filter(o => o.status === 0 && o.paid).length,
    completed: orders.filter(o => o.status === 1).length,
    failed: orders.filter(o => o.status === 2).length,
  }), [orders]);

  const stats = [
    { key: 'payment_pending', Icon: BanknoteArrowUp, count: counts.paymentPending, label: 'Payment Pending', iconColor: colors.warning },
    { key: 'in_progress',     Icon: ClipboardClock,    count: counts.inProgress,     label: 'In Progress',     iconColor: colors.info },
    { key: 'completed',       Icon: PrinterCheck,  count: counts.completed,      label: 'To Collect',      iconColor: colors.success },
    { key: 'failed',          Icon: PrinterX,      count: counts.failed,         label: 'Failed',          iconColor: colors.danger },
  ];

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden" style={{ backgroundColor: colors.background }}>
      <Header
        showBrand
        rightElement={
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 transition-opacity "
              aria-label="Refresh"
            >
              <RefreshCw size={16} color={colors.text} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => push({ id: 'settings', transition: 'modal' })}
              className="p-2 transition-opacity "
              aria-label="Settings"
            >
              <Settings size={20} color={colors.text} />
            </button>
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto pb-20">
        <div className="page-container px-6 pt-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight mb-0.5" style={{ color: colors.text, letterSpacing: '-0.5px' }}>
              {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'there'}.
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-3 mb-6">
            {stats.map(s => (
              <button
                key={s.key}
                onClick={() => push({ id: 'orders', transition: 'push', params: { filter: s.key } })}
                className="p-3 rounded-xl border flex flex-col gap-1 text-left transition-all "
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
              >
                <div className="flex items-center justify-between">
                  <s.Icon size={16} color={s.iconColor} strokeWidth={1.8} />
                  <span className="text-[20px] font-bold leading-none" style={{ color: colors.text }}>{s.count}</span>
                </div>
                <span className="text-[11px] font-medium" style={{ color: colors.textSecondary }}>{s.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between py-2.5 mb-2.5">
            <h2 className="text-base font-semibold" style={{ color: colors.text }}>Recent Orders</h2>
            <button
              onClick={() => push({ id: 'orders', transition: 'push' })}
              className="flex items-center gap-0.5 transition-opacity "
            >
              <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>View All</span>
              <ChevronRight size={12} color={colors.textSecondary} strokeWidth={2} />
            </button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {recentOrders.map((order, idx) => (
                <div key={order.id} className={idx === 3 ? "hidden md:block" : ""}>
                  <OrderCard order={order} onPress={handleOrderPress} variant="list" />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center gap-1.5">
              <span className="text-base font-semibold" style={{ color: colors.text }}>No orders yet</span>
              <span className="text-sm" style={{ color: colors.textMuted }}>Tap the + button to start printing.</span>
            </div>
          )}
        </div>
      </main>

      <FAB onClick={handleNewOrder} />
    </div>
  );
}
