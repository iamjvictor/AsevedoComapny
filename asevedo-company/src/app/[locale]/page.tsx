/**
 * Homepage
 * Main landing page for Asevedo Company
 */

import { 
  HeroSection,
  ProofStripSection,
  ServicesSection,
  ProcessSection,
  AboutLeadershipSection,
  CTASection
} from '@/components/sections';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  return (
    <>
      <HeroSection />
      <ProofStripSection />
      <ServicesSection />
      <ProcessSection />
      <AboutLeadershipSection />
      <CTASection />
    </>
  );
}
