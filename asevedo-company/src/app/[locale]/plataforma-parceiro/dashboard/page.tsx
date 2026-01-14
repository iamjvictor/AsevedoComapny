'use client';

/**
 * Partner Platform - Dashboard
 * Complete dashboard with real data from Supabase
 */

import { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers';
import { supabase } from '@/components/clients/Supabase';
import PartnerSidebar from '@/components/partner-platform/PartnerSidebar';
import {
  Bell,
  Check,
  ChevronRight,
  Clock,
  Copy,
  DollarSign,
  Gift,
  History,
  Link as LinkIcon,
  Loader2,
  Menu,
  MessageCircle,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';

// Interface para leads/indicações
interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  partner_code: string | null;
  status: string;
  created_at: string;
}

// Status configuration with colors and labels
const statusConfig: Record<string, { bg: string; text: string; label: string; icon: string }> = {
  novo: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Novo', icon: '🟡' },
  em_contato: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Em Contato', icon: '🔵' },
  qualificado: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', label: 'Qualificado', icon: '✅' },
  proposta_enviada: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Proposta Enviada', icon: '📄' },
  negociacao: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', label: 'Em Negociação', icon: '🤝' },
  fechado: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Fechado', icon: '🟢' },
  perdido: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Não Avançou', icon: '❌' },
};

export default function PartnerDashboardPage() {
  const t = useTranslations('PartnerPlatform');
  const locale = useLocale();
  const router = useRouter();
  const { profile, isLoading: authLoading, isAuthenticated } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  // Estados para dados reais
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  // Gera o link de indicação baseado no código do parceiro
  const referralLink = useMemo(() => {
    if (!profile?.code) return '';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://asevedocompany.com';
    return `${baseUrl}/${locale}?ref=${profile.code}`;
  }, [profile?.code, locale]);

  // Busca leads do parceiro (apenas uma vez)
  useEffect(() => {
    let isMounted = true;
    let hasFetched = false;

    const fetchLeads = async () => {
      if (!profile?.code || hasFetched) return;

      hasFetched = true;
      setIsLoadingLeads(true);

      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('partner_code', String(profile.code))
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erro ao buscar leads:', error);
        } else if (isMounted) {
          setLeads(data || []);
        }
      } catch (err) {
        console.error('Erro ao buscar leads:', err);
      } finally {
        if (isMounted) {
          setIsLoadingLeads(false);
        }
      }
    };

    if (profile?.code) {
      fetchLeads();
    } else {
      setIsLoadingLeads(false);
    }

    return () => {
      isMounted = false;
    };
  }, [profile?.code]);

  // Calcula estatísticas baseadas nos leads reais
  const stats = useMemo(() => {
    const total = leads.length;
    const fechados = leads.filter(l => l.status === 'fechado').length;
    const emAndamento = leads.filter(l => !['fechado', 'perdido'].includes(l.status || '')).length;
    const conversionRate = total > 0 ? Math.round((fechados / total) * 100) : 0;

    return {
      total,
      fechados,
      emAndamento,
      conversionRate,
    };
  }, [leads]);

  // Progresso de bônus (meta de 5 contratos)
  const bonusProgress = useMemo(() => {
    const closedDeals = stats.fechados;
    const targetDeals = 5;
    const percentage = Math.min((closedDeals / targetDeals) * 100, 100);
    const bonusUnlocked = closedDeals >= targetDeals;

    return { closedDeals, targetDeals, percentage, bonusUnlocked };
  }, [stats.fechados]);

  // Redirect se não autenticado
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/${locale}/login?redirect=plataforma-parceiro/dashboard`);
    }
  }, [authLoading, isAuthenticated, router, locale]);

  const handleCopyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    if (!referralLink) return;
    const text = encodeURIComponent(`Conheça a Asevedo Company! Acesse: ${referralLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // Formata data relativa
  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `${diffDays} dias atrás`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  // Loading state
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

  // Not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Component */}
      <PartnerSidebar
        locale={locale}
        currentPage="dashboard"
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        notificationsOpen={notificationsOpen}
        setNotificationsOpen={setNotificationsOpen}
      />

      {/* =========== MAIN CONTENT =========== */}
      <div className="flex-1 lg:pl-64">
        {/* Mobile Header (apenas botão do menu) */}
        <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-sm border-b border-card-border">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
          >
            <Menu size={24} className="text-foreground" />
          </button>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">{profile?.name || 'Parceiro'}</p>
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
            >
              <Bell size={20} className="text-foreground-secondary" />
            </button>
          </div>
        </div>

        {/* =========== DASHBOARD CONTENT =========== */}
        <main className="p-4 lg:p-6">
          {/* =========== CARDS PRINCIPAIS =========== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            {/* 🟦 CARD GRANDE - Saldo & Ganhos (principal) */}
            <div className="lg:col-span-2 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-violet-500/10 rounded-2xl p-6 lg:p-8 border border-violet-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <DollarSign size={24} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Suas Indicações</h2>
                  <p className="text-sm text-foreground-muted">Resumo das suas indicações</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-foreground-muted mb-1">Total de indicações</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.total}
                  </p>
                </div>
                <div className="sm:border-l sm:border-card-border sm:pl-6">
                  <p className="text-sm text-foreground-muted mb-1">Fechados</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {stats.fechados}
                  </p>
                </div>
                <div className="sm:border-l sm:border-card-border sm:pl-6">
                  <p className="text-sm text-foreground-muted mb-1">Em andamento</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    {stats.emAndamento}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  href={`/${locale}/plataforma-parceiro/indicacoes`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 text-sm font-medium transition-colors"
                >
                  <History size={16} />
                  Ver histórico
                </Link>
              </div>
            </div>

            {/* 🟪 CARD MÉDIO - Progresso de bônus */}
            <div className="bg-background-secondary rounded-2xl p-6 border border-card-border">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Gift size={20} className="text-purple-400" />
                </div>
                <h3 className="font-semibold text-foreground">Meta de Bônus</h3>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-foreground-muted">{bonusProgress.closedDeals} de {bonusProgress.targetDeals} contratos</span>
                  <span className="text-violet-400 font-medium">{bonusProgress.percentage.toFixed(0)}%</span>
                </div>
                <div className="w-full h-3 bg-background-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${bonusProgress.percentage}%` }}
                  />
                </div>
              </div>

              {/* Milestones */}
              <div className="flex justify-between text-xs text-foreground-muted mb-4">
                <span>1</span>
                <span>3</span>
                <span className="text-purple-400 font-medium">5 🎁</span>
              </div>

              <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <p className="text-sm text-foreground">
                  {bonusProgress.bonusUnlocked
                    ? '🎉 Bônus desbloqueado!'
                    : `🔓 Faltam ${bonusProgress.targetDeals - bonusProgress.closedDeals} para desbloquear o bônus`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Segunda linha de cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            {/* 🟩 CARD - Link de indicação */}
            <div className="bg-background-secondary rounded-xl p-6 border border-card-border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <LinkIcon size={20} className="text-emerald-400" />
                </div>
                <h3 className="font-semibold text-foreground">Seu link de parceiro</h3>
              </div>

              <div className="flex items-center gap-2 p-3 bg-background-tertiary rounded-lg mb-4">
                <code className="flex-1 text-sm text-foreground-muted truncate">
                  {referralLink || 'Carregando...'}
                </code>
                <button
                  onClick={handleCopyLink}
                  disabled={!referralLink}
                  className={`p-2 rounded-lg transition-colors ${linkCopied
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'hover:bg-background-secondary text-foreground-muted'
                    }`}
                >
                  {linkCopied ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopyLink}
                  disabled={!referralLink}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Copy size={16} />
                  {linkCopied ? 'Copiado!' : 'Copiar link'}
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  disabled={!referralLink}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </button>
              </div>

              <p className="text-xs text-foreground-muted mt-4">
                Use este link para indicar projetos. Seu código: <strong>{profile?.code || '---'}</strong>
              </p>
            </div>

            {/* 🟨 CARD - Indicações resumo */}
            <div className="bg-background-secondary rounded-xl p-6 border border-card-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-foreground">Resumo de Indicações</h3>
                <Link
                  href={`/${locale}/plataforma-parceiro/indicacoes`}
                  className="text-sm text-violet-400 hover:text-violet-300 font-medium"
                >
                  Ver todas
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center mx-auto mb-2">
                    <Clock size={20} className="text-yellow-400" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.emAndamento}</p>
                  <p className="text-xs text-foreground-muted">Em andamento</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                    <Check size={20} className="text-emerald-400" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.fechados}</p>
                  <p className="text-xs text-foreground-muted">Fechados</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mx-auto mb-2">
                    <TrendingUp size={20} className="text-violet-400" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stats.conversionRate}%</p>
                  <p className="text-xs text-foreground-muted">Conversão</p>
                </div>
              </div>
            </div>
          </div>

          {/* =========== LISTA DE INDICAÇÕES =========== */}
          <div className="bg-background-secondary rounded-xl border border-card-border overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-card-border">
              <h2 className="font-semibold text-foreground">Suas Indicações</h2>
              <div className="flex items-center gap-3">
                <Link
                  href={`/${locale}/plataforma-parceiro/indicacoes`}
                  className="text-sm text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1"
                >
                  Ver todas <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              {isLoadingLeads ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-violet-500" />
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-12">
                  <Users size={48} className="mx-auto text-foreground-muted mb-4" />
                  <p className="text-foreground-muted mb-2">Nenhuma indicação ainda</p>
                  <p className="text-sm text-foreground-muted">
                    Compartilhe seu link para começar a indicar projetos!
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-background-tertiary">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Lead</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Contato</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-card-border">
                    {leads.slice(0, 2).map((lead) => {
                      const status = statusConfig[lead.status || 'novo'] || statusConfig.novo;
                      return (
                        <tr key={lead.id} className="hover:bg-background-tertiary/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground">{lead.name}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-foreground">{new Date(lead.created_at).toLocaleDateString('pt-BR')}</p>
                            <p className="text-xs text-foreground-muted">{formatRelativeDate(lead.created_at)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                              <span>{status.icon}</span>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-foreground">{lead.email}</p>
                            <p className="text-xs text-foreground-muted">{lead.phone}</p>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
