'use client';

/**
 * Projects Page
 * Showcases all projects in an alternating layout
 * Each section contains 2 projects with scroll navigation
 */

import { Badge } from '@/components/ui/Badge';
import { Activity, Brain, ChevronDown, ExternalLink, Globe, Leaf, MessageCircle, TrendingUp, Users, Wallet } from 'lucide-react';
import Image from 'next/image';
import { useRef } from 'react';

// Projetos reais da Asevedo Company - ordenados por autoridade
const projects = [
  {
    id: 1,
    title: 'DataMetrics — Plataforma de Performance Esportiva',
    subtitle: 'Sistema de Análise de Performance e Risco de Lesão',
    description: 'Plataforma desenvolvida para transformar um MVP em um produto escalável, focado na coleta e análise de dados fisioterapêuticos de atletas de futebol. O sistema integra dados de GPS de treinos e jogos, processa métricas avançadas e utiliza modelos de IA para auxiliar na avaliação de risco de lesões e tomada de decisão profissional.',
    image: '/datametrics.png',
    icon: 'activity',
    technologies: ['Arquitetura de Sistemas', 'Integrações GPS', 'Machine Learning', 'Backend Escalável', 'Cloud'],
    context: 'Plataforma B2B | Esporte & Saúde',
    year: '2024',
    link: 'https://datametrics.app.br/futebol',
  },
  {
    id: 2,
    title: 'Precificação Inteligente para Alimentos Orgânicos',
    subtitle: 'Sistema de Preços Dinâmicos com IA para Redução de Desperdício',
    description: 'Plataforma de precificação dinâmica desenvolvida para tornar alimentos orgânicos mais acessíveis e reduzir desperdícios. Utiliza machine learning para ajustar preços com base em oferta, demanda, validade e histórico de vendas, priorizando ONGs, cozinhas comunitárias e regiões com escassez alimentar (desertos alimentares).',
    image: null,
    icon: 'leaf',
    technologies: ['Machine Learning', 'Algoritmos de Precificação', 'Análise de Dados', 'Geolocalização', 'Backend'],
    context: 'Plataforma de Impacto Social | IA',
    year: '2024',
    link: 'https://github.com/asevedocompany/precificacao-organicos',
  },
  {
    id: 3,
    title: 'AutoBooks — Automação de Reservas via WhatsApp',
    subtitle: 'Plataforma de Vendas e Agendamento Automatizado',
    description: 'SaaS desenvolvido para hotéis, pousadas e hostels automatizarem reservas e vendas via WhatsApp. A plataforma permite configuração rápida, geração de QR Code e integração automática com pagamentos e agenda, operando 24/7 sem necessidade de atendimento manual.',
    image: '/autobooks.png',
    icon: 'message-circle',
    technologies: ['Node.js', 'WhatsApp API', 'Stripe', 'Google Calendar', 'SaaS'],
    context: 'SaaS B2B | Automação Comercial',
    year: '2024',
    link: 'https://autobooks.com.br',
  },
  {
    id: 4,
    title: 'Bora Expandir — Plataforma de Gestão Empresarial',
    subtitle: 'Sistema de Gestão para Empresa de Vistos',
    description: 'Plataforma completa para gestão de uma empresa de assessoria de vistos internacionais, com módulos administrativos, financeiros, área do cliente, área de parceiros (afiliados) e automação de atendimento inicial via bot para qualificação de leads.',
    image: '/bora-logo.png',
    icon: 'globe',
    technologies: ['Sistema Web', 'Painel Administrativo', 'Automação de Atendimento', 'Backend', 'APIs'],
    context: 'Sistema Corporativo | Serviços Internacionais',
    year: '2023',
    link: 'https://boraexpandir.com.br/',
  },
  {
    id: 5,
    title: 'Recruta.ia — Automação de Recrutamento com IA',
    subtitle: 'Plataforma Inteligente para Seleção de Talentos',
    description: 'Sistema desenvolvido para automatizar processos de recrutamento, utilizando IA para análise de currículos, aplicação de testes psicológicos, ranqueamento de candidatos e agendamento automático das melhores entrevistas, reduzindo tempo e esforço operacional do RH.',
    image: null,
    icon: 'users',
    technologies: ['Inteligência Artificial', 'Processamento de Dados', 'Automação de RH', 'Backend'],
    context: 'SaaS B2B | Recursos Humanos',
    year: '2024',
    link: 'https://github.com/asevedocompany/recruta-ia',
  },
  {
    id: 6,
    title: 'Plataforma de Preços Dinâmicos — SaaS B2B',
    subtitle: 'Sistema de Precificação Dinâmica para Serviços e Ingressos',
    description: 'SaaS B2B desenvolvido em uma maratona de programação de 36h, focado em cálculo de preços dinâmicos para plataformas de serviços e ingressos. A solução considera demanda, clima, sazonalidade e urgência da reserva para maximizar faturamento e reduzir ociosidade.',
    image: null,
    icon: 'trending-up',
    technologies: ['APIs REST', 'Algoritmos de Precificação', 'Node.js', 'Modelagem Estatística'],
    context: 'Hackathon | MVP Funcional',
    year: '2023',
    link: 'https://github.com/asevedocompany/precos-dinamicos',
  },
  {
    id: 7,
    title: 'App de Gestão de Investimentos em Criptomoedas',
    subtitle: 'Aplicativo Multiplataforma para Controle de Criptoativos',
    description: 'Aplicativo desenvolvido para acompanhamento de investimentos em criptomoedas, permitindo registro de transações, cálculo de performance, controle de preço médio e geração de informações para declaração correta de imposto de renda.',
    image: null,
    icon: 'bitcoin',
    technologies: ['App Multiplataforma', 'Cálculos Financeiros', 'Relatórios', 'Backend'],
    context: 'Aplicação Mobile | Finanças',
    year: '2023',
    link: 'https://github.com/asevedocompany/crypto-wallet',
  },
  {
    id: 8,
    title: 'Modelo de IA para Predição de Resultados no Futebol',
    subtitle: 'Algoritmo de Predição de Resultados Esportivos',
    description: 'Modelo de machine learning treinado com dados históricos de clubes para prever probabilidades de desempenho e chances de títulos em competições de futebol, considerando múltiplos fatores estatísticos e contextuais.',
    image: null,
    icon: 'brain',
    technologies: ['Machine Learning', 'Modelagem Estatística', 'Análise de Dados'],
    context: 'Projeto de Pesquisa | Inteligência Artificial',
    year: '2022',
    link: 'https://github.com/asevedocompany/predicao-futebol',
  },
];

// Agrupar projetos em seções de 2
const projectSections = projects.reduce<typeof projects[]>((acc, project, index) => {
  const sectionIndex = Math.floor(index / 2);
  if (!acc[sectionIndex]) {
    acc[sectionIndex] = [];
  }
  acc[sectionIndex].push(project);
  return acc;
}, []);

// Mapeamento de ícones para os placeholders
const iconMap: Record<string, React.ReactNode> = {
  'activity': <Activity size={64} className="text-primary/60" />,
  'leaf': <Leaf size={64} className="text-emerald-400/60" />,
  'message-circle': <MessageCircle size={64} className="text-green-400/60" />,
  'globe': <Globe size={64} className="text-blue-400/60" />,
  'users': <Users size={64} className="text-violet-400/60" />,
  'trending-up': <TrendingUp size={64} className="text-orange-400/60" />,
  'bitcoin': <Wallet size={64} className="text-amber-400/60" />,
  'brain': <Brain size={64} className="text-pink-400/60" />,
};

// Componente de projeto individual
function ProjectCard({ 
  project, 
  imageOnLeft 
}: { 
  project: typeof projects[0]; 
  imageOnLeft: boolean;
}) {
  const hasImage = project.image !== null;

  return (
    <div 
      className={`flex flex-col ${imageOnLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center`}
    >
      {/* Imagem do Projeto - Clicável */}
      <a 
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full lg:w-1/2 group cursor-pointer"
      >
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 border border-card-border transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/20">
          {hasImage ? (
            /* Imagem real do projeto - contida no container */
            <div className="absolute inset-0 bg-background-secondary flex items-center justify-center p-6">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-500 p-4"
              />
            </div>
          ) : (
            /* Placeholder com ícone */
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background-secondary to-secondary/20 flex flex-col items-center justify-center gap-4">
              {iconMap[project.icon] || <Activity size={64} className="text-primary/60" />}
              <span className="text-foreground-muted text-sm font-medium">Ver projeto</span>
            </div>
          )}
          
          {/* Overlay com ícone de link */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="bg-primary/90 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
              <ExternalLink size={24} className="text-background" />
            </div>
          </div>
        </div>
      </a>

      {/* Conteúdo do Projeto */}
      <div className="w-full lg:w-1/2 space-y-5">
        {/* Ano e Contexto */}
        <div className="flex items-center gap-4 text-sm text-foreground-muted">
          <span>{project.year}</span>
          <span className="w-1 h-1 rounded-full bg-primary" />
          <span>{project.context}</span>
        </div>

        {/* Título */}
        <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
          {project.title}
        </h3>

        {/* Subtítulo */}
        <p className="text-primary font-medium text-lg">
          {project.subtitle}
        </p>

        {/* Descrição */}
        <p className="text-foreground-secondary text-base leading-relaxed">
          {project.description}
        </p>

        {/* Badges de Tecnologias */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.technologies.map((tech: string) => (
            <Badge key={tech} variant="tech">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const scrollToSection = (index: number) => {
    if (sectionRefs.current[index]) {
      sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-background pt-32">
      {/* Header da Página */}
      <div className="text-center mb-20 px-6">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Nossos <span className="text-gradient">Projetos</span>
        </h1>
        <p className="text-foreground-secondary text-lg md:text-xl max-w-2xl mx-auto">
          Conheça alguns dos projetos que desenvolvemos e como ajudamos nossos clientes a alcançar seus objetivos.
        </p>
      </div>

      {/* Seções de Projetos */}
      {projectSections.map((section, sectionIndex) => (
        <section
          key={sectionIndex}
          ref={(el) => { sectionRefs.current[sectionIndex] = el; }}
          className="min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-16 py-20 relative"
        >
          {/* Projetos da Seção */}
          <div className="max-w-7xl mx-auto w-full space-y-20 lg:space-y-32">
            {section.map((project, projectIndex) => {
              // Calcular se a imagem fica na esquerda
              // Primeiro projeto de cada seção: esquerda, segundo: direita
              const globalIndex = sectionIndex * 2 + projectIndex;
              const imageOnLeft = globalIndex % 2 === 0;

              return (
                <div
                  key={project.id}
                  className="opacity-0 animate-fade-in-up"
                  style={{ animationDelay: `${projectIndex * 200}ms`, animationFillMode: 'forwards' }}
                >
                  <ProjectCard project={project} imageOnLeft={imageOnLeft} />
                </div>
              );
            })}
          </div>

          {/* Seta para próxima seção */}
          {sectionIndex < projectSections.length - 1 && (
            <button
              onClick={() => scrollToSection(sectionIndex + 1)}
              className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground-muted hover:text-primary transition-colors group"
              aria-label="Próxima seção"
            >
              <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Mais projetos
              </span>
              <ChevronDown 
                size={32} 
                className="animate-bounce" 
              />
            </button>
          )}
        </section>
      ))}

      {/* CTA Final */}
      <section className="py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Tem um projeto em mente?
          </h2>
          <p className="text-foreground-secondary text-lg mb-8">
            Vamos conversar sobre como podemos ajudar a transformar sua ideia em realidade.
          </p>
          <a
            href="/#cta"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-background font-medium rounded-lg hover:shadow-lg hover:shadow-primary-glow/30 hover:scale-[1.02] transition-all duration-300"
          >
            Solicitar Orçamento
          </a>
        </div>
      </section>
    </main>
  );
}
