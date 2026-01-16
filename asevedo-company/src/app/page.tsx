import { redirect } from 'next/navigation';

/**
 * Root Page
 * Redirects the root path to the default locale (pt-BR)
 */
export default function RootPage() {
  redirect('/pt-BR');
}
