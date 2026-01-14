'use client';

/**
 * Página do Programa de Parceiros
 * Landing page completa para conversão de parceiros
 * Com suporte internacional (País > Estado > Cidade)
 */

import { DottedSurface } from '@/components/effects';
import { Card, Section } from '@/components/ui';
import { 
  ArrowRight,
  Briefcase,
  CheckCircle,
  ChevronDown,
  Clock,
  DollarSign,
  Eye,
  EyeOff,
  FileText,
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
import { useState, useEffect, useMemo } from 'react';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { supabase } from '@/components/clients/Supabase';

interface FormData {
  name: string;
  email: string;
  password: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  taxId: string;  // CPF/Tax ID (internacional)
  paymentKey: string;  // PIX/PayPal/etc
}

export default function ParceiroPage() {
  const locale = useLocale();
  const t = useTranslations('Partner');
  
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    country: 'BR', // Brasil como padrão
    state: '',
    city: '',
    taxId: '',
    paymentKey: '',
  });

  // Country-State-City data
  const countries = useMemo(() => Country.getAllCountries(), []);
  const [states, setStates] = useState<IState[]>(() => 
    // Initialize with Brazilian states since BR is the default
    State.getStatesOfCountry('BR')
  );
  const [cities, setCities] = useState<ICity[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Update states when country changes
  useEffect(() => {
    if (formData.country) {
      const countryStates = State.getStatesOfCountry(formData.country);
      setStates(countryStates);
      if (!isInitialLoad) {
        setFormData(prev => ({ ...prev, state: '', city: '' }));
        setCities([]);
      }
      setIsInitialLoad(false);
    } else {
      setStates([]);
      setCities([]);
    }
  }, [formData.country]);

  // Update cities when state changes
  useEffect(() => {
    if (formData.country && formData.state) {
      const stateCities = City.getCitiesOfState(formData.country, formData.state);
      setCities(stateCities);
      // Reset city when state changes
      setFormData(prev => ({ ...prev, city: '' }));
    } else {
      setCities([]);
    }
  }, [formData.state]);

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

  console.log('=== INÍCIO DO CADASTRO ===');
  console.log('Form data:', formData);

  try {
    // 1) Validação simples
    if (formData.password.length < 6) {
      alert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    // 2) Normaliza nomes
    const countryName = getCountryName(formData.country);
    const stateName =
      states.find((s) => s.isoCode === formData.state)?.name || formData.state;

    console.log('Country:', countryName, '| State:', stateName);
    console.log('City:', formData.city);
    console.log('Tax ID:', formData.taxId);
    console.log('Phone:', formData.phone);
    console.log('Email:', formData.email);
    console.log('Name:', formData.name);
    console.log('Password:', formData.password);

    // 3) Signup com metadata
    console.log('Chamando supabase.auth.signUp...');
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          name: formData.name,
          phone: formData.phone,
          document: formData.taxId,
          country: countryName,
          state: stateName,
          city: formData.city,
        },
      },
    });

    console.log('signUp response - data:', data);
    console.log('signUp response - error:', error);

    if (error) {
      console.error('❌ Supabase signup error:', error);
      alert(error.message);
      return;
    }

    const userId = data.user?.id;
    console.log('User ID:', userId);
    console.log('User metadata:', data.user?.user_metadata);

    if (!userId) {
      console.log('❌ No user returned from signUp');
      alert('Não foi possível concluir o cadastro agora. Tente novamente.');
      return;
    }

    // 4) Checa sessão
    const { data: sessionData } = await supabase.auth.getSession();
    const hasSession = !!sessionData.session;
    console.log('Has session:', hasSession);
    console.log('Session data:', sessionData);

    // 5) Se tiver sessão, tenta atualizar/inserir o profile
    if (hasSession) {
      console.log('✅ Sessão ativa - tentando inserir/atualizar profile...');
      
      const profilePayload = {
        id: userId,
        name: formData.name,
        phone: formData.phone,
        document: formData.taxId,
      };
      console.log('Profile payload:', profilePayload);

      // Primeiro tenta INSERT (upsert)
      const { data: upsertData, error: upsertError } = await supabase
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id' })
        .select();

      console.log('Upsert result - data:', upsertData);
      console.log('Upsert result - error:', upsertError);

      if (upsertError) {
        console.error('❌ Erro ao salvar profile:', upsertError);
        alert(`Erro ao salvar perfil: ${upsertError.message}`);
      } else {
        console.log('✅ Profile salvo com sucesso!');
      }
    } else {
      console.log('⚠️ Sem sessão - o trigger deve criar o profile');
      console.log('User metadata que será usado pelo trigger:', data.user?.user_metadata);
    }

    // 6) UI pós-cadastro
    console.log('=== CADASTRO CONCLUÍDO ===');
    setShowModal(false);
    setShowTermsModal(true);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    alert('Erro inesperado. Tente novamente.');
  } finally {
    setIsSubmitting(false);
  }
};


  // Handle terms acceptance
  const handleAcceptTerms = () => {
    setShowTermsModal(false);
    setShowSuccessModal(true);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      country: 'BR',
      state: '',
      city: '',
      taxId: '',
      paymentKey: '',
    });
    
    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      window.location.href = `/${locale}/plataforma-parceiro/dashboard`;
    }, 2000);
  };

  // Get country name by code
  const getCountryName = (code: string) => {
    const country = countries.find(c => c.isoCode === code);
    return country?.name || code;
  };

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
                href={`/${locale}/login?redirect=plataforma-parceiro/dashboard`}
                className="text-slate-400 hover:text-white transition-colors duration-300 font-medium flex items-center group"
                style={{
                  fontSize: 'var(--text-base)',
                  gap: 'var(--space-2)',
                }}
              >
                {t('hero.alreadyPartner')}
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
                    htmlFor="password" 
                    className="block text-sm font-medium text-white mb-2"
                  >
                    {t('modal.form.password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      required
                      minLength={6}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors pr-12"
                      placeholder={t('modal.form.passwordPlaceholder')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label 
                  htmlFor="phone" 
                  className="block text-sm font-medium text-white mb-2"
                >
                  {t('modal.form.phone')}
                </label>
                <PhoneInput
                  defaultCountry="BR"
                  value={formData.phone}
                  onChange={(value) => setFormData(prev => ({ ...prev, phone: value || '' }))}
                  className="phone-input-dark w-full"
                  placeholder={t('modal.form.phonePlaceholder')}
                />
              </div>

              {/* Localização - País */}
              <div>
                <label 
                  htmlFor="country" 
                  className="block text-sm font-medium text-white mb-2"
                >
                  {t('modal.form.country')}
                </label>
                <select
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors"
                >
                  <option value="" className="text-slate-500">{t('modal.form.countryPlaceholder')}</option>
                  {countries.map((country) => (
                    <option key={country.isoCode} value={country.isoCode}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado e Cidade */}
              <div className="grid md:grid-cols-2 gap-4">
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
                    disabled={!formData.country || states.length === 0}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="" className="text-slate-500">{t('modal.form.statePlaceholder')}</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>{state.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label 
                    htmlFor="city" 
                    className="block text-sm font-medium text-white mb-2"
                  >
                    {t('modal.form.city')}
                  </label>
                  {cities.length > 0 ? (
                    <select
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!formData.state}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" className="text-slate-500">{t('modal.form.cityPlaceholder')}</option>
                      {cities.map((city) => (
                        <option key={city.name} value={city.name}>{city.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleChange}
                      disabled={!formData.state && states.length > 0}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder={t('modal.form.cityPlaceholder')}
                    />
                  )}
                </div>
              </div>

              {/* Dados para pagamento */}
              <div className="pt-2">
                <p className="text-xs text-slate-500 mb-3">{t('modal.form.paymentInfo')}</p>
                <div className="grid md:grid-cols-2 gap-4 items-end">
                  <div>
                    <label 
                      htmlFor="taxId" 
                      className="block text-sm font-medium text-white mb-2 min-h-[40px] flex items-end"
                    >
                      {t('modal.form.taxId')}
                    </label>
                    <input
                      type="text"
                      id="taxId"
                      name="taxId"
                      required
                      value={formData.taxId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder={t('modal.form.taxIdPlaceholder')}
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="paymentKey" 
                      className="block text-sm font-medium text-white mb-2 min-h-[40px] flex items-end"
                    >
                      {t('modal.form.paymentKey')}
                    </label>
                    <input
                      type="text"
                      id="paymentKey"
                      name="paymentKey"
                      required
                      value={formData.paymentKey}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
                      placeholder={t('modal.form.paymentKeyPlaceholder')}
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

      {/* ===== MODAL DE TERMOS ===== */}
      {showTermsModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
        >
          <div 
            className="relative bg-slate-900 border border-slate-700/50 rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                <FileText size={24} className="text-violet-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {t('modal.terms.title')}
                </h3>
                <p className="text-slate-400 text-sm">
                  {t('modal.terms.subtitle')}
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-800/50 rounded-lg p-4 mb-6 text-slate-300 text-sm space-y-4 max-h-[40vh]">
              <h4 className="font-semibold text-white">1. Aceite dos Termos</h4>
              <p>
                Ao se cadastrar como Parceiro da Asevedo Company, você concorda com os termos e condições aqui estabelecidos.
              </p>
              
              <h4 className="font-semibold text-white">2. Comissões</h4>
              <p>
                As comissões serão calculadas com base no valor do contrato fechado e estarão disponíveis para saque após a confirmação do pagamento pelo cliente.
              </p>
              
              <h4 className="font-semibold text-white">3. Confidencialidade</h4>
              <p>
                Você concorda em manter sigilo sobre todas as informações confidenciais da empresa e de seus clientes.
              </p>
              
              <h4 className="font-semibold text-white">4. Uso da Marca</h4>
              <p>
                O uso da marca Asevedo Company deve ser autorizado e seguir as diretrizes fornecidas pela empresa.
              </p>
              
              <h4 className="font-semibold text-white">5. Rescisão</h4>
              <p>
                Qualquer parte pode rescindir esta parceria a qualquer momento, mediante aviso prévio de 30 dias.
              </p>
            </div>

            <div className="flex items-start gap-3 mb-6">
              <input
                type="checkbox"
                id="acceptTerms"
                className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-violet-500 focus:ring-violet-500"
              />
              <label htmlFor="acceptTerms" className="text-slate-300 text-sm">
                {t('modal.terms.accept')}
              </label>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowTermsModal(false)}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-colors border border-slate-700"
              >
                {t('modal.terms.decline')}
              </button>
              <button
                onClick={handleAcceptTerms}
                className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors"
              >
                {t('modal.terms.accept_button')}
              </button>
            </div>
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
