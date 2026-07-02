'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCw, Search } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { usePrintJob } from '../../context/PrintJobContext';
import Header from '../Header';
import OrderCard from '../OrderCard';
import Btn from '../Btn';
import { useAppNav } from '../AppNavigator';
import type { Order } from '../../types';

type Filter = 'all' | 'pending' | 'completed' | 'failed';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'failed', label: 'Failed' },
];

export default function OrdersScreen({ initialFilter }: { initialFilter?: string }) {
  const { colors } = useTheme();
  const { orders, refreshOrders } = usePrintJob();
  const { pop, push } = useAppNav();
  const [refreshing, setRefreshing] = useState(false);
  const lastRefresh = useRef(0);
  const parsedFilter = useMemo((): Filter => {
    if (initialFilter === 'pending' || initialFilter === 'inProgress') return 'pending';
    if (initialFilter === 'completed') return 'completed';
    if (initialFilter === 'failed') return 'failed';
    return 'all';
  }, [initialFilter]);
  const [filter, setFilter] = useState<Filter>(parsedFilter);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const now = Date.now();
    if (now - lastRefresh.current < 30_000) return;
    lastRefresh.current = now;
    refreshOrders().catch(() => {});
  }, [refreshOrders]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await refreshOrders(); } finally { setRefreshing(false); }
  }, [refreshOrders]);

  const filteredOrders = useMemo(() => {
    let result = orders;
    if (filter === 'pending') result = result.filter(o => o.status === 0);
    else if (filter === 'completed') result = result.filter(o => o.status === 1);
    else if (filter === 'failed') result = result.filter(o => o.status === 2);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(o => o.files.some(f => f.file.name.toLowerCase().includes(q)));
    }
    return result;
  }, [orders, filter, search]);

  const handleOrderPress = useCallback((order: Order) => {
    push({ id: 'order_detail', transition: 'push', params: { orderId: order.id } });
  }, [push]);

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: colors.background }}>
      <Header title="Orders" showBack onBack={pop}
        rightElement={
          <button onClick={handleRefresh} disabled={refreshing} className="p-2 transition-opacity hover:opacity-70" aria-label="Refresh">
            <RefreshCw size={16} color={colors.textMuted} className={refreshing ? 'animate-spin' : ''} />
          </button>
        }
      />
      <main className="flex-1 overflow-y-auto pb-10">
        <div className="max-w-2xl mx-auto px-5 pt-4">
          <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: colors.text, letterSpacing: '-0.3px' }}>Orders</h1>
          <p className="text-sm font-medium mb-5" style={{ color: colors.textSecondary }}>Manage and track your print jobs.</p>
          <div className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl border mb-3.5" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Search size={18} color={colors.textMuted} strokeWidth={2} />
            <input type="text" placeholder="Search orders by file name..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium" style={{ color: colors.text }} />
          </div>
          <div className="flex flex-wrap gap-2 mb-5">
            {FILTERS.map(f => {
              const active = filter === f.key;
              return (
                <button key={f.key} onClick={() => setFilter(f.key)}
                  className="px-4 py-2 rounded-full border text-xs font-semibold transition-all"
                  style={{ borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : 'transparent', color: active ? colors.background : colors.textSecondary }}>
                  {f.label}
                </button>
              );
            })}
          </div>
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-4">
              <span className="text-sm font-medium" style={{ color: colors.textMuted }}>No orders found</span>
              {orders.length === 0 && filter === 'all' && !search && (
                <Btn variant="solid" size="md" onClick={pop}>Start Printing</Btn>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredOrders.map(order => <OrderCard key={order.id} order={order} onPress={handleOrderPress} variant="list" />)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
