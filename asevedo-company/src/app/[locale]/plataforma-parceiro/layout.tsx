/**
 * Partner Platform Layout
 * Separate layout for the partner dashboard (no site header/footer)
 */

import { ThemeProvider } from '@/components/providers';
import { AuthProvider } from '@/providers';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function PartnerPlatformLayout({ children, params }: Props) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-background">
            {children}
          </div>
        </AuthProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
