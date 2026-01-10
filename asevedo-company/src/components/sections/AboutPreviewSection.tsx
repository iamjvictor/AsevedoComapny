/**
 * About Preview Section
 * Brief about section with link to full page
 * Highlights team structure and expertise
 */

import { Button, Container, Section } from '@/components/ui';
import { ArrowRight, Users } from 'lucide-react';

export function AboutPreviewSection() {
  return (
    <Section id="about">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Visual */}
        <div className="relative order-2 lg:order-1">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl rounded-full" />
          
          {/* Team illustration card */}
          <div className="relative glass rounded-2xl p-8 border border-primary/20">
            <div className="flex items-center justify-center gap-6 mb-6">
              {/* Team avatars placeholder */}
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary opacity-80"
                  style={{
                    transform: `translateX(${i * -10}px)`,
                    zIndex: 4 - i,
                  }}
                />
              ))}
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-gradient">8+</p>
                <p className="text-foreground-muted text-sm">Anos de mercado</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gradient">50+</p>
                <p className="text-foreground-muted text-sm">Projetos entregues</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gradient">20+</p>
                <p className="text-foreground-muted text-sm">Especialistas</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="order-1 lg:order-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <span className="text-foreground-muted font-medium">Sobre Nós</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Núcleo técnico + rede de{' '}
            <span className="text-gradient">especialistas colaboradores</span>
          </h2>
          
          <p className="text-foreground-secondary text-lg mb-6">
            Somos uma software house com um core team sênior e uma rede de profissionais 
            especializados que montamos sob demanda para cada projeto. Isso nos permite 
            escalar com qualidade, sem comprometer a entrega.
          </p>
          
          <p className="text-foreground-secondary mb-8">
            Nosso modelo combina a agilidade de uma startup com a maturidade técnica 
            de quem já entregou projetos para empresas de diversos portes e segmentos.
          </p>
          
          <Button href="/about" iconAfter={<ArrowRight size={18} />}>
            Conheça nossa história
          </Button>
        </div>
      </div>
    </Section>
  );
}
