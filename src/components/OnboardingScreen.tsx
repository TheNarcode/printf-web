'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import GoogleLogo from './GoogleLogo';
import Header from './Header';

const SLIDES = [
  {
    title: '',
    subtitle: '',
    lottieLight: '/welcome(light).lottie',
    lottieDark: '/welcome(dark).lottie',
  },
  {
    title: 'Print Anywhere',
    subtitle: 'Upload documents instantly.',
    lottie: '/print.lottie',
  },
  {
    title: 'Stay Updated',
    subtitle: 'Track orders live.',
    lottie: '/notify.lottie',
  },
  {
    title: 'Save Time',
    subtitle: 'Fast & frictionless.',
    lottie: '/xerox.lottie',
  }
];

export default function OnboardingScreen() {
  const { isAuthenticated, isLoading, signInWithGoogle } = useAuth();
  const { colors, isDark, setMode } = useTheme();
  const router = useRouter();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % SLIDES.length);
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    timeoutRef.current = setInterval(nextSlide, 5000);
    return () => {
      if (timeoutRef.current) clearInterval(timeoutRef.current);
    };
  }, []);

  if (isLoading || isAuthenticated) {
    return (
      <div className="h-[100dvh] flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: colors.textMuted }} />
      </div>
    );
  }

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    timeoutRef.current = setInterval(nextSlide, 5000);
  };

  return (
    <>
      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-100px, 120px) scale(1.1); }
          66% { transform: translate(80px, -80px) scale(0.9); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(120px, -100px) scale(0.9); }
          66% { transform: translate(-80px, 80px) scale(1.1); }
        }
      `}</style>
      
      <div className="h-[100dvh] flex flex-col overflow-hidden relative" style={{ backgroundColor: colors.background }}>
        
        {/* Background Decor */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="absolute rounded-full filter blur-[60px]"
            style={{
              width: 600, height: 600,
              top: -150, right: -200,
              backgroundColor: colors.primary,
              opacity: 0.15,
              animation: 'float1 18s ease-in-out infinite'
            }}
          />
          <div
            className="absolute rounded-full filter blur-[80px]"
            style={{
              width: 500, height: 500,
              bottom: 0, left: -250,
              backgroundColor: colors.primary,
              opacity: 0.12,
              animation: 'float2 15s ease-in-out infinite'
            }}
          />
          <div
            className="absolute rounded-full filter blur-[100px]"
            style={{
              width: 400, height: 400,
              top: '30%', left: '20%',
              backgroundColor: colors.primary,
              opacity: 0.08,
              animation: 'float1 20s ease-in-out infinite reverse'
            }}
          />
        </div>

        <Header 
          showBrand 
          transparent
          rightElement={
            <button
              onClick={() => setMode(isDark ? 'light' : 'dark')}
              className="p-2 rounded-full transition-colors hover:bg-black/5 dark:hover:bg-white/10"
              style={{ color: colors.text }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
            </button>
          }
        />

        {/* Carousel — Sliding implementation */}
        <div className="flex-1 z-10 flex flex-col justify-center overflow-hidden" style={{ paddingBottom: 160 }}>
          
          <div className="w-full overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {SLIDES.map((slide, index) => {
                const src = (slide as any).lottie || (isDark ? (slide as any).lottieDark : (slide as any).lottieLight);
                return (
                  <div key={index} className="w-full flex-shrink-0 flex flex-col items-center px-8">
                    {/* Animation */}
                    <div className="w-full max-w-[320px] aspect-square flex items-center justify-center">
                      {src && (
                        <DotLottieReact
                          src={src}
                          loop
                          autoplay
                          style={{ width: '100%', height: '100%' }}
                        />
                      )}
                    </div>
                    
                    {/* Text */}
                    <div className="h-[72px] mt-2 flex flex-col items-center justify-center text-center">
                      {slide.title && (
                        <h1
                          className="text-[26px] leading-tight font-black tracking-[-0.5px]"
                          style={{ color: colors.text, fontFamily: 'var(--font-geist-sans), sans-serif' }}
                        >
                          {slide.title}
                        </h1>
                      )}
                      {slide.subtitle && (
                        <p
                          className="text-[14px] leading-snug mt-1.5"
                          style={{ color: colors.textSecondary, fontFamily: 'var(--font-geist-sans), sans-serif' }}
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
            {SLIDES.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className="w-1.5 h-1.5 rounded-full transition-all duration-500 ease-out"
                style={{
                  backgroundColor: index === currentIndex ? colors.primary : colors.textMuted,
                  opacity: index === currentIndex ? 1 : 0.3,
                  transform: index === currentIndex ? 'scale(1.5)' : 'scale(1)',
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Sticky Bottom Login */}
        <div
          className="absolute bottom-0 left-0 right-0 z-20 px-6 pt-24 pb-14 flex flex-col items-center pointer-events-none"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${colors.background} 30%, ${colors.background} 100%)`
          }}
        >
          <div className="w-full max-w-sm flex flex-col gap-4 pointer-events-auto">
            <button
              onClick={() => signInWithGoogle()}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 rounded-[100px] border transition-transform active:scale-95 disabled:opacity-60 shadow-lg hover:shadow-xl"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                paddingTop: 16,
                paddingBottom: 16,
                minHeight: 56
              }}
            >
              {isLoading ? (
                <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: colors.text }} />
              ) : (
                <>
                  <GoogleLogo size={20} />
                  <span className="text-[15px]" style={{ color: colors.text, fontWeight: 700, fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                    Continue with Google
                  </span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-3" style={{ color: colors.textMuted }}>
              <a href="/terms" className="text-[11px] font-semibold uppercase tracking-widest hover:underline opacity-50 hover:opacity-100 transition-opacity">Terms</a>
              <span className="text-[10px] opacity-20">●</span>
              <a href="/privacy" className="text-[11px] font-semibold uppercase tracking-widest hover:underline opacity-50 hover:opacity-100 transition-opacity">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
