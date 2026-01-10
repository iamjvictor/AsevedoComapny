'use client';

/**
 * Header Component
 * Fixed transparent header
 * Features white logo on left, CTA button and dropdown menu on right
 * CTA button hides when at top of page (Hero section visible)
 */

import { ChevronDown, User, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Detectar scroll para mostrar/esconder botão
  useEffect(() => {
    const handleScroll = () => {
      // Considera que passou da Hero quando scrollou mais de 80% da altura da tela
      setIsScrolled(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Verificar estado inicial
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to CTA section
  const scrollToCTA = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const ctaSection = document.getElementById('cta');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent pointer-events-none">
      <div className="w-full px-4 py-2 md:px-12 lg:px-16">
        <nav className="flex items-center justify-between pointer-events-auto">
          {/* Logo Branca - Responsiva */}
          <Link
            href="/"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src="/LogoBranca.png"
              alt="Asevedo Company"
              width={680}
              height={192}
              className="h-20 sm:h-28 md:h-40 lg:h-48 w-auto"
              priority
            />
          </Link>

          {/* Right Side - CTA Button + Dropdown */}
          <div className="flex items-center gap-3">
            {/* CTA Button - Fazer Orçamento (aparece só após scroll) */}
            <div className={`transition-all duration-300 ${isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'}`}>
              <Button 
                onClick={scrollToCTA}
                size="sm"
                className="px-6"
              >
                Fazer Orçamento
              </Button>
            </div>

            {/* Dropdown Menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center justify-center p-2 hover:opacity-70 transition-all duration-300"
                aria-label="Menu"
              >
                <ChevronDown 
                  size={20} 
                  className={`text-white transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Content */}
              <div
                className={`absolute right-0 top-full mt-2 w-56 rounded-xl bg-background/95 backdrop-blur-xl border border-card-border shadow-2xl overflow-hidden transition-all duration-300 ${
                  isMenuOpen 
                    ? 'opacity-100 translate-y-0 pointer-events-auto' 
                    : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
              >
                <div className="py-2">
                  <Link
                    href="/cliente"
                    className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={18} />
                    <span className="font-medium">Área do Cliente</span>
                  </Link>
                  <Link
                    href="/parceiro"
                    className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Users size={18} />
                    <span className="font-medium">Torne-se um Parceiro</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
