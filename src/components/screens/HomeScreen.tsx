'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { ChevronRight, CheckCircle2, RefreshCw, RefreshCcw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import { usePrintJob } from '../../context/PrintJobContext';
import Header from '../Header';
import ProfileButton from '../ProfileButton';
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
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await refreshOrders(); } finally { setRefreshing(false); }
  }, [refreshOrders]);

  const handleNewOrder  = useCallback(() => push({ id: 'upload', transition: 'push' }), [push]);

  const handleOrderPress = useCallback((order: Order) => {
    push({ id: 'order_detail', transition: 'push', params: { orderId: order.id } });
  }, [push]);

  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);

  const counts = useMemo(() => ({
    paymentPending: orders.filter(o => o.status === 0 && !o.paid).length,
    inProgress: orders.filter(o => o.status === 0 && o.paid).length,
    completed: orders.filter(o => o.status === 1).length,
    failed: orders.filter(o => o.status === 2).length,
  }), [orders]);

  const stats = [
    { key: 'payment_pending', Icon: AlertCircle,   count: counts.paymentPending, label: 'Payment Pending', isDanger: true  },
    { key: 'in_progress',     Icon: RefreshCcw,    count: counts.inProgress,     label: 'In Progress',     isDanger: false },
    { key: 'completed',       Icon: CheckCircle2,  count: counts.completed,      label: 'To Collect',      isDanger: false },
    { key: 'failed',          Icon: AlertCircle,   count: counts.failed,         label: 'Failed',          isDanger: true  },
  ];

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden" style={{ backgroundColor: colors.background }}>
      <Header
        showBrand
        transparent
        rightElement={
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 transition-opacity hover:opacity-70"
              aria-label="Refresh"
            >
              <RefreshCw size={16} color={colors.textMuted} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <ProfileButton
              userName={user?.name}
              userPhoto={user?.photo}
              onPress={() => push({ id: 'profile', transition: 'modal' })}
            />
          </div>
        }
      />

      <main className="flex-1 overflow-y-auto pb-20">
        <div className="page-container px-6 pt-4">
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
                className="p-3 rounded-xl border flex flex-col gap-1 text-left transition-all hover:opacity-80"
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
              >
                <div className="flex items-center justify-between">
                  <s.Icon size={16} color={s.isDanger ? colors.danger : colors.textMuted} strokeWidth={1.8} />
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
              className="flex items-center gap-0.5 transition-opacity hover:opacity-70"
            >
              <span className="text-xs font-medium" style={{ color: colors.textSecondary }}>View All</span>
              <ChevronRight size={12} color={colors.textSecondary} strokeWidth={2} />
            </button>
          </div>

          {recentOrders.length > 0 ? (
            <div className="flex flex-col gap-4">
              {recentOrders.map(order => (
                <OrderCard key={order.id} order={order} onPress={handleOrderPress} variant="list" />
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
