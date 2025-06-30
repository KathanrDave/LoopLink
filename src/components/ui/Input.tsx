import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'glass';
  size?: 'sm' | 'md' | 'lg';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  variant = 'default',
  size = 'md',
  className,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-white border border-gray-200 focus:border-brand-primary',
    filled: 'bg-gray-50 border border-transparent focus:bg-white focus:border-brand-primary',
    glass: 'glass-light border border-white/20 focus:border-white/40',
  };

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-base',
    lg: 'h-14 px-5 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const paddingWithIcons = {
    sm: leftIcon ? 'pl-9' : rightIcon ? 'pr-9' : '',
    md: leftIcon ? 'pl-11' : rightIcon ? 'pr-11' : '',
    lg: leftIcon ? 'pl-14' : rightIcon ? 'pr-14' : '',
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className={cn(
            'absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400',
            iconSizes[size]
          )}>
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            'w-full rounded-xl transition-all duration-200',
            'focus:ring-2 focus:ring-brand-primary/20 focus:outline-none',
            'placeholder:text-gray-400',
            variants[variant],
            sizes[size],
            paddingWithIcons[size],
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className={cn(
            'absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400',
            iconSizes[size]
          )}>
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-error-600 flex items-center space-x-1">
          <span>⚠️</span>
          <span>{error}</span>
        </p>
      )}
      
      {hint && !error && (
        <p className="text-sm text-gray-500">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;