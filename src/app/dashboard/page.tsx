'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, ChevronRight, ClipboardList, CheckCircle2, RefreshCw, RefreshCcw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import { usePrintJob } from '../../context/PrintJobContext';
import { usePayOrder } from '../../hooks/usePayOrder';
import GoogleLogo from '../../components/GoogleLogo';
import Header from '../../components/Header';
import ProfileButton from '../../components/ProfileButton';
import OrderCard from '../../components/OrderCard';
import FAB from '../../components/FAB';
import { AppNavigator, useAppNav } from '../../components/AppNavigator';
import type { NavFrame } from '../../components/AppNavigator';
import ProfileScreen from '../../components/app-screens/ProfileScreen';
import OrdersScreen from '../../components/app-screens/OrdersScreen';
import OrderDetailScreen from '../../components/app-screens/OrderDetailScreen';
import TermsScreen from '../../components/app-screens/TermsScreen';
import PrivacyScreen from '../../components/app-screens/PrivacyScreen';
import type { Order } from '../../types';

// ─── Greeting helper ──────────────────────────────────────────────────────────
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}



function DeepLinkHandler() {
  const { push } = useAppNav();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return;
    handled.current = true;
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    if (orderId) {
      window.history.replaceState({}, '', '/dashboard');
      setTimeout(() => {
        push({ id: 'order_detail', transition: 'push', params: { orderId } });
      }, 50);
    }
  }, [push]);

  return null;
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
function HomeScreen() {
  const { colors } = useTheme();
  const { orders, refreshOrders, resetFlow } = usePrintJob();
  const { payOrder } = usePayOrder();
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
    inProgress: orders.filter(o => o.status === 0).length,
    completed: orders.filter(o => o.status === 1).length,
    failed: orders.filter(o => o.status === 2).length,
    pages: orders.reduce((sum, o) => sum + o.totalPages, 0),
  }), [orders]);

  const stats = [
    { key: 'pages',      Icon: ClipboardList, count: counts.pages,      label: 'Pages Printed', isDanger: false },
    { key: 'inProgress', Icon: RefreshCcw,    count: counts.inProgress, label: 'In Progress',   isDanger: false },
    { key: 'completed',  Icon: CheckCircle2,  count: counts.completed,  label: 'Completed',     isDanger: false },
    { key: 'failed',     Icon: AlertCircle,   count: counts.failed,     label: 'Alerts',        isDanger: true  },
  ];

  return (
    <div className="h-full flex flex-col overflow-hidden" style={{ backgroundColor: colors.background }}>
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
        <div className="page-container px-5 pt-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight mb-0.5" style={{ color: colors.text, letterSpacing: '-0.5px', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
              {getGreeting()}, {user?.name ? user.name.split(' ')[0] : 'there'}.
            </h1>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6">
            {stats.map(s => (
              <button
                key={s.key}
                onClick={() => push({ id: 'orders', transition: 'push', params: { filter: s.key } })}
                className="p-3.5 rounded-xl border flex flex-col gap-1.5 text-left transition-all hover:opacity-80"
                style={{ backgroundColor: colors.card, borderColor: colors.border }}
              >
                <div className="flex items-center justify-between">
                  <s.Icon size={16} color={s.isDanger ? colors.danger : colors.textMuted} strokeWidth={1.8} />
                  <span className="text-[22px] font-bold leading-none" style={{ color: colors.text }}>{s.count}</span>
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

import { Suspense, lazy } from 'react';

const UploadScreen   = lazy(() => import('../../components/screens/UploadScreen'));
const SettingsScreen = lazy(() => import('../../components/screens/SettingsScreen'));
const PaymentScreen  = lazy(() => import('../../components/screens/PaymentScreen'));

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #ccc', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

// ─── App Screen Renderer ──────────────────────────────────────────────────────
function renderAppScreen(frame: NavFrame): React.ReactNode {
  const { screen } = frame;
  switch (screen.id) {
    case 'home':         return <><DeepLinkHandler /><HomeScreen /></>;
    case 'orders':       return <OrdersScreen initialFilter={screen.params?.filter} />;
    case 'order_detail': return <OrderDetailScreen orderId={screen.params?.orderId ?? ''} />;
    case 'profile':      return <ProfileScreen />;
    case 'terms':        return <TermsScreen />;
    case 'privacy':      return <PrivacyScreen />;
    case 'upload':       return <Suspense fallback={<Spinner />}><UploadScreen /></Suspense>;
    case 'settings':     return <Suspense fallback={<Spinner />}><SettingsScreen /></Suspense>;
    case 'payment':      return <Suspense fallback={<Spinner />}><PaymentScreen /></Suspense>;
    default:             return <HomeScreen />;
  }
}

function AuthenticatedHome() {
  return <AppNavigator renderScreen={renderAppScreen} />;
}

// ─── Main Print Page ──────────────────────────────────────────────────────────
export default function PrintPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: colors.textMuted }} />
      </div>
    );
  }

  return <AuthenticatedHome />;
}
