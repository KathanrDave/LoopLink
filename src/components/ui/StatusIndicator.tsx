import React from 'react';
import { cn } from '../../utils/cn';

interface StatusIndicatorProps {
  status: 'online' | 'busy' | 'away' | 'offline';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = false,
  className,
}) => {
  const statusConfig = {
    online: { color: 'bg-success-500', label: 'Online' },
    busy: { color: 'bg-warning-500', label: 'Busy' },
    away: { color: 'bg-warning-300', label: 'Away' },
    offline: { color: 'bg-gray-400', label: 'Offline' },
  };

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const config = statusConfig[status];

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className={cn(
        'rounded-full status-dot',
        config.color,
        sizes[size],
        status
      )} />
      {showLabel && (
        <span className="text-sm text-gray-600 font-medium">
          {config.label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator;