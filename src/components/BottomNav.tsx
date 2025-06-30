import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Share2, Calendar, User } from 'lucide-react';

const BottomNav = () => {
  const navItems = [
    { to: '/app', icon: Home, label: 'Home', end: true },
    { to: '/app/share', icon: Share2, label: 'Share' },
    { to: '/app/events', icon: Calendar, label: 'Events' },
    { to: '/app/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 z-40 shadow-elegant">
      <div className="grid grid-cols-4">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center py-4 px-2 text-xs transition-all duration-300 ${
                isActive
                  ? 'text-indigo-600 bg-indigo-50/50'
                  : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-6 h-6 mb-1 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                <span className={`font-medium ${isActive ? 'text-indigo-600' : ''}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;