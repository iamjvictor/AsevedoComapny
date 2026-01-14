'use client';

/**
 * Partner Platform - Perfil
 * Página de perfil do parceiro com opções de edição
 */

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/providers';
import { supabase } from '@/components/clients/Supabase';
import PartnerSidebar from '@/components/partner-platform/PartnerSidebar';
import {
    Check,
    Copy,
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    Menu,
    Phone,
    Save,
    User,
    Building,
    CreditCard,
    AlertCircle
} from 'lucide-react';

export default function PerfilPage() {
    const t = useTranslations('PartnerPlatform');
    const locale = useLocale();
    const router = useRouter();
    const { user, profile, isLoading: authLoading, isAuthenticated, refreshProfile } = useAuth();

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        pix_key: '',
        bank_name: '',
        bank_agency: '',
        bank_account: '',
    });

    // Password form
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    // Preenche o form com dados do profile
    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                phone: profile.phone || '',
                pix_key: profile.pix_key || '',
                bank_name: profile.bank_name || '',
                bank_agency: profile.bank_agency || '',
                bank_account: profile.bank_account || '',
            });
        }
    }, [profile]);

    // Redirect se não autenticado
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push(`/${locale}/login?redirect=plataforma-parceiro/perfil`);
        }
    }, [authLoading, isAuthenticated, router, locale]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = async () => {
        if (!profile?.id) return;

        setIsSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    name: formData.name,
                    phone: formData.phone,
                    pix_key: formData.pix_key,
                    bank_name: formData.bank_name,
                    bank_agency: formData.bank_agency,
                    bank_account: formData.bank_account,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', profile.id);

            if (error) {
                throw error;
            }

            setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
            setIsEditing(false);

            // Atualiza o profile no contexto
            if (refreshProfile) {
                await refreshProfile();
            }
        } catch (error: any) {
            console.error('Erro ao salvar perfil:', error);
            setMessage({ type: 'error', text: error.message || 'Erro ao salvar perfil' });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'As senhas não coincidem' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres' });
            return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: passwordData.newPassword
            });

            if (error) {
                throw error;
            }

            setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
            setIsChangingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            console.error('Erro ao alterar senha:', error);
            setMessage({ type: 'error', text: error.message || 'Erro ao alterar senha' });
        } finally {
            setIsSaving(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setMessage({ type: 'success', text: 'Copiado!' });
        setTimeout(() => setMessage(null), 2000);
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
                currentPage="perfil"
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
                    <p className="text-sm font-medium text-foreground">Perfil</p>
                    <div className="w-10" />
                </div>

                {/* Content */}
                <main className="p-4 lg:p-6 max-w-4xl mx-auto">
                    {/* Mensagem de feedback */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                            : 'bg-red-500/20 border border-red-500/30 text-red-400'
                            }`}>
                            {message.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
                            {message.text}
                        </div>
                    )}

                    {/* Profile Header */}
                    <div className="bg-background-secondary rounded-xl p-6 border border-card-border mb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">{profile?.name || 'Parceiro'}</h2>
                                <p className="text-foreground-muted mb-2">{user?.email}</p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-400 text-xs font-medium">
                                        Parceiro
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                                        {profile?.status || 'Ativo'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-2 bg-background-tertiary rounded-lg">
                                <span className="text-xs text-foreground-muted">Código:</span>
                                <span className="font-mono font-bold text-white">{profile?.code || '—'}</span>
                                <button
                                    onClick={() => copyToClipboard(String(profile?.code || ''))}
                                    className="p-1 hover:bg-background rounded transition-colors cursor-pointer"
                                >
                                    <Copy size={14} className="text-foreground-muted" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Personal Info */}
                    <div className="bg-background-secondary rounded-xl border border-card-border mb-6">
                        <div className="px-6 py-4 border-b border-card-border flex items-center justify-between">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <User size={18} className="text-violet-400" />
                                Informações Pessoais
                            </h3>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-colors cursor-pointer"
                                >
                                    Editar
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 rounded-lg bg-background-tertiary hover:bg-background text-foreground-muted text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        Salvar
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-foreground-muted mb-2">Nome Completo</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-violet-500 transition-colors"
                                    />
                                ) : (
                                    <p className="text-white font-medium">{profile?.name || '—'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm text-foreground-muted mb-2">Email</label>
                                <p className="text-white font-medium flex items-center gap-2">
                                    <Mail size={16} className="text-foreground-muted" />
                                    {user?.email || '—'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm text-foreground-muted mb-2">Telefone</label>
                                {isEditing ? (
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="+55 11 99999-9999"
                                        className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-violet-500 transition-colors"
                                    />
                                ) : (
                                    <p className="text-white font-medium flex items-center gap-2">
                                        <Phone size={16} className="text-foreground-muted" />
                                        {profile?.phone || '—'}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm text-foreground-muted mb-2">Membro desde</label>
                                <p className="text-white font-medium">
                                    {profile?.created_at
                                        ? new Date(profile.created_at).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric'
                                        })
                                        : '—'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Bank Info */}
                    <div className="bg-background-secondary rounded-xl border border-card-border mb-6">
                        <div className="px-6 py-4 border-b border-card-border">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <CreditCard size={18} className="text-emerald-400" />
                                Dados para Pagamento
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm text-foreground-muted mb-2">Chave PIX</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="pix_key"
                                        value={formData.pix_key}
                                        onChange={handleInputChange}
                                        placeholder="CPF, Email, Telefone ou Chave Aleatória"
                                        className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-violet-500 transition-colors"
                                    />
                                ) : (
                                    <p className="text-white font-medium">{profile?.pix_key || '—'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm text-foreground-muted mb-2">Banco</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="bank_name"
                                        value={formData.bank_name}
                                        onChange={handleInputChange}
                                        placeholder="Nome do banco"
                                        className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-violet-500 transition-colors"
                                    />
                                ) : (
                                    <p className="text-white font-medium flex items-center gap-2">
                                        <Building size={16} className="text-foreground-muted" />
                                        {profile?.bank_name || '—'}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-foreground-muted mb-2">Agência</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="bank_agency"
                                            value={formData.bank_agency}
                                            onChange={handleInputChange}
                                            placeholder="0000"
                                            className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-violet-500 transition-colors"
                                        />
                                    ) : (
                                        <p className="text-white font-medium">{profile?.bank_agency || '—'}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-foreground-muted mb-2">Conta</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="bank_account"
                                            value={formData.bank_account}
                                            onChange={handleInputChange}
                                            placeholder="00000-0"
                                            className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-violet-500 transition-colors"
                                        />
                                    ) : (
                                        <p className="text-white font-medium">{profile?.bank_account || '—'}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="bg-background-secondary rounded-xl border border-card-border">
                        <div className="px-6 py-4 border-b border-card-border flex items-center justify-between">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Lock size={18} className="text-yellow-400" />
                                Segurança
                            </h3>
                            {!isChangingPassword && (
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="px-4 py-2 rounded-lg bg-background-tertiary hover:bg-background text-foreground text-sm font-medium transition-colors cursor-pointer"
                                >
                                    Alterar Senha
                                </button>
                            )}
                        </div>

                        {isChangingPassword ? (
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm text-foreground-muted mb-2">Nova Senha</label>
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? 'text' : 'password'}
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full px-4 py-3 pr-12 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-violet-500 transition-colors"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground-muted hover:text-foreground"
                                        >
                                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-foreground-muted mb-2">Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-violet-500 transition-colors"
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        onClick={() => {
                                            setIsChangingPassword(false);
                                            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                        }}
                                        className="px-4 py-2 rounded-lg bg-background-tertiary hover:bg-background text-foreground-muted text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={isSaving || !passwordData.newPassword || !passwordData.confirmPassword}
                                        className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                                        Alterar Senha
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6">
                                <p className="text-foreground-muted text-sm">
                                    Mantenha sua conta segura atualizando sua senha regularmente.
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
