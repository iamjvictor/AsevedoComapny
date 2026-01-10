/**
 * Internationalization Middleware
 * Handles locale detection, redirection, and cookie management
 */

import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing, {
  // Store the user's locale preference in a cookie
  localeDetection: true,
});

export const config = {
  // Match all pathnames except for:
  // - API routes
  // - Next.js internals (_next)
  // - Static files (files with extensions)
  matcher: [
    '/',
    '/(pt-BR|en)/:path*',
    '/((?!api|_next|.*\\..*).*)',
  ],
};
