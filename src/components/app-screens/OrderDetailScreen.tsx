'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Printer, Lock } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { usePrintJob } from '../../context/PrintJobContext';
import Header from '../Header';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { parsePageRange } from '../../utils/previewUtils';
import { useAppNav } from '../../app/dashboard/layout';
import { usePayOrder } from '../../hooks/usePayOrder';
import Btn from '../Btn';

function Separator({ color }: { color: string }) {
  return (
    <div className="overflow-hidden my-1.5" style={{ color }}>
      <span className="font-mono text-[10px] leading-[14px] whitespace-nowrap">{'='.repeat(80)}</span>
    </div>
  );
}

export default function OrderDetailScreen({ orderId }: { orderId: string }) {
  const { colors, isDark } = useTheme();
  const { orders, refreshOrders } = usePrintJob();
  const { pop } = useAppNav();
  const { payOrder, isPaying } = usePayOrder();
  const lastRefresh = useRef(0);

  const [fetchAttempts, setFetchAttempts] = useState(0);
  const order = orders.find(o => o.id === orderId);

  useEffect(() => {
    const now = Date.now();
    if (now - lastRefresh.current < 30_000 && !(!order && fetchAttempts < 3)) return;
    lastRefresh.current = now;
    refreshOrders().catch(() => {});
  }, [refreshOrders, order, fetchAttempts]);

  useEffect(() => {
    if (!order && fetchAttempts < 3) {
      const timer = setTimeout(() => {
        refreshOrders().finally(() => setFetchAttempts(a => a + 1));
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [order, fetchAttempts, refreshOrders]);

  const screenBg =  colors.background;
  const slipBg = isDark ? '#27272A' : '#eeeeee';;
  const sepColor = colors.textMuted + '70';

  if (!order) {
    if (fetchAttempts >= 3) {
      return (
        <div className="h-[100dvh] flex flex-col" style={{ backgroundColor: screenBg }}>
          <Header title={`Order#${orderId.slice(0, 5)}`} showBack onBack={pop} />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm" style={{ color: colors.textMuted }}>Order not found</p>
          </div>
        </div>
      );
    }

    return (
      <div className="h-[100dvh] flex flex-col" style={{ backgroundColor: screenBg }}>
        <Header title={`Order#${orderId.slice(0, 5)}`} showBack onBack={pop} />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: colors.primary }} />
          <p className="text-sm" style={{ color: colors.textMuted }}>Loading order details...</p>
        </div>
      </div>
    );
  }

  const isUnpaid = order.status === 0 && !order.paid;
  const isInProgress = order.status === 0 && order.paid;
  const isFailed = order.status === 2;
  const isDone = order.status === 1;
  const isCollected = order.status === 3;
  const statusLabel = isCollected ? 'Collected' : isDone ? 'Completed' : isFailed ? 'Failed' : isUnpaid ? 'Unpaid' : 'In Progress';
  const statusColor = isCollected ? colors.collected : isFailed ? colors.danger : isDone ? colors.success : isUnpaid ? colors.warning : colors.info;
  const statusBg = isCollected ? colors.collectedBg : isFailed ? colors.dangerBg : isDone ? colors.successBg : isUnpaid ? colors.warningBg : colors.infoBg;

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden" style={{ backgroundColor: screenBg }}>
      <Header title={`Order#${order.orderRef || order.id.slice(0, 5)}`} showBack onBack={pop} />
      <main className="flex-1 overflow-y-auto pt-6 pb-4 px-6 flex flex-col">
        <div className="max-w-[480px] w-full mx-auto my-auto">
          <div className="h-3 overflow-hidden flex" style={{ backgroundColor: screenBg }}>
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="flex-shrink-0" style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: `12px solid ${slipBg}` }} />
            ))}
          </div>
          <div className="px-4 py-3" style={{ backgroundColor: slipBg }}>
            <div className="flex flex-col items-center mb-1">
              <div className="p-2 rounded-xl mb-1.5" style={{ backgroundColor: colors.primaryBg }}>
                <Printer size={22} color={colors.primary} strokeWidth={2} />
              </div>
              <p className="font-mono font-bold text-xl tracking-[3px] mb-0.5" style={{ color: colors.text }}>PRINTF</p>
              {['St. Francis Institute of Technology', 'Mount Poinsur, Borivali West', 'Mumbai - 400103'].map(line => (
                <p key={line} className="font-mono text-[10px] leading-4 text-center" style={{ color: colors.textSecondary }}>{line}</p>
              ))}
            </div>
            <div className="flex justify-center my-1 items-center gap-3">
              <span className="font-mono font-bold text-[11px] tracking-[1.5px] px-3 py-1 rounded-xl border" style={{ color: statusColor, backgroundColor: statusBg, borderColor: statusColor }}>{statusLabel}</span>
            </div>
            <Separator color={sepColor} />
            <div className="flex justify-between mb-0.5">
              <span className="font-mono text-[10px]" style={{ color: colors.textSecondary }}>Order ID:</span>
              <span className="font-mono text-[10px] font-medium" style={{ color: colors.text }}>{order.orderRef}</span>
            </div>
            <div className="flex justify-between mb-0.5">
              <span className="font-mono text-[10px]" style={{ color: colors.textSecondary }}>Date:</span>
              <span className="font-mono text-[10px] font-medium" style={{ color: colors.text }}>{formatDateTime(order.createdAt)}</span>
            </div>
            <div className="flex justify-between mb-0.5">
              <span className="font-mono text-[10px]" style={{ color: colors.textSecondary }}>Printer:</span>
              <span className="font-mono text-[10px] font-medium truncate ml-4" style={{ color: colors.text }}>{order.printerName}</span>
            </div>
            <Separator color={sepColor} />
            <div className="flex items-center mb-1">
              <span className="flex-1 font-mono text-[10px]" style={{ color: colors.textSecondary }}>Name</span>
              <span className="w-9 font-mono text-[10px] text-center" style={{ color: colors.textSecondary }}>Qty</span>
              <span className="w-14 font-mono text-[10px] text-right" style={{ color: colors.textSecondary }}>Price</span>
            </div>
            <div className="h-px mb-2" style={{ backgroundColor: colors.textMuted + '40' }} />
            <div className="mb-0">
              {order.files.map(f => {
                const printedPages = parsePageRange(f.settings.pageRange, f.file.pages).length;
                const sheets = Math.ceil(printedPages / f.settings.pagesPerSheet);
                const pricePerSheet = sheets > 0 && f.settings.copies > 0 ? f.price / (sheets * f.settings.copies) : 0;
                return (
                  <div key={f.file.id} className="mb-1.5">
                    <div className="flex items-center">
                      <span className="flex-1 font-mono text-[11px] truncate" style={{ color: colors.text }}>{f.file.name}</span>
                      <span className="w-9 font-mono text-[11px] text-center" style={{ color: colors.text }}>{f.settings.copies}</span>
                      <span className="w-14 font-mono text-[11px] text-right" style={{ color: colors.text }}>{formatCurrency(f.price)}</span>
                    </div>
                    <div className="pl-1 mt-0.5">
                      <p className="font-mono text-[9px]" style={{ color: colors.textMuted }}>
                        {printedPages}p · {f.settings.colorMode === 'color' ? 'Color' : 'B&W'} · {f.settings.paperSize.toUpperCase()} · {f.settings.sides === 'single' ? '1-sided' : '2-sided'} · {f.settings.pagesPerSheet}pp/s
                      </p>
                      <p className="font-mono text-[9px]" style={{ color: colors.textMuted }}>
                        Cost breakdown: {sheets} sheet{sheets !== 1 ? 's' : ''} × ₹{pricePerSheet.toFixed(2)}{f.settings.copies > 1 ? ` × ${f.settings.copies} copies` : ''}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <Separator color={sepColor} />
            <div className="flex justify-between mb-0.5">
              <span className="font-mono text-[11px]" style={{ color: colors.text }}>Sub Total</span>
              <span className="font-mono text-[11px]" style={{ color: colors.text }}>{formatCurrency(order.totalPrice - order.convenienceFee)}</span>
            </div>
            <div className="flex justify-between mb-0.5">
              <span className="font-mono text-[11px]" style={{ color: colors.textSecondary }}>Convenience Fee (5%)</span>
              <span className="font-mono text-[11px]" style={{ color: colors.textSecondary }}>{formatCurrency(order.convenienceFee)}</span>
            </div>
            <Separator color={sepColor} />
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-mono font-bold text-base" style={{ color: colors.text }}>TOTAL</span>
              <span className="font-mono font-bold text-base" style={{ color: colors.text }}>{formatCurrency(order.totalPrice)}</span>
            </div>
            <div className="flex justify-between mb-0.5">
              <span className="font-mono text-[11px]" style={{ color: colors.textSecondary }}>STATUS</span>
              <span className="font-mono text-[11px]" style={{ color: colors.textSecondary }}>{order.paid ? 'Payment Cleared' : 'Payment Pending'}</span>
            </div>
            <Separator color={sepColor} />
            <div className="flex flex-col items-center mt-0.5 mb-1.5">
              <p className="font-mono font-bold text-[13px]" style={{ color: colors.text }}>THANK YOU!</p>
              <p className="font-mono text-[11px]" style={{ color: colors.textSecondary }}>Glad to see you again!</p>
            </div>
          </div>
          <div className="h-3 overflow-hidden flex" style={{ backgroundColor: slipBg }}>
            {Array.from({ length: 60 }).map((_, i) => (
              <div key={i} className="flex-shrink-0" style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: `12px solid ${screenBg}` }} />
            ))}
          </div>
        </div>
      </main>

      {order.status === 0 && !order.paid && order.paymentRequestId && (
        <div className="flex-shrink-0 px-6 py-5 sticky bottom-0 z-20 pointer-events-none">
          <div className="page-container flex flex-col items-center pointer-events-auto">
            <Btn variant="solid" size="lg" fullWidth onClick={() => payOrder(order)} disabled={isPaying} style={{ backgroundColor: colors.text, color: colors.background, borderColor: colors.text }}>
              {isPaying ? 'Processing...' : `Pay ${formatCurrency(order.totalPrice)}`}
            </Btn>
            <div className="flex items-center gap-1.5 mt-3 opacity-60">
              <Lock size={12} style={{ color: colors.textMuted }} />
              <span className="text-[11px] font-medium" style={{ color: colors.textMuted }}>Secured by Razorpay</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
