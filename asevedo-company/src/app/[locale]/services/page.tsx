/**
 * Services Page
 * Detailed overview of all services offered
 */

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Container, Section } from '@/components/ui';
import { CTASection } from '@/components/sections';
import { ArrowRight, CheckCircle, Code2, Globe, Server, Smartphone } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Serviços',
  description: 'Sistemas web, aplicações mobile, APIs e arquitetura escalável. Conheça nossas soluções de desenvolvimento de software.',
};

// Detailed services data
const services = [
  {
    id: 'web',
    icon: Globe,
    title: 'Plataformas e Sistemas Web',
    description: 'Desenvolvemos sistemas web completos — de intranets a plataformas SaaS — com interfaces modernas e arquitetura preparada para escalar.',
    features: [
      'Sistemas administrativos e dashboards',
      'Plataformas SaaS completas',
      'E-commerce e marketplaces',
      'Portais corporativos',
      'Intranets e extranets',
      'PWAs (Progressive Web Apps)',
    ],
    stack: ['Next.js', 'React', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis'],
    color: 'primary',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Aplicações Mobile',
    description: 'Apps nativos ou híbridos para iOS e Android, com foco em experiência do usuário, performance e escalabilidade.',
    features: [
      'Apps iOS e Android nativos',
      'Apps híbridos multiplataforma',
      'Push notifications e real-time',
      'Integração com hardware',
      'Offline-first architecture',
      'App Store / Play Store deployment',
    ],
    stack: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'Expo'],
    color: 'secondary',
  },
  {
    id: 'api',
    icon: Server,
    title: 'APIs & Integrações',
    description: 'Conectamos sistemas, automatizamos processos e integramos plataformas para criar um ecossistema digital coeso.',
    features: [
      'APIs RESTful e GraphQL',
      'Integrações com ERPs e CRMs',
      'Webhooks e eventos',
      'ETL e sincronização de dados',
      'Autenticação OAuth/SAML',
      'Rate limiting e caching',
    ],
    stack: ['Node.js', 'Python', 'Go', 'RabbitMQ', 'Kafka', 'ElasticSearch'],
    color: 'primary',
  },
  {
    id: 'architecture',
    icon: Code2,
    title: 'Arquitetura & Escalabilidade',
    description: 'Projetamos infraestruturas que suportam crescimento exponencial sem comprometer performance ou segurança.',
    features: [
      'Arquitetura de microserviços',
      'Cloud infrastructure (AWS, GCP, Azure)',
      'Containerização (Docker, Kubernetes)',
      'CI/CD pipelines',
      'Monitoramento e observabilidade',
      'Disaster recovery',
    ],
    stack: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'DataDog'],
    color: 'secondary',
  },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="primary" className="mb-6">
              Nossos Serviços
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Tecnologia que{' '}
              <span className="text-gradient">impulsiona resultados</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground-secondary">
              De sistemas web a apps mobile, entregamos soluções técnicas robustas 
              que resolvem problemas reais e escalam junto com seu negócio.
            </p>
          </div>
        </Container>
      </section>

      {/* Services List */}
      <Section variant="secondary">
        <div className="space-y-20">
          {services.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content */}
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${service.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'} flex items-center justify-center mb-6`}>
                  <service.icon className={`w-8 h-8 ${service.color === 'primary' ? 'text-primary' : 'text-secondary'}`} />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h2>
                <p className="text-foreground-secondary text-lg mb-6">{service.description}</p>
                
                {/* Features list */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-foreground-secondary">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {/* Stack */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.stack.map((tech) => (
                    <Badge key={tech} variant="default" size="sm">
                      {tech}
                    </Badge>
                  ))}
                </div>
                
                <Button href={`/${locale}/contact`} iconAfter={<ArrowRight size={18} />}>
                  Solicitar proposta
                </Button>
              </div>
              
              {/* Visual */}
              <div className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl rounded-full" />
                <Card variant="glass" className="relative border-primary/20">
                  <CardContent className="p-8">
                    {/* Service illustration placeholder */}
                    <div className="aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <service.icon className="w-20 h-20 text-foreground-muted" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
