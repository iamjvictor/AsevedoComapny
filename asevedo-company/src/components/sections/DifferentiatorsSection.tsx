
import { Card, CardContent, Section } from '@/components/ui';
import { CheckCircle2, FileCode2, FileText, MessageCircle, Shield, Target } from 'lucide-react';

// Differentiators data
const differentiators = [
  {
    icon: FileCode2,
    title: 'Código Limpo e Versionado',
    description: 'Todo código é versionado no Git, segue padrões de clean code e é revisado por pares antes do merge.',
  },
  {
    icon: FileText,
    title: 'Documentação e Handoff',
    description: 'Documentação técnica completa, APIs documentadas e processo de handoff estruturado para sua equipe.',
  },
  {
    icon: MessageCircle,
    title: 'Comunicação Clara',
    description: 'Updates regulares, reuniões de alinhamento e acesso direto ao time técnico durante todo o projeto.',
  },
  {
    icon: Shield,
    title: 'Qualidade e Segurança',
    description: 'Testes automatizados, code review rigoroso, práticas de segurança e compliance desde o início.',
  },
  {
    icon: Target,
    title: 'Entrega Orientada a Resultado',
    description: 'Foco em métricas de negócio, não apenas entregas técnicas. Sucesso medido pelo impacto real.',
  },
  {
    icon: CheckCircle2,
    title: 'Compromisso com Prazo',
    description: 'Cronogramas realistas, gestão proativa de riscos e transparência sobre o progresso do projeto.',
  },
];

export function DifferentiatorsSection() {
  return (
    <Section
      id="differentiators"
      variant="tertiary"
      title="Por que a Asevedo?"
      subtitle="Diferenciais que garantem o sucesso do seu projeto"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {differentiators.map((item, index) => (
          <Card
            key={item.title}
            variant="glass"
            className="group hover:border-primary/30 transition-all"
          >
            <CardContent className="flex gap-4">
              {/* Icon */}
              <div className="shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              
              {/* Content */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-foreground-secondary text-sm leading-relaxed">{item.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  );
}
