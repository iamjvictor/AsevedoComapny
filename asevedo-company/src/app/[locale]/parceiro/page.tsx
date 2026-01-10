'use client';

/**
 * Página de Parceiros
 * Informações para se tornar um parceiro
 */

import { useLocale, useTranslations } from 'next-intl';

export default function ParceiroPage() {
  const locale = useLocale();
  const t = useTranslations('Common');

  return (
    <main className="min-h-screen bg-background pt-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Torne-se um <span className="text-gradient">Parceiro</span>
        </h1>
        <p className="text-foreground-secondary text-lg mb-8">
          Interessado em uma parceria? Entre em contato conosco para discutir oportunidades.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="mailto:jvictor.asevedo@gmail.com"
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-background font-medium rounded-lg hover:shadow-lg hover:shadow-primary-glow/30 hover:scale-[1.02] transition-all duration-300"
          >
            Entrar em Contato
          </a>
          <a 
            href={`/${locale}`}
            className="inline-flex items-center justify-center px-8 py-4 border border-card-border text-foreground font-medium rounded-lg hover:bg-card-border/20 transition-all duration-300"
          >
            {t('backToHome')}
          </a>
        </div>
      </div>
    </main>
  );
}
