import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  loading = false,
  type = 'button',
  fullWidth = false,
}) => {
  const baseClasses = `
    relative overflow-hidden font-medium transition-all duration-300 
    transform active:btn-press disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    border-0 cursor-pointer inline-flex items-center justify-center
    whitespace-nowrap
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-brand-primary via-blue-600 to-brand-primary
      text-white shadow-elevation-2 hover:shadow-elevation-3
      hover:from-blue-500 hover:via-blue-500 hover:to-brand-primary
      focus:ring-brand-primary/50
      before:absolute before:inset-0 before:bg-gradient-to-r 
      before:from-white/20 before:to-transparent before:opacity-0 
      hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
    secondary: `
      bg-white border border-gray-200 text-gray-700 
      shadow-elevation-1 hover:shadow-elevation-2
      hover:bg-gray-50 hover:border-gray-300
      focus:ring-gray-400/50
    `,
    accent: `
      bg-gradient-to-r from-brand-accent via-orange-500 to-brand-accent
      text-white shadow-elevation-2 hover:shadow-elevation-3
      hover:from-orange-400 hover:via-orange-400 hover:to-brand-accent
      focus:ring-brand-accent/50
      before:absolute before:inset-0 before:bg-gradient-to-r 
      before:from-white/20 before:to-transparent before:opacity-0 
      hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
    ghost: `
      bg-transparent text-gray-600 hover:text-gray-900
      hover:bg-gray-100 focus:ring-gray-400/50
    `,
    outline: `
      bg-transparent border-2 border-brand-primary text-brand-primary
      hover:bg-brand-primary hover:text-white
      focus:ring-brand-primary/50
    `,
    destructive: `
      bg-gradient-to-r from-error-500 via-red-500 to-error-500
      text-white shadow-elevation-2 hover:shadow-elevation-3
      hover:from-red-400 hover:via-red-400 hover:to-error-500
      focus:ring-error-500/50
    `,
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl h-9',
    md: 'px-6 py-3 text-base rounded-xl h-11',
    lg: 'px-8 py-4 text-lg rounded-2xl h-14',
    xl: 'px-10 py-5 text-xl rounded-2xl h-16',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        widthClass,
        className
      )}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <span className={cn('relative z-10', loading && 'opacity-0')}>
        {children}
      </span>
    </button>
  );
};

export default Button;