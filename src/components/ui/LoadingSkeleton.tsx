import React from 'react';
import { cn } from '../../utils/cn';

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  lines = 1,
}) => {
  const baseClasses = 'skeleton bg-gray-200 animate-pulse';

  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variants.text,
              index === lines - 1 ? 'w-3/4' : 'w-full'
            )}
            style={{ width, height }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variants[variant],
        className
      )}
      style={{ width, height }}
    />
  );
};

export default LoadingSkeleton;