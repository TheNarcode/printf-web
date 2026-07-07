'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon, Printer, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../theme/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function PrivacyPage() {
  const { colors, isDark, setMode } = useTheme();
  const { isAuthenticated } = useAuth();

  const back = isAuthenticated ? '/dashboard' : '/';

  const section = (num: string, title: string, children: React.ReactNode) => (
    <section style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'baseline', marginBottom: '0.75rem' }}>
        <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6875rem', letterSpacing: '0.1em', opacity: 0.35, flexShrink: 0 }}>{num}</span>
        <h2 style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.text, margin: 0 }}>{title}</h2>
      </div>
      <div style={{ paddingLeft: '2.75rem', fontSize: '0.875rem', lineHeight: '1.65', color: colors.textSecondary }}>
        {children}
      </div>
    </section>
  );

  const row = (label: string, value: string) => (
    <div key={label} style={{ display: 'flex', gap: '1rem', borderTop: `1px solid ${colors.border}`, padding: '0.625rem 0', alignItems: 'baseline' }}>
      <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6875rem', letterSpacing: '0.05em', opacity: 0.5, width: '7rem', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '0.875rem', color: colors.textSecondary }}>{value}</span>
    </div>
  );

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: colors.background, color: colors.text, fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>

      {/* Header */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', backgroundColor: 'transparent', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Printer size={16} strokeWidth={1.8} style={{ color: colors.text }} />
          <span style={{ fontSize: '0.9375rem', fontWeight: 700, letterSpacing: '-0.02em', color: colors.text }}>printf</span>
        </div>
        <button onClick={() => setMode(isDark ? 'light' : 'dark')} style={{ color: colors.text, padding: '0.5rem', borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Toggle theme">
          {isDark ? <Sun size={18} strokeWidth={2} /> : <Moon size={18} strokeWidth={2} />}
        </button>
      </header>

      <main style={{ maxWidth: '42rem', margin: '0 auto', padding: '1.5rem 1.5rem 6rem' }}>

        {/* Back */}
        <Link href={back} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.textSecondary, textDecoration: 'none', marginBottom: '2.5rem' }}>
          <ArrowLeft size={12} strokeWidth={2.5} />Back
        </Link>

        {/* Title */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6875rem', letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.4, marginBottom: '0.625rem' }}>Effective 7 July 2026</p>
          <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.25rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1, color: colors.text, margin: 0 }}>Privacy Policy</h1>
        </div>

        {section('01', 'Data We Collect', <>
          <p style={{ marginBottom: '0.75rem' }}>We collect the minimum necessary to operate the service:</p>
          {row('Email address', 'Collected via Google Sign-In. Used solely to identify your account and associate orders.')}
          {row('Uploaded files', 'Stored in Cloudflare R2. Auto-deleted within 24 hours regardless of order status. No copies retained.')}
          {row('Order metadata', 'Page count, colour mode, copies, duplex preference — stored to process and track your print job.')}
          <p style={{ marginTop: '0.875rem', fontSize: '0.8125rem', fontStyle: 'italic', opacity: 0.7 }}>
            We collect no name, phone number, device ID, location, or biometric data. No analytics. No ad tracking. No user profiling.
          </p>
        </>)}

        {section('02', 'Payments', <>
          <p>All payments are handled by <strong style={{ color: colors.text }}>Razorpay</strong> (RBI-regulated, PCI-DSS certified). printf never sees, stores, or touches your payment credentials — card numbers, UPI IDs, or banking tokens are entered directly into Razorpay's infrastructure.</p>
          <p style={{ marginTop: '0.625rem' }}>We share your email with Razorpay only to generate a payment order. Their processing is governed by the{' '}
            <a href="https://razorpay.com/privacy-policy/" target="_blank" rel="noopener noreferrer" style={{ color: colors.text, textDecoration: 'underline' }}>Razorpay Privacy Policy</a>.
          </p>
        </>)}

        {section('03', 'Infrastructure', <>
          <p style={{ marginBottom: '0.75rem' }}>printf runs entirely on Cloudflare's edge network:</p>
          {row('Pages', 'Hosts and serves the web app.')}
          {row('Workers', 'Runs server-side API logic.')}
          {row('D1', 'Stores order records and account data.')}
          {row('R2', 'Temporary file storage. 24-hour auto-deletion.')}
          <p style={{ marginTop: '0.875rem' }}>Cloudflare may process network telemetry (IP addresses, request logs) for security and reliability under their own{' '}
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" style={{ color: colors.text, textDecoration: 'underline' }}>Privacy Policy</a>.
          </p>
        </>)}

        {section('04', 'Data Retention', <>
          {row('Uploaded files', '≤ 24 hours. Automated Cloudflare R2 lifecycle policy.')}
          {row('Order records', 'Until you request account deletion.')}
          {row('Email (account)', 'Until you request account deletion.')}
        </>)}

        {section('05', 'Security', <>
          <p>All traffic is encrypted over HTTPS (TLS 1.3). Files are encrypted at rest (AES-256). No payment credentials are stored on our systems.</p>
          <p style={{ marginTop: '0.625rem', fontSize: '0.8125rem', fontStyle: 'italic', opacity: 0.7 }}>printf is a student project. Reasonable security controls are in place, but we cannot guarantee absolute security of any internet-facing system.</p>
        </>)}

        {section('06', 'Notifications', <>
          <p>Push notifications (Android) and transactional emails are sent only for order status events — confirmation, ready for collection. No marketing or promotional communications.</p>
        </>)}

        {section('07', 'Your Rights', <>
          <p style={{ marginBottom: '0.75rem' }}>You may request, at any time:</p>
          {row('Access', 'A summary of personal data we hold about you.')}
          {row('Rectification', 'Correction of inaccurate data.')}
          {row('Erasure', 'Deletion of your account and all associated data.')}
          {row('Portability', 'An export of your order history.')}
        </>)}

        {section('08', 'Changes', <>
          <p>Material changes will be communicated via in-app notification or email. The effective date above is updated with each revision. Continued use constitutes acceptance.</p>
        </>)}

        {/* Contact */}
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '1.5rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'baseline', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6875rem', letterSpacing: '0.1em', opacity: 0.35, flexShrink: 0 }}>—</span>
            <h2 style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.text, margin: 0 }}>Contact</h2>
          </div>
          <div style={{ paddingLeft: '2.75rem' }}>
            <p style={{ fontSize: '0.875rem', color: colors.textSecondary }}>For all privacy-related enquiries, data requests, or account deletion, write to{' '}
              <a href="mailto:thenarcode@gmail.com" style={{ color: colors.text, textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 600 }}>thenarcode@gmail.com</a>.
            </p>
          </div>
        </div>
      </main>

      <footer style={{ borderTop: `1px solid ${colors.border}`, padding: '1.25rem 1.5rem', maxWidth: '42rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.6875rem', fontFamily: 'var(--font-geist-mono), monospace', letterSpacing: '0.06em', color: colors.textMuted, opacity: 0.5 }}>printf © 2026 — The Narcode</span>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <a href="https://github.com/thenarcode" target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors.textSecondary, textDecoration: 'none', opacity: 0.6 }}>GitHub</a>
          <Link href="/terms" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: colors.textSecondary, textDecoration: 'none', opacity: 0.6 }}>Terms</Link>
        </div>
      </footer>
    </div>
  );
}
