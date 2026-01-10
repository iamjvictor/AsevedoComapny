'use client';

/**
 * Process Section
 * Timeline showing the 5-step development process - Full screen format
 */

import { Container } from '@/components/ui';
import { CheckCircle, ClipboardList, Code2, HeadphonesIcon, Search, Settings } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Process steps data
const processSteps = [
  {
    number: '01',
    icon: Search,
    title: 'Diagnóstico',
    description: 'Entendemos profundamente seu negócio, desafios e objetivos para definir a melhor estratégia técnica.',
  },
  {
    number: '02',
    icon: ClipboardList,
    title: 'Planejamento',
    description: 'Definimos escopo, cronograma, tecnologias e arquitetura com transparência total sobre entregas.',
  },
  {
    number: '03',
    icon: Code2,
    title: 'Desenvolvimento',
    description: 'Construímos com metodologia ágil, entregas incrementais e comunicação constante.',
  },
  {
    number: '04',
    icon: Settings,
    title: 'Validação',
    description: 'Testes rigorosos de performance, segurança e usabilidade antes de cada release.',
  },
  {
    number: '05',
    icon: HeadphonesIcon,
    title: 'Entrega & Suporte',
    description: 'Deploy, documentação completa e suporte contínuo para evolução do produto.',
  },
];

export function ProcessSection() {
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
    <section ref={sectionRef} id="process" className="min-h-screen flex items-center py-20">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-100">
              Nosso Processo
            </span>
          </h2>
          <p className="text-foreground-secondary text-lg max-w-3xl mx-auto">
            Metodologia estruturada para entregar resultados previsíveis
          </p>
        </div>

        <div className="relative">
          {/* Timeline line - Desktop */}
          <div className="hidden lg:block absolute top-8 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500/30 via-blue-500/30 to-cyan-500/30" />
          
          {/* Steps */}
          <div className="grid md:grid-cols-5 gap-8 lg:gap-4">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={`
                    relative flex flex-col items-center text-center group
                    transition-all duration-500 ease-out
                    ${isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-8'
                    }
                  `}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Step number and icon */}
                  <div className="relative mb-6">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Circle background */}
                    <div className="relative w-16 h-16 rounded-full bg-slate-900/50 border-2 border-cyan-500/30 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
                      <Icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    
                    {/* Step number badge */}
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-cyan-500 text-slate-900 text-sm font-bold flex items-center justify-center">
                      {step.number.replace('0', '')}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                  
                  {/* Checkmark for completed visual */}
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
