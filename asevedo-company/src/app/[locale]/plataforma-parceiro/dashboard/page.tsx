'use client';

/**
 * Partner Platform - Dashboard
 * Complete dashboard following PRD:
 * - Saldo & Ganhos (principal)
 * - Link de indicação
 * - Progresso de bônus
 * - Lista de indicações
 * - Header fixo com navegação
 */

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowUpRight,
  Bell,
  BookOpen,
  Check,
  ChevronRight,
  Clock,
  Copy,
  DollarSign,
  ExternalLink,
  Gift,
  HelpCircle,
  History,
  Home,
  Link as LinkIcon,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  Settings,
  Share2,
  TrendingUp,
  User,
  Users,
  Wallet,
  X
} from 'lucide-react';

// Mock data - will be replaced with Supabase
const mockPartner = {
  name: 'João Silva',
  status: 'Ativo',
  referralCode: 'joao-silva-2024',
  referralLink: 'https://asevedocompany.com/r/joao-silva-2024',
};

const mockFinancials = {
  totalGenerated: 18500.00,
  available: 3200.00,
  pending: 15300.00,
};

const mockProgress = {
  closedDeals: 3,
  targetDeals: 5,
  bonusUnlocked: false,
};

const mockStats = {
  activeLeads: 4,
  closedDeals: 6,
  conversionRate: 50,
};

const mockReferrals = [
  { 
    id: 1, 
    company: 'Tech Solutions Ltda', 
    date: '2024-01-08', 
    status: 'proposal_sent',
    contractValue: 25000,
    commission: 2500,
    lastUpdate: '2 dias atrás',
    note: 'Aguardando resposta do cliente'
  },
  { 
    id: 2, 
    company: 'Comércio Digital SA', 
    date: '2024-01-05', 
    status: 'closed',
    contractValue: 28000,
    commission: 2800,
    lastUpdate: '5 dias atrás',
    note: null
  },
  { 
    id: 3, 
    company: 'StartupXYZ', 
    date: '2024-01-03', 
    status: 'diagnosis',
    contractValue: null,
    commission: null,
    lastUpdate: '1 dia atrás',
    note: 'Em análise técnica'
  },
  { 
    id: 4, 
    company: 'Indústria ABC', 
    date: '2024-01-01', 
    status: 'received',
    contractValue: null,
    commission: null,
    lastUpdate: 'Agora',
    note: null
  },
  { 
    id: 5, 
    company: 'Clínica Saúde+', 
    date: '2023-12-28', 
    status: 'commission_available',
    contractValue: 35000,
    commission: 3500,
    lastUpdate: '10 dias atrás',
    note: 'Comissão disponível para saque'
  },
  { 
    id: 6, 
    company: 'Restaurante Sabor', 
    date: '2023-12-20', 
    status: 'lost',
    contractValue: null,
    commission: null,
    lastUpdate: '18 dias atrás',
    note: 'Cliente optou por outra solução'
  },
];

const mockNotifications = [
  { id: 1, message: 'Sua indicação "Tech Solutions" avançou para proposta enviada', time: '2h atrás', unread: true },
  { id: 2, message: 'Comissão de R$ 3.500 disponível para saque!', time: '1 dia atrás', unread: true },
  { id: 3, message: 'Falta apenas 2 contratos para desbloquear o bônus!', time: '3 dias atrás', unread: false },
];

// Status configuration with colors and labels
const statusConfig: Record<string, { bg: string; text: string; label: string; icon: string }> = {
  received: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', label: 'Recebido', icon: '🟡' },
  diagnosis: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Em diagnóstico', icon: '🔵' },
  proposal_sent: { bg: 'bg-purple-500/20', text: 'text-purple-400', label: 'Proposta enviada', icon: '🟣' },
  closed: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', label: 'Contrato fechado', icon: '🟢' },
  commission_available: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Comissão disponível', icon: '💰' },
  lost: { bg: 'bg-red-500/20', text: 'text-red-400', label: 'Não avançou', icon: '❌' },
};

export default function PartnerDashboardPage() {
  const t = useTranslations('PartnerPlatform');
  const locale = useLocale();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mockPartner.referralLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Conheça a Asevedo Company! Acesse: ${mockPartner.referralLink}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const navigation = [
    { name: 'Dashboard', href: `/${locale}/plataforma-parceiro/dashboard`, icon: Home, current: true },
    { name: 'Indicações', href: `/${locale}/plataforma-parceiro/indicacoes`, icon: Users, current: false },
    { name: 'Comissões', href: `/${locale}/plataforma-parceiro/comissoes`, icon: Wallet, current: false },
    { name: 'Comece Aqui', href: `/${locale}/plataforma-parceiro/comece-aqui`, icon: BookOpen, current: false },
    { name: 'Perfil', href: `/${locale}/plataforma-parceiro/perfil`, icon: User, current: false },
  ];

  const progressPercentage = (mockProgress.closedDeals / mockProgress.targetDeals) * 100;

  return (
    <div className="min-h-screen bg-background flex">
      {/* =========== SIDEBAR - Desktop =========== */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-background-secondary border-r border-card-border">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-card-border">
          <Image src="/AS.png" alt="Logo" width={40} height={40} />
          <div>
            <p className="text-sm font-semibold text-foreground">Portal do Parceiro</p>
            <p className="text-xs text-foreground-muted">Asevedo Company</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                item.current
                  ? 'bg-violet-500/10 text-violet-400'
                  : 'text-foreground-secondary hover:bg-background-tertiary hover:text-foreground'
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="px-4 py-4 border-t border-card-border space-y-1">
          <Link
            href={`/${locale}/plataforma-parceiro/perfil`}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground-secondary hover:bg-background-tertiary hover:text-foreground transition-colors"
          >
            <Settings size={20} />
            Configurações
          </Link>
          <button
            onClick={() => {/* TODO: Implement logout */}}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex flex-col w-72 bg-background-secondary">
            <div className="flex items-center justify-between px-6 py-5 border-b border-card-border">
              <div className="flex items-center gap-3">
                <Image src="/AS.png" alt="Logo" width={32} height={32} />
                <span className="text-sm font-semibold text-foreground">Portal do Parceiro</span>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <X size={24} className="text-foreground-muted" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.current
                      ? 'bg-violet-500/10 text-violet-400'
                      : 'text-foreground-secondary hover:bg-background-tertiary hover:text-foreground'
                  }`}
                >
                  <item.icon size={20} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* =========== MAIN CONTENT =========== */}
      <div className="flex-1 lg:pl-64">
        {/* =========== HEADER FIXO =========== */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-4 lg:px-8 py-4 bg-background/80 backdrop-blur-sm border-b border-card-border">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-background-secondary transition-colors"
            >
              <Menu size={24} className="text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
              <div className="flex items-center gap-2">
                <p className="text-sm text-foreground-muted">Olá, {mockPartner.name}</p>
                <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-500/20 text-emerald-400">
                  {mockPartner.status}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Quick Link Copy */}
            <button
              onClick={handleCopyLink}
              className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 text-sm font-medium transition-colors"
            >
              <LinkIcon size={16} />
              {linkCopied ? 'Copiado!' : 'Meu link'}
            </button>

            {/* New Referral */}
            <Link
              href={`/${locale}/plataforma-parceiro/indicacoes/nova`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              <span className="hidden sm:inline">Indicar projeto</span>
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-lg hover:bg-background-secondary transition-colors"
              >
                <Bell size={22} className="text-foreground-secondary" />
                {mockNotifications.some(n => n.unread) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-violet-500 rounded-full border-2 border-background" />
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-background-secondary rounded-xl border border-card-border shadow-xl z-50">
                    <div className="px-4 py-3 border-b border-card-border">
                      <p className="font-semibold text-foreground">Notificações</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {mockNotifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`px-4 py-3 border-b border-card-border last:border-0 hover:bg-background-tertiary transition-colors cursor-pointer ${
                            notification.unread ? 'bg-violet-500/5' : ''
                          }`}
                        >
                          <p className="text-sm text-foreground">{notification.message}</p>
                          <p className="text-xs text-foreground-muted mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Help */}
            <Link 
              href={`/${locale}/plataforma-parceiro/comece-aqui`}
              className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
            >
              <HelpCircle size={22} className="text-foreground-secondary" />
            </Link>
          </div>
        </header>

        {/* =========== DASHBOARD CONTENT =========== */}
        <main className="p-4 lg:p-8">
          {/* =========== CARDS PRINCIPAIS =========== */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            
            {/* 🟦 CARD GRANDE - Saldo & Ganhos (principal) */}
            <div className="lg:col-span-2 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-violet-500/10 rounded-2xl p-6 lg:p-8 border border-violet-500/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <DollarSign size={24} className="text-violet-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Seus Ganhos</h2>
                  <p className="text-sm text-foreground-muted">Comissões por indicações</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-foreground-muted mb-1">Total gerado</p>
                  <p className="text-3xl font-bold text-foreground">
                    R$ {mockFinancials.totalGenerated.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="sm:border-l sm:border-card-border sm:pl-6">
                  <p className="text-sm text-foreground-muted mb-1">Disponível para saque</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    R$ {mockFinancials.available.toLocaleString('pt-BR')}
                  </p>
                </div>
                <div className="sm:border-l sm:border-card-border sm:pl-6">
                  <p className="text-sm text-foreground-muted mb-1">Em análise</p>
                  <p className="text-3xl font-bold text-yellow-400">
                    R$ {mockFinancials.pending.toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  href={`/${locale}/plataforma-parceiro/comissoes`}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 text-sm font-medium transition-colors"
                >
                  <History size={16} />
                  Ver histórico
                </Link>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-medium transition-colors">
                  <Wallet size={16} />
                  Solicitar saque
                </button>
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
                  <span className="text-foreground-muted">{mockProgress.closedDeals} de {mockProgress.targetDeals} contratos</span>
                  <span className="text-violet-400 font-medium">{progressPercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full h-3 bg-background-tertiary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercentage}%` }}
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
                  {mockProgress.bonusUnlocked 
                    ? '🎉 Bônus desbloqueado!' 
                    : `🔓 Faltam ${mockProgress.targetDeals - mockProgress.closedDeals} para desbloquear o bônus`
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
                  {mockPartner.referralLink}
                </code>
                <button
                  onClick={handleCopyLink}
                  className={`p-2 rounded-lg transition-colors ${
                    linkCopied 
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
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 text-sm font-medium transition-colors"
                >
                  <Copy size={16} />
                  {linkCopied ? 'Copiado!' : 'Copiar link'}
                </button>
                <button
                  onClick={handleShareWhatsApp}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-sm font-medium transition-colors"
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </button>
              </div>

              <p className="text-xs text-foreground-muted mt-4">
                Use este link para indicar projetos e acompanhar tudo por aqui.
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
                  <p className="text-2xl font-bold text-foreground">{mockStats.activeLeads}</p>
                  <p className="text-xs text-foreground-muted">Em andamento</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                    <Check size={20} className="text-emerald-400" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{mockStats.closedDeals}</p>
                  <p className="text-xs text-foreground-muted">Fechados</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center mx-auto mb-2">
                    <TrendingUp size={20} className="text-violet-400" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{mockStats.conversionRate}%</p>
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
              <table className="w-full">
                <thead className="bg-background-tertiary">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Empresa</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Comissão</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-foreground-muted uppercase tracking-wider">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-card-border">
                  {mockReferrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-background-tertiary/50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-foreground">{referral.company}</p>
                          {referral.note && (
                            <p className="text-xs text-foreground-muted mt-0.5">{referral.note}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-foreground">{new Date(referral.date).toLocaleDateString('pt-BR')}</p>
                        <p className="text-xs text-foreground-muted">{referral.lastUpdate}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[referral.status].bg} ${statusConfig[referral.status].text}`}>
                          <span>{statusConfig[referral.status].icon}</span>
                          {statusConfig[referral.status].label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {referral.contractValue 
                          ? `R$ ${referral.contractValue.toLocaleString('pt-BR')}`
                          : <span className="text-foreground-muted">—</span>
                        }
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-emerald-400">
                        {referral.commission 
                          ? `R$ ${referral.commission.toLocaleString('pt-BR')}`
                          : <span className="text-foreground-muted">—</span>
                        }
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-foreground-muted hover:text-foreground transition-colors">
                          <ExternalLink size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
