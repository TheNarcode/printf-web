'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Printer, ChevronRight, ClipboardList, CheckCircle2, RefreshCw, RefreshCcw, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme/ThemeContext';
import { usePrintJob } from '../../context/PrintJobContext';
import GoogleLogo from '../../components/GoogleLogo';
import Header from '../../components/Header';
import ProfileButton from '../../components/ProfileButton';
import OrderCard from '../../components/OrderCard';
import FAB from '../../components/FAB';
import CreateOrderFlow from '../../components/CreateOrderFlow';
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

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen() {
  const { isLoading, signInWithGoogle } = useAuth();
  const { colors } = useTheme();

  const contentRef = useRef<HTMLDivElement>(null);
  const btnRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const btn     = btnRef.current;
    if (!content || !btn) return;
    content.style.opacity = '0';
    content.style.transform = 'translateY(20px)';
    btn.style.opacity = '0';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        content.style.transition = 'opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.16,1,0.3,1)';
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
        setTimeout(() => {
          btn.style.transition = 'opacity 0.4s ease-out';
          btn.style.opacity = '1';
        }, 100);
      });
    });
  }, []);

  const handleSignIn = useCallback(async () => {
    await signInWithGoogle();
  }, [signInWithGoogle]);

  return (
    <div className="min-h-dvh flex flex-col overflow-hidden" style={{ backgroundColor: colors.background }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
          style={{
            width: 500, height: 500,
            top: -120, right: -180,
            backgroundColor: colors.primaryBg,
            opacity: 0.5,
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 380, height: 380,
            bottom: -60, left: -180,
            backgroundColor: colors.primaryBg,
            opacity: 0.3,
          }}
        />
      </div>

      <div className="relative flex-1 flex flex-col justify-center px-8 gap-[60px] max-w-sm w-full mx-auto">
        <div ref={contentRef} className="flex flex-col items-center gap-3.5">
          <div
            className="w-[72px] h-[72px] rounded-[20px] flex items-center justify-center"
            style={{ backgroundColor: colors.surface, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
          >
            <Printer size={32} color={colors.primary} strokeWidth={1.5} />
          </div>
          <p className="text-[40px] leading-none tracking-[-1.5px]" style={{ color: colors.text, fontWeight: 900, fontFamily: 'var(--font-geist-sans), sans-serif' }}>
            printf
          </p>
          <p className="text-[14px] text-center" style={{ color: colors.textMuted, marginTop: -4, fontFamily: 'var(--font-geist-sans), sans-serif', fontWeight: 500 }}>
            Print anything, anywhere.
          </p>
        </div>

        <div ref={btnRef}>
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-[100px] border transition-all active:scale-95 hover:opacity-80 disabled:opacity-60"
            style={{ backgroundColor: colors.card, borderColor: colors.border, paddingTop: 14, paddingBottom: 14, minHeight: 52, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}
          >
            {isLoading ? (
              <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: colors.text }} />
            ) : (
              <>
                <GoogleLogo size={18} />
                <span className="text-[14px]" style={{ color: colors.text, fontWeight: 600, fontFamily: 'var(--font-geist-sans), sans-serif' }}>Sign in with Google</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 pb-8" style={{ color: colors.textMuted }}>
          <a href="/terms" className="text-[11px] hover:underline opacity-60 hover:opacity-100 transition-opacity">Terms</a>
          <span className="text-[11px] opacity-30">·</span>
          <a href="/privacy" className="text-[11px] hover:underline opacity-60 hover:opacity-100 transition-opacity">Privacy</a>
        </div>
      </div>
    </div>
  );
}

// ─── Home Screen ──────────────────────────────────────────────────────────────
function HomeScreen() {
  const { colors } = useTheme();
  const { orders, refreshOrders, resetFlow } = usePrintJob();
  const { user } = useAuth();
  const { push } = useAppNav();
  const [refreshing, setRefreshing] = useState(false);
  const [showFlow, setShowFlow] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await refreshOrders(); } finally { setRefreshing(false); }
  }, [refreshOrders]);

  const handleNewOrder  = useCallback(() => setShowFlow(true), []);
  const handleFlowClose = useCallback(() => { resetFlow(); setShowFlow(false); }, [resetFlow]);

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
        title="printf"
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
            <div
              className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center rounded-2xl border border-dashed"
              style={{ borderColor: colors.border, backgroundColor: colors.surface }}
            >
              <ClipboardList size={32} color={colors.textMuted} strokeWidth={1.5} />
              <span className="text-lg font-bold" style={{ color: colors.text }}>No orders yet</span>
              <span className="text-sm" style={{ color: colors.textSecondary }}>Tap the + button to start printing your documents.</span>
            </div>
          )}
        </div>
      </main>

      <FAB onClick={handleNewOrder} />
      {showFlow && <CreateOrderFlow onClose={handleFlowClose} />}
    </div>
  );
}

// ─── App Screen Renderer ──────────────────────────────────────────────────────
function renderAppScreen(frame: NavFrame): React.ReactNode {
  const { screen } = frame;
  switch (screen.id) {
    case 'home':         return <HomeScreen />;
    case 'orders':       return <OrdersScreen initialFilter={screen.params?.filter} />;
    case 'order_detail': return <OrderDetailScreen orderId={screen.params?.orderId ?? ''} />;
    case 'profile':      return <ProfileScreen />;
    case 'terms':        return <TermsScreen />;
    case 'privacy':      return <PrivacyScreen />;
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

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: colors.textMuted }} />
      </div>
    );
  }

  if (isAuthenticated) {
    return <AuthenticatedHome />;
  }

  return <LoginScreen />;
}
