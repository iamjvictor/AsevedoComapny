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

export default function HomePage() {
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

