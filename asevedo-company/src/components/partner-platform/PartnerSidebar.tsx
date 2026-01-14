'use client';

/**
 * Partner Platform - Sidebar Component
 * Reusable sidebar with expandable "Comece Aqui" navigation
 */

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/providers';
import {
    Bell,
    BookOpen,
    ChevronDown,
    ChevronRight,
    Download,
    Home,
    LogOut,
    Map,
    Menu,
    Puzzle,
    Rocket,
    Search,
    Settings,
    Target,
    User,
    Users,
    Wallet,
    X,
    ArrowRight,
    Handshake
} from 'lucide-react';

interface PartnerSidebarProps {
    locale: string;
    currentPage: 'dashboard' | 'indicacoes' | 'comissoes' | 'comece-aqui' | 'perfil';
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    notificationsOpen?: boolean;
    setNotificationsOpen?: (open: boolean) => void;
}

// Seções do manual "Comece Aqui"
const comeceAquiSections = [
    { id: 'introducao', label: 'Introdução', icon: Handshake },
    { id: 'servicos', label: 'Nossos Serviços', icon: Puzzle },
    { id: 'identificando-dor', label: 'Identificando Dor', icon: Search },
    { id: 'processo', label: 'O Processo', icon: Map },
    { id: 'boas-praticas', label: 'Boas Práticas', icon: Target },
    { id: 'estrategias', label: 'Estratégias', icon: Rocket },
    { id: 'materiais', label: 'Materiais', icon: Download },
    { id: 'proximo-passo', label: 'Próximo Passo', icon: ArrowRight },
];

export default function PartnerSidebar({
    locale,
    currentPage,
    sidebarOpen,
    setSidebarOpen,
    notificationsOpen = false,
    setNotificationsOpen
}: PartnerSidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { profile, signOut } = useAuth();
    const [comeceAquiExpanded, setComeceAquiExpanded] = useState(currentPage === 'comece-aqui');

    const handleSignOut = async () => {
        await signOut();
        router.push(`/${locale}/login`);
    };

    const handleComeceAquiClick = () => {
        if (currentPage !== 'comece-aqui') {
            // Se não está na página, navega para ela
            router.push(`/${locale}/plataforma-parceiro/comece-aqui`);
            setSidebarOpen(false);
        } else {
            // Se já está na página, apenas expande/colapsa
            setComeceAquiExpanded(!comeceAquiExpanded);
        }
    };

    const handleSectionClick = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        // Fecha sidebar mobile
        setSidebarOpen(false);
    };

    const navigation = [
        { name: 'Dashboard', href: `/${locale}/plataforma-parceiro/dashboard`, icon: Home, key: 'dashboard' },
        { name: 'Indicações', href: `/${locale}/plataforma-parceiro/indicacoes`, icon: Users, key: 'indicacoes' },
        { name: 'Comissões', href: `/${locale}/plataforma-parceiro/comissoes`, icon: Wallet, key: 'comissoes' },
        { name: 'Perfil', href: `/${locale}/plataforma-parceiro/perfil`, icon: User, key: 'perfil' },
    ];

    const renderNavItem = (item: { name: string; href: string; icon: any; key: string }) => {
        const isCurrent = currentPage === item.key;
        return (
            <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isCurrent
                    ? 'bg-violet-500/10 text-violet-400'
                    : 'text-foreground-secondary hover:bg-background-tertiary hover:text-foreground'
                }`}
            >
                <item.icon size={20} />
                {item.name}
            </Link>
        );
    };

    const renderComeceAquiSection = (mobile: boolean = false) => {
        const isCurrent = currentPage === 'comece-aqui';
        const showExpanded = isCurrent && comeceAquiExpanded;
        
        return (
            <div>
                {/* Botão principal "Comece Aqui" */}
                <button
                    onClick={handleComeceAquiClick}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isCurrent
                        ? 'bg-violet-500/10 text-violet-400'
                        : 'text-foreground-secondary hover:bg-background-tertiary hover:text-foreground'
                    }`}
                >
                    <div className="flex items-center gap-3">
                        <BookOpen size={20} />
                        <span>Comece Aqui</span>
                    </div>
                    {isCurrent && (
                        <ChevronDown 
                            size={16} 
                            className={`transition-transform duration-200 ${showExpanded ? 'rotate-180' : ''}`}
                        />
                    )}
                </button>

                {/* Subnavegação expandida - só mostra quando está na página */}
                {isCurrent && (
                    <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                            showExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                    >
                        <div className="mt-1 ml-4 pl-4 border-l border-card-border space-y-1">
                            {comeceAquiSections.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => handleSectionClick(section.id)}
                                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-foreground-muted hover:bg-background-tertiary hover:text-foreground transition-colors text-left cursor-pointer"
                                >
                                    <section.icon size={14} />
                                    {section.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <>
            {/* =========== SIDEBAR - Desktop =========== */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-background-secondary border-r border-card-border">
                {/* Logo + User Info */}
                <div className="px-4 py-4 border-b border-card-border">
                    <div className="flex items-center gap-3 mb-4">
                        <Image src="/AS.png" alt="Logo" width={36} height={36} />
                        <div>
                            <p className="text-sm font-semibold text-foreground">Portal do Parceiro</p>
                            <p className="text-xs text-foreground-muted">Asevedo Company</p>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background-tertiary">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                                <User size={16} className="text-violet-400" />
                            </div>
                            <div>
                                <p className="text-sm font-medium max-w-[120px]" style={{ color: '#fff' }}>
                                    {profile?.name || 'Parceiro'}
                                </p>
                            </div>
                        </div>

                        {/* Notification Bell */}
                        {setNotificationsOpen && (
                            <div className="relative">
                                <button
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className="p-2 rounded-lg hover:bg-background-secondary transition-colors"
                                >
                                    <Bell size={18} className="text-foreground-secondary" />
                                </button>

                                {notificationsOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                                        <div className="absolute left-0 mt-2 w-72 bg-background rounded-xl border border-card-border shadow-xl z-50">
                                            <div className="px-4 py-3 border-b border-card-border">
                                                <p className="font-semibold text-foreground">Notificações</p>
                                            </div>
                                            <div className="p-4 text-center text-foreground-muted text-sm">
                                                Nenhuma notificação no momento
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    {navigation.slice(0, 3).map(renderNavItem)}
                    {renderComeceAquiSection()}
                    {navigation.slice(3).map(renderNavItem)}
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
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* =========== Mobile Sidebar =========== */}
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
                        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                            {navigation.slice(0, 3).map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentPage === item.key
                                        ? 'bg-violet-500/10 text-violet-400'
                                        : 'text-foreground-secondary hover:bg-background-tertiary hover:text-foreground'
                                    }`}
                                >
                                    <item.icon size={20} />
                                    {item.name}
                                </Link>
                            ))}
                            {renderComeceAquiSection(true)}
                            {navigation.slice(3).map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${currentPage === item.key
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
        </>
    );
}
