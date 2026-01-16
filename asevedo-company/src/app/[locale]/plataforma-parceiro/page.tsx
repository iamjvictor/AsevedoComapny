'use client';

/**
 * Partner Platform - Entry Point
 * Redirects to login or dashboard based on auth status
 */

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';

export default function PartnerPlatformPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('PartnerPlatform');

  useEffect(() => {
    // TODO: Check if user is authenticated with Supabase
    const isAuthenticated = false; // Will be replaced with actual auth check
    
    if (isAuthenticated) {
      router.replace(`/${locale}/plataforma-parceiro/dashboard`);
    } else {
      // Redirect to universal login with return URL
      router.replace(`/${locale}/login?redirect=plataforma-parceiro/dashboard`);
    }
  }, [router, locale]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
        <p className="text-foreground-muted text-sm">{t('common.loading')}</p>
      </div>
    </div>
  );
}
