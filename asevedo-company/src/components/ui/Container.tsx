/**
 * Container Component
 * Provides consistent max-width and padding for page sections
 * Ensures content remains readable across all screen sizes
 */

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** Full width container without max-width limit */
  fluid?: boolean;
}

export function Container({ children, className, fluid = false }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        !fluid && 'max-w-7xl',
        className
      )}
    >
      {children}
    </div>
  );
}
