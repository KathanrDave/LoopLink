import React from 'react';
import { Plus } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  gradient?: string;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onClick,
  icon = <Plus className="w-6 h-6" />,
  gradient = 'from-blue-500 via-purple-500 to-pink-500',
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-24 right-6 z-50
        w-14 h-14 rounded-full
        bg-gradient-to-br ${gradient}
        text-white shadow-2xl
        flex items-center justify-center
        transform transition-all duration-300
        hover:scale-110 hover:shadow-3xl
        active:scale-95
        before:absolute before:inset-0 before:rounded-full
        before:bg-gradient-to-br before:from-white/20 before:to-transparent
        before:opacity-0 hover:before:opacity-100
        before:transition-opacity before:duration-300
        focus:outline-none focus:ring-4 focus:ring-purple-500/50
        ${className}
      `}
    >
      <span className="relative z-10">{icon}</span>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-white/20 scale-0 animate-ping opacity-0 hover:animate-none"></div>
    </button>
  );
};

export default FloatingActionButton;