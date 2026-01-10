/**
 * Card Component
 * Versatile card component with glassmorphism effect
 * Supports hover animations and glow effects
 */

import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  /** Enable hover glow effect */
  hover?: boolean;
  /** Card variant style */
  variant?: 'default' | 'glass' | 'outlined';
  /** Optional click handler */
  onClick?: () => void;
}

export function Card({
  children,
  className,
  hover = false,
  variant = 'default',
  onClick,
}: CardProps) {
  const variants = {
    default: 'bg-card border border-card-border',
    glass: 'glass',
    outlined: 'bg-transparent border border-card-border',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-all duration-300',
        variants[variant],
        hover && 'hover:scale-[1.02] hover:border-primary/30 hover:shadow-lg hover:shadow-primary-glow/10 cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

/**
 * Card Header Component
 */
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

/**
 * Card Title Component
 */
interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className }: CardTitleProps) {
  return (
    <h3 className={cn('text-xl font-semibold text-foreground', className)}>
      {children}
    </h3>
  );
}

/**
 * Card Description Component
 */
interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className }: CardDescriptionProps) {
  return (
    <p className={cn('text-foreground-secondary text-sm mt-2', className)}>
      {children}
    </p>
  );
}

/**
 * Card Content Component
 */
interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={cn('', className)}>
      {children}
    </div>
  );
}

/**
 * Card Footer Component
 */
interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={cn('mt-4 pt-4 border-t border-card-border', className)}>
      {children}
    </div>
  );
}
