/**
 * Button Component
 * Primary interactive element with multiple variants
 * Supports icons, loading states, and link behavior
 */

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonBaseProps {
  children?: ReactNode;
  className?: string;
  /** Button style variant */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Icon to display before text */
  icon?: ReactNode;
  /** Icon to display after text */
  iconAfter?: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
}

interface ButtonAsButtonProps extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  href?: never;
  external?: never;
}

interface ButtonAsLinkProps extends ButtonBaseProps {
  href: string;
  external?: boolean;
  onClick?: never;
  type?: never;
  disabled?: never;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  iconAfter,
  fullWidth = false,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-background hover:shadow-lg hover:shadow-primary-glow/30 hover:scale-[1.02]',
    secondary: 'bg-background-secondary text-foreground border border-card-border hover:bg-background-tertiary hover:border-primary/30',
    outline: 'bg-transparent border border-primary text-primary hover:bg-primary/10',
    ghost: 'bg-transparent text-foreground-secondary hover:text-foreground hover:bg-card-hover',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-lg gap-3',
  };

  const combinedClassName = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  );

  // Render as link if href is provided
  if ('href' in props && props.href) {
    const { href, external, ...linkProps } = props;
    
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClassName}
          {...linkProps}
        >
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
          {iconAfter && <span className="shrink-0">{iconAfter}</span>}
        </a>
      );
    }
    
    return (
      <Link href={href} className={combinedClassName}>
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
        {iconAfter && <span className="shrink-0">{iconAfter}</span>}
      </Link>
    );
  }

  // Render as button
  const { ...buttonProps } = props as ButtonAsButtonProps;
  
  return (
    <button className={combinedClassName} {...buttonProps}>
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
      {iconAfter && <span className="shrink-0">{iconAfter}</span>}
    </button>
  );
}
