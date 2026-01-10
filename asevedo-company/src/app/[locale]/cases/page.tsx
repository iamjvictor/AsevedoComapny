/**
 * Cases Page
 * Portfolio of completed projects
 */

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Container, Section } from '@/components/ui';
import { CTASection } from '@/components/sections';
import { ArrowRight, ExternalLink, Filter } from 'lucide-react';
import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

export const metadata: Metadata = {
  title: 'Cases',
  description: 'Conheça os projetos que entregamos. Cases de sucesso em sistemas web, apps mobile e integrações.',
};

// All case studies
const cases = [
  {
    id: 'fintech-dashboard',
    title: 'Dashboard Financeiro para Fintech',
    category: 'Fintech',
    problem: 'Sistema legado com baixa performance, UX desatualizada e dificuldade de manutenção.',
    solution: 'Reconstrução completa com arquitetura moderna, design system próprio e analytics em tempo real.',
    results: [
      'Performance 340% superior',
      '50K+ usuários ativos',
      '99.9% uptime',
      'Tempo de desenvolvimento de novas features reduzido em 60%',
    ],
    stack: ['Next.js', 'Node.js', 'PostgreSQL', 'AWS', 'Redis', 'TypeScript'],
  },
  {
    id: 'ecommerce-platform',
    title: 'Plataforma E-commerce B2B',
    category: 'E-commerce',
    problem: 'Processos manuais de pedidos, falta de integração com ERP e portal de clientes inexistente.',
    solution: 'Plataforma integrada com ERP SAP, automação completa de pedidos e portal self-service para clientes.',
    results: [
      'Conversão +85%',
      '2.5K pedidos/dia processados',
      'Redução de 90% no tempo de processamento',
      'ROI positivo em 4 meses',
    ],
    stack: ['React', 'Node.js', 'MongoDB', 'Redis', 'SAP Integration', 'Docker'],
  },
  {
    id: 'health-app',
    title: 'App de Telemedicina',
    category: 'Saúde',
    problem: 'Atendimento limitado a consultas presenciais, agenda manual e sem histórico digital.',
    solution: 'App mobile com videochamada HD, prontuário digital, agendamento inteligente e receituário eletrônico.',
    results: [
      '15K consultas/mês',
      'NPS de 94',
      'Conformidade HIPAA/LGPD',
      '40% de aumento na capacidade de atendimento',
    ],
    stack: ['React Native', 'Firebase', 'WebRTC', 'Node.js', 'PostgreSQL', 'AWS'],
  },
  {
    id: 'logistics-erp',
    title: 'ERP para Logística',
    category: 'Logística',
    problem: 'Controle de frota descentralizado, rastreamento manual e falta de visibilidade operacional.',
    solution: 'Sistema integrado com rastreamento real-time, roteirização inteligente e dashboards operacionais.',
    results: [
      'Redução de 25% nos custos operacionais',
      'Rastreamento de 500+ veículos',
      'Otimização de rotas em tempo real',
      'Integração com 12 sistemas parceiros',
    ],
    stack: ['React', 'Node.js', 'PostgreSQL', 'RabbitMQ', 'Google Maps API', 'IoT'],
  },
  {
    id: 'edtech-platform',
    title: 'Plataforma de Educação Online',
    category: 'EdTech',
    problem: 'Conteúdo educacional disperso, sem gamificação e baixo engajamento dos alunos.',
    solution: 'LMS customizado com gamificação, trilhas personalizadas, live classes e analytics de aprendizado.',
    results: [
      '200K+ alunos ativos',
      '85% de taxa de conclusão',
      'Tempo médio de sessão +150%',
      'Integração com 5 universidades',
    ],
    stack: ['Next.js', 'Node.js', 'MongoDB', 'WebSocket', 'FFmpeg', 'CDN'],
  },
  {
    id: 'retail-analytics',
    title: 'Analytics para Varejo',
    category: 'Varejo',
    problem: 'Dados de vendas fragmentados, sem visão unificada e tomada de decisão baseada em intuição.',
    solution: 'Data warehouse unificado, dashboards em tempo real e modelo preditivo de demanda.',
    results: [
      'Redução de estoque parado em 35%',
      'Previsão de demanda com 92% de acurácia',
      'Consolidação de 8 fontes de dados',
      'Relatórios automatizados para 50+ lojas',
    ],
    stack: ['Python', 'PostgreSQL', 'Apache Airflow', 'Metabase', 'AWS', 'Machine Learning'],
  },
];

// Categories for filtering
const categories = ['Todos', 'Fintech', 'E-commerce', 'Saúde', 'Logística', 'EdTech', 'Varejo'];

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CasesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return (
    <>
      {/* Hero */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="primary" className="mb-6">
              Nosso Portfólio
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Cases de{' '}
              <span className="text-gradient">sucesso</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground-secondary">
              Projetos que transformaram negócios através da tecnologia. 
              Conheça alguns dos desafios que resolvemos.
            </p>
          </div>
        </Container>
      </section>

      {/* Cases Grid */}
      <Section variant="secondary">
        {/* Filter (visual only - would need client component for interactivity) */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((category, index) => (
            <Badge
              key={category}
              variant={index === 0 ? 'primary' : 'default'}
              className="cursor-pointer hover:bg-primary/20 transition-colors"
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {cases.map((caseStudy) => (
            <Card
              key={caseStudy.id}
              hover
              className="group flex flex-col"
            >
              {/* Case image placeholder */}
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-xl bg-card/50 backdrop-blur flex items-center justify-center">
                    <ExternalLink className="w-8 h-8 text-foreground-secondary" />
                  </div>
                </div>
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="primary" size="sm">
                    {caseStudy.category}
                  </Badge>
                </div>
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{caseStudy.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {/* Problem/Solution */}
                <div className="space-y-3 mb-4 flex-1">
                  <div>
                    <p className="text-foreground-muted text-xs uppercase tracking-wider mb-1">Desafio</p>
                    <p className="text-foreground-secondary text-sm">{caseStudy.problem}</p>
                  </div>
                </div>
                
                {/* Key result */}
                <div className="mb-4 p-3 bg-background-tertiary/50 rounded-lg">
                  <p className="text-2xl font-bold text-gradient">{caseStudy.results[0]}</p>
                </div>
                
                {/* Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {caseStudy.stack.slice(0, 4).map((tech) => (
                    <Badge key={tech} variant="default" size="sm">
                      {tech}
                    </Badge>
                  ))}
                  {caseStudy.stack.length > 4 && (
                    <Badge variant="default" size="sm">
                      +{caseStudy.stack.length - 4}
                    </Badge>
                  )}
                </div>
                
                {/* CTA */}
                <Button 
                  href={`/${locale}/cases/${caseStudy.id}`} 
                  variant="ghost" 
                  className="p-0 h-auto w-fit"
                  iconAfter={<ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                >
                  Ver case completo
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <CTASection />
    </>
  );
}
