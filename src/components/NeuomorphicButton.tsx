import React from 'react';

interface NeuomorphicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

const NeuomorphicButton: React.FC<NeuomorphicButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button'
}) => {
  const baseClasses = `
    relative overflow-hidden font-medium transition-all duration-300 
    transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    border-0 cursor-pointer
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700
      text-white shadow-elegant hover:shadow-elegant-lg
      hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600
      focus:ring-indigo-500/50
      before:absolute before:inset-0 before:bg-gradient-to-r 
      before:from-white/20 before:to-transparent before:opacity-0 
      hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
    secondary: `
      bg-white/10 backdrop-blur-xl border border-white/20
      text-gray-700 shadow-elegant hover:shadow-elegant-lg
      hover:bg-white/20 hover:border-white/30
      focus:ring-gray-400/50
    `,
    accent: `
      bg-gradient-to-r from-cyan-500 to-blue-600
      text-white shadow-elegant hover:shadow-elegant-lg
      hover:from-cyan-400 hover:to-blue-500
      focus:ring-cyan-500/50
      before:absolute before:inset-0 before:bg-gradient-to-r 
      before:from-white/20 before:to-transparent before:opacity-0 
      hover:before:opacity-100 before:transition-opacity before:duration-300
    `,
    ghost: `
      bg-transparent text-gray-600 hover:text-gray-900
      hover:bg-gray-100/50 focus:ring-gray-400/50
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default NeuomorphicButton;