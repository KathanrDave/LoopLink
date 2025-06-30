import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  strokeWidth?: number;
  color?: 'primary' | 'success' | 'warning' | 'error';
  showLabel?: boolean;
  className?: string;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 'md',
  strokeWidth,
  color = 'primary',
  showLabel = false,
  className,
}) => {
  const sizes = {
    sm: { radius: 20, defaultStroke: 3 },
    md: { radius: 30, defaultStroke: 4 },
    lg: { radius: 40, defaultStroke: 5 },
  };

  const colors = {
    primary: '#2563eb',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  };

  const { radius, defaultStroke } = sizes[size];
  const stroke = strokeWidth || defaultStroke;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          stroke="#e5e7eb"
          fill="transparent"
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        {/* Progress circle */}
        <circle
          stroke={colors[color]}
          fill="transparent"
          strokeWidth={stroke}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-500 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-700">
            {Math.round(progress)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressRing;