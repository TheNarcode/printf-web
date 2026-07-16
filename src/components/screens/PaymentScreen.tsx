'use client';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Lock, FileText } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { usePrintJob } from '../../context/PrintJobContext';
import { useAppNav } from '../../app/dashboard/layout';
import { useNetwork } from '../../context/NetworkContext';

import Header from '../Header';
import Btn from '../Btn';
import { formatCurrency, formatFileSize } from '../../utils/formatters';
import { createOrder, buildPrintConfig } from '../../services/api';
import { getFileId } from '../../services/fileUploadManager';
import { useRouter } from 'next/navigation';

import { RAZORPAY_KEY, processRazorpayPayment } from '../../utils/razorpay';

export default function PaymentScreen() {
  const { colors } = useTheme();
  const { getOrderSummary, refreshOrders, resetFlow, files } = usePrintJob();
  const { getValidToken, user } = useAuth();
  const { pop } = useAppNav();
  const router = useRouter();
  const { assertOnline } = useNetwork();
  
  const { items, fee, total } = useMemo(() => getOrderSummary(), [getOrderSummary]);

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/dashboard');
    }
  }, [items.length, router]);
  
  const [isPaying, setIsPaying] = useState(false);
  const [statusText, setStatusText] = useState('');

  const handlePay = useCallback(async () => {
    if (!assertOnline()) return;
    setIsPaying(true);
    try {
      const token = await getValidToken();
      if (!token) throw new Error('Authentication required');

      setStatusText('Preparing files…');
      const fileIds: Record<string, string> = {};
      for (const item of items) {
        fileIds[item.file.id] = getFileId(item.file.id);
      }

      setStatusText('Creating order…');
      const printConfigs = items.map(item =>
        buildPrintConfig(fileIds[item.file.id], item.file.name, item.file.type, item.settings)
      );

      const rpOrder = await createOrder(printConfigs, token);
      setStatusText('Opening payment…');

      await processRazorpayPayment({
        orderId: rpOrder.id,
        amount: rpOrder.amount,
        currency: rpOrder.currency,
        userEmail: user?.email || '',
        userName: user?.name || ''
      });

      const orderId = rpOrder.localOrderId;
      setStatusText('Processing transaction...');
      await refreshOrders().catch(() => {});
      router.push(`/order-result?success=true&orderId=${orderId}`);

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      
      // Let the global PrintJobContext handle clearing state via the success/failure screen
      // Do not call reset() here to prevent unmounting the PaymentScreen before routing
      setStatusText('Processing transaction...');

      if (msg === 'cancelled') {
        router.push('/order-result?success=false&reason=cancelled');
      } else if (msg.includes('Unable to connect') || msg.includes('timed out') || msg.includes('Unable to upload')) {
        router.push('/order-result?success=false&reason=timeout');
      } else if (msg.includes('Authentication required')) {
        router.push('/order-result?success=false&reason=session');
      } else if (msg === 'payment_failed') {
        router.push('/order-result?success=false&reason=payment_failed');
      } else {
        router.push('/order-result?success=false&reason=unknown');
      }
    }
  }, [items, files, getValidToken, user, refreshOrders, resetFlow, router]);

  const handleBack = useCallback(() => {
    pop();
  }, [pop]);

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden" style={{ backgroundColor: colors.background }}>
      <Header title="Payment" subtitle="Step 3 of 3" showBack onBack={handleBack} />

      <main className="flex-1 overflow-y-auto pb-8">
        <div className="max-w-3xl mx-auto px-6 pt-6">
          <div className="flex flex-col md:flex-row md:gap-6 gap-5">

            {/* Files list */}
            <div className="flex-1 min-w-0">
              <p className="text-[9px] font-bold tracking-widest uppercase mb-3" style={{ color: colors.textMuted }}>FILES</p>
              <div className="flex flex-col gap-2.5">
                {items.map(item => (
                  <div key={item.file.id} className="rounded-xl border p-3.5" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.surface }}>
                        <FileText size={16} color={colors.textSecondary} strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate" style={{ color: colors.text }}>{item.file.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: colors.textMuted }}>
                          {item.file.pages} pages · {formatFileSize(item.file.size)}
                        </p>
                      </div>
                      <span className="text-base font-bold flex-shrink-0" style={{ color: colors.text }}>
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {[
                        item.settings.colorMode === 'color' ? 'Color' : 'B&W',
                        item.settings.paperSize.toUpperCase(),
                        item.settings.sides === 'single' ? 'Single Sided' : 'Double Sided',
                        item.settings.orientation === 'landscape' ? 'Landscape' : 'Portrait',
                        `×${item.settings.copies} copies`,
                      ].map(tag => (
                        <span key={tag} className="px-2 py-0.5 rounded-md text-[10px] font-medium" style={{ backgroundColor: colors.surface, color: colors.textSecondary }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="w-full md:w-[260px] flex-shrink-0">
              <p className="text-[9px] font-bold tracking-widest uppercase mb-3" style={{ color: colors.textMuted }}>PRICE BREAKDOWN</p>
              <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                <div className="p-3.5">
                  {items.map(item => (
                    <div key={item.file.id} className="flex justify-between py-1.5">
                      <span className="text-xs truncate flex-1 mr-3" style={{ color: colors.textSecondary }}>
                        {item.file.name.replace(/\.[^/.]+$/, '')}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: colors.text }}>{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between py-1.5 mt-1 pt-3 border-t" style={{ borderColor: colors.border }}>
                    <span className="text-xs" style={{ color: colors.textMuted }}>Convenience fee</span>
                    <span className="text-xs" style={{ color: colors.textMuted }}>{formatCurrency(fee)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 mt-1 border-t" style={{ borderColor: colors.border }}>
                    <span className="text-sm font-semibold" style={{ color: colors.text }}>Total</span>
                    <span className="text-xl font-bold" style={{ color: colors.text }}>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="flex-shrink-0 px-6 py-4 border-t z-30" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <div className="max-w-3xl mx-auto">
          <Btn variant="solid" size="lg" fullWidth onClick={handlePay} loading={isPaying}>
            {isPaying ? (statusText || 'Processing…') : `Pay ${formatCurrency(total)}`}
          </Btn>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <Lock size={10} color={colors.textMuted} strokeWidth={2} />
            <span className="text-[10px]" style={{ color: colors.textMuted }}>Secured by Razorpay</span>
          </div>
        </div>
      </div>
    </div>
  );
}
