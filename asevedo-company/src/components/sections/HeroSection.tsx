'use client';

/**
 * Hero Section Component
 * Simple centered phrase with animated background and typewriter effect
 * Uses fluid design for proportional sizing across all screens
 */

import { DottedSurface } from '@/components/effects';
import { ChevronDown } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const t = useTranslations('Hero');
  const locale = useLocale();
  
  const fullText = t('typewriterText');
  const highlightWord = t('highlightWord');
  
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => setIsTypingComplete(true), 300);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, [fullText]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  const scrollToNextSection = () => {
    const sectionIds = ['hero', 'proof', 'services', 'process', 'about', 'cta'];
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    
    const scrollPosition = window.scrollY + 100;
    
    for (const section of sections) {
      if (section.offsetTop > scrollPosition) {
        section.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Esfera/Lua iluminada no topo */}
      <div 
        className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
        aria-hidden="true"
        style={{
          top: 'clamp(-300px, -25vw, -400px)',
          width: 'clamp(400px, 50vw, 700px)',
          height: 'clamp(400px, 50vw, 700px)',
          animation: 'float 8s ease-in-out infinite',
        }}
      >
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 100%, #1a1a2e 0%, #0a0a0f 50%, #000000 100%)',
            boxShadow: `
              0 50px 100px -20px rgba(255, 255, 255, 0.3),
              0 30px 60px -10px rgba(255, 255, 255, 0.2),
              inset 0 -80px 100px -50px rgba(255, 255, 255, 0.1)
            `,
          }}
        />
        
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] rounded-full blur-3xl"
          style={{
            height: 'clamp(120px, 15vw, 200px)',
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.15) 40%, transparent 70%)',
          }}
        />
      </div>
      
      <DottedSurface className="opacity-50" />
      
      <div 
        className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background/10 pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Centered Content */}
      <div 
        className="relative z-10 text-center mx-auto"
        style={{
          padding: '0 var(--space-4)',
          maxWidth: 'min(90vw, 1200px)',
        }}
      >
        <h1 
          className="font-bold leading-tight tracking-tight min-h-[1.2em]"
          style={{ 
            fontFamily: 'var(--font-jetbrains), monospace',
            fontSize: 'var(--text-5xl)',
            marginBottom: 'var(--space-4)',
          }}
        >
          {displayedText.includes(highlightWord) ? (
            <>
              <span className="text-white">
                {displayedText.split(highlightWord)[0]}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
                {highlightWord}
              </span>
              <span className="text-white">
                {displayedText.split(highlightWord)[1] || ''}
              </span>
            </>
          ) : (
            <span className="text-white">
              {displayedText}
            </span>
          )}
          <span 
            className={`inline-block w-[3px] h-[0.9em] bg-violet-400 ml-1 align-middle transition-opacity duration-100 ${
              showCursor ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden="true"
          />
        </h1>
        
        <p 
          className={`text-slate-400 max-w-3xl mx-auto leading-relaxed transition-all duration-700 ease-out ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            fontSize: 'var(--text-lg)',
            marginBottom: 'var(--space-8)',
          }}
        >
          {t('subtitle')}
        </p>

        <div 
          className={`flex items-center justify-center flex-wrap transition-all duration-700 ease-out ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ 
            gap: 'var(--space-4)',
            transitionDelay: isTypingComplete ? '200ms' : '0ms',
          }}
        >
          <button
            onClick={() => {
              const ctaSection = document.getElementById('cta');
              if (ctaSection) {
                ctaSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center justify-center bg-slate-800/80 text-white font-medium rounded-full border border-slate-600/50 hover:bg-slate-700/80 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20 cursor-pointer hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
            style={{
              fontSize: 'var(--text-base)',
              padding: 'var(--space-3) var(--space-6)',
            }}
          >
            {t('ctaButton')}
          </button>

          <a
            href={`/${locale}/cliente`}
            className="text-slate-400 hover:text-white transition-colors duration-300 font-medium flex items-center group"
            style={{
              fontSize: 'var(--text-base)',
              gap: 'var(--space-2)',
            }}
          >
            {t('clientLink')}
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
        </div>
      </div>

      {/* Scroll Down Arrow */}
      <button
        onClick={scrollToNextSection}
        className="fixed left-1/2 -translate-x-1/2 z-50 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 animate-pulse cursor-pointer"
        style={{
          bottom: 'var(--space-6)',
          padding: 'var(--space-3)',
        }}
        aria-label={t('scrollLabel')}
      >
        <ChevronDown 
          className="text-white/80" 
          style={{ width: 'var(--icon-xl)', height: 'var(--icon-xl)' }}
        />
      </button>
    </section>
  );
}
