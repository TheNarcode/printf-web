"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme/ThemeContext";

export default function LandingClient() {
  const { colors, isDark, setMode, mode } = useTheme();
  const router = useRouter();
  const pageRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const handler = () => setScrollY(el.scrollTop);
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, []);

  const scrolled = scrollY > 60;

  return (
    <div
      ref={pageRef}
      className="h-[100dvh] overflow-y-auto"
      style={{ backgroundColor: colors.background, color: colors.text }}
    >
      <div
        className="sticky top-0 z-50 flex items-start justify-center"
        style={{ paddingTop: scrolled ? 12 : 24 }}
      >
        <header
          className="transition-all duration-300 ease-in-out w-full"
          style={{
            maxWidth: scrolled ? 520 : 768,
            borderRadius: scrolled ? 9999 : 0,
            backgroundColor: scrolled
              ? isDark
                ? "rgba(9,9,11,0.85)"
                : "rgba(250,250,250,0.85)"
              : "transparent",
            backdropFilter: scrolled ? "blur(16px) saturate(2)" : "none",
            border: scrolled
              ? `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)"}`
              : "1px solid transparent",
            boxShadow: scrolled
              ? `0 12px 40px rgba(0,0,0,${isDark ? 0.4 : 0.08})`
              : "none",
          }}
        >
          <div className="flex items-center justify-between px-5 h-14">
            <div className="flex items-center gap-3">
              <span className="text-[16px] font-black tracking-[-0.04em] uppercase">
                Shree Printer and Xerox
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setMode(
                    mode === "dark"
                      ? "light"
                      : mode === "light"
                        ? "system"
                        : "dark",
                  )
                }
                className="transition-opacity "
                style={{ color: colors.text }}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun size={15} strokeWidth={2.5} />
                ) : (
                  <Moon size={15} strokeWidth={2.5} />
                )}
              </button>
              <button
                onClick={() => router.push("/print")}
                className="text-[13px] font-bold tracking-tight uppercase  transition-opacity"
                style={{ color: colors.text }}
              >
                Sign In
              </button>
            </div>
          </div>
        </header>
      </div>

      {/* ── Hero: Stark Typography ── */}
      <section className="px-6 pt-24 pb-12 max-w-5xl mx-auto text-center">
        <h1
          className="text-6xl md:text-[88px] font-black tracking-tighter leading-[0.95] mb-8"
          style={{ color: colors.text }}
        >
          Print your documents.
          <br />
          Securely.
          <br />
          Instantly.
        </h1>
        <p
          className="text-xl md:text-2xl font-medium tracking-tight max-w-2xl mx-auto leading-snug mb-16"
          style={{ color: colors.textSecondary }}
        >
          No queues. No subscriptions. Upload your files, configure your layout,
          and pick them up. Powered by seamless Google Authentication.
        </p>
        <button
          onClick={() => router.push("/print")}
          className="h-14 px-10 text-[15px] font-bold uppercase tracking-widest transition-transform  active:scale-95"
          style={{ backgroundColor: colors.text, color: colors.background }}
        >
          Start Printing
        </button>
      </section>

      {/* ── Narrative Flow ── */}
      <section
        className="px-6 py-32 border-t"
        style={{ borderColor: colors.border }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-20"
            style={{ color: colors.textSecondary }}
          >
            The Workflow
          </h2>

          <div className="flex flex-col gap-24">
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-baseline">
              <span
                className="text-[120px] font-black leading-none tracking-tighter"
                style={{ color: colors.text, opacity: 0.1 }}
              >
                1
              </span>
              <div>
                <h3
                  className="text-3xl font-bold tracking-tight mb-4"
                  style={{ color: colors.text }}
                >
                  Upload Without Friction
                </h3>
                <p
                  className="text-lg leading-relaxed font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  Whether it&apos;s a massive thesis PDF or a quick
                  high-resolution image, drop it in. The system chunks and
                  transmits your files securely via encrypted endpoints directly
                  to the spooler.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-baseline">
              <span
                className="text-[120px] font-black leading-none tracking-tighter"
                style={{ color: colors.text, opacity: 0.1 }}
              >
                2
              </span>
              <div>
                <h3
                  className="text-3xl font-bold tracking-tight mb-4"
                  style={{ color: colors.text }}
                >
                  Configure Instantly
                </h3>
                <p
                  className="text-lg leading-relaxed font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  Select color profiles, page sides, and orientation. The system
                  parses your document in real-time, calculating exact page
                  counts and costs before you even click checkout.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-baseline">
              <span
                className="text-[120px] font-black leading-none tracking-tighter"
                style={{ color: colors.text, opacity: 0.1 }}
              >
                3
              </span>
              <div>
                <h3
                  className="text-3xl font-bold tracking-tight mb-4"
                  style={{ color: colors.text }}
                >
                  Queue & Collect
                </h3>
                <p
                  className="text-lg leading-relaxed font-medium"
                  style={{ color: colors.textSecondary }}
                >
                  Payment is handled seamlessly through Razorpay. Once verified,
                  your order enters the physical queue. Track its exact status
                  from your dashboard and pick it up when it says
                  &quot;Completed&quot.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── High Contrast Security Block ── */}
      <section
        className="px-6 py-32"
        style={{ backgroundColor: colors.text, color: colors.background }}
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-[11px] font-mono font-bold tracking-[0.2em] uppercase mb-16 opacity-60">
            Authentication & Privacy
          </h2>
          <h3 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1] mb-8">
            Verified by Google.
            <br />
            Zero passwords.
          </h3>
          <div className="max-w-2xl">
            <p className="text-xl leading-relaxed font-medium mb-12 opacity-90">
              We rely entirely on Google Sign-In. This means we never store,
              see, or manage passwords. We request absolute minimum scope: only
              your Name and Email to send receipts and identify your orders.
            </p>
            <p className="text-lg leading-relaxed opacity-70 mb-12">
              We do not, and will never, request access to your Google Drive,
              your contacts, or any other sensitive data. Your uploaded
              documents are treated as ephemeral—they are purged immediately
              after your order finishes printing.
            </p>
          </div>
        </div>
      </section>

      {/* ── Minimal Footer ── */}
      <footer
        className="px-6 py-16"
        style={{ backgroundColor: colors.background }}
      >
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div
            className="text-[13px] font-bold tracking-tight uppercase"
            style={{ color: colors.text }}
          >
            Shree Printer and Xerox © 2026
          </div>
          <div className="flex gap-8">
            <a
              href="/terms"
              className="text-[12px] font-bold tracking-wider uppercase transition-opacity "
              style={{ color: colors.textSecondary }}
            >
              Terms
            </a>
            <a
              href="/privacy"
              className="text-[12px] font-bold tracking-wider uppercase transition-opacity "
              style={{ color: colors.textSecondary }}
            >
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
