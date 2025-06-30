import React from 'react';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  blur?: 'sm' | 'md' | 'lg';
  opacity?: number;
}

const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  className = '',
  gradient = 'from-white/20 to-white/10',
  blur = 'md',
  opacity = 0.8
}) => {
  const blurClass = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg'
  };

  return (
    <div 
      className={`
        bg-gradient-to-br ${gradient} 
        ${blurClass[blur]} 
        border border-white/20 
        rounded-2xl 
        shadow-xl 
        ${className}
      `}
      style={{ 
        backgroundColor: `rgba(255, 255, 255, ${opacity * 0.1})`,
        backdropFilter: `blur(${blur === 'sm' ? '4px' : blur === 'md' ? '8px' : '12px'})`,
        WebkitBackdropFilter: `blur(${blur === 'sm' ? '4px' : blur === 'md' ? '8px' : '12px'})`
      }}
    >
      {children}
    </div>
  );
};

export default GlassmorphicCard;