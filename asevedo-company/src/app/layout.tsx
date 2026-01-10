/**
 * Root Layout
 * Main layout wrapper for the entire application
 * Includes theme provider, global styles, and common layout elements
 */

import { Footer, Header } from '@/components/layout';
import { ThemeProvider } from '@/components/providers';
import type { Metadata } from 'next';
import { Geist, Geist_Mono, JetBrains_Mono } from 'next/font/google';
import './globals.css';

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
