'use client';

import React, { Suspense, lazy } from 'react';
import { StackNavigator } from './StackNavigator';

// Lazy-load the screen components so the main bundle stays small
const UploadScreen   = lazy(() => import('./screens/UploadScreen'));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));
const PaymentScreen  = lazy(() => import('./screens/PaymentScreen'));

function Spinner() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid #ccc', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );
}

interface CreateOrderFlowProps {
  onClose: () => void;  // called after payment success or user backs out from Upload
}

export default function CreateOrderFlow({ onClose }: CreateOrderFlowProps) {
  const screens = {
    upload:   <Suspense fallback={<Spinner />}><UploadScreen onExit={onClose} /></Suspense>,
    settings: <Suspense fallback={<Spinner />}><SettingsScreen /></Suspense>,
    payment:  <Suspense fallback={<Spinner />}><PaymentScreen onSuccess={onClose} /></Suspense>,
  } as const;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      <StackNavigator screens={screens} initialScreen="upload" />
    </div>
  );
}
