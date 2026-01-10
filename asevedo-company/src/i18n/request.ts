/**
 * i18n Request Configuration
 * Handles loading of translation messages based on locale
 */

import { getRequestConfig } from 'next-intl/server';
import { routing, locales, defaultLocale, type Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  // Get the locale from the request
  let locale = await requestLocale;

  // Validate that the locale is supported, fallback to default if not
  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
