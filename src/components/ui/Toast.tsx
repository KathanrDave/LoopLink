import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  type = 'info',
  duration = 5000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  const typeConfig = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      iconColor: 'text-success-600',
      titleColor: 'text-success-900',
    },
    error: {
      icon: AlertCircle,
      bgColor: 'bg-error-50',
      borderColor: 'border-error-200',
      iconColor: 'text-error-600',
      titleColor: 'text-error-900',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      iconColor: 'text-warning-600',
      titleColor: 'text-warning-900',
    },
    info: {
      icon: Info,
      bgColor: 'bg-info-50',
      borderColor: 'border-info-200',
      iconColor: 'text-info-600',
      titleColor: 'text-info-900',
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'max-w-sm w-full shadow-elevation-3 rounded-2xl pointer-events-auto',
        'transform transition-all duration-300 ease-out',
        config.bgColor,
        config.borderColor,
        'border backdrop-blur-xl',
        isVisible 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
      )}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Icon className={cn('w-5 h-5', config.iconColor)} />
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={cn('text-sm font-medium', config.titleColor)}>
              {title}
            </p>
            {description && (
              <p className="mt-1 text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={handleClose}
              className="rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toast;