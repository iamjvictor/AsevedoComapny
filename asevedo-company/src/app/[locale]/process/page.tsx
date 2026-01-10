/**
 * Process Page
 * Detailed explanation of our development methodology
 */

import { Badge, Card, CardContent, Container, Section } from '@/components/ui';
import { CTASection } from '@/components/sections';
import { CheckCircle, ClipboardList, Code2, HeadphonesIcon, MessageCircle, Search, Settings, Users } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Processo',
  description: 'Conheça nossa metodologia de desenvolvimento. Do diagnóstico à entrega, transparência total em cada etapa.',
};

// Process steps with detailed info
const processSteps = [
  {
    number: '01',
    icon: Search,
    title: 'Diagnóstico',
    subtitle: 'Entendendo seu negócio',
    description: 'Mergulhamos no seu contexto para entender profundamente o problema a ser resolvido. Não construímos apenas software — entregamos soluções de negócio.',
    activities: [
      'Reunião de discovery com stakeholders',
      'Análise de processos atuais',
      'Levantamento de requisitos funcionais',
      'Identificação de riscos e dependências',
      'Definição de métricas de sucesso',
    ],
    deliverables: ['Documento de requisitos', 'Mapa de processos', 'Proposta técnica'],
    duration: '1-2 semanas',
  },
  {
    number: '02',
    icon: ClipboardList,
    title: 'Planejamento',
    subtitle: 'Arquitetando a solução',
    description: 'Definimos a arquitetura técnica, escolhemos as tecnologias adequadas e criamos um roadmap detalhado com entregas incrementais.',
    activities: [
      'Design da arquitetura de software',
      'Escolha do stack tecnológico',
      'Definição de sprints e milestones',
      'Estimativa detalhada por funcionalidade',
      'Planejamento de integrações',
    ],
    deliverables: ['Arquitetura técnica', 'Cronograma detalhado', 'Backlog priorizado'],
    duration: '1-2 semanas',
  },
  {
    number: '03',
    icon: Code2,
    title: 'Desenvolvimento',
    subtitle: 'Construindo com qualidade',
    description: 'Trabalhamos em sprints de 2 semanas, com entregas incrementais e comunicação constante. Você acompanha o progresso em tempo real.',
    activities: [
      'Desenvolvimento iterativo (Scrum)',
      'Code review em todas as entregas',
      'Testes automatizados (unitários, integração)',
      'Documentação técnica contínua',
      'Demos a cada sprint',
    ],
    deliverables: ['Código versionado', 'Ambiente de staging', 'Release notes por sprint'],
    duration: 'Variável por projeto',
  },
  {
    number: '04',
    icon: Settings,
    title: 'Validação',
    subtitle: 'Garantindo qualidade',
    description: 'Antes de cada release, executamos uma bateria completa de testes para garantir que tudo funcione perfeitamente em produção.',
    activities: [
      'Testes de aceitação (UAT)',
      'Testes de performance e carga',
      'Auditoria de segurança',
      'Validação de usabilidade',
      'Correção de bugs identificados',
    ],
    deliverables: ['Relatório de testes', 'Certificação de segurança', 'Sign-off do cliente'],
    duration: '1-2 semanas',
  },
  {
    number: '05',
    icon: HeadphonesIcon,
    title: 'Entrega & Suporte',
    subtitle: 'Indo além do deploy',
    description: 'Realizamos o deploy em produção, documentamos tudo e permanecemos ao seu lado para suporte, melhorias e evolução contínua.',
    activities: [
      'Deploy em produção',
      'Handoff técnico para sua equipe',
      'Treinamento de usuários',
      'Monitoramento pós-deploy',
      'Suporte e manutenção contínua',
    ],
    deliverables: ['Sistema em produção', 'Documentação completa', 'Contrato de suporte'],
    duration: 'Contínuo',
  },
];

// Methodology principles
const principles = [
  {
    icon: MessageCircle,
    title: 'Transparência Total',
    description: 'Você tem visibilidade completa do progresso, custos e decisões técnicas. Sem surpresas.',
  },
  {
    icon: Users,
    title: 'Colaboração Constante',
    description: 'Trabalhamos como extensão do seu time, com comunicação diária e alinhamentos frequentes.',
  },
  {
    icon: CheckCircle,
    title: 'Foco em Resultado',
    description: 'Não entregamos apenas código. Entregamos soluções que geram impacto mensurável no negócio.',
  },
];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProcessPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="primary" className="mb-6">
              Nosso Processo
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Metodologia que{' '}
              <span className="text-gradient">entrega resultados</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground-secondary">
              Do diagnóstico à entrega, cada etapa é desenhada para maximizar qualidade 
              e minimizar riscos. Transparência total do início ao fim.
            </p>
          </div>
        </Container>
      </section>

      {/* Principles */}
      <Section variant="secondary">
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {principles.map((principle) => (
            <Card key={principle.title} variant="glass" className="text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <principle.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{principle.title}</h3>
                <p className="text-foreground-secondary">{principle.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Process Steps */}
        <div className="space-y-12">
          {processSteps.map((step, index) => (
            <Card key={step.number} className="overflow-hidden">
              <div className="grid lg:grid-cols-3 gap-0">
                {/* Step Header */}
                <div className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col justify-center">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-primary" />
                    </div>
                    <span className="text-5xl font-bold text-foreground-muted">{step.number}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-foreground-secondary">{step.subtitle}</p>
                  <Badge variant="primary" className="mt-4 w-fit">
                    {step.duration}
                  </Badge>
                </div>

                {/* Step Content */}
                <div className="lg:col-span-2 p-8">
                  <p className="text-foreground-secondary text-lg mb-6">{step.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Activities */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-4">
                        Atividades
                      </h4>
                      <ul className="space-y-2">
                        {step.activities.map((activity) => (
                          <li key={activity} className="flex items-start gap-2 text-foreground-secondary text-sm">
                            <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Deliverables */}
                    <div>
                      <h4 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider mb-4">
                        Entregáveis
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {step.deliverables.map((deliverable) => (
                          <Badge key={deliverable} variant="secondary" size="sm">
                            {deliverable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
