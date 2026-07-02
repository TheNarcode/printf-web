import React from 'react';
import { Link } from 'next-view-transitions';
import { ArrowLeft } from 'lucide-react';
import { termsHTML } from './termsContent';

export const metadata = {
  title: 'Terms and Conditions - printf',
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-text)', fontFamily: 'var(--font-geist-sans), sans-serif' }}>
      <header className="px-6 py-8 max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-[13px] font-bold tracking-tight uppercase transition-opacity hover:opacity-50"
          style={{ color: 'var(--color-text)' }}
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          Back to Home
        </Link>
        <span className="text-[16px] font-black tracking-[-0.04em] uppercase">printf</span>
      </header>

      <main className="px-6 py-20 max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[1] mb-12" style={{ color: 'var(--color-text)' }}>
          Terms and Conditions
        </h1>
        <div suppressHydrationWarning className="prose prose-lg dark:prose-invert max-w-none prose-h2:text-3xl prose-h2:font-bold prose-h2:tracking-tight prose-h2:mt-16 prose-h2:mb-8 prose-h3:text-xl prose-p:text-[17px] prose-p:leading-relaxed prose-li:text-[17px] prose-strong:text-[var(--color-text)]" style={{ color: 'var(--color-text-secondary)' }}>
          <p className="text-sm font-mono tracking-widest uppercase mb-12 opacity-60">Last updated: June 28, 2026</p>
          <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: termsHTML }} />
        </div>
      </main>
    </div>
  );
}
