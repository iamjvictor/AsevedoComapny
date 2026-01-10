'use client';

/**
 * Área do Cliente
 * Página para clientes acessarem informações
 */

import { useLocale, useTranslations } from 'next-intl';

export default function ClientePage() {
  const locale = useLocale();
  const t = useTranslations('Common');

  return (
    <main className="min-h-screen bg-background pt-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Área do <span className="text-gradient">Cliente</span>
        </h1>
        <p className="text-foreground-secondary text-lg mb-8">
          Em breve você poderá acessar informações sobre seus projetos aqui.
        </p>
        <a 
          href={`/${locale}`}
          className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-background font-medium rounded-lg hover:shadow-lg hover:shadow-primary-glow/30 hover:scale-[1.02] transition-all duration-300"
        >
          {t('backToHome')}
        </a>
      </div>
    </main>
  );
}
