/**
 * Locale-specific Layout
 * Wraps pages with NextIntlClientProvider for translations
 */

import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { ConditionalLayout } from '@/components/layout';
import { ThemeProvider } from '@/components/providers';
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google';
import '../globals.css';
import type { Metadata } from 'next';

// Font configurations
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
});

// Generate static params for all supported locales
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// SEO Metadata
export const metadata: Metadata = {
  title: {
    default: 'Asevedo Company | Soluções Digitais Premium',
    template: '%s | Asevedo Company',
  },
  description:
    'Desenvolvemos sistemas web, aplicações mobile e integrações com foco em performance, escalabilidade e resultado. Tecnologia de verdade para empresas que precisam crescer.',
  keywords: [
    'desenvolvimento web',
    'aplicações mobile',
    'sistemas empresariais',
    'API',
    'integrações',
    'software house',
    'tecnologia',
    'São Paulo',
  ],
  authors: [{ name: 'Asevedo Company' }],
  creator: 'Asevedo Company',
  icons: {
    icon: '/AS.png',
    shortcut: '/AS.png',
    apple: '/AS.png',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://asevedocompany.com',
    siteName: 'Asevedo Company',
    title: 'Asevedo Company | Soluções Digitais Premium',
    description:
      'Desenvolvemos sistemas web, aplicações mobile e integrações com foco em performance, escalabilidade e resultado.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asevedo Company | Soluções Digitais Premium',
    description:
      'Desenvolvemos sistemas web, aplicações mobile e integrações com foco em performance, escalabilidade e resultado.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Validate that the locale is supported
  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  // Get messages for the current locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ConditionalLayout>{children}</ConditionalLayout>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

