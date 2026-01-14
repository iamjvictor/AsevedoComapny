'use client';

/**
 * Partner Platform - Comissões
 * Lista de comissões do parceiro baseadas nos contratos indicados
 */

import { useState, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers';
import { supabase } from '@/components/clients/Supabase';
import PartnerSidebar from '@/components/partner-platform/PartnerSidebar';
import {
    DollarSign,
    HelpCircle,
    Loader2,
    Menu,
    Wallet,
    Banknote,
    Clock
} from 'lucide-react';

// Interface para contrato com dados do lead
interface ContractWithLead {
    id: string;
    contract_number: string;
    title: string;
    total_value: number;
    commission_percentage: number;
    amount_paid: number;
    status: string;
    signed_at: string;
    lead: {
        id: string;
        name: string;
        email: string;
    } | null;
}

export default function ComissoesPage() {
    const t = useTranslations('PartnerPlatform');
    const locale = useLocale();
    const router = useRouter();
    const { profile, isLoading: authLoading, isAuthenticated } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [contracts, setContracts] = useState<ContractWithLead[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [withdrawing, setWithdrawing] = useState<string | null>(null);

    // Busca contratos do parceiro
    useEffect(() => {
        let isMounted = true;

        const fetchContracts = async () => {
            if (!profile?.id) return;

            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('contracts')
                    .select(`
                        id,
                        contract_number,
                        title,
                        total_value,
                        commission_percentage,
                        amount_paid,
                        status,
                        signed_at,
                        lead:client_id (
                            id,
                            name,
                            email
                        )
                    `)
                    .eq('partner_id', profile.id)
                    .order('signed_at', { ascending: false });

                if (error) {
                    console.error('Erro ao buscar contratos:', error);
                } else if (isMounted) {
                    setContracts(data as ContractWithLead[] || []);
                }
            } catch (err) {
                console.error('Erro ao buscar contratos:', err);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        if (profile?.id) {
            fetchContracts();
        } else {
            setIsLoading(false);
        }

        return () => {
            isMounted = false;
        };
    }, [profile?.id]);

    // Calcula totais
    const totals = useMemo(() => {
        let totalCommission = 0;
        let availableCommission = 0;
        let pendingCommission = 0;

        contracts.forEach(contract => {
            const commission = (contract.total_value * (contract.commission_percentage || 10)) / 100;
            const available = (contract.amount_paid * (contract.commission_percentage || 10)) / 100;
            const pending = commission - available;

            totalCommission += commission;
            availableCommission += available;
            pendingCommission += pending;
        });

        return { totalCommission, availableCommission, pendingCommission };
    }, [contracts]);

    // Redirect se não autenticado
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push(`/${locale}/login?redirect=plataforma-parceiro/comissoes`);
        }
    }, [authLoading, isAuthenticated, router, locale]);

    const handleWithdraw = async (contractId: string) => {
        setWithdrawing(contractId);
        // Simula envio de solicitação
        setTimeout(() => {
            alert('Solicitação de saque enviada! Aguarde a aprovação.');
            setWithdrawing(null);
        }, 1500);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
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
                currentPage="comissoes"
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
                    <p className="text-sm font-medium text-foreground">Comissões</p>
                    <div className="w-10" />
                </div>

                {/* Content */}
                <main className="p-4 lg:p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-foreground">Comissões</h1>
                        <p className="text-foreground-muted">Acompanhe suas comissões por indicação</p>
                    </div>

                    {/* Cards de resumo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {/* Total a receber */}
                        <div className="bg-background-secondary rounded-xl p-5 border border-card-border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                    <DollarSign size={20} className="text-violet-400" />
                                </div>
                                <p className="text-sm text-foreground-muted">Total em Comissões</p>
                            </div>
                            <p className="text-2xl font-bold text-white">{formatCurrency(totals.totalCommission)}</p>
                        </div>

                        {/* Disponível */}
                        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-xl p-5 border border-emerald-500/20">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                    <Banknote size={20} className="text-emerald-400" />
                                </div>
                                <div className="flex items-center gap-1">
                                    <p className="text-sm text-emerald-400">Disponível para Saque</p>
                                    <div className="relative group">
                                        <HelpCircle size={14} className="text-emerald-400/60 cursor-help" />
                                        <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-zinc-900 rounded-lg border border-zinc-700 shadow-xl text-xs text-white w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                            O valor disponível corresponde à sua comissão sobre o que o cliente já pagou. Como os contratos podem ser parcelados, a comissão vai sendo liberada conforme os pagamentos são realizados.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-emerald-400">{formatCurrency(totals.availableCommission)}</p>
                        </div>

                        {/* Pendente */}
                        <div className="bg-background-secondary rounded-xl p-5 border border-card-border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                                    <Clock size={20} className="text-yellow-400" />
                                </div>
                                <p className="text-sm text-foreground-muted">Pendente</p>
                            </div>
                            <p className="text-2xl font-bold text-yellow-400">{formatCurrency(totals.pendingCommission)}</p>
                            <p className="text-xs text-foreground-muted mt-1">Aguardando pagamento do cliente</p>
                        </div>
                    </div>

                    {/* Tabela de comissões */}
                    <div className="bg-background-secondary rounded-xl border border-card-border overflow-hidden">

                        <div className="overflow-x-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 size={32} className="animate-spin text-violet-500" />
                                </div>
                            ) : contracts.length === 0 ? (
                                <div className="text-center py-12">
                                    <Wallet size={48} className="mx-auto text-foreground-muted mb-4" />
                                    <p className="text-foreground-muted mb-2">Nenhuma comissão ainda</p>
                                    <p className="text-sm text-foreground-muted">
                                        Quando seus leads fecharem contratos, suas comissões aparecerão aqui.
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-background-tertiary">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                                                Lead / Contrato
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                                                Valor do Contrato
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                                                Comissão Total
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                                                Disponível
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                                                Ação
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-card-border">
                                        {contracts.map((contract) => {
                                            const totalCommission = (contract.total_value * (contract.commission_percentage || 10)) / 100;
                                            const availableCommission = (contract.amount_paid * (contract.commission_percentage || 10)) / 100;

                                            return (
                                                <tr key={contract.id} className="hover:bg-background-tertiary/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-medium text-white">{contract.lead?.name || 'Cliente'}</p>
                                                            <p className="text-xs text-foreground-muted">{contract.contract_number} - {contract.title}</p>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-white">{formatCurrency(contract.total_value)}</p>
                                                        <p className="text-xs text-foreground-muted">
                                                            Pago: {formatCurrency(contract.amount_paid)}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-white">{formatCurrency(totalCommission)}</p>
                                                        <p className="text-xs text-foreground-muted">{contract.commission_percentage || 10}%</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm font-medium text-emerald-400">{formatCurrency(availableCommission)}</p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {availableCommission > 0 ? (
                                                            <button
                                                                onClick={() => handleWithdraw(contract.id)}
                                                                disabled={withdrawing === contract.id}
                                                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                                                            >
                                                                {withdrawing === contract.id ? (
                                                                    <Loader2 size={14} className="animate-spin" />
                                                                ) : (
                                                                    <Banknote size={14} />
                                                                )}
                                                                Sacar
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-foreground-muted">Aguardando pagamento</span>
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

                    {/* Info */}
                    <div className="mt-6 p-4 bg-violet-500/10 rounded-lg border border-violet-500/20">
                        <p className="text-sm text-foreground-muted">
                            💡 <strong className="text-white">Como funciona:</strong> Você recebe comissão sobre cada contrato fechado através da sua indicação.
                            O valor disponível para saque aumenta conforme o cliente realiza os pagamentos.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}
