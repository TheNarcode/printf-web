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
  
  const [slides, setSlides] = useState(() => SLIDES.map((s, i) => ({ ...s, id: i })));
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setSlides(prev => {
        const newSlides = [...prev];
        const first = newSlides.shift();
        if (first) newSlides.push(first);
        return newSlides;
      });
    }, 500);
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
    if (isAnimating) return;
    setSlides(prev => {
      const newSlides = [...prev];
      while (newSlides[0].id !== index) {
        newSlides.push(newSlides.shift()!);
      }
      return newSlides;
    });
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    timeoutRef.current = setInterval(nextSlide, 5000);
  };

  return (
    <>
      <div className="h-[100dvh] flex flex-col overflow-hidden relative" style={{ backgroundColor: colors.background }}>
        
        {/* Natural Floating Orbs Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className="absolute top-[5%] left-[-5%] w-[30vh] h-[30vh] rounded-full"
            style={{
              backgroundColor: colors.textSecondary,
              opacity: 0.05, 
              animation: 'orb1 12s ease-in-out infinite alternate',
            }}
          />

          <div
            className="absolute top-[40%] right-[5%] w-[35vh] h-[35vh] rounded-full"
            style={{
              backgroundColor: colors.text,
              opacity: 0.05,
              animation: 'orb3 13s ease-in-out infinite alternate',
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

        {/* Carousel — Infinite Sliding implementation */}
        <div className="flex-1 z-10 flex flex-col justify-center overflow-hidden" style={{ paddingBottom: 160 }}>
          
          <div className="w-full overflow-hidden">
            <div 
              className={`flex w-full ${isAnimating ? 'transition-transform duration-500 ease-in-out -translate-x-full' : 'translate-x-0'}`}
            >
              {slides.map((slide) => {
                const src = (slide as any).lottie || (isDark ? (slide as any).lottieDark : (slide as any).lottieLight);
                return (
                  <div key={slide.id} className="w-full shrink-0 flex flex-col items-center px-8">
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
              const activeId = isAnimating && slides.length > 1 ? slides[1].id : slides[0].id;
              const isActive = index === activeId;
              return (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: isActive ? colors.primary : colors.textMuted,
                    opacity: isActive ? 1 : 0.3,
                    transform: isActive ? 'scale(1.5)' : 'scale(1)',
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              );
            })}
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
                  <span className="text-[15px]" style={{ color: colors.text, fontWeight: 700 }}>
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
