'use client';

/**
 * Header Component
 * Fixed transparent header with fluid responsive design
 * Features: logo, language switcher (stacked above menu), dropdown menu
 * CTA button appears after scroll
 */

import { ChevronDown, User, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState, useTransition } from 'react';
import { routing, type Locale } from '@/i18n/routing';
import { Button } from '../ui/Button';

export function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPending, startTransition] = useTransition();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToCTA = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const ctaSection = document.getElementById('cta');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent pointer-events-none">
      <div 
        className="w-full pointer-events-auto"
        style={{
          padding: 'clamp(0.5rem, 0.4rem + 0.5vw, 1rem) clamp(1rem, 0.8rem + 2vw, 2rem)',
        }}
      >
        <nav className="flex items-start justify-between max-w-full">
          {/* Logo Branca */}
          <Link
            href={`/${locale}`}
            className="hover:opacity-80 transition-opacity shrink-0"
          >
            <Image
              src="/LogoBranca.png"
              alt="Asevedo Company"
              width={680}
              height={192}
              className="w-auto"
              style={{ height: 'var(--logo-height)' }}
              priority
            />
          </Link>

          {/* Right Side - Stacked: Language on top, CTA + Dropdown below */}
          <div className="flex flex-col items-end shrink-0" style={{ gap: 'var(--space-2)' }}>
            
            {/* Minimal Language Switcher - Stacked above menu */}
            <div 
              className={`flex items-center transition-all duration-300 ${
                isScrolled ? 'opacity-0 pointer-events-none h-0' : 'opacity-100'
              }`}
              style={{ gap: 'var(--space-1)' }}
            >
              <button
                onClick={() => switchLocale('pt-BR')}
                disabled={isPending}
                className={`
                  rounded-full transition-all duration-200
                  ${locale === 'pt-BR' 
                    ? 'opacity-100 scale-110' 
                    : 'opacity-50 hover:opacity-80'
                  }
                  ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{
                  padding: 'var(--space-1)',
                  fontSize: 'clamp(0.875rem, 0.75rem + 0.5vw, 1.125rem)',
                }}
                aria-label="Português"
              >
                🇧🇷
              </button>
              
              <button
                onClick={() => switchLocale('en')}
                disabled={isPending}
                className={`
                  rounded-full transition-all duration-200
                  ${locale === 'en' 
                    ? 'opacity-100 scale-110' 
                    : 'opacity-50 hover:opacity-80'
                  }
                  ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{
                  padding: 'var(--space-1)',
                  fontSize: 'clamp(0.875rem, 0.75rem + 0.5vw, 1.125rem)',
                }}
                aria-label="English"
              >
                🇺🇸
              </button>
            </div>

            {/* Row: CTA Button + Dropdown */}
            <div className="flex items-center" style={{ gap: 'var(--space-2)' }}>
              {/* CTA Button - Fazer Orçamento (aparece só após scroll) */}
              <div className={`transition-all duration-300 ${isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
                <Button 
                  onClick={scrollToCTA}
                  size="sm"
                  className="whitespace-nowrap"
                  style={{ 
                    fontSize: 'var(--text-sm)',
                    padding: 'var(--space-2) var(--space-4)',
                  }}
                >
                  {t('getQuote')}
                </Button>
              </div>

              {/* Dropdown Menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center justify-center hover:opacity-70 transition-all duration-300"
                  style={{ padding: 'var(--space-1)' }}
                  aria-label="Menu"
                >
                  <ChevronDown 
                    className={`text-white transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
                    style={{ width: 'var(--icon-xl)', height: 'var(--icon-xl)' }}
                  />
                </button>

                {/* Dropdown Content */}
                <div
                  className={`absolute right-0 top-full mt-2 rounded-xl bg-background/95 backdrop-blur-xl border border-card-border shadow-2xl overflow-hidden transition-all duration-300 ${
                    isMenuOpen 
                      ? 'opacity-100 translate-y-0 pointer-events-auto' 
                      : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                  style={{ width: 'clamp(11rem, 35vw, 14rem)' }}
                >
                  <div style={{ padding: 'var(--space-2) 0' }}>
                    <Link
                      href={`/${locale}/cliente`}
                      className="flex items-center text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      style={{ gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)' }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User style={{ width: 'var(--icon-md)', height: 'var(--icon-md)' }} />
                      <span className="font-medium">{t('clientArea')}</span>
                    </Link>
                    <Link
                      href={`/${locale}/parceiro`}
                      className="flex items-center text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                      style={{ gap: 'var(--space-3)', padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--text-sm)' }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Users style={{ width: 'var(--icon-md)', height: 'var(--icon-md)' }} />
                      <span className="font-medium">{t('becomePartner')}</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
