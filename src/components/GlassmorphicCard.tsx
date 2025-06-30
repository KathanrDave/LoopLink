import React from 'react';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'light' | 'dark' | 'primary' | 'secondary';
  hover?: boolean;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className = '',
  variant = 'light',
  hover = true
}) => {
  const variants = {
    light: 'bg-white/80 backdrop-blur-xl border border-white/30 text-gray-900',
    dark: 'bg-black/20 backdrop-blur-xl border border-white/20 text-white',
    primary: 'bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-xl border border-indigo-300/30 text-gray-900',
    secondary: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20 backdrop-blur-xl border border-pink-300/30 text-gray-900'
  };

  const hoverEffect = hover ? 'hover:bg-white/90 hover:border-white/40 hover:shadow-lg hover:scale-[1.02]' : '';

  return (
    <div 
      className={`
        ${variants[variant]}
        ${hoverEffect}
        rounded-2xl 
        shadow-lg
        transition-all 
        duration-300 
        ease-out
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default GlassmorphicCard;