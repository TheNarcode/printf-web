'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from '../../../theme/ThemeContext';

/**
 * OAuth callback page.
 * Google redirects here with id_token in the URL hash fragment:
 *   /auth/callback#id_token=xxx&token_type=Bearer&...
 *
 * URL hash is NEVER sent to the server (security) — only JS can read it.
 * We extract the id_token, pass it to AuthContext, and redirect to home.
 */
function CallbackContent() {
  const { colors } = useTheme();
  const router = useRouter();

  useEffect(() => {
    // Parse the hash fragment
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');
    const error = params.get('error');

    if (error) {
      console.error('OAuth error:', error);
      router.replace('/print');
      return;
    }

    if (!idToken) {
      console.error('No id_token in callback URL');
      router.replace('/print');
      return;
    }

    // Call the global handler registered by AuthContext
    const handler = (window as unknown as Record<string, unknown>).__printfHandleOAuthCallback as ((token: string) => void) | undefined;

    if (handler) {
      handler(idToken);
      router.replace('/print');
    } else {
      // Handler not ready yet — retry in a tick
      setTimeout(() => {
        const h = (window as unknown as Record<string, unknown>).__printfHandleOAuthCallback as ((token: string) => void) | undefined;
        if (h) {
          h(idToken);
          router.replace('/print');
        } else {
          router.replace('/print');
        }
      }, 100);
    }
  }, [router]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4"
      style={{ backgroundColor: colors.background }}>
      <div className="w-6 h-6 rounded-full border-2 border-current border-t-transparent animate-spin"
        style={{ color: colors.textMuted }} />
      <p className="text-sm" style={{ color: colors.textMuted }}>Completing sign in…</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}
