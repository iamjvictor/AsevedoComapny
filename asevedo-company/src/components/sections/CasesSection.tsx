/**
 * Cases Section
 * Featured project case studies
 * Shows problem/solution with tech stack badges
 */

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Section } from '@/components/ui';
import { ArrowRight, ExternalLink } from 'lucide-react';

// Case studies data
const cases = [
  {
    id: 'fintech-dashboard',
    title: 'Dashboard Financeiro para Fintech',
    problem: 'Sistema legado com baixa performance e UX desatualizada',
    solution: 'Reconstrução completa com arquitetura moderna e analytics em tempo real',
    stack: ['Next.js', 'Node.js', 'PostgreSQL', 'AWS'],
    metrics: [
      { label: 'Performance', value: '+340%' },
      { label: 'Usuários', value: '50K+' },
    ],
    image: '/cases/fintech.jpg',
  },
  {
    id: 'ecommerce-platform',
    title: 'Plataforma E-commerce B2B',
    problem: 'Processos manuais e falta de integração entre sistemas',
    solution: 'Plataforma integrada com ERP, automação de pedidos e portal do cliente',
    stack: ['React', 'Node.js', 'MongoDB', 'Redis'],
    metrics: [
      { label: 'Conversão', value: '+85%' },
      { label: 'Pedidos/dia', value: '2.5K' },
    ],
    image: '/cases/ecommerce.jpg',
  },
  {
    id: 'health-app',
    title: 'App de Telemedicina',
    problem: 'Atendimento limitado a consultas presenciais',
    solution: 'App mobile com videochamada, prontuário digital e agendamento',
    stack: ['React Native', 'Firebase', 'WebRTC', 'HIPAA'],
    metrics: [
      { label: 'Consultas', value: '15K/mês' },
      { label: 'NPS', value: '94' },
    ],
    image: '/cases/health.jpg',
  },
];

export function CasesSection() {
  return (
    <Section
      id="cases"
      variant="secondary"
      title="Cases de Sucesso"
      subtitle="Projetos que transformaram negócios através da tecnologia"
    >
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
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors" />
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
                <div>
                  <p className="text-foreground-muted text-xs uppercase tracking-wider mb-1">Solução</p>
                  <p className="text-foreground-secondary text-sm">{caseStudy.solution}</p>
                </div>
              </div>
              
              {/* Metrics */}
              <div className="flex gap-4 mb-4">
                {caseStudy.metrics.map((metric) => (
                  <div key={metric.label} className="text-center">
                    <p className="text-2xl font-bold text-gradient">{metric.value}</p>
                    <p className="text-foreground-muted text-xs">{metric.label}</p>
                  </div>
                ))}
              </div>
              
              {/* Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {caseStudy.stack.map((tech) => (
                  <Badge key={tech} variant="default" size="sm">
                    {tech}
                  </Badge>
                ))}
              </div>
              
              {/* CTA */}
              <Button 
                href={`/cases/${caseStudy.id}`} 
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
      
      {/* View All CTA */}
      <div className="text-center mt-12">
        <Button href="/cases" variant="outline">
          Ver todos os cases
        </Button>
      </div>
    </Section>
  );
}
