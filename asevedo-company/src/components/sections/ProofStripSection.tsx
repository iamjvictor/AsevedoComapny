'use client';

/**
 * Proof Strip Section
 * Problem → Solution cards with hover effects and viewport animations
 */

import { Container } from '@/components/ui';
import { Cog, Cpu, Link2, LayoutDashboard } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const problemSolutions = [
  {
    icon: Cog,
    problem: 'Trabalho manual repetitivo',
    solution: 'Automação de fluxos e rotinas',
    description: 'Automatizamos tarefas operacionais, notificações, rotinas e processos que hoje consomem tempo e geram erro humano.',
  },
  {
    icon: Link2,
    problem: 'Ferramentas desconectadas',
    solution: 'Integrações e APIs',
    description: 'Conectamos sistemas, plataformas e serviços para que os dados fluam de forma automática, segura e confiável.',
  },
  {
    icon: LayoutDashboard,
    problem: 'Informação espalhada',
    solution: 'Dashboards e sistemas internos',
    description: 'Centralizamos dados em painéis claros e sistemas sob medida para tomada de decisão e controle operacional.',
  },
  {
    icon: Cpu,
    problem: 'Ideia só no papel',
    solution: 'Software sob medida do zero',
    description: 'Arquitetamos e desenvolvemos sistemas completos, transformando sua ideia em um produto real, escalável e pronto para operar.',
  },
];

export function ProofStripSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="proof" className="min-h-screen flex items-center py-20">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-100">
              Problemas reais. Soluções técnicas.
            </span>
          </h2>
          <p className="text-foreground-secondary text-lg max-w-3xl mx-auto">
            Substituímos processos manuais, sistemas desconectados e falta de visibilidade por automação, integração e controle.
          </p>
        </div>

        {/* Grid 2x2 */}
        <div className="grid md:grid-cols-2 gap-6">
          {problemSolutions.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`
                  group relative p-6 rounded-2xl 
                  bg-slate-900/50 border border-white/10
                  hover:border-cyan-500/30 hover:bg-slate-900/70
                  transition-all duration-500 ease-out
                  ${isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                  }
                `}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-5 group-hover:bg-cyan-500/20 transition-colors duration-300">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>

                  {/* Solution */}
                  <div className="mb-4">
                    <p className="text-white font-semibold text-lg">
                      {item.solution}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
