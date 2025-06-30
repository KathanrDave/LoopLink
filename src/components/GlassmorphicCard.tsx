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
    light: 'bg-white/10 backdrop-blur-xl border border-white/20',
    dark: 'bg-black/10 backdrop-blur-xl border border-white/10',
    primary: 'bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-xl border border-indigo-300/30',
    secondary: 'bg-gradient-to-br from-pink-500/20 to-rose-600/20 backdrop-blur-xl border border-pink-300/30'
  };

  const hoverEffect = hover ? 'hover:bg-white/15 hover:border-white/30 hover:shadow-elegant-lg hover:scale-[1.02]' : '';

  return (
    <div 
      className={`
        ${variants[variant]}
        ${hoverEffect}
        rounded-2xl 
        shadow-elegant
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