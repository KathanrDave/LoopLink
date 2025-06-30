import React from 'react';
import { cn } from '../../utils/cn';
import Card from './Card';

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: 4 | 6 | 8;
}

interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  variant?: 'default' | 'glass' | 'gradient';
  hover?: boolean;
}

export const BentoGrid: React.FC<BentoGridProps> = ({
  children,
  className,
  columns = 6,
}) => {
  const gridCols = {
    4: 'grid-cols-4',
    6: 'grid-cols-6',
    8: 'grid-cols-8',
  };

  return (
    <div className={cn(
      'grid gap-4 auto-rows-min',
      gridCols[columns],
      className
    )}>
      {children}
    </div>
  );
};

export const BentoItem: React.FC<BentoItemProps> = ({
  children,
  className,
  size = 'medium',
  variant = 'default',
  hover = true,
}) => {
  const sizes = {
    small: 'col-span-2 row-span-1',
    medium: 'col-span-3 row-span-1',
    large: 'col-span-4 row-span-2',
    wide: 'col-span-6 row-span-1',
    tall: 'col-span-2 row-span-2',
  };

  return (
    <Card
      variant={variant}
      hover={hover}
      className={cn(
        sizes[size],
        'min-h-[120px]',
        className
      )}
    >
      {children}
    </Card>
  );
};