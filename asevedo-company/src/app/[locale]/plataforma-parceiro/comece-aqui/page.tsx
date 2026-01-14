'use client';

/**
 * Partner Platform - Comece Aqui (Get Started)
 * Manual educacional completo para parceiros comerciais
 */

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers';
import PartnerSidebar from '@/components/partner-platform/PartnerSidebar';
import {
    ArrowRight,
    ArrowDown,
    BookOpen,
    Brain,
    Briefcase,
    Check,
    CheckCircle2,
    ClipboardList,
    Copy,
    Download,
    ExternalLink,
    Eye,
    FileText,
    Handshake,
    Lightbulb,
    Loader2,
    Map,
    Menu,
    Mic,
    Phone,
    Puzzle,
    Rocket,
    Search,
    Settings,
    Share2,
    Shuffle,
    Sparkles,
    Target,
    Users,
    Video,
    X,
    Zap
} from 'lucide-react';

export default function ComeceAquiPage() {
    const locale = useLocale();
    const router = useRouter();
    const { profile, isLoading: authLoading, isAuthenticated } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    // Gera o link de indicação
    const referralLink = useMemo(() => {
        if (!profile?.code) return '';
        const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://asevedocompany.com';
        return `${baseUrl}/${locale}?ref=${profile.code}`;
    }, [profile?.code, locale]);

    // Redirect se não autenticado
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push(`/${locale}/login?redirect=plataforma-parceiro/comece-aqui`);
        }
    }, [authLoading, isAuthenticated, router, locale]);

    const handleCopyLink = () => {
        if (!referralLink) return;
        navigator.clipboard.writeText(referralLink);
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2000);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 size={40} className="animate-spin text-violet-500" />
                    <p className="text-foreground-muted">Carregando...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar Component */}
            <PartnerSidebar
                locale={locale}
                currentPage="comece-aqui"
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
            />

            {/* =========== MAIN CONTENT =========== */}
            <div className="flex-1 lg:pl-64">
                {/* Mobile Header */}
                <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-sm border-b border-card-border">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
                    >
                        <Menu size={24} className="text-foreground" />
                    </button>
                    <p className="text-sm font-medium text-foreground">Manual do Parceiro</p>
                    <div className="w-10" />
                </div>

                {/* Content */}
                <main className="p-4 lg:p-8 max-w-6xl mx-auto">
                        {/* Hero Header */}
                        <div className="mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                    <BookOpen size={24} className="text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Manual do Parceiro Comercial</h1>
                                    <p className="text-foreground-muted">Seu guia completo para indicar projetos</p>
                                </div>
                            </div>
                        </div>

                        {/* =========== SEÇÃO 1: INTRODUÇÃO =========== */}
                        <section id="introducao" className="mb-16 scroll-mt-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                    <Handshake size={20} className="text-violet-400" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">O Papel do Parceiro Comercial</h2>
                            </div>

                            <div className="bg-background-secondary rounded-xl p-6 border border-card-border mb-6">
                                <p className="text-foreground-secondary leading-relaxed mb-4">
                                    Como parceiro comercial da Asevedo Company, você atua como uma <strong className="text-white">ponte estratégica</strong> entre empresas com problemas reais e nossa equipe de engenharia especializada.
                                </p>
                                <p className="text-foreground-secondary leading-relaxed mb-6">
                                    Seu papel <strong className="text-white">não é</strong> vender serviços, negociar valores ou executar projetos. Seu foco é identificar oportunidades e direcionar leads qualificados para nossa equipe.
                                </p>

                                {/* Box de destaque */}
                                <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/5 rounded-xl p-5 border border-violet-500/20">
                                    <p className="text-sm text-foreground-muted mb-4 font-medium">Seu objetivo principal:</p>
                                    <p className="text-lg text-white font-semibold mb-6">
                                        Identificar uma dor real e conduzir o lead até o diagnóstico técnico da Asevedo Company.
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                                <Check size={14} className="text-emerald-400" />
                                            </div>
                                            <p className="text-foreground">Você identifica a dor</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                                <Check size={14} className="text-emerald-400" />
                                            </div>
                                            <p className="text-foreground">O engenheiro responsável faz o diagnóstico</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                                <Check size={14} className="text-emerald-400" />
                                            </div>
                                            <p className="text-foreground">A empresa propõe a solução e o orçamento</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* =========== SEÇÃO 2: SERVIÇOS =========== */}
                        <section id="servicos" className="mb-16 scroll-mt-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                    <Puzzle size={20} className="text-blue-400" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Que Tipos de Problemas Resolvemos</h2>
                            </div>

                            <p className="text-foreground-secondary mb-6">
                                Entenda os tipos de dores que nossa equipe resolve. Pense em <strong className="text-white">problemas</strong>, não em tecnologia.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                {[
                                    { icon: Zap, title: 'Automação de Processos', desc: 'Trabalho manual repetitivo, retrabalho, tarefas que consomem horas', color: 'yellow' },
                                    { icon: Shuffle, title: 'Integração de Sistemas', desc: 'Ferramentas desconectadas, dados duplicados, falta de sincronização', color: 'cyan' },
                                    { icon: ClipboardList, title: 'Sistemas Internos', desc: 'Falta de controle, decisões sem dados, processos desorganizados', color: 'emerald' },
                                    { icon: Settings, title: 'Manutenção de Software', desc: 'Sistemas antigos, bugs recorrentes, falta de suporte técnico', color: 'orange' },
                                    { icon: Brain, title: 'IA Aplicada', desc: 'Análise de dados manual, previsões imprecisas, atendimento sobrecarregado', color: 'purple' },
                                ].map((item, i) => (
                                    <div key={i} className={`bg-background-secondary rounded-xl p-5 border border-card-border hover:border-${item.color}-500/30 transition-colors aspect-square flex flex-col justify-center`}>
                                        <div className="text-center">
                                            <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/20 flex items-center justify-center mx-auto mb-4`}>
                                                <item.icon size={24} className={`text-${item.color}-400`} />
                                            </div>
                                            <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                                            <p className="text-sm text-foreground-muted">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                <p className="text-sm text-foreground">
                                    💡 <strong>Lembre-se:</strong> O parceiro não oferece serviços. Ele identifica problemas.
                                </p>
                            </div>
                        </section>

                        {/* =========== SEÇÃO 3: IDENTIFICANDO DOR =========== */}
                        <section id="identificando-dor" className="mb-16 scroll-mt-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                    <Search size={20} className="text-amber-400" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Como Identificar uma Boa Oportunidade</h2>
                            </div>

                            <p className="text-foreground-secondary mb-6">
                                A dor surge em conversas normais, observações e reclamações do dia a dia. Fique atento aos sinais.
                            </p>

                            <div className="bg-background-secondary rounded-xl p-6 border border-card-border mb-6">
                                <h3 className="font-semibold text-foreground mb-4">🔍 Sinais de dor em empresas:</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {[
                                        'Processos manuais e repetitivos',
                                        'Excesso de planilhas para controle',
                                        'Sistemas lentos ou ultrapassados',
                                        'Falta de visibilidade da operação',
                                        'Donos sobrecarregados com tarefas operacionais',
                                        'Informações espalhadas em vários lugares',
                                        'Erros frequentes por falta de automação',
                                        'Dificuldade em escalar o negócio'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                                            <p className="text-sm text-foreground-secondary">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 rounded-xl p-5 border border-emerald-500/20 mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <CheckCircle2 size={20} className="text-emerald-400" />
                                    <h3 className="font-semibold text-foreground">Checklist de Qualificação</h3>
                                </div>
                                <p className="text-sm text-foreground-secondary">
                                    Se a empresa apresenta <strong className="text-white">2 ou mais</strong> desses pontos, é uma oportunidade qualificada para indicação.
                                </p>
                            </div>

                            {/* Box de alerta sobre qualidade do lead */}
                            <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 rounded-xl p-6 border border-yellow-500/20">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center flex-shrink-0">
                                        <Target size={20} className="text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-yellow-400 mb-2">⚡ Dica de Ouro: Qualidade do Lead</h3>
                                        <p className="text-sm text-foreground-secondary mb-4">
                                            <strong className="text-white">Quanto melhor o cliente, melhor o contrato, melhor a sua comissão.</strong>
                                        </p>
                                        <p className="text-sm text-foreground-muted mb-3">
                                            É difícil cobrar um valor justo do "Seu Zé da Padaria" que fatura R$ 5k/mês. Busque empresas com estrutura, faturamento e capacidade de investimento real.
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                                            <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                                                <p className="text-xs font-semibold text-red-400 mb-1">❌ Evite:</p>
                                                <p className="text-xs text-foreground-muted">Microempresas sem faturamento, negócios informais, quem não tem verba para investir</p>
                                            </div>
                                            <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20">
                                                <p className="text-xs font-semibold text-emerald-400 mb-1">✅ Busque:</p>
                                                <p className="text-xs text-foreground-muted">PMEs estruturadas, empresas em crescimento, operações com gargalos reais</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* =========== SEÇÃO 4: PROCESSO =========== */}
                        <section id="processo" className="mb-16 scroll-mt-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                    <Map size={20} className="text-cyan-400" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Como Funciona o Processo</h2>
                            </div>

                            <p className="text-foreground-secondary mb-8">
                                Você indica, nós cuidamos do resto. Seu papel termina no momento em que o lead agenda a conversa.
                            </p>

                            {/* Timeline - Desktop: 7 em uma linha */}
                            <div className="hidden lg:block">
                                <div className="flex items-start justify-between w-full">
                                    {[
                                        { step: 1, title: 'Identifica a dor', desc: 'Percebe o problema' },
                                        { step: 2, title: 'Apresenta Asevedo', desc: 'Indica a empresa' },
                                        { step: 3, title: 'Lead acessa link', desc: 'Usa seu link' },
                                        { step: 4, title: 'Preenche formulário', desc: 'Descreve a dor' },
                                        { step: 5, title: 'Agenda a call', desc: 'Escolhe horário' },
                                        { step: 6, title: 'Call técnica', desc: 'Head de Engenharia' },
                                        { step: 7, title: 'Proposta', desc: 'Escopo e valor' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start flex-1">
                                            <div className="flex flex-col items-center w-full">
                                                <div className="flex items-center w-full">
                                                    <div className="flex-1 h-0.5 bg-violet-500/30" style={{ visibility: i === 0 ? 'hidden' : 'visible' }} />
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-violet-500/30 flex-shrink-0">
                                                        {item.step}
                                                    </div>
                                                    <div className="flex-1 h-0.5 bg-violet-500/30" style={{ visibility: i === 6 ? 'hidden' : 'visible' }} />
                                                </div>
                                                <div className="mt-3 text-center px-1">
                                                    <h3 className="font-semibold text-foreground text-sm leading-tight">{item.title}</h3>
                                                    <p className="text-xs text-foreground-muted mt-1">{item.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Timeline - Mobile/Tablet: 2 linhas */}
                            <div className="lg:hidden space-y-6">
                                {/* Primeira linha: Steps 1-4 */}
                                <div className="flex items-start justify-between">
                                    {[
                                        { step: 1, title: 'Identifica a dor', desc: 'Percebe o problema' },
                                        { step: 2, title: 'Apresenta', desc: 'Indica a empresa' },
                                        { step: 3, title: 'Acessa link', desc: 'Usa seu link' },
                                        { step: 4, title: 'Formulário', desc: 'Descreve a dor' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start flex-1">
                                            <div className="flex flex-col items-center w-full">
                                                <div className="flex items-center w-full">
                                                    <div className="flex-1 h-0.5 bg-violet-500/30" style={{ visibility: i === 0 ? 'hidden' : 'visible' }} />
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg shadow-violet-500/30 flex-shrink-0">
                                                        {item.step}
                                                    </div>
                                                    <div className="flex-1 h-0.5 bg-violet-500/30" style={{ visibility: i === 3 ? 'hidden' : 'visible' }} />
                                                </div>
                                                <div className="mt-2 text-center px-1">
                                                    <h3 className="font-semibold text-foreground text-[10px] sm:text-xs leading-tight">{item.title}</h3>
                                                    <p className="text-[9px] sm:text-[10px] text-foreground-muted mt-0.5 hidden sm:block">{item.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Seta para baixo */}
                                <div className="flex justify-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-0.5 h-4 bg-gradient-to-b from-violet-500/50 to-violet-500" />
                                        <ArrowDown size={20} className="text-violet-400 -mt-1" />
                                    </div>
                                </div>

                                {/* Segunda linha: Steps 5-7 */}
                                <div className="flex items-start justify-center gap-4 sm:gap-8">
                                    {[
                                        { step: 5, title: 'Agenda call', desc: 'Escolhe horário' },
                                        { step: 6, title: 'Call técnica', desc: 'Head de Engenharia' },
                                        { step: 7, title: 'Proposta', desc: 'Escopo e valor' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start">
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center">
                                                    {i > 0 && <div className="w-4 sm:w-8 h-0.5 bg-violet-500/30 -mr-1" />}
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg shadow-violet-500/30 flex-shrink-0">
                                                        {item.step}
                                                    </div>
                                                    {i < 2 && <div className="w-4 sm:w-8 h-0.5 bg-violet-500/30 -ml-1" />}
                                                </div>
                                                <div className="mt-2 text-center w-16 sm:w-20">
                                                    <h3 className="font-semibold text-foreground text-[10px] sm:text-xs leading-tight">{item.title}</h3>
                                                    <p className="text-[9px] sm:text-[10px] text-foreground-muted mt-0.5 hidden sm:block">{item.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Destaque do Head de Engenharia */}
                            <div className="mt-6 bg-gradient-to-br from-violet-500/15 to-purple-500/10 rounded-xl p-6 border border-violet-500/30">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-violet-500/30 flex items-center justify-center flex-shrink-0">
                                        <Handshake size={24} className="text-violet-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-2">🎯 O próximo passo: Call com o Head de Engenharia</h3>
                                        <p className="text-sm text-foreground-secondary mb-3">
                                            O diagnóstico é feito diretamente com a <strong className="text-white">liderança técnica</strong> da empresa. 
                                            Isso garante autoridade, precisão técnica e uma proposta realmente alinhada com as necessidades do cliente.
                                        </p>
                                        <p className="text-xs text-foreground-muted">
                                            → Seu trabalho já foi feito. A partir daqui, a equipe da Asevedo conduz todo o processo comercial e técnico.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* =========== SEÇÃO 5: BOAS PRÁTICAS =========== */}
                        <section id="boas-praticas" className="mb-16 scroll-mt-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                    <Target size={20} className="text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Boas Práticas de Abordagem</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* O que fazer */}
                                <div className="bg-background-secondary rounded-xl p-6 border border-emerald-500/20 min-h-[320px] flex flex-col">
                                    <div className="flex items-center gap-2 mb-4">
                                        <Check size={20} className="text-emerald-400" />
                                        <h3 className="font-semibold text-emerald-400">O que fazer</h3>
                                    </div>
                                    <ul className="space-y-3 flex-1">
                                        {[
                                            'Ouvir mais do que falar',
                                            'Fazer perguntas simples sobre o dia a dia',
                                            'Focar no problema, não na solução',
                                            'Deixar o lead descrever a própria dor',
                                            'Direcionar para o site com seu link',
                                            'Ser genuíno e empático'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                                                <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* O que evitar */}
                                <div className="bg-background-secondary rounded-xl p-6 border border-red-500/20 min-h-[320px] flex flex-col">
                                    <div className="flex items-center gap-2 mb-4">
                                        <X size={20} className="text-red-400" />
                                        <h3 className="font-semibold text-red-400">O que evitar</h3>
                                    </div>
                                    <ul className="space-y-3 flex-1">
                                        {[
                                            'Prometer preço ou prazo',
                                            'Explicar tecnologias ou linguagens',
                                            'Tentar fechar contrato você mesmo',
                                            'Coletar informações técnicas profundas',
                                            'Falar mal de concorrentes',
                                            'Pressionar para decisão imediata'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                                                <X size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* =========== SEÇÃO 6: ESTRATÉGIAS =========== */}
                        <section id="estrategias" className="mb-16 scroll-mt-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                                    <Rocket size={20} className="text-purple-400" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Estratégias de Prospecção</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Prospecção Pessoal */}
                                <div className="bg-background-secondary rounded-xl p-6 border border-card-border min-h-[200px]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                            <Users size={20} className="text-blue-400" />
                                        </div>
                                        <h3 className="font-semibold text-foreground">Prospecção Pessoal</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Conversas naturais', 'Networking', 'Contatos próximos', 'Indicação orgânica'].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-foreground-secondary">
                                                <div className="w-2 h-2 rounded-full bg-blue-400" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Rede de Contatos */}
                                <div className="bg-background-secondary rounded-xl p-6 border border-card-border min-h-[200px]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                            <Share2 size={20} className="text-emerald-400" />
                                        </div>
                                        <h3 className="font-semibold text-foreground">Rede de Contatos</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Profissionais de outras áreas', 'Empresários conhecidos', 'Parceiros estratégicos', 'Grupos de negócios'].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-foreground-secondary">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Conteúdo Dark */}
                                <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/5 rounded-xl p-6 border border-purple-500/20 min-h-[200px]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                                            <Video size={20} className="text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">Conteúdo Dark</h3>
                                            <span className="text-xs text-purple-400 font-medium">Estratégia mais escalável</span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-foreground-secondary mb-4">
                                        Crie vídeos curtos sem mostrar o rosto, focando em provocar a dor do empresário.
                                    </p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { icon: Eye, text: 'Fundo escuro + texto' },
                                            { icon: Mic, text: 'Narração simples' },
                                            { icon: Target, text: 'Foco na dor' },
                                            { icon: ExternalLink, text: 'CTA para seu link' }
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-foreground-secondary">
                                                <item.icon size={14} className="text-purple-400" />
                                                {item.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Prospecção Local */}
                                <div className="bg-background-secondary rounded-xl p-6 border border-card-border min-h-[200px]">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                                            <Phone size={20} className="text-orange-400" />
                                        </div>
                                        <h3 className="font-semibold text-foreground">Prospecção Local</h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Ligações para estabelecimentos', 'Visitas presenciais', 'Empresas tradicionais', 'Comércios locais'].map((item, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-foreground-secondary">
                                                <div className="w-2 h-2 rounded-full bg-orange-400" />
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
                                <p className="text-sm text-foreground">
                                    🎯 <strong>O objetivo não é vender, é despertar interesse pelo diagnóstico.</strong>
                                </p>
                            </div>
                        </section>

                        {/* =========== SEÇÃO 7: MATERIAIS =========== */}
                        <section id="materiais" className="mb-16 scroll-mt-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                                    <Download size={20} className="text-cyan-400" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Materiais para Parceiros</h2>
                            </div>

                            <p className="text-foreground-secondary mb-6">
                                A Asevedo Company disponibiliza materiais oficiais para facilitar sua prospecção.
                            </p>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {[
                                    { icon: Video, title: 'Pack de Criativos', desc: 'Reels, Shorts e TikToks prontos' },
                                    { icon: FileText, title: 'Templates Visuais', desc: 'Artes dark para redes sociais' },
                                    { icon: Briefcase, title: 'Material Institucional', desc: 'Apresentações e documentos' },
                                    { icon: Lightbulb, title: 'Conteúdos Explicativos', desc: 'Guias e tutoriais em vídeo' },
                                ].map((item, i) => (
                                    <div key={i} className="bg-background-secondary rounded-xl p-5 border border-card-border hover:border-cyan-500/30 transition-colors aspect-square flex flex-col items-center justify-center text-center">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-4">
                                            <item.icon size={24} className="text-cyan-400" />
                                        </div>
                                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                                        <p className="text-xs text-foreground-muted">{item.desc}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20 mb-6">
                                <p className="text-sm text-foreground">
                                    📦 Os materiais serão disponibilizados e atualizados regularmente pela empresa.
                                </p>
                            </div>

                            <button
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-medium transition-colors cursor-pointer"
                            >
                                <Download size={20} />
                                Acessar Materiais Disponíveis
                            </button>
                        </section>

                        {/* =========== SEÇÃO 8: PRÓXIMO PASSO =========== */}
                        <section id="proximo-passo" className="mb-16 scroll-mt-24">
                            <div className="bg-gradient-to-br from-violet-500/20 via-purple-500/10 to-violet-500/20 rounded-2xl p-8 border border-violet-500/20">
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                                        <Sparkles size={32} className="text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-foreground mb-2">Pronto para Começar</h2>
                                    <p className="text-foreground-muted max-w-lg mx-auto">
                                        Você agora conhece o papel estratégico do parceiro, a simplicidade do processo e o foco em diagnóstico e solução.
                                    </p>
                                </div>

                                {/* Resumo das dicas de ouro */}
                                <div className="bg-background-secondary/50 rounded-xl p-6 border border-card-border mb-8">
                                    <h3 className="font-semibold text-white mb-4 text-center">🏆 Resumo para Sucesso</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-2xl mb-1">🎯</p>
                                            <p className="text-sm text-foreground-secondary"><strong className="text-white">Busque clientes qualificados</strong><br/>Empresas com estrutura e capacidade de investimento</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl mb-1">🤝</p>
                                            <p className="text-sm text-foreground-secondary"><strong className="text-white">Seja profissional</strong><br/>Deixe o diagnóstico com o Head de Engenharia</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl mb-1">💰</p>
                                            <p className="text-sm text-foreground-secondary"><strong className="text-white">Qualidade = Comissão</strong><br/>Melhor cliente = Melhor contrato = Melhor ganho</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                                    <button
                                        onClick={handleCopyLink}
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-medium transition-colors cursor-pointer"
                                    >
                                        <Copy size={18} />
                                        {linkCopied ? 'Link Copiado!' : 'Copiar Link de Indicação'}
                                    </button>

                                    <Link
                                        href={`/${locale}/plataforma-parceiro/indicacoes`}
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-medium transition-colors"
                                    >
                                        <Users size={18} />
                                        Ver Minhas Indicações
                                    </Link>

                                    <button
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 font-medium transition-colors cursor-pointer"
                                    >
                                        <Download size={18} />
                                        Acessar Materiais
                                    </button>
                                </div>

                                <div className="text-center">
                                    <p className="text-sm text-foreground-muted">
                                        💡 Quanto melhor a dor descrita pelo lead, melhor será a solução proposta — e maior será o seu retorno.
                                    </p>
                                </div>
                            </div>
                        </section>
                </main>
            </div>
        </div>
    );
}
