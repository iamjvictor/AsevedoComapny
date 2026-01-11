'use client';

/**
 * Conditional Layout Wrapper
 * Hides header/footer on specific routes (login, platforms, etc.)
 */

import { usePathname } from 'next/navigation';
import { Footer, Header } from '@/components/layout';

// Routes that should NOT show the site header/footer
const routesWithoutSiteLayout = [
  '/login',
  '/plataforma-parceiro',
  '/plataforma-cliente',
  '/admin',
];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if current path matches any route that should hide header/footer
  const shouldHideLayout = routesWithoutSiteLayout.some(route => 
    pathname.includes(route)
  );

  if (shouldHideLayout) {
    // Return only children without header/footer
    return <>{children}</>;
  }

  // Return with header and footer for regular pages
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
