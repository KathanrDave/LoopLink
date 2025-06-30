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
  gradient = 'from-indigo-500 via-purple-500 to-pink-500',
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-28 right-6 z-50
        w-16 h-16 rounded-2xl
        bg-gradient-to-br ${gradient}
        text-white shadow-elegant-lg
        flex items-center justify-center
        transform transition-all duration-300
        hover:scale-110 hover:shadow-2xl
        active:scale-95
        before:absolute before:inset-0 before:rounded-2xl
        before:bg-gradient-to-br before:from-white/20 before:to-transparent
        before:opacity-0 hover:before:opacity-100
        before:transition-opacity before:duration-300
        focus:outline-none focus:ring-4 focus:ring-indigo-500/50
        ${className}
      `}
    >
      <span className="relative z-10">{icon}</span>
    </button>
  );
};

export default FloatingActionButton;