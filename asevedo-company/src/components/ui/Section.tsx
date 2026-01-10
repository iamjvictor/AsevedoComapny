/**
 * Section Component
 * Wrapper for page sections with consistent vertical spacing
 * Supports different background variants for visual hierarchy
 */

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';
import { Container } from './Container';

interface SectionProps {
  children: ReactNode;
  className?: string;
  /** ID for anchor navigation */
  id?: string;
  /** Background variant */
  variant?: 'default' | 'secondary' | 'tertiary';
  /** Section title */
  title?: string;
  /** Section subtitle */
  subtitle?: string;
  /** Whether to use full-width container */
  fluid?: boolean;
}

export function Section({
  children,
  className,
  id,
  variant = 'default',
  title,
  subtitle,
  fluid = false,
}: SectionProps) {
  const bgVariants = {
    default: 'bg-transparent',
    secondary: 'bg-background-secondary/30',
    tertiary: 'bg-background-tertiary/20',
  };

  return (
    <section
      id={id}
      className={cn(
        'py-16 md:py-24 lg:py-32',
        bgVariants[variant],
        className
      )}
    >
      <Container fluid={fluid}>
        {(title || subtitle) && (
          <div className="mb-12 md:mb-16 text-center">
            {title && (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg md:text-xl text-foreground-secondary max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </Container>
    </section>
  );
}
