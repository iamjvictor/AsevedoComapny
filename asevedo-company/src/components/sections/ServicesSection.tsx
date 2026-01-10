'use client';

/**
 * Services Section
 * Main services showcase with detailed cards - Full screen format
 */

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Container } from '@/components/ui';
import { ArrowRight, Code2, Globe, Server, Smartphone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// Services data
const services = [
  {
    id: 'web',
    icon: Globe,
    title: 'Plataformas e Sistemas Web',
    description: 'Desenvolvemos sistemas web completos — de intranets a plataformas SaaS — com interfaces modernas e arquitetura preparada para escalar.',
    features: ['Next.js / React', 'APIs RESTful', 'Dashboards', 'Autenticação segura'],
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Aplicações Mobile',
    description: 'Apps nativos ou híbridos para iOS e Android, com foco em experiência do usuário e performance.',
    features: ['React Native', 'Flutter', 'iOS / Android', 'Push Notifications'],
  },
  {
    id: 'chatbots',
    icon: Server,
    title: 'ChatBots Inteligentes',
    description: 'Bots personalizados para agendamento, atendimento, pagamentos e integração com seus sistemas e plataformas.',
    features: ['Agendamento automático', 'Pagamentos', 'Integração CRM', 'WhatsApp / Telegram'],
  },
  {
    id: 'architecture',
    icon: Code2,
    title: 'Arquitetura & Escalabilidade',
    description: 'Projetamos infraestruturas que suportam crescimento exponencial sem comprometer performance ou segurança.',
    features: ['Cloud AWS / GCP', 'Docker / K8s', 'CI/CD', 'Monitoramento'],
  },
];

export function ServicesSection() {
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
    <section ref={sectionRef} id="services" className="min-h-screen flex items-center py-20">
      <Container>
        {/* Header */}
        <div className="text-center mb-16">
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-100">
              Nossos Serviços
            </span>
          </h2>
          <p className="text-foreground-secondary text-lg max-w-3xl mx-auto">
            Soluções técnicas de ponta para cada desafio do seu negócio
          </p>
        </div>

        {/* Grid 2x2 */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`
                  transition-all duration-500 ease-out
                  ${isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                  }
                `}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <Card hover className="group h-full">
                  <CardHeader>
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-all group-hover:scale-110">
                      <Icon className="w-7 h-7 text-cyan-400" />
                    </div>
                    
                    <CardTitle className="text-xl md:text-2xl">{service.title}</CardTitle>
                    <CardDescription className="text-base">{service.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    {/* CTA */}
                    <Button 
                      href={`/services#${service.id}`} 
                      variant="ghost" 
                      className="p-0 h-auto"
                      iconAfter={<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                    >
                      Saiba mais
                    </Button>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
