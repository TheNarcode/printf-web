'use client';

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useTheme } from '../../theme/ThemeContext';
import { usePrintJob } from '../../context/PrintJobContext';
import Header from '../../components/Header';
import Btn from '../../components/Btn';

function OrderResultContent() {
  const { colors } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { orders } = usePrintJob();

  const success = searchParams?.get('success') === 'true';
  const orderId = searchParams?.get('orderId');
  const reason = searchParams?.get('reason');

  const order = orderId ? orders.find(o => o.id === orderId) : null;

  let errorMessage = 'Something went wrong while processing your order. Please try again.';
  if (reason === 'cancelled') errorMessage = 'Payment was cancelled by the user.';
  else if (reason === 'timeout') errorMessage = 'Unable to connect to the server right now. Please check your connection.';
  else if (reason === 'session') errorMessage = 'Your session has expired. Please sign in again.';
  else if (reason === 'payment_failed') errorMessage = 'Your payment failed. Please try again with a different method.';

  const [dotLottie, setDotLottie] = React.useState<any>(null);

  React.useEffect(() => {
    if (!dotLottie) return;
    const onFrame = () => {
      // Pause slightly before the end to prevent it from reaching the final blank frame and vanishing
      if (dotLottie.currentFrame >= dotLottie.totalFrames - 2 && dotLottie.totalFrames > 0) {
        dotLottie.pause();
      }
    };
    dotLottie.addEventListener('frame', onFrame);
    return () => dotLottie.removeEventListener('frame', onFrame);
  }, [dotLottie]);

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: colors.background }}>
      <Header title="" />

      <main className="flex-1 flex flex-col justify-center items-center px-8 pb-20">
        <div className="w-[160px] h-[160px] mb-6">
          {success ? (
            <DotLottieReact src="/success.lottie" autoplay loop={false} dotLottieRefCallback={setDotLottie} />
          ) : (
            <DotLottieReact src="/fail.lottie" autoplay loop={false} dotLottieRefCallback={setDotLottie} />
          )}
        </div>

        <h1 className="text-3xl font-bold text-center mb-3" style={{ color: colors.text, fontFamily: 'var(--font-geist-sans), sans-serif', letterSpacing: '-0.5px' }}>
          {success ? 'Order Placed!' : 'Payment Failed'}
        </h1>
        
        <p className="text-center text-[15px] mb-8 max-w-sm leading-relaxed" style={{ color: colors.textMuted }}>
          {success ? 'Your print order has been submitted successfully.' : errorMessage}
        </p>

        {success && order && (
          <div 
            className="rounded-xl border flex flex-col items-center gap-1.5 py-4 px-8 mb-10"
            style={{ backgroundColor: colors.surface, borderColor: colors.border }}
          >
            <span className="text-xs font-medium uppercase tracking-widest" style={{ color: colors.textMuted }}>Order Reference</span>
            <span className="text-2xl font-bold tracking-wide" style={{ color: colors.text, fontFamily: 'var(--font-geist-mono), monospace' }}>
              {order.orderRef || order.id.slice(0, 8)}
            </span>
          </div>
        )}

        <div className="w-full max-w-[280px] flex flex-col gap-3">
          {success ? (
            <>
              <Btn 
                variant="solid" 
                size="lg" 
                fullWidth 
                onClick={() => router.push(`/dashboard?orderId=${orderId}`)}
              >
                View Order
              </Btn>
              <Btn 
                variant="outline" 
                size="lg" 
                fullWidth 
                onClick={() => router.push('/dashboard')}
              >
                Back to Home
              </Btn>
            </>
          ) : (
            <Btn 
              variant="solid" 
              size="lg" 
              fullWidth 
              onClick={() => router.push('/dashboard')}
            >
              Go Home
            </Btn>
          )}
        </div>
      </main>
    </div>
  );
}

export default function OrderResultScreen() {
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <OrderResultContent />
    </Suspense>
  );
}
