import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePrintJob } from '../context/PrintJobContext';
import { processRazorpayPayment } from '../utils/razorpay';
import { CustomAlertAPI } from '../context/AlertContext';
import type { Order } from '../types';

export function usePayOrder() {
  const { user } = useAuth();
  const { refreshOrders } = usePrintJob();
  const [isPaying, setIsPaying] = useState(false);

  const payOrder = async (order: Order, onSuccess?: () => void) => {
    if (!order.paymentRequestId) return;
    setIsPaying(true);
    try {
      await processRazorpayPayment({
        orderId: order.paymentRequestId,
        amount: Math.round((order.totalPrice + order.convenienceFee) * 100),
        userEmail: user?.email || '',
        userName: user?.name || ''
      });
      
      refreshOrders().catch(() => {});
      if (onSuccess) onSuccess();
      
      CustomAlertAPI.alert('Success', 'Payment successful! Your order is now confirmed.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg === 'cancelled') {
        // user just closed modal, do nothing
      } else if (msg === 'payment_failed') {
        CustomAlertAPI.alert('Payment Failed', 'Your payment could not be processed.');
      } else {
        CustomAlertAPI.alert('Error', 'An unexpected error occurred during payment.');
      }
    } finally {
      setIsPaying(false);
    }
  };

  return { payOrder, isPaying };
}
