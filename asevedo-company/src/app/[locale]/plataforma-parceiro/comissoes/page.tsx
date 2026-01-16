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
import { notifyPrizeUnlocked } from '@/services/emailService';
import {
    DollarSign,
    HelpCircle,
    Loader2,
    Menu,
    Wallet,
    Banknote,
    Clock,
    Zap,
    X,
    Trophy,
    Gift,
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
        created_at: string;
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
    const [showPromoModal, setShowPromoModal] = useState(false);
    const [prizeModalOpen, setPrizeModalOpen] = useState(false);
    const [isRedeeming, setIsRedeeming] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    // Update countdown every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

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
                            email,
                            created_at
                        )
                    `)
                    .eq('partner_id', profile.id)
                    .order('signed_at', { ascending: false });

                if (error) {
                    console.error('Erro ao buscar contratos:', error);
                } else if (isMounted) {
                    // Transform the data to match ContractWithLead interface
                    // Supabase returns relations as arrays, but we expect a single object or null
                    const transformedData: ContractWithLead[] = (data || []).map((contract: any) => ({
                        ...contract,
                        lead: Array.isArray(contract.lead) ? contract.lead[0] || null : contract.lead
                    }));
                    setContracts(transformedData);
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

    // Lógica do Desafio (Premiação de Entrada)
    const challenge = useMemo(() => {
        if (!profile?.created_at) return null;

        const registrationDate = new Date(profile.created_at);
        const challengeEndDate = new Date(registrationDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        const now = currentTime;
        
        const timeLeftMs = challengeEndDate.getTime() - now.getTime();
        const isActive = timeLeftMs > 0;

        // Filtra contratos cujos LEADS foram capturados nos primeiros 30 dias
        const challengeContracts = contracts.filter(contract => {
            if (!contract.lead?.created_at) return false;
            const leadCreatedAt = new Date(contract.lead.created_at);
            return leadCreatedAt.getTime() <= challengeEndDate.getTime();
        });

        const currentCommission = challengeContracts.reduce((sum, contract) => {
            const commission = (contract.total_value * (contract.commission_percentage || 10)) / 100;
            return sum + commission;
        }, 0);

        const target = 3000;
        const progress = Math.min((currentCommission / target) * 100, 100);
        const completed = currentCommission >= target;

        // Formata contagem regressiva
        let countdown = t('commissions.entryPrize.ended');
        if (isActive) {
            const days = Math.floor(timeLeftMs / (24 * 60 * 60 * 1000));
            const hours = Math.floor((timeLeftMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
            const minutes = Math.floor((timeLeftMs % (60 * 60 * 1000)) / (60 * 1000));
            const seconds = Math.floor((timeLeftMs % (60 * 1000)) / 1000);
            
            if (days > 0) countdown = `${days}d ${hours}h ${minutes}m`;
            else countdown = `${hours}h ${minutes}m ${seconds}s`;
        }

        return {
            currentCommission,
            target,
            progress,
            completed,
            countdown,
            isActive
        };
    }, [profile?.created_at, contracts, currentTime]);

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

    const handleRedeemPrize = async () => {
        if (!profile) return;
        
        setIsRedeeming(true);
        try {
            await notifyPrizeUnlocked({
                name: profile.name || 'Parceiro sem nome',
                phone: profile.phone || 'N/A',
                pix: profile.pix_key || 'Não cadastrado',
                code: String(profile.code || 'N/A'),
                type: 'Premiação de Entrada (R$ 3.000 em comissão)'
            });
            setPrizeModalOpen(true);
        } catch (error) {
            console.error('Erro ao resgatar prêmio:', error);
            alert('Ocorreu um erro ao processar seu resgate. Por favor, tente novamente.');
        } finally {
            setIsRedeeming(false);
        }
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
                    <p className="text-foreground-muted">{t('common.loading')}</p>
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
                    <p className="text-sm font-medium text-foreground">{t('commissions.title')}</p>
                    <div className="w-10" />
                </div>

                {/* Content */}
                <main className="p-4 lg:p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-foreground">{t('commissions.title')}</h1>
                        <p className="text-foreground-muted">{t('commissions.subtitle')}</p>
                    </div>

                    {/* Desafio Premiação de Entrada */}
                    {challenge && (challenge.isActive || challenge.completed) && (
                        <div className="mb-8 relative overflow-hidden bg-zinc-900/50 rounded-2xl border border-violet-500/30 p-6 shadow-[0_0_20px_rgba(139,92,246,0.15)]">
                            {/* Background Glow subtly */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/10 blur-[100px]" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-600/10 blur-[100px]" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 p-[1px]">
                                        <div className="w-full h-full rounded-xl bg-zinc-900 flex items-center justify-center">
                                            <Zap size={24} className="text-cyan-400 group-hover:scale-110 transition-transform shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-bold text-white tracking-tight uppercase">{t('commissions.entryPrize.title')}</h2>
                                            <button 
                                                onClick={() => setShowPromoModal(true)}
                                                className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[10px] text-zinc-400 hover:text-white hover:border-violet-500 transition-all cursor-pointer"
                                            >
                                                ?
                                            </button>
                                        </div>
                                        <p className="text-xs text-zinc-400 uppercase tracking-widest">{t('commissions.entryPrize.subtitle')}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end">
                                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">{t('commissions.entryPrize.timeRemaining')}</p>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700">
                                        <Clock size={14} className="text-cyan-400" />
                                        <span className="text-sm font-mono font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                                            {challenge.countdown}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Neon Progress Bar */}
                            <div className="relative mb-2">
                                <div className="flex justify-between text-xs mb-2">
                                    <span className="text-zinc-300 font-medium">{t('commissions.entryPrize.progress')}: <span className="text-cyan-400">{formatCurrency(challenge.currentCommission)}</span></span>
                                    <span className="text-zinc-300 font-medium">{t('commissions.entryPrize.goal')}: <span className="text-white">{formatCurrency(challenge.target)}</span></span>
                                </div>
                                <div className="h-4 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-700/50 p-[2px]">
                                    <div 
                                        className="h-full rounded-full bg-gradient-to-r from-violet-600 via-cyan-500 to-cyan-400 relative transition-all duration-1000 shadow-[0_0_15px_rgba(34,211,238,0.6)]"
                                        style={{ width: `${challenge.progress}%` }}
                                    >
                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full animate-[shimmer_2s_infinite]" style={{ backgroundSize: '200% 100%' }} />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center text-[10px] text-zinc-500 uppercase tracking-tighter">
                                <span>{t('commissions.entryPrize.startOfJourney')}</span>
                                <span>{t('commissions.entryPrize.bonusUnlocked')}</span>
                            </div>

                            {challenge.completed && (
                                <div className="mt-6 flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="p-3 w-full rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-bold">
                                        {t('commissions.entryPrize.congratulations')}
                                    </div>
                                    
                                    <button
                                        onClick={handleRedeemPrize}
                                        disabled={isRedeeming}
                                        className="w-full max-w-sm flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black text-sm uppercase tracking-widest shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {isRedeeming ? (
                                            <Loader2 size={18} className="animate-spin" />
                                        ) : (
                                            <>
                                                <Trophy size={20} className="animate-bounce" />
                                                {t('commissions.entryPrize.redeemPrize')}
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cards de resumo */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {/* Total a receber */}
                        <div className="bg-background-secondary rounded-xl p-5 border border-card-border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                    <DollarSign size={20} className="text-violet-400" />
                                </div>
                                <p className="text-sm text-foreground-muted">{t('commissions.totalCommissions')}</p>
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
                                    <p className="text-sm text-emerald-400">{t('commissions.availableForWithdraw')}</p>
                                    <div className="relative group">
                                        <HelpCircle size={14} className="text-emerald-400/60 cursor-help" />
                                        <div className="absolute left-0 bottom-full mb-2 px-3 py-2 bg-zinc-900 rounded-lg border border-zinc-700 shadow-xl text-xs text-white w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                            {t('commissions.availableTooltip')}
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
                                <p className="text-sm text-foreground-muted">{t('commissions.pending')}</p>
                            </div>
                            <p className="text-2xl font-bold text-yellow-400">{formatCurrency(totals.pendingCommission)}</p>
                            <p className="text-xs text-foreground-muted mt-1">{t('commissions.awaitingPayment')}</p>
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
                                    <p className="text-foreground-muted mb-2">{t('commissions.noCommissionsYet')}</p>
                                    <p className="text-sm text-foreground-muted">
                                        {t('commissions.noCommissionsMessage')}
                                    </p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-background-tertiary">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                                                {t('commissions.leadContract')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                                                {t('commissions.contractValue')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                                                {t('commissions.totalCommission')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                                                {t('commissions.available')}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                                                {t('commissions.action')}
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
                                                            {t('commissions.paid')}: {formatCurrency(contract.amount_paid)}
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
                                                                {t('commissions.withdraw')}
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-foreground-muted">{t('commissions.awaitingPaymentShort')}</span>
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
                            💡 <strong className="text-white">{t('commissions.howItWorks')}</strong> {t('commissions.howItWorksDescription')}
                        </p>
                    </div>
                </main>
            </div>

            {/* Modal de Explicação da Promoção */}
            {showPromoModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowPromoModal(false)}
                    />
                    <div className="relative w-full max-w-lg bg-zinc-900 border border-violet-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                        <Zap size={20} className="text-violet-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">{t('commissions.entryPrize.modalTitle')}</h3>
                                </div>
                                <button 
                                    onClick={() => setShowPromoModal(false)}
                                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4 text-zinc-300">
                                <p className="leading-relaxed">
                                    {t('commissions.entryPrize.modalDescription')}
                                </p>
                                
                                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                                    <div className="flex gap-3">
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">1</div>
                                        <p className="text-sm">{t('commissions.entryPrize.step1')}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">2</div>
                                        <p className="text-sm">{t('commissions.entryPrize.step2')}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="shrink-0 w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">3</div>
                                        <p className="text-sm">{t('commissions.entryPrize.step3')}</p>
                                    </div>
                                </div>

                                <p className="text-xs text-zinc-500 italic">
                                    {t('commissions.entryPrize.note')}
                                </p>
                            </div>

                            <button
                                onClick={() => setShowPromoModal(false)}
                                className="w-full mt-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-bold hover:opacity-90 transition-all uppercase tracking-widest text-sm"
                            >
                                {t('commissions.entryPrize.letsGo')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* =========== MODAL DE RESGATE DE PRÊMIO =========== */}
            {prizeModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setPrizeModalOpen(false)}
                    />
                    <div className="relative w-full max-w-md bg-zinc-900 border border-violet-500/30 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/20 pulse-animation">
                                <Trophy size={40} className="text-white" />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-2">{t('modals.prizeRedeemed.title')}</h3>
                            <p className="text-zinc-400 mb-6 leading-relaxed">
                                {t('modals.prizeRedeemed.message')}
                            </p>
                            
                            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4 mb-8">
                                <p className="text-cyan-400 font-medium text-sm">
                                    {t('modals.prizeRedeemed.note')}
                                </p>
                            </div>
                            
                            <button
                                onClick={() => setPrizeModalOpen(false)}
                                className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-zinc-200 transition-colors cursor-pointer"
                            >
                                {t('modals.prizeRedeemed.button')}
                            </button>
                        </div>
                        
                        <button 
                            onClick={() => setPrizeModalOpen(false)}
                            className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes pulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
                    70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(34, 211, 238, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(34, 211, 238, 0); }
                }
                .pulse-animation {
                    animation: pulse 2s infinite;
                }
                @keyframes shimmer {
                    0% { background-position: -200% 0; }
                    100% { background-position: 200% 0; }
                }
            `}</style>
        </div>
    );
}
