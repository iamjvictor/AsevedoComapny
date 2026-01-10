import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  /** Badge color variant */
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'tech';
  /** Badge size */
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  className,
  variant = 'default',
  size = 'md',
}: BadgeProps) {
  const variants = {
    default: 'bg-background-tertiary text-foreground-secondary border-card-border',
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20',
    tech: 'bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground border-primary/20 hover:border-primary/40 transition-colors',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
