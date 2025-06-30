import React from 'react';

interface NeuomorphicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'accent';
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
    relative overflow-hidden font-semibold transition-all duration-300 
    transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-4 focus:ring-opacity-50
  `;

  const variants = {
    primary: `
      bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500
      text-white shadow-lg hover:shadow-xl
      before:absolute before:inset-0 before:bg-gradient-to-br 
      before:from-white/20 before:to-transparent before:opacity-0 
      hover:before:opacity-100 before:transition-opacity before:duration-300
      focus:ring-blue-500
    `,
    secondary: `
      bg-gradient-to-br from-gray-100 to-gray-200
      text-gray-800 shadow-inner hover:shadow-lg
      border border-gray-300/50
      focus:ring-gray-400
    `,
    accent: `
      bg-gradient-to-br from-emerald-400 to-cyan-400
      text-white shadow-lg hover:shadow-xl
      before:absolute before:inset-0 before:bg-gradient-to-br 
      before:from-white/20 before:to-transparent before:opacity-0 
      hover:before:opacity-100 before:transition-opacity before:duration-300
      focus:ring-emerald-500
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