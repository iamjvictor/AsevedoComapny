'use client';

/**
 * About Leadership Section
 * Compact founder profile + Featured projects in same view
 */

import { Button, Card, CardContent, Container } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

// Featured clients data
const featuredClients = [
  {
    id: 'client-1',
    name: 'DataMetrics',
    logo: '/datametrics.png',
    description: 'Plataforma gamificada para fisioterapeutas acompanharem e analisarem dados de jogadores de futebol.',
    url: 'https://datametrics.app.br/futebol',
  },
  {
    id: 'client-2',
    name: 'AutoBooks',
    logo: '/autobooks.png',
    description: 'SaaS de Automação de WhatsApp para agendamento e pagamentos online.',
    url: 'https://autobooks.com.br',
  },
  {
    id: 'client-3',
    name: 'Bora Expandir',
    logo: '/bora-logo.png',
    description: 'Plataforma de gestão para empresa de assessoria de vistos internacionais.',
    url: 'https://boraexpandir.com.br/',
  },
];

export function AboutLeadershipSection() {
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
    <section ref={sectionRef} id="about" className="min-h-screen flex items-center py-16">
      <Container>
        {/* Compact layout: Photo + Text + Projects in same view */}
        <div className="flex flex-col lg:flex-row gap-10 items-start mb-10">
          
          {/* Left side: Photo smaller */}
          <div 
            className={`
              shrink-0 transition-all duration-700 ease-out
              ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}
            `}
          >
            <div className="relative">
              {/* Glow effect removed */}
              <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-2xl bg-slate-900/50 border border-white/10 overflow-hidden">
                <Image
                  src="/jv.jpeg"
                  alt="João Asevedo - Founder & CTO"
                  fill
                  className="object-cover scale-150"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Right side: Text content */}
          <div 
            className={`
              flex-1 transition-all duration-700 ease-out delay-100
              ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}
            `}
          >
            <p className="text-cyan-400 font-medium mb-1 tracking-wide uppercase text-xs">
              Liderança técnica
            </p>
            
            <h2 
              className="text-2xl md:text-3xl font-bold mb-1"
              style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
            >
              <span className="text-white">
                João Asevedo
              </span>
            </h2>
            
            <p className="text-slate-400 font-medium text-sm mb-4">
              Founder & CTO — Asevedo Company
            </p>

            <div className="space-y-2 text-slate-300 text-sm max-w-2xl">
              <p>
                A Asevedo Company é liderada por João Asevedo, engenheiro de software com foco em automação, integrações e arquitetura de sistemas.
              </p>
              <p>
                João atua diretamente na definição técnica dos projetos, garantindo qualidade, escalabilidade e clareza no processo — desde o diagnóstico até a entrega final.
              </p>
            </div>
          </div>
        </div>

        {/* Projects Block */}
        <div>
          {/* Projects header */}
          <div 
            className={`
              mb-6 transition-all duration-700 ease-out delay-200
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <h3 
              className="text-xl md:text-2xl font-bold mb-2"
              style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
            >
              <span className="text-white">
                Clientes e Projetos
              </span>
            </h3>
            <p className="text-slate-400 text-sm">
              Empresas que confiam na Asevedo Company.
            </p>
          </div>

          {/* Clients grid */}
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {featuredClients.map((client, index) => (
              <a
                key={client.id}
                href={client.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`
                  block transition-all duration-500 ease-out
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <Card hover className="group h-full cursor-pointer">
                  <CardContent className="p-4">
                    {/* Logo */}
                    <div className="relative h-16 w-full mb-4 flex justify-center">
                      <div className="relative h-16 w-40">
                        <Image
                          src={client.logo}
                          alt={`${client.name} logo`}
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>

                    {/* Client name */}
                    <h4 className="text-base font-semibold text-white mb-2 group-hover:text-cyan-100 transition-colors">
                      {client.name}
                    </h4>

                    {/* Description */}
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {client.description}
                    </p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>

          {/* View all projects button */}
          <div 
            className={`
              text-center transition-all duration-500 ease-out delay-600
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
          >
            <Button 
              href="/projects" 
              variant="outline"
              iconAfter={<ArrowRight size={18} />}
            >
              Ver todos os projetos
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
