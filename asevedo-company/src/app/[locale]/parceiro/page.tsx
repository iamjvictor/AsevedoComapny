'use client';

/**
 * Página do Programa de Parceiros
 * Landing page completa para conversão de parceiros
 */

import { DottedSurface } from '@/components/effects';
import { Card, Section } from '@/components/ui';
import { 
  ArrowRight,
  Briefcase,
  CheckCircle, 
  ChevronDown,
  DollarSign, 
  Eye,
  Gift, 
  Handshake, 
  History,
  MessageCircle,
  Percent,
  Search, 
  Send, 
  Target, 
  TrendingUp, 
  UserCheck,
  Users, 
  Wallet,
  X,
  Zap
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  cpf: string;
  pix: string;
}

export default function ParceiroPage() {
  const locale = useLocale();
  const t = useTranslations('Partner');
  
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    cpf: '',
    pix: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Integrar com Supabase Auth (magic link) e salvar dados do parceiro
    console.log('Partner registration:', formData);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setShowModal(false);
    setShowSuccessModal(true);
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      city: '',
      state: '',
      cpf: '',
      pix: '',
    });
  };

  // Lista de estados brasileiros
  const brazilianStates = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  // Seção 2 - Para quem é o programa
  const targetAudience = [
    {
      icon: <Users size={28} className="text-primary" />,
      title: t('targetAudience.items.network.title'),
      description: t('targetAudience.items.network.description'),
    },
    {
      icon: <Briefcase size={28} className="text-secondary" />,
      title: t('targetAudience.items.professionals.title'),
      description: t('targetAudience.items.professionals.description'),
    },
    {
      icon: <Handshake size={28} className="text-primary" />,
      title: t('targetAudience.items.informal.title'),
      description: t('targetAudience.items.informal.description'),
    },
    {
      icon: <Wallet size={28} className="text-secondary" />,
      title: t('targetAudience.items.income.title'),
      description: t('targetAudience.items.income.description'),
    },
  ];

  // Seção 3 - Como funciona
  const howItWorks = [
    {
      step: '01',
      title: t('howItWorks.steps.step1'),
      icon: <UserCheck size={24} />,
    },
    {
      step: '02',
      title: t('howItWorks.steps.step2'),
      icon: <Send size={24} />,
    },
    {
      step: '03',
      title: t('howItWorks.steps.step3'),
      icon: <Search size={24} />,
    },
    {
      step: '04',
      title: t('howItWorks.steps.step4'),
      icon: <CheckCircle size={24} />,
    },
    {
      step: '05',
      title: t('howItWorks.steps.step5'),
      icon: <DollarSign size={24} />,
    },
    {
      step: '06',
      title: t('howItWorks.steps.step6'),
      icon: <Wallet size={24} />,
    },
  ];

  // Seção 6 - Transparência
  const transparencyItems = [
    { icon: <Eye size={20} />, text: t('transparency.items.tracking') },
    { icon: <Zap size={20} />, text: t('transparency.items.status') },
    { icon: <History size={20} />, text: t('transparency.items.history') },
    { icon: <MessageCircle size={20} />, text: t('transparency.items.communication') },
  ];

  // Scroll to next section function (copied from HeroSection)
  const scrollToNextSection = () => {
    const sectionIds = ['hero', 'para-quem', 'como-funciona', 'comissoes', 'bonus', 'transparencia', 'cta'];
    const sections = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];
    
    const scrollPosition = window.scrollY + 100;
    
    for (const section of sections) {
      if (section.offsetTop > scrollPosition) {
        section.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    
    window.scrollBy({
      top: window.innerHeight,
      behavior: 'smooth'
    });
  };

  return (
    <>
      {/* DottedSurface Background - Fixed like homepage */}
      <DottedSurface className="opacity-50" />

      <main className="min-h-screen bg-transparent relative">
        {/* ===== 1. HERO SECTION ===== */}
        <section id="hero" className="relative pt-32 pb-24 px-6 overflow-hidden min-h-screen flex items-center justify-center">
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1 
              className="font-bold leading-tight tracking-tight mb-6"
              style={{ 
                fontFamily: 'var(--font-jetbrains), monospace',
                fontSize: 'var(--text-5xl)',
              }}
            >
              <span className="text-white">{t('hero.title')}</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
                {t('hero.titleHighlight')}
              </span>
            </h1>
            
            <p 
              className="text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10"
              style={{ fontSize: 'var(--text-lg)' }}
            >
              {t('hero.subtitle')}
            </p>

            <div 
              className="flex items-center justify-center flex-wrap"
              style={{ gap: 'var(--space-4)' }}
            >
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center justify-center bg-slate-800/80 text-white font-medium rounded-full border border-slate-600/50 hover:bg-slate-700/80 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20 cursor-pointer hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
                style={{
                  fontSize: 'var(--text-base)',
                  padding: 'var(--space-3) var(--space-6)',
                  gap: 'var(--space-2)',
                }}
              >
                <Handshake size={18} />
                {t('hero.cta')}
              </button>
              
              <a
                href="#como-funciona"
                className="text-slate-400 hover:text-white transition-colors duration-300 font-medium flex items-center group"
                style={{
                  fontSize: 'var(--text-base)',
                  gap: 'var(--space-2)',
                }}
              >
                {t('cta.secondaryButton')}
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
            </div>

            <p className="text-slate-500 text-sm mt-6">
              {t('hero.microcopy')}
            </p>
          </div>

          {/* Scroll Down Arrow */}
          <button
            onClick={scrollToNextSection}
            className="fixed left-1/2 -translate-x-1/2 z-50 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 animate-pulse cursor-pointer"
            style={{
              bottom: 'var(--space-6)',
              padding: 'var(--space-3)',
            }}
            aria-label="Scroll to next section"
          >
            <ChevronDown 
              className="text-white/80" 
              style={{ width: 'var(--icon-xl)', height: 'var(--icon-xl)' }}
            />
          </button>
        </section>

        {/* ===== 2. PARA QUEM É O PROGRAMA ===== */}
        <Section id="para-quem" className="min-h-screen flex items-center">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="font-bold mb-4"
                style={{ 
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 'var(--text-4xl)',
                }}
              >
                <span className="text-white">{t('targetAudience.title')}</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
                  {t('targetAudience.titleHighlight')}
                </span>
              </h2>
              <p className="text-lg text-slate-400 max-w-3xl mx-auto">
                {t('targetAudience.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {targetAudience.map((item, index) => (
                <Card 
                  key={index} 
                  variant="glass" 
                  hover 
                  className="group backdrop-blur-sm bg-slate-900/40 border-slate-700/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-slate-800/80 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Frase de Reforço */}
            <div className="mt-10 text-center">
              <p 
                className="font-medium"
                style={{ fontSize: 'var(--text-xl)' }}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
                  {t('targetAudience.reinforcement')}
                </span>
              </p>
            </div>
          </div>
        </Section>

        {/* ===== 3. COMO FUNCIONA ===== */}
        <Section id="como-funciona" className="min-h-screen flex items-center">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 
                className="font-bold mb-4"
                style={{ 
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 'var(--text-4xl)',
                }}
              >
                <span className="text-white">{t('howItWorks.title')}</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
                  {t('howItWorks.titleHighlight')}
                </span>
              </h2>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Linha vertical central (desktop) */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-purple-500 to-violet-500/30" />

              <div className="space-y-8 md:space-y-0">
                {howItWorks.map((item, index) => (
                  <div 
                    key={index}
                    className={`relative flex flex-col md:flex-row items-center gap-4 md:gap-8 ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    {/* Conteúdo */}
                    <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <Card variant="glass" className="inline-block backdrop-blur-sm bg-slate-900/40 border-slate-700/50">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-800/80 flex items-center justify-center shrink-0 text-violet-400">
                            {item.icon}
                          </div>
                          <div>
                            <span className="text-xs text-violet-400 font-bold">STEP {item.step}</span>
                            <h3 className="text-lg font-semibold text-white">
                              {item.title}
                            </h3>
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Círculo central */}
                    <div className="hidden md:flex w-12 h-12 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 items-center justify-center text-white font-bold text-sm shrink-0 z-10 shadow-lg shadow-violet-500/30">
                      {item.step}
                    </div>

                    {/* Espaço vazio do outro lado */}
                    <div className="flex-1 hidden md:block" />
                  </div>
                ))}
              </div>
            </div>

            {/* Observação */}
            <div className="mt-12 text-center">
              <p className="text-slate-500 italic">
                {t('howItWorks.observation')}
              </p>
            </div>
          </div>
        </Section>

        {/* ===== 4. COMISSÕES ===== */}
        <Section id="comissoes" className="min-h-screen flex items-center">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 
                className="font-bold mb-4"
                style={{ 
                  fontFamily: 'var(--font-jetbrains), monospace',
                  fontSize: 'var(--text-4xl)',
                }}
              >
                <span className="text-white">{t('commissions.title')}</span>{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
                  {t('commissions.titleHighlight')}
                </span>
              </h2>
              <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                {t('commissions.subtitle')}
              </p>
            </div>

            {/* Cards de Comissão */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card variant="glass" className="text-center p-8 backdrop-blur-sm bg-slate-900/40 border-slate-700/50">
                <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Percent size={32} className="text-violet-400" />
                </div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400 mb-2">10%</div>
                <p className="text-slate-400 text-sm">{t('commissions.standard')}</p>
              </Card>

              <Card variant="glass" className="text-center p-8 backdrop-blur-sm bg-slate-900/40 border-violet-500/30">
                <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <TrendingUp size={32} className="text-purple-400" />
                </div>
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-2">15%</div>
                <p className="text-slate-400 text-sm">{t('commissions.performance')}</p>
              </Card>

              <Card variant="glass" className="text-center p-8 backdrop-blur-sm bg-slate-900/40 border-slate-700/50">
                <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-violet-400" />
                </div>
                <div className="text-lg font-bold text-white mb-2">{t('commissions.perProject')}</div>
                <p className="text-slate-400 text-sm">{t('commissions.perProjectDesc')}</p>
              </Card>
            </div>

            {/* Nota */}
            <p className="text-center text-slate-500 text-sm mt-8">
              {t('commissions.note')}
            </p>
          </div>
        </Section>

        {/* ===== 5. BÔNUS POR METAS ===== */}
        <Section id="bonus" className="min-h-screen flex items-center">
          <div className="max-w-4xl mx-auto">
            <div className="backdrop-blur-sm bg-slate-900/40 rounded-2xl p-8 md:p-12 border border-purple-500/30">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-500/20 mb-6">
                  <Gift size={40} className="text-purple-400" />
                </div>
                <h2 
                  className="font-bold mb-4"
                  style={{ 
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: 'var(--text-3xl)',
                  }}
                >
                  <span className="text-white">{t('bonus.title')}</span>{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
                    {t('bonus.titleHighlight')}
                  </span>
                </h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  {t('bonus.subtitle')}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Target size={20} className="text-purple-400" />
                  </div>
                  <span className="text-white font-medium">{t('bonus.items.monthly')}</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                    <TrendingUp size={20} className="text-purple-400" />
                  </div>
                  <span className="text-white font-medium">{t('bonus.items.increase')}</span>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
                  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Gift size={20} className="text-purple-400" />
                  </div>
                  <span className="text-white font-medium">{t('bonus.items.exclusive')}</span>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ===== 6. TRANSPARÊNCIA E CONFIANÇA ===== */}
        <Section id="transparencia" className="min-h-screen flex items-center">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 
                  className="font-bold mb-6"
                  style={{ 
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: 'var(--text-3xl)',
                  }}
                >
                  <span className="text-white">{t('transparency.title')}</span>{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
                    {t('transparency.titleHighlight')}
                  </span>
                </h2>
                
                <div className="space-y-4 mb-8">
                  {transparencyItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0 text-violet-400">
                        {item.icon}
                      </div>
                      <span className="text-white">{item.text}</span>
                    </div>
                  ))}
                </div>

                <p className="text-slate-400">
                  {t('transparency.reinforcement')}
                </p>
              </div>

              <div className="backdrop-blur-sm bg-slate-900/40 rounded-2xl p-8 border border-slate-700/50">
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
                    <span className="text-slate-400">Referral #1024</span>
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">{t('transparency.dashboard.closed')}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
                    <span className="text-slate-400">Referral #1025</span>
                    <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-sm font-medium">{t('transparency.dashboard.negotiation')}</span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-slate-700/50">
                    <span className="text-slate-400">Referral #1026</span>
                    <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-sm font-medium">{t('transparency.dashboard.diagnosis')}</span>
                  </div>
                  <div className="text-center pt-2">
                    <p className="text-slate-500 text-sm">{t('transparency.dashboard.example')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>

        {/* ===== 7. CTA FINAL ===== */}
        <Section id="cta" className="min-h-screen flex items-center">
          <div className="max-w-4xl mx-auto text-center">
            <div className="backdrop-blur-sm bg-slate-900/40 rounded-2xl p-8 md:p-14 border border-slate-700/50 relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
              </div>

              <div className="relative z-10">
                <h2 
                  className="font-bold mb-4"
                  style={{ 
                    fontFamily: 'var(--font-jetbrains), monospace',
                    fontSize: 'var(--text-4xl)',
                  }}
                >
                  <span className="text-white">{t('cta.title')}</span>{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400">
                    {t('cta.titleHighlight')}
                  </span>?
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8">
                  {t('cta.subtitle')}
                </p>

                <div 
                  className="flex flex-col sm:flex-row justify-center mb-6"
                  style={{ gap: 'var(--space-4)' }}
                >
                  <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center justify-center bg-slate-800/80 text-white font-medium rounded-full border border-slate-600/50 hover:bg-slate-700/80 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20 cursor-pointer hover:scale-[1.02] transition-all duration-300 backdrop-blur-sm"
                    style={{
                      fontSize: 'var(--text-base)',
                      padding: 'var(--space-3) var(--space-6)',
                      gap: 'var(--space-2)',
                    }}
                  >
                    <Handshake size={18} />
                    {t('cta.primaryButton')}
                  </button>
                  <a
                    href={`/${locale}/contact`}
                    className="inline-flex items-center justify-center text-slate-400 hover:text-white font-medium rounded-full border border-slate-700/50 hover:border-slate-600/50 transition-all duration-300"
                    style={{
                      fontSize: 'var(--text-base)',
                      padding: 'var(--space-3) var(--space-6)',
                      gap: 'var(--space-2)',
                    }}
                  >
                    <MessageCircle size={18} />
                    {t('cta.secondaryButton')}
                  </a>
                </div>

                <p className="text-slate-500 text-sm">
                  {t('cta.microcopy')}
                </p>
              </div>
            </div>
          </div>
        </Section>
      </main>

      {/* ===== MODAL DE CADASTRO ===== */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="relative bg-slate-900 border border-slate-700/50 rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão fechar */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-violet-500/20 flex items-center justify-center mx-auto mb-4">
                <Handshake size={32} className="text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {t('modal.title')}
              </h3>
              <p className="text-slate-400 mt-2">
                {t('modal.subtitle')}
              </p>
            </div>

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-white mb-2"
                >
                  {t('modal.form.name')}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                  placeholder={t('modal.form.namePlaceholder')}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label 
                    htmlFor="email" 
                    className="block text-sm font-medium text-white mb-2"
                  >
                    {t('modal.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder={t('modal.form.emailPlaceholder')}
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="phone" 
                    className="block text-sm font-medium text-white mb-2"
                  >
                    {t('modal.form.phone')}
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder={t('modal.form.phonePlaceholder')}
                  />
                </div>
              </div>

              {/* Localização */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label 
                    htmlFor="city" 
                    className="block text-sm font-medium text-white mb-2"
                  >
                    {t('modal.form.city')}
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                    placeholder={t('modal.form.cityPlaceholder')}
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="state" 
                    className="block text-sm font-medium text-white mb-2"
                  >
                    {t('modal.form.state')}
                  </label>
                  <select
                    id="state"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
                  >
                    <option value="" className="text-slate-500">{t('modal.form.statePlaceholder')}</option>
                    {brazilianStates.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Dados para pagamento */}
              <div className="pt-2">
                <p className="text-xs text-slate-500 mb-3">{t('modal.form.paymentInfo')}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label 
                      htmlFor="cpf" 
                      className="block text-sm font-medium text-white mb-2"
                    >
                      {t('modal.form.cpf')}
                    </label>
                    <input
                      type="text"
                      id="cpf"
                      name="cpf"
                      required
                      value={formData.cpf}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder={t('modal.form.cpfPlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="pix" 
                      className="block text-sm font-medium text-white mb-2"
                    >
                      {t('modal.form.pix')}
                    </label>
                    <input
                      type="text"
                      id="pix"
                      name="pix"
                      required
                      value={formData.pix}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder={t('modal.form.pixPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full inline-flex items-center justify-center bg-slate-800/80 text-white font-medium rounded-full border border-slate-600/50 hover:bg-slate-700/80 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20 cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    fontSize: 'var(--text-base)',
                    padding: 'var(--space-3) var(--space-6)',
                    gap: 'var(--space-2)',
                  }}
                >
                  <ArrowRight size={18} />
                  {isSubmitting ? t('modal.form.submitting') : t('modal.form.submit')}
                </button>
              </div>

              <p className="text-slate-500 text-xs text-center">
                {t('modal.form.terms')}
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ===== MODAL DE SUCESSO ===== */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowSuccessModal(false)}
        >
          <div 
            className="relative bg-slate-900 border border-slate-700/50 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle size={48} className="text-green-400" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3">
              {t('modal.success.title')}
            </h3>
            <p className="text-slate-400 mb-6">
              {t('modal.success.message')}
            </p>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full inline-flex items-center justify-center bg-slate-800/80 text-white font-medium rounded-full border border-slate-600/50 hover:bg-slate-700/80 hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/20 cursor-pointer transition-all duration-300"
              style={{
                fontSize: 'var(--text-base)',
                padding: 'var(--space-3) var(--space-6)',
              }}
            >
              {t('modal.success.button')}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
