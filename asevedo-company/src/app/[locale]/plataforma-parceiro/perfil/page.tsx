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
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
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
    AlertCircle,
    Globe
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

            setMessage({ type: 'success', text: t('profile.profileUpdated') });
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
            setMessage({ type: 'error', text: t('profile.passwordsDontMatch') });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: t('profile.passwordMinLength') });
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

            setMessage({ type: 'success', text: t('profile.passwordChanged') });
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
        setMessage({ type: 'success', text: t('profile.codeCopied') });
        setTimeout(() => setMessage(null), 2000);
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
                    <p className="text-sm font-medium text-foreground">{t('profile.title')}</p>
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
                                        {t('profile.partnerBadge')}
                                    </span>
                                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                                        {profile?.status || t('profile.activeBadge')}
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
                                {t('profile.personalInfo')}
                            </h3>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white text-sm font-medium transition-colors cursor-pointer"
                                >
                                    {t('profile.edit')}
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="px-4 py-2 rounded-lg bg-background-tertiary hover:bg-background text-foreground-muted text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        {t('profile.cancel')}
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={isSaving}
                                        className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        {t('profile.save')}
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm text-foreground-muted mb-2">{t('profile.fullName')}</label>
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
                                <label className="block text-sm text-foreground-muted mb-2">{t('profile.email')}</label>
                                <p className="text-white font-medium flex items-center gap-2">
                                    <Mail size={16} className="text-foreground-muted" />
                                    {user?.email || '—'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm text-foreground-muted mb-2">{t('profile.phone')}</label>
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
                                <label className="block text-sm text-foreground-muted mb-2">{t('profile.memberSince')}</label>
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

                    {/* Language Settings */}
                    <div className="bg-background-secondary rounded-xl border border-card-border mb-6 overflow-hidden">
                        <div className="px-6 py-4 border-b border-card-border">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Globe size={18} className="text-cyan-400" />
                                {t('profile.languagePreferences')}
                            </h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-foreground-muted mb-4">
                                {t('profile.languageDescription')}
                            </p>
                            <LanguageSwitcher variant="inline" />
                        </div>
                    </div>

                    {/* Bank Info */}
                    <div className="bg-background-secondary rounded-xl border border-card-border mb-6">
                        <div className="px-6 py-4 border-b border-card-border">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <CreditCard size={18} className="text-emerald-400" />
                                {t('profile.paymentInfo')}
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm text-foreground-muted mb-2">{t('profile.pixKey')}</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="pix_key"
                                        value={formData.pix_key}
                                        onChange={handleInputChange}
                                        placeholder={t('profile.pixKeyPlaceholder')}
                                        className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-violet-500 transition-colors"
                                    />
                                ) : (
                                    <p className="text-white font-medium">{profile?.pix_key || '—'}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm text-foreground-muted mb-2">{t('profile.bank')}</label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="bank_name"
                                        value={formData.bank_name}
                                        onChange={handleInputChange}
                                        placeholder={t('profile.bankPlaceholder')}
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
                                    <label className="block text-sm text-foreground-muted mb-2">{t('profile.agency')}</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="bank_agency"
                                            value={formData.bank_agency}
                                            onChange={handleInputChange}
                                            placeholder={t('profile.agencyPlaceholder')}
                                            className="w-full px-4 py-3 bg-background border border-card-border rounded-lg text-foreground focus:outline-none focus:border-violet-500 transition-colors"
                                        />
                                    ) : (
                                        <p className="text-white font-medium">{profile?.bank_agency || '—'}</p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm text-foreground-muted mb-2">{t('profile.account')}</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="bank_account"
                                            value={formData.bank_account}
                                            onChange={handleInputChange}
                                            placeholder={t('profile.accountPlaceholder')}
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
                                {t('profile.security')}
                            </h3>
                            {!isChangingPassword && (
                                <button
                                    onClick={() => setIsChangingPassword(true)}
                                    className="px-4 py-2 rounded-lg bg-background-tertiary hover:bg-background text-foreground text-sm font-medium transition-colors cursor-pointer"
                                >
                                    {t('profile.changePassword')}
                                </button>
                            )}
                        </div>

                        {isChangingPassword ? (
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm text-foreground-muted mb-2">{t('profile.newPassword')}</label>
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
                                    <label className="block text-sm text-foreground-muted mb-2">{t('profile.confirmNewPassword')}</label>
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
                                        {t('profile.cancel')}
                                    </button>
                                    <button
                                        onClick={handleChangePassword}
                                        disabled={isSaving || !passwordData.newPassword || !passwordData.confirmPassword}
                                        className="px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-black text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                                    >
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                                        {t('profile.changePassword')}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="p-6">
                                <p className="text-foreground-muted text-sm">
                                    {t('profile.securityTip')}
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
