'use client';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { RefreshCw, Search, ListFilter, Check } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { usePrintJob } from '../../context/PrintJobContext';
import { useNetwork } from '../../context/NetworkContext';
import Header from '../Header';
import OrderCard from '../OrderCard';
import { useAppNav } from '../../app/dashboard/layout';
import { usePayOrder } from '../../hooks/usePayOrder';
import type { Order } from '../../types';

import { useSearchParams } from 'next/navigation';

type Filter = 'all' | 'payment_pending' | 'in_progress' | 'completed' | 'collected' | 'failed';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All orders' },
  { key: 'in_progress', label: 'In progress' },
  { key: 'payment_pending', label: 'Payment pending' },
  { key: 'completed', label: 'Completed' },
  { key: 'collected', label: 'Collected' },
  { key: 'failed', label: 'Failed' },
];

export default function OrdersScreen({ initialFilter: _ignore }: { initialFilter?: string }) {
  const searchParams = useSearchParams();
  const initialFilter = searchParams.get('filter') || _ignore;
  const { colors } = useTheme();
  const { orders, refreshOrders } = usePrintJob();
  const { pop, push } = useAppNav();
  const { payOrder } = usePayOrder();
  const { assertOnline } = useNetwork();
  const [refreshing, setRefreshing] = useState(false);
  const lastRefresh = useRef(0);

  const parsedFilter = useMemo((): Filter[] => {
    if (initialFilter === 'payment_pending') return ['payment_pending'];
    if (initialFilter === 'in_progress') return ['in_progress'];
    if (initialFilter === 'completed') return ['completed'];
    if (initialFilter === 'failed') return ['failed'];
    if (initialFilter === 'collected') return ['collected'];
    return ['all'];
  }, [initialFilter]);

  const [selectedFilters, setSelectedFilters] = useState<Filter[]>(parsedFilter);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setSelectedFilters(parsedFilter);
  }, [parsedFilter]);

  useEffect(() => {
    const now = Date.now();
    if (now - lastRefresh.current < 30_000) return;
    lastRefresh.current = now;
    refreshOrders().catch(() => {});
  }, [refreshOrders]);

  const handleRefresh = useCallback(async () => {
    if (!assertOnline()) return;
    setRefreshing(true);
    try { await refreshOrders(); } finally { setRefreshing(false); }
  }, [refreshOrders, assertOnline]);

  const toggleFilter = useCallback((f: Filter) => {
    setSelectedFilters(prev => {
      if (f === 'all') return ['all'];
      const next = prev.filter(x => x !== 'all');
      if (next.includes(f)) {
        const removed = next.filter(x => x !== f);
        return removed.length === 0 ? ['all'] : removed;
      }
      return [...next, f];
    });
  }, []);

  const filteredOrders = useMemo(() => {
    let result = orders;
    
    if (!selectedFilters.includes('all')) {
      result = result.filter(o => {
        if (selectedFilters.includes('payment_pending') && !o.paid) return true;
        if (selectedFilters.includes('in_progress') && o.status === 0 && o.paid) return true;
        if (selectedFilters.includes('completed') && o.status === 1) return true;
        if (selectedFilters.includes('failed') && o.status === 2) return true;
        if (selectedFilters.includes('collected') && o.status === 3) return true;
        return false;
      });
    }
    
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(o => {
        const displayId = (o.orderRef || o.id.slice(0, 5)).toLowerCase();
        if (displayId.includes(q)) return true;
        return o.files.some(f => f.file.name.toLowerCase().includes(q));
      });
    }
    return result;
  }, [orders, selectedFilters, search]);

  const handleOrderPress = useCallback((order: Order) => {
    if ((order as any)._payNowTrigger) {
      payOrder(order);
    } else {
      push({ id: 'order_detail', transition: 'push', params: { orderId: order.id } });
    }
  }, [push, payOrder]);

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden relative" style={{ backgroundColor: colors.background }}>
      {showDropdown && (
        <div 
          className="absolute inset-0 z-[5]" 
          onClick={() => setShowDropdown(false)} 
        />
      )}
      <Header title="All Orders" showBack onBack={pop}
        rightElement={
          <button onClick={handleRefresh} disabled={refreshing} className="p-2 transition-opacity " aria-label="Refresh">
            <RefreshCw size={16} color={colors.text} className={refreshing ? 'animate-spin' : ''} />
          </button>
        }
      />
      <div className="shrink-0 px-6 pt-6 pb-2 w-full max-w-2xl mx-auto relative z-10">
        <h1 className="text-2xl font-bold tracking-tight mb-0.5" style={{ color: colors.text }}>Manage and track orders</h1>
        
        <div className="flex items-center gap-2 mt-5 mb-3 relative z-10">
          <div className="flex-1 flex items-center gap-2.5 px-3.5 h-11 rounded-xl border" style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
            <Search size={16} color={colors.textMuted} strokeWidth={2} />
            <input type="text" placeholder="Search by file name or order ID..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium" style={{ color: colors.text }} />
          </div>
          
          <button 
            className="w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl border transition-all " 
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <ListFilter size={18} color={!selectedFilters.includes('all') ? colors.primary : colors.text} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 top-12 mt-1 w-48 rounded-xl border shadow-lg overflow-hidden flex flex-col py-1.5" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
              {FILTERS.map(f => {
                const active = selectedFilters.includes(f.key);
                return (
                  <button
                    key={f.key}
                    className="flex items-center gap-3 px-3.5 py-2.5 w-full text-left transition-colors  "
                    onClick={() => toggleFilter(f.key)}
                  >
                    <div className="w-4 h-4 rounded flex items-center justify-center border" style={{ borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary : 'transparent' }}>
                      {active && <Check size={12} color={colors.background} strokeWidth={3} />}
                    </div>
                    <span className="text-sm font-medium" style={{ color: colors.text }}>{f.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <main className="flex-1 overflow-y-auto pb-10 relative z-0">
        <div className="max-w-2xl mx-auto px-6 pt-6">
          {filteredOrders.length === 0 ? (
            <div className="py-12 flex flex-col items-center gap-1.5">
              <span className="text-sm" style={{ color: colors.textMuted }}>No orders found</span>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {filteredOrders.map(order => <OrderCard key={order.id} order={order} onPress={handleOrderPress} variant="list" />)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

