'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import { useTheme } from '../../theme/ThemeContext';

export default function TermsPage() {
  const { colors } = useTheme();
  const router = useRouter();

  const section = (num: string, title: string, children: React.ReactNode) => (
    <section key={num} style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'baseline', marginBottom: '0.75rem' }}>
        <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6875rem', letterSpacing: '0.1em', opacity: 0.35, flexShrink: 0 }}>{num}</span>
        <h2 style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.text, margin: 0 }}>{title}</h2>
      </div>
      <div style={{ paddingLeft: '2.75rem', fontSize: '0.875rem', lineHeight: '1.65', color: colors.textSecondary }}>
        {children}
      </div>
    </section>
  );

  const li = (text: string) => (
    <div key={text} style={{ display: 'flex', gap: '0.75rem', borderTop: `1px solid ${colors.border}`, padding: '0.5rem 0', alignItems: 'baseline' }}>
      <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6875rem', opacity: 0.35, flexShrink: 0 }}>—</span>
      <span style={{ fontSize: '0.875rem', color: colors.textSecondary }}>{text}</span>
    </div>
  );

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: colors.background, color: colors.text, fontFamily: 'var(--font-geist-sans), system-ui, sans-serif' }}>
      <Header title="Terms of Usage" showBack onBack={() => router.back()} />
      <main style={{ maxWidth: '42rem', margin: '0 auto', padding: '1.5rem 1.5rem 6rem' }}>

        {section('01', 'The Service', <>
          <p>printf is a campus print service operated by <strong style={{ color: colors.text }}>The Narcode</strong> — an informal student group, not a registered entity. The service is available at{' '}
            <a href="https://print-f.top" target="_blank" rel="noopener noreferrer" style={{ color: colors.text, textDecoration: 'underline' }}>print-f.top</a>{' '}
            and as an Android APK, restricted to campus use only.
          </p>
        </>)}

        {section('02', 'Eligibility', <>
          <p style={{ marginBottom: '0.5rem' }}>By using printf, you confirm that:</p>
          {li('You are a student or staff member of the associated college.')}
          {li('You are at least 13 years of age.')}
          {li('You will not share your account or permit others to access it.')}
        </>)}

        {section('03', 'Payments & Refunds', <>
          <p>All payments are processed by <strong style={{ color: colors.text }}>Razorpay</strong> (RBI-regulated). Amounts are charged in INR via the payment methods available at checkout.</p>
          <div style={{ borderLeft: `2px solid ${colors.text}`, paddingLeft: '1rem', marginTop: '0.75rem' }}>
            <p style={{ fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em', textTransform: 'uppercase', color: colors.text, marginBottom: '0.25rem' }}>No Refunds</p>
            <p>All transactions are final. Refunds are not provided except where a verified system fault on our end causes an incorrect or failed print. Disputes must be raised within 24 hours via the contact details below.</p>
          </div>
        </>)}

        {section('04', 'Uploaded Files', <>
          <p>By uploading a file, you warrant that you hold the right to reproduce the content and that it does not infringe any law or third-party rights. You are solely responsible for the content you submit.</p>
          <p style={{ marginTop: '0.625rem' }}><strong style={{ color: colors.text }}>Auto-deletion:</strong> All uploaded files are permanently deleted from Cloudflare R2 within 24 hours of upload, irrespective of order status.</p>
          <p style={{ marginTop: '0.625rem' }}>We reserve the right to refuse printing of content that violates these terms.</p>
        </>)}

        {section('05', 'Prohibited Conduct', <>
          <p style={{ marginBottom: '0.5rem' }}>You may not use printf to:</p>
          {li('Reproduce copyrighted content without authorisation from the rights holder.')}
          {li('Submit illegal, obscene, or defamatory material for printing.')}
          {li('Attempt to exploit, scrape, or disrupt the service or its infrastructure.')}
          {li('Use automated scripts, bots, or non-human agents to interact with the service.')}
          {li('Circumvent payment obligations or obtain print jobs without valid payment.')}
          <p style={{ marginTop: '0.75rem' }}>Violations may result in immediate account suspension.</p>
        </>)}

        {section('06', 'Android App', <>
          <p>The Android APK is distributed via direct sideload — it is not on the Play Store. By installing it, you agree not to decompile, reverse-engineer, modify, or redistribute the application.</p>
        </>)}

        {section('07', 'Intellectual Property', <>
          <p>The printf app, its code, and branding belong to The Narcode. You retain ownership of your uploaded documents. By submitting a file, you grant us a temporary licence to process and print it — this expires upon automatic deletion of the file (within 24 hours).</p>
        </>)}

        {section('08', 'Disclaimer', <>
          <p>printf is provided &ldquo;as is&rdquo; without warranties of any kind. The Narcode is not liable for service interruptions, print errors, or any indirect or consequential damages. Liability, if established, is capped at the amount paid for the specific transaction in dispute.</p>
        </>)}

        {section('09', 'Governing Law', <>
          <p>These terms are governed by the laws of Maharashtra, India. Disputes shall be subject to the exclusive jurisdiction of courts in Mumbai. We encourage direct resolution — contact us before initiating formal proceedings.</p>
        </>)}

        {section('10', 'Changes', <>
          <p>We may update these terms at any time. Material changes will be communicated via in-app notification or email. Continued use constitutes acceptance of the revised terms.</p>
        </>)}

        {/* Contact */}
        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '1.5rem', marginTop: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'baseline', marginBottom: '1rem' }}>
            <span style={{ fontFamily: 'var(--font-geist-mono), monospace', fontSize: '0.6875rem', letterSpacing: '0.1em', opacity: 0.35, flexShrink: 0 }}>—</span>
            <h2 style={{ fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: colors.text, margin: 0 }}>Contact</h2>
          </div>
          <div style={{ paddingLeft: '2.75rem' }}>
            <p style={{ fontSize: '0.875rem', color: colors.textSecondary }}>For all enquiries regarding these terms, or to raise a dispute, write to{' '}
              <a href="mailto:thenarcode@gmail.com" style={{ color: colors.text, textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 600 }}>thenarcode@gmail.com</a>.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
