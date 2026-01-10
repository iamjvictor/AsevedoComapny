/**
 * About Page
 * Company information, team, and values
 */

import { Badge, Button, Card, CardContent, Container, Section } from '@/components/ui';
import { CTASection } from '@/components/sections';
import { ArrowRight, Award, Code2, Heart, Lightbulb, Rocket, Shield, Target, Users, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Sobre',
  description: 'Conheça a Asevedo Company. Software house focada em entregar tecnologia de verdade para empresas que precisam crescer.',
};

// Company values
const values = [
  {
    icon: Code2,
    title: 'Excelência Técnica',
    description: 'Código limpo, arquitetura sólida e melhores práticas. Não fazemos gambiarras.',
  },
  {
    icon: Target,
    title: 'Foco em Resultado',
    description: 'Métricas de negócio importam mais que linhas de código. Medimos sucesso pelo impacto.',
  },
  {
    icon: Shield,
    title: 'Transparência',
    description: 'Comunicação clara e honesta. Você sabe exatamente o que está acontecendo no projeto.',
  },
  {
    icon: Heart,
    title: 'Parceria',
    description: 'Atuamos como extensão do seu time, não apenas como fornecedores.',
  },
  {
    icon: Lightbulb,
    title: 'Inovação Pragmática',
    description: 'Usamos tecnologia de ponta quando faz sentido, não por modismo.',
  },
  {
    icon: Zap,
    title: 'Agilidade',
    description: 'Entregas rápidas e incrementais. Valorizamos feedback contínuo.',
  },
];

// Team structure
const teamAreas = [
  {
    title: 'Liderança Técnica',
    description: 'Arquitetos e tech leads sêniores que definem a estratégia técnica de cada projeto.',
    count: '4 pessoas',
  },
  {
    title: 'Desenvolvimento',
    description: 'Engenheiros full-stack especializados em diversas tecnologias e domínios.',
    count: '12 pessoas',
  },
  {
    title: 'Design & UX',
    description: 'Designers focados em criar experiências que encantam e convertem.',
    count: '3 pessoas',
  },
  {
    title: 'Rede de Especialistas',
    description: 'Profissionais parceiros que acionamos para projetos com necessidades específicas.',
    count: '15+ pessoas',
  },
];

// Key milestones
const milestones = [
  { year: '2016', event: 'Fundação da empresa' },
  { year: '2018', event: 'Primeiro cliente enterprise' },
  { year: '2020', event: 'Expansão para apps mobile' },
  { year: '2022', event: '50 projetos entregues' },
  { year: '2024', event: 'Parceria com AWS' },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="primary" className="mb-6">
                Sobre Nós
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Tecnologia de verdade para{' '}
                <span className="text-gradient">empresas que precisam crescer</span>
              </h1>
              <p className="text-lg md:text-xl text-foreground-secondary mb-8">
                Somos uma software house brasileira focada em entregar soluções digitais 
                robustas, escaláveis e com impacto real no negócio dos nossos clientes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button href={`/${locale}/contact`} iconAfter={<ArrowRight size={18} />}>
                  Fale conosco
                </Button>
                <Button href={`/${locale}/cases`} variant="outline">
                  Ver projetos
                </Button>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 gap-6">
              {[
                { value: '8+', label: 'Anos de mercado' },
                { value: '50+', label: 'Projetos entregues' },
                { value: '20+', label: 'Especialistas' },
                { value: '15+', label: 'Clientes ativos' },
              ].map((stat) => (
                <Card key={stat.label} variant="glass" className="text-center">
                  <CardContent className="py-8">
                    <p className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</p>
                    <p className="text-foreground-secondary">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <Section variant="secondary" title="Nossa História">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-foreground-secondary text-lg mb-6">
              A Asevedo Company nasceu da frustração com projetos de software mal executados. 
              Vimos demais empresas perderem tempo e dinheiro com entregas que não funcionavam, 
              prazos estourados e código impossível de manter.
            </p>
            <p className="text-foreground-secondary text-lg mb-6">
              Decidimos fazer diferente: montar um time de profissionais sêniores que realmente 
              entendem de engenharia de software e sabem traduzir necessidades de negócio em 
              soluções técnicas elegantes.
            </p>
            <p className="text-foreground-secondary text-lg">
              Hoje, combinamos um core team experiente com uma rede de especialistas que 
              acionamos sob demanda. Isso nos permite escalar com qualidade e entregar projetos 
              complexos sem comprometer o padrão.
            </p>
          </div>
          
          {/* Timeline */}
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-secondary" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="relative pl-12">
                  <div className="absolute left-0 w-8 h-8 rounded-full bg-background-secondary border-2 border-primary flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                  </div>
                  <div>
                    <span className="text-primary font-bold">{milestone.year}</span>
                    <p className="text-foreground">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Leadership Section - João Asevedo */}
      <Section id="leadership">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Photo / Visual */}
          <div className="relative order-2 lg:order-1">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl rounded-full" />
            
            {/* Profile card */}
            <Card variant="glass" className="relative border-primary/20 overflow-hidden">
              <CardContent className="p-0">
                {/* Profile image placeholder - replace with actual image */}
                <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-6xl font-bold text-background">JA</span>
                  </div>
                </div>
                
                {/* Name and title overlay */}
                <div className="p-6 text-center bg-background-secondary/50">
                  <h3 className="text-2xl font-bold text-foreground">João Asevedo</h3>
                  <p className="text-primary font-medium">Fundador & Lead Engineer</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Content */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary" />
              </div>
              <Badge variant="primary">Liderança Técnica</Badge>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              A pessoa por trás da{' '}
              <span className="text-gradient">Asevedo Company</span>
            </h2>
            
            <p className="text-foreground-secondary text-lg mb-6">
              A Asevedo Company é liderada por <strong className="text-foreground">João Asevedo</strong>, 
              engenheiro de software com atuação em sistemas web, aplicações mobile e arquitetura de sistemas.
            </p>
            
            <p className="text-foreground-secondary text-lg mb-8">
              João atua diretamente na definição da arquitetura, padrões técnicos e qualidade das entregas, 
              garantindo que cada projeto siga boas práticas e esteja preparado para escalar.
            </p>
            
            {/* Key points */}
            <div className="space-y-4">
              {[
                'Definição de arquitetura e padrões técnicos',
                'Supervisão direta da qualidade de código',
                'Comunicação próxima com stakeholders',
                'Mentoria do time de desenvolvimento',
              ].map((point) => (
                <div key={point} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-foreground-secondary">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section title="Nossos Valores" subtitle="Princípios que guiam cada decisão e entrega">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value) => (
            <Card key={value.title} hover className="group">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <value.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-foreground-secondary">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Team Structure */}
      <Section 
        variant="tertiary" 
        title="Nosso Time" 
        subtitle="Core team sênior + rede de especialistas colaboradores"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {teamAreas.map((area) => (
            <Card key={area.title} variant="glass">
              <CardContent className="pt-6">
                <Badge variant="primary" className="mb-4">{area.count}</Badge>
                <h3 className="text-lg font-semibold mb-2">{area.title}</h3>
                <p className="text-foreground-secondary text-sm">{area.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 bg-gradient-to-br from-primary/10 to-secondary/10">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-primary" />
                <span className="text-foreground-muted font-medium">Modelo Híbrido</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Escalamos sem perder qualidade
              </h3>
              <p className="text-foreground-secondary">
                Nosso modelo combina a estabilidade de um time fixo com a flexibilidade de 
                especialistas sob demanda. Cada projeto tem o time ideal, sem overhead desnecessário.
              </p>
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <ul className="space-y-4">
                {[
                  'Liderança técnica dedicada em cada projeto',
                  'Especialistas acionados conforme a necessidade',
                  'Processo padronizado de onboarding',
                  'Qualidade consistente independente do tamanho',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Award className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-foreground-secondary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </Section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
