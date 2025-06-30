import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'outlined' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  hover = false,
  interactive = false,
}) => {
  const variants = {
    default: 'bg-white border border-gray-200',
    glass: 'glass-light',
    elevated: 'bg-white shadow-elevation-2',
    outlined: 'bg-transparent border-2 border-gray-200',
    gradient: 'gradient-enterprise border border-white/20',
  };

  const sizes = {
    sm: 'p-4 rounded-xl',
    md: 'p-6 rounded-2xl',
    lg: 'p-8 rounded-3xl',
  };

  const hoverEffects = hover ? 'hover:card-hover hover:shadow-glass-lg' : '';
  const interactiveEffects = interactive ? 'cursor-pointer focus:ring-2 focus:ring-brand-primary/50 focus:outline-none' : '';

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-out',
        variants[variant],
        sizes[size],
        hoverEffects,
        interactiveEffects,
        className
      )}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card;