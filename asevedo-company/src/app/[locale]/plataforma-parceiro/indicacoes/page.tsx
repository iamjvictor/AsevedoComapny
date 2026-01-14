'use client';

/**
 * Partner Platform - Indicações
 * Lista completa de todas as indicações do parceiro
 */

import { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers';
import { supabase } from '@/components/clients/Supabase';
import PartnerSidebar from '@/components/partner-platform/PartnerSidebar';
import {
    Check,
    Clock,
    Loader2,
    Menu,
    MessageCircle,
    Search,
    TrendingUp,
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
    updated_at: string;
    contacted_at: string | null;
}

// Status configuration with colors and labels
const statusConfig: Record<string, { bg: string; text: string; label: string; icon: string }> = {
    novo: { bg: 'bg-yellow-500/20', text: 'text-white', label: 'Novo', icon: '🟡' },
    em_contato: { bg: 'bg-blue-500/20', text: 'text-white', label: 'Em Contato', icon: '🔵' },
    qualificado: { bg: 'bg-cyan-500/20', text: 'text-white', label: 'Qualificado', icon: '✅' },
    proposta_enviada: { bg: 'bg-purple-500/20', text: 'text-white', label: 'Proposta Enviada', icon: '📋' },
    negociacao: { bg: 'bg-indigo-500/20', text: 'text-white', label: 'Em Negociação', icon: '🤝' },
    fechado: { bg: 'bg-emerald-500/20', text: 'text-white', label: 'Fechado', icon: '🟢' },
    perdido: { bg: 'bg-red-500/20', text: 'text-white', label: 'Não Avançou', icon: '❌' },
};

export default function IndicacoesPage() {
    const t = useTranslations('PartnerPlatform');
    const locale = useLocale();
    const router = useRouter();
    const { profile, isLoading: authLoading, isAuthenticated } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    // Estados para dados reais
    const [leads, setLeads] = useState<Lead[]>([]);
    const [isLoadingLeads, setIsLoadingLeads] = useState(true);

    // Busca leads do parceiro
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

    // Filtra leads por busca e status
    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [leads, searchTerm, statusFilter]);

    // Estatísticas
    const stats = useMemo(() => {
        const total = leads.length;
        const fechados = leads.filter(l => l.status === 'fechado').length;
        const emAndamento = leads.filter(l => !['fechado', 'perdido'].includes(l.status || '')).length;
        return { total, fechados, emAndamento };
    }, [leads]);

    // Redirect se não autenticado
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push(`/${locale}/login?redirect=plataforma-parceiro/indicacoes`);
        }
    }, [authLoading, isAuthenticated, router, locale]);

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

    // Verifica se lead precisa de remarketing
    // Condições: tem contacted_at preenchido, não foi fechado, e último contato foi há mais de 2 semanas
    const needsRemarketing = (lead: Lead) => {
        // Status que indica que houve contato mas não fechou
        const statusComContato = ['em_contato', 'qualificado', 'proposta_enviada', 'negociacao'];
        if (!statusComContato.includes(lead.status)) return false;

        // Se não tem contacted_at, não mostra remarketing
        if (!lead.contacted_at) return false;

        // Usa contacted_at para verificar último contato
        const lastContact = new Date(lead.contacted_at);
        const now = new Date();
        const diffMs = now.getTime() - lastContact.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        return diffDays >= 30; // 1 mês sem contato
    };

    // Abre WhatsApp para remarketing
    const handleRemarketing = (lead: Lead) => {
        const phone = lead.phone.replace(/\D/g, ''); // Remove caracteres não numéricos
        const message = encodeURIComponent(
            `Olá ${lead.name}! Tudo bem? Sou da Asevedo Company, entramos em contato anteriormente sobre seu projeto. Gostaria de saber se ainda tem interesse em dar continuidade. 😊`
        );
        window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
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

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar Component */}
            <PartnerSidebar
                locale={locale}
                currentPage="indicacoes"
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
                    <p className="text-sm font-medium text-foreground">Indicações</p>
                    <div className="w-10" />
                </div>

                {/* Content */}
                <main className="p-4 lg:p-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Indicações</h1>
                            <p className="text-foreground-muted">Todas as suas indicações de projetos</p>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-4">
                            <div className="px-4 py-2 rounded-lg bg-background-secondary border border-card-border">
                                <p className="text-xs text-foreground-muted">Total</p>
                                <p className="text-xl font-bold text-foreground">{stats.total}</p>
                            </div>
                            <div className="px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                <p className="text-xs text-emerald-400">Fechados</p>
                                <p className="text-xl font-bold text-emerald-400">{stats.fechados}</p>
                            </div>
                            <div className="px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <p className="text-xs text-yellow-400">Em andamento</p>
                                <p className="text-xl font-bold text-yellow-400">{stats.emAndamento}</p>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-background-secondary border border-card-border rounded-lg text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-violet-500 transition-colors"
                            />
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2.5 bg-background-secondary border border-card-border rounded-lg text-foreground focus:outline-none focus:border-violet-500 transition-colors"
                        >
                            <option value="all">Todos os status</option>
                            <option value="novo">Novo</option>
                            <option value="em_contato">Em Contato</option>
                            <option value="qualificado">Qualificado</option>
                            <option value="proposta_enviada">Proposta Enviada</option>
                            <option value="negociacao">Em Negociação</option>
                            <option value="fechado">Fechado</option>
                            <option value="perdido">Não Avançou</option>
                        </select>
                    </div>

                    {/* Table */}
                    <div className="bg-background-secondary rounded-xl border border-card-border overflow-hidden">
                        <div className="overflow-x-auto">
                            {isLoadingLeads ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 size={32} className="animate-spin text-violet-500" />
                                </div>
                            ) : filteredLeads.length === 0 ? (
                                <div className="text-center py-12">
                                    <Users size={48} className="mx-auto text-foreground-muted mb-4" />
                                    <p className="text-foreground-muted mb-2">
                                        {searchTerm || statusFilter !== 'all'
                                            ? 'Nenhuma indicação encontrada com esses filtros'
                                            : 'Nenhuma indicação ainda'
                                        }
                                    </p>
                                    {!searchTerm && statusFilter === 'all' && (
                                        <p className="text-sm text-foreground-muted">
                                            Compartilhe seu link para começar a indicar projetos!
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-background-tertiary">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Lead</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Contato</th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-card-border">
                                        {filteredLeads.map((lead) => {
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
                                                    <td className="px-6 py-4">
                                                        {needsRemarketing(lead) && (
                                                            <button
                                                                onClick={() => handleRemarketing(lead)}
                                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 cursor-pointer text-white text-xs font-medium transition-colors"
                                                                title="Entrar em contato via WhatsApp"
                                                            >
                                                                <MessageCircle size={14} />
                                                                Remarketing
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Results count */}
                    {!isLoadingLeads && filteredLeads.length > 0 && (
                        <p className="text-sm text-foreground-muted mt-4">
                            Mostrando {filteredLeads.length} de {leads.length} indicações
                        </p>
                    )}
                </main>
            </div>
        </div>
    );
}
