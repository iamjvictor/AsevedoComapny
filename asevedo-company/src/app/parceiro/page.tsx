'use client';

/**
 * Página de Parceiros
 * Informações sobre o programa de parceiros e cadastro
 */

import { DottedSurface } from '@/components/effects';
import { Button, Card, Section } from '@/components/ui';
import { 
  CheckCircle, 
  DollarSign, 
  Gift, 
  Handshake, 
  Rocket, 
  Send, 
  Target, 
  TrendingUp, 
  Users, 
  X,
  Zap
} from 'lucide-react';
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

export default function ParceiroPage() {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Integrar com API para cadastrar parceiro
    console.log('Partner registration:', formData);
    
    // Simula delay de envio
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowModal(false);
    setShowSuccessModal(true);
    
    // Limpa formulário
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      message: '',
    });
  };

  const benefits = [
    {
      icon: <DollarSign size={32} className="text-primary" />,
      title: 'Comissão Atrativa',
      description: 'Ganhe de 10% a 15% de comissão sobre cada contrato fechado através de sua indicação.',
      highlight: '10% - 15%',
    },
    {
      icon: <Gift size={32} className="text-secondary" />,
      title: 'Bônus por Metas',
      description: 'Alcance metas mensais e trimestrais e receba bônus exclusivos além das comissões.',
      highlight: 'Bônus Extra',
    },
    {
      icon: <TrendingUp size={32} className="text-primary" />,
      title: 'Crescimento Contínuo',
      description: 'Quanto mais você indica, maior sua porcentagem de comissão. Evolua junto conosco.',
      highlight: 'Escalável',
    },
    {
      icon: <Target size={32} className="text-secondary" />,
      title: 'Acompanhamento na Plataforma',
      description: 'Acompanhe suas indicações, comissões e metas através de nossa plataforma exclusiva.',
      highlight: 'Dashboard',
    },
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Cadastre-se',
      description: 'Preencha o formulário e aguarde a aprovação do seu cadastro como parceiro.',
      icon: <Users size={24} />,
    },
    {
      step: '02',
      title: 'Indique Clientes',
      description: 'Apresente a Asevedo Company para empresas que precisam de soluções tecnológicas.',
      icon: <Handshake size={24} />,
    },
    {
      step: '03',
      title: 'Acompanhe',
      description: 'Monitore o status das suas indicações e negociações em tempo real.',
      icon: <Zap size={24} />,
    },
    {
      step: '04',
      title: 'Receba',
      description: 'Com o contrato fechado, receba sua comissão de forma rápida e transparente.',
      icon: <DollarSign size={24} />,
    },
  ];

  return (
    <>
      {/* DottedSurface Background - Fixed like homepage */}
      <DottedSurface className="opacity-50" />

      <main className="min-h-screen bg-transparent relative">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Rocket size={16} className="text-primary" />
              <span className="text-sm text-primary font-medium">Programa de Parceiros</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Seja um <span className="text-gradient">Parceiro</span> e{' '}
              <br className="hidden md:block" />
              Ganhe com a Gente
            </h1>
            
            <p className="text-foreground-secondary text-lg md:text-xl max-w-3xl mx-auto mb-10">
              Transforme seu networking em receita. Indique empresas para a Asevedo Company 
              e ganhe comissões de até <strong className="text-primary">15%</strong> sobre cada contrato fechado, 
              além de bônus exclusivos por metas alcançadas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => setShowModal(true)}
                icon={<Handshake size={20} />}
              >
                Cadastre-se como Parceiro
              </Button>
              <Button 
                href="#como-funciona" 
                variant="secondary" 
                size="lg"
              >
                Saiba Mais
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass rounded-xl p-6 border border-card-border">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">10-15%</div>
                <p className="text-foreground-secondary text-sm">Comissão por contrato</p>
              </div>
              <div className="glass rounded-xl p-6 border border-card-border">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">+Bônus</div>
                <p className="text-foreground-secondary text-sm">Por metas alcançadas</p>
              </div>
              <div className="glass rounded-xl p-6 border border-card-border">
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-2">100%</div>
                <p className="text-foreground-secondary text-sm">Transparência</p>
              </div>
            </div>
          </div>
        </section>

        {/* O que é o Programa */}
        <Section id="sobre" variant="secondary">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                O que é o <span className="text-gradient">Programa de Parceiros</span>?
              </h2>
              <p className="text-lg text-foreground-secondary max-w-3xl mx-auto">
                Uma oportunidade única de fazer parte do crescimento da Asevedo Company
              </p>
            </div>

            <Card variant="glass" className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">
                    Transforme Conexões em <span className="text-primary">Oportunidades</span>
                  </h3>
                  <div className="space-y-4 text-foreground-secondary">
                    <p>
                      O Programa de Parceiros da Asevedo Company é destinado a profissionais, 
                      consultores, empreendedores e empresas que desejam monetizar seu networking 
                      indicando soluções tecnológicas de alta qualidade.
                    </p>
                    <p>
                      Conhece uma empresa que precisa de desenvolvimento de software, automação 
                      de processos ou transformação digital? Indique para nós e ganhe comissões 
                      atrativas sobre cada contrato fechado.
                    </p>
                    <p>
                      Todo o acompanhamento é feito através de nossa <strong className="text-foreground">plataforma exclusiva</strong>, 
                      onde você pode monitorar suas indicações, comissões e metas em tempo real.
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-background-secondary/50 border border-card-border">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <CheckCircle size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Sem Investimento Inicial</h4>
                      <p className="text-sm text-foreground-secondary">Cadastre-se gratuitamente e comece a indicar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-background-secondary/50 border border-card-border">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <CheckCircle size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Suporte Dedicado</h4>
                      <p className="text-sm text-foreground-secondary">Conte com nossa equipe para apoiar suas indicações</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-4 rounded-lg bg-background-secondary/50 border border-card-border">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <CheckCircle size={20} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Pagamento Garantido</h4>
                      <p className="text-sm text-foreground-secondary">Comissões pagas de forma rápida e transparente</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Section>

        {/* Benefícios */}
        <Section id="beneficios">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Por que ser um <span className="text-gradient">Parceiro</span>?
              </h2>
              <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
                Benefícios exclusivos para quem faz parte do nosso programa
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <Card 
                  key={index} 
                  variant="glass" 
                  hover 
                  className="group"
                >
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-xl bg-background-secondary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {benefit.title}
                        </h3>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary">
                          {benefit.highlight}
                        </span>
                      </div>
                      <p className="text-foreground-secondary">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Commission Highlight */}
            <div className="mt-12 glass rounded-2xl p-8 md:p-12 border border-primary/20 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
                <DollarSign size={40} className="text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Comissões de <span className="text-gradient">10% a 15%</span>
              </h3>
              <p className="text-foreground-secondary max-w-2xl mx-auto mb-6">
                A porcentagem de comissão varia de acordo com o valor do contrato e sua 
                performance como parceiro. Quanto mais você indica e fecha, maior sua 
                porcentagem!
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span className="text-foreground-secondary">10% para novos parceiros</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span className="text-foreground-secondary">12% após 3 indicações</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-success" />
                  <span className="text-foreground-secondary">15% para top parceiros</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* Como Funciona */}
        <Section id="como-funciona" variant="secondary">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                Como <span className="text-gradient">Funciona</span>?
              </h2>
              <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
                Um processo simples e transparente para você começar a ganhar
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((item, index) => (
                <div key={index} className="relative group">
                  {/* Connector Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent z-0" />
                  )}
                  
                  <Card variant="glass" className="relative z-10 text-center h-full">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-background text-sm font-bold">
                      {item.step}
                    </div>
                    
                    <div className="pt-6">
                      <div className="w-14 h-14 rounded-xl bg-background-secondary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-primary">{item.icon}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-foreground-secondary">
                        {item.description}
                      </p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* CTA Final */}
        <Section id="cta">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass rounded-2xl p-8 md:p-12 border border-card-border relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
              </div>

              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 mb-6">
                  <Rocket size={40} className="text-primary" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Pronto para <span className="text-gradient">Começar</span>?
                </h2>
                <p className="text-foreground-secondary text-lg max-w-2xl mx-auto mb-8">
                  Faça parte do nosso programa de parceiros e transforme seu networking em 
                  uma fonte de renda. Cadastre-se agora e comece a ganhar!
                </p>

                <Button 
                  size="lg" 
                  onClick={() => setShowModal(true)}
                  icon={<Handshake size={20} />}
                  className="animate-pulse-glow"
                >
                  Cadastre-se como Parceiro
                </Button>

                <p className="text-foreground-muted text-sm mt-6">
                  Cadastro gratuito • Aprovação em até 48h • Suporte dedicado
                </p>
              </div>
            </div>
          </div>
        </Section>
      </main>

      {/* Modal de Cadastro */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative bg-background-secondary border border-card-border rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Handshake size={32} className="text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">
                Cadastro de Parceiro
              </h3>
              <p className="text-foreground-secondary mt-2">
                Preencha os dados abaixo para se tornar um parceiro
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder="Seu nome completo"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors"
                    placeholder="seu@email.com"
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="phone" 
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="company" 
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Empresa (opcional)
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder="Nome da sua empresa"
                />
              </div>

              <div>
                <label 
                  htmlFor="message" 
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Mensagem (opcional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Conte um pouco sobre você e sua experiência..."
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  size="lg" 
                  fullWidth
                  icon={<Send size={18} />}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Cadastro'}
                </Button>
              </div>

              <p className="text-foreground-muted text-xs text-center">
                Ao se cadastrar, você concorda com nossos termos de uso e política de privacidade.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowSuccessModal(false)}
        >
          <div 
            className="relative bg-background-secondary border border-card-border rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors"
              aria-label="Fechar"
            >
              <X size={24} />
            </button>

            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center">
                <CheckCircle size={48} className="text-success" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-foreground mb-3">
              Cadastro Enviado!
            </h3>
            <p className="text-foreground-secondary mb-6">
              Recebemos seu cadastro com sucesso! Nossa equipe irá analisar suas informações 
              e entrar em contato em até 48 horas.
            </p>

            <Button onClick={() => setShowSuccessModal(false)} fullWidth>
              Entendido
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
