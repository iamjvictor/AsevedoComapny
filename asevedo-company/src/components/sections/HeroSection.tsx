'use client';

/**
 * Hero Section Component
 * Simple centered phrase with animated background and typewriter effect
 */

import { DottedSurface } from '@/components/effects';
import { ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';

export function HeroSection() {
  const fullText = "Automação e software sob medida.";
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
        // Adiciona um pequeno delay antes de mostrar o subtítulo e botão
        setTimeout(() => setIsTypingComplete(true), 300);
      }
    }, 50); // Velocidade de digitação

    return () => clearInterval(typingInterval);
  }, []);

  // Cursor piscando
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  const scrollToNextSection = () => {
    // Lista de IDs das seções na ordem
    const sectionIds = ['hero', 'proof', 'services', 'process', 'about', 'cta'];
    
    // Encontra todas as seções
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    
    // Posição atual do scroll
    const scrollPosition = window.scrollY + 100; // +100 para margem
    
    // Encontra a próxima seção que está abaixo da posição atual
    for (const section of sections) {
      if (section.offsetTop > scrollPosition) {
        section.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    // Se não encontrar, rola uma tela
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Esfera/Lua iluminada no topo */}
      <div 
        className="absolute -top-[400px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] pointer-events-none"
        aria-hidden="true"
        style={{
          animation: 'float 8s ease-in-out infinite',
        }}
      >
        {/* Esfera principal - escura */}
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
        
        {/* Glow inferior - efeito de luz branca */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[200px] rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.15) 40%, transparent 70%)',
          }}
        />
      </div>
      
      {/* Animated Background */}
      <DottedSurface className="opacity-50" />
      
      {/* Gradient Overlay - suave indo para um ponto mais claro */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/20 to-background/10 pointer-events-none"
        aria-hidden="true"
      />
      
      {/* Centered Phrase with Typewriter Effect */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold leading-tight tracking-tight min-h-[1.2em] mb-6" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
          {/* Renderização do texto com destaque em "software" */}
          {displayedText.includes('software') ? (
            <>
              <span className="text-white">
                {displayedText.split('software')[0]}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
                software
              </span>
              <span className="text-white">
                {displayedText.split('software')[1] || ''}
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
        
        {/* Subtítulo - aparece após digitação */}
        <p 
          className={`text-lg md:text-xl lg:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10 transition-all duration-700 ease-out ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Projetamos e desenvolvemos sistemas, integrações e automações com foco em performance, escalabilidade e clareza operacional.
        </p>
        {/* Botões - aparecem após digitação */}
        <div 
          className={`flex items-center justify-center gap-6 flex-wrap transition-all duration-700 ease-out ${
            isTypingComplete ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ transitionDelay: isTypingComplete ? '200ms' : '0ms' }}
        >
          {/* Botão Principal - Fazer Orçamento */}
          <button
            onClick={() => {
              const ctaSection = document.getElementById('cta');
              if (ctaSection) {
                ctaSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center justify-center px-8 py-3.5 bg-slate-800/80 text-white font-medium rounded-full border border-slate-600/50 hover:bg-slate-700/80 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20 cursor-pointer hover:scale-[1.02] transition-all duration-300 text-base backdrop-blur-sm"
          >
            Fazer Orçamento
          </button>

          {/* Link Secundário - Já sou cliente */}
          <a
            href="/cliente"
            className="text-slate-400 hover:text-white transition-colors duration-300 text-base font-medium flex items-center gap-2 group"
          >
            Já sou cliente
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
        </div>
      </div>

      {/* Scroll Down Arrow - Fixed on screen */}
      <button
        onClick={scrollToNextSection}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 p-3 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 animate-pulse cursor-pointer"
        aria-label="Scroll para próxima seção"
      >
        <ChevronDown className="w-6 h-6 text-white/80" />
      </button>
    </section>
  );
}
