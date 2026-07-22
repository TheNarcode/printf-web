"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme/ThemeContext";
import GoogleLogo from "./GoogleLogo";
import Header from "./Header";
import Link from "next/link";

const SLIDES = [
  {
    title: "Welcome to Shree Printer and Xerox!",
    subtitle: "One stope print solution.",
    uri: "https://lottie.host/6ec486aa-843b-4566-a632-f62955af5aea/B1bbq9mOd7.lottie",
  },
  {
    title: "Print from Anywhere",
    subtitle: "Upload documents instantly.",
    uri: "https://lottie.host/2443202d-0b4d-4224-bc56-c9d29bf6c186/69Hvfcelft.lottie",
  },
  {
    title: "Stay Updated",
    subtitle: "Push notifications to track your orders",
    uri: "https://lottie.host/0f682ab2-d02f-49fc-b7c5-0c317bda0528/rYz2KNLnkn.lottie",
  },
  {
    title: "Save Time",
    subtitle: "No more standing in queues for print",
    uri: "https://lottie.host/e7926353-a492-44ed-8645-7d8f791bff1b/kcbMmVbGF1.lottie",
  },
];

export default function LoginScreen() {
  const { isAuthenticated, isLoading, isAuthenticating, signInWithGoogle } =
    useAuth();
  const { colors, isDark, setMode } = useTheme();
  const router = useRouter();

  const [slides, setSlides] = useState(() =>
    SLIDES.map((s, i) => ({ ...s, id: i })),
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setSlides((prev) => {
        const newSlides = [...prev];
        const first = newSlides.shift();
        if (first) newSlides.push(first);
        return newSlides;
      });
    }, 500);
  }, []);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    timeoutRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, [nextSlide]);

  if (isLoading || isAuthenticated || isAuthenticating) {
    return (
      <div
        className="h-[100dvh] flex flex-col items-center justify-center z-[9999]"
        style={{ backgroundColor: colors.background }}
      >
        <div
          className="w-8 h-8 rounded-full border-[3px] animate-spin"
          style={{
            borderBottomColor: colors.primary,
            borderLeftColor: colors.primary,
            borderRightColor: colors.primary,
            borderTopColor: "transparent",
          }}
        />
        <span
          className="mt-4 text-sm font-medium"
          style={{ color: colors.textSecondary }}
        >
          {isAuthenticating ? "Authenticating..." : "Loading..."}
        </span>
      </div>
    );
  }

  return (
    <>
      <div
        className="h-[100dvh] flex flex-col overflow-hidden relative"
        style={{ backgroundColor: colors.background }}
      >
        {/* Natural Floating Orbs Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className="absolute top-[5%] left-[-10%] w-[30vh] h-[30vh] rounded-full"
            style={{
              backgroundColor: colors.textSecondary,
              opacity: 0.05,
              animation: "orb1 16s ease-in-out infinite",
            }}
          />

          <div
            className="absolute top-[40%] right-[-10%] w-[37vh] h-[37vh] rounded-full"
            style={{
              backgroundColor: colors.text,
              opacity: 0.05,
              animation: "orb2 20s ease-in-out infinite",
            }}
          />
        </div>

        <Header
          showBrand
          transparent
          rightElement={
            <button
              onClick={() => setMode(isDark ? "light" : "dark")}
              className="p-2 rounded-full transition-colors  "
              style={{ color: colors.text }}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={20} strokeWidth={2} />
              ) : (
                <Moon size={20} strokeWidth={2} />
              )}
            </button>
          }
        />

        {/* Carousel — Infinite Sliding implementation */}
        <div
          className="flex-1 z-10 flex flex-col justify-center overflow-hidden"
          style={{ paddingBottom: 160 }}
        >
          <div className="w-full overflow-hidden">
            <div
              className={`flex w-full ${isAnimating ? "transition-transform duration-500 ease-in-out -translate-x-full" : "translate-x-0"}`}
            >
              {slides.map((slide) => {
                const src =
                  (slide as any).uri ||
                  (slide as any).lottie ||
                  (isDark
                    ? (slide as any).lottieDark
                    : (slide as any).lottieLight);
                return (
                  <div
                    key={slide.id}
                    className="w-full shrink-0 flex flex-col items-center px-8"
                  >
                    {/* Animation */}
                    <div className="w-full max-w-[320px] aspect-square flex items-center justify-center">
                      {src && (
                        <DotLottieReact
                          src={src}
                          loop
                          autoplay
                          style={{ width: "100%", height: "100%" }}
                        />
                      )}
                    </div>

                    {/* Text */}
                    <div className="h-[72px] mt-2 flex flex-col items-center justify-center text-center">
                      {slide.title && (
                        <h1
                          className="text-[26px] leading-tight font-black tracking-[-0.5px]"
                          style={{ color: colors.text }}
                        >
                          {slide.title}
                        </h1>
                      )}
                      {slide.subtitle && (
                        <p
                          className="text-[14px] leading-snug mt-1.5"
                          style={{ color: colors.textSecondary }}
                        >
                          {slide.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2.5 mt-8">
            {SLIDES.map((_, index) => {
              const activeId =
                isAnimating && slides.length > 1 ? slides[1].id : slides[0].id;
              const isActive = index === activeId;
              return (
                <div
                  key={index}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: isActive
                      ? colors.primary
                      : colors.textMuted,
                    opacity: isActive ? 1 : 0.3,
                    transform: isActive ? "scale(1.5)" : "scale(1)",
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Sticky Bottom Login */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 px-6 pt-24 pb-14 flex flex-col items-center pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${colors.background} 30%, ${colors.background} 100%)`,
          }}
        >
          <div className="w-full max-w-sm flex flex-col gap-4 pointer-events-auto">
            <button
              onClick={() => signInWithGoogle()}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-[100px] border transition-transform active:scale-95 disabled:opacity-60 shadow-lg "
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                paddingTop: 16,
                paddingBottom: 16,
                minHeight: 56,
              }}
            >
              {isLoading ? (
                <div
                  className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                  style={{ borderColor: colors.text }}
                />
              ) : (
                <>
                  <GoogleLogo size={20} />
                  <span
                    className="text-[15px]"
                    style={{ color: colors.text, fontWeight: 700 }}
                  >
                    Continue with Google
                  </span>
                </>
              )}
            </button>

            <div className="flex justify-center mt-4">
              <p
                className="text-[11px] text-center leading-4 opacity-70"
                style={{ color: colors.textMuted }}
              >
                By signing in, you agree to our{" "}
                <Link
                  href="/terms"
                  className="font-semibold underline  transition-opacity"
                >
                  Terms of Usage
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="font-semibold underline  transition-opacity"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
