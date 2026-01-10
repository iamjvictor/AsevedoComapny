'use client';

/**
 * Language Switcher Component
 * Shows only on first screen (Hero), hides when scrolled down
 * Uses fluid design for proportional sizing across all screens
 */

import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { routing, type Locale } from '@/i18n/routing';

export function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para esconder o switcher
  useEffect(() => {
    const handleScroll = () => {
      // Esconde quando scrollou mais de 80% da altura da tela
      setIsScrolled(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const switchLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;

    const segments = pathname.split('/');
    
    if (segments[1] && routing.locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale;
    } else {
      segments.splice(1, 0, newLocale);
    }

    const newPath = segments.join('/') || '/';

    startTransition(() => {
      router.push(newPath);
      router.refresh();
    });
  };

  return (
    <div 
      className={`
        fixed z-[60] flex items-center bg-background/80 backdrop-blur-xl border border-card-border rounded-full shadow-lg
        transition-all duration-300
        ${isScrolled 
          ? 'opacity-0 translate-y-2 pointer-events-none' 
          : 'opacity-100 translate-y-0 pointer-events-auto'
        }
      `}
      style={{
        top: 'calc(var(--logo-height) + var(--space-2))',
        right: 'var(--space-3)',
        gap: 'var(--space-1)',
        padding: 'var(--space-1)',
      }}
    >
      <button
        onClick={() => switchLocale('pt-BR')}
        disabled={isPending}
        className={`
          flex items-center rounded-full transition-all duration-200
          ${locale === 'pt-BR' 
            ? 'bg-primary/20 text-primary font-semibold' 
            : 'text-foreground-secondary hover:text-foreground hover:bg-white/5'
          }
          ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{
          gap: 'var(--space-1)',
          padding: 'var(--space-2) var(--space-3)',
          fontSize: 'var(--text-sm)',
        }}
        aria-label="Mudar para Português"
      >
        <span style={{ fontSize: 'var(--text-base)' }}>🇧🇷</span>
        <span className="hidden sm:inline">{t('portuguese')}</span>
      </button>
      
      <button
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={`
          flex items-center rounded-full transition-all duration-200
          ${locale === 'en' 
            ? 'bg-primary/20 text-primary font-semibold' 
            : 'text-foreground-secondary hover:text-foreground hover:bg-white/5'
          }
          ${isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        style={{
          gap: 'var(--space-1)',
          padding: 'var(--space-2) var(--space-3)',
          fontSize: 'var(--text-sm)',
        }}
        aria-label="Switch to English"
      >
        <span style={{ fontSize: 'var(--text-base)' }}>🇺🇸</span>
        <span className="hidden sm:inline">{t('english')}</span>
      </button>
    </div>
  );
}
