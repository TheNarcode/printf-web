export const RAZORPAY_KEY = 'rzp_test_StI0D1pMPdbae3';

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

interface ProcessPaymentOptions {
  orderId: string;
  amount: number;
  currency?: string;
  userEmail?: string;
  userName?: string;
}

export function processRazorpayPayment({
  orderId,
  amount,
  currency = 'INR',
  userEmail = '',
  userName = ''
}: ProcessPaymentOptions): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined' || !window.Razorpay) {
      return reject(new Error('Razorpay SDK not loaded'));
    }

    let hasFailed = false;

    const options = {
      description: 'printf - Print Order',
      currency,
      key: RAZORPAY_KEY,
      amount,
      name: 'printf',
      order_id: orderId,
      prefill: { email: userEmail, name: userName },
      theme: { color: '#18181B' },
      handler: () => resolve(),
      modal: { ondismiss: () => reject(new Error(hasFailed ? 'payment_failed' : 'cancelled')) },
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', () => { hasFailed = true; });
    rzp.open();
  });
}
