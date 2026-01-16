/**
 * i18n Routing Configuration
 * Defines supported locales and routing behavior
 */

import { defineRouting } from 'next-intl/routing';

export const locales = ['pt-BR', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'pt-BR';

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});
