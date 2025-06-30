import React, { useState } from 'react';
import { ChevronDown, Bell, Users, MapPin, Building2, LogOut, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import GlassmorphicCard from './GlassmorphicCard';

const Header = () => {
  const { currentUser, currentLoop, userLoops, setCurrentLoop } = useApp();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [showLoopSelector, setShowLoopSelector] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getLoopIcon = (type: string) => {
    switch (type) {
      case 'friend': return Users;
      case 'neighborhood': return MapPin;
      case 'organization': return Building2;
      default: return Users;
    }
  };

  const getLoopGradient = (type: string) => {
    switch (type) {
      case 'friend': return 'from-purple-500 to-pink-500';
      case 'neighborhood': return 'from-emerald-500 to-teal-500';
      case 'organization': return 'from-blue-500 to-indigo-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handleLoopChange = (loop: any) => {
    setCurrentLoop(loop);
    setShowLoopSelector(false);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  if (!currentLoop) return null;

  const LoopIcon = getLoopIcon(currentLoop.type);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 z-40 shadow-elegant">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Loop Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLoopSelector(!showLoopSelector)}
              className="flex items-center space-x-4 hover:bg-gray-50/50 rounded-2xl p-3 -ml-3 transition-all duration-300 group"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${getLoopGradient(currentLoop.type)} rounded-2xl flex items-center justify-center shadow-elegant group-hover:scale-105 transition-transform duration-300`}>
                <LoopIcon className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {currentLoop.name}
                </h1>
                <p className="text-sm text-gray-500 capitalize font-medium">{currentLoop.type} Loop • {currentLoop.members.length} members</p>
              </div>
              <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>

            {/* Loop Selector Dropdown */}
            {showLoopSelector && (
              <GlassmorphicCard className="absolute top-full left-0 mt-3 w-96 py-3 z-50">
                <div className="px-5 py-3 border-b border-white/20">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Your Loops</p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {userLoops.map((loop) => {
                    const Icon = getLoopIcon(loop.type);
                    const isActive = loop.id === currentLoop.id;
                    
                    return (
                      <button
                        key={loop.id}
                        onClick={() => handleLoopChange(loop)}
                        className={`w-full flex items-center space-x-4 px-5 py-4 hover:bg-white/20 transition-all duration-200 group ${
                          isActive ? 'bg-indigo-50/30' : ''
                        }`}
                      >
                        <div className={`w-12 h-12 bg-gradient-to-br ${getLoopGradient(loop.type)} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-900 line-clamp-1">{loop.name}</p>
                          <p className="text-sm text-gray-500">
                            {loop.members.length} members • {loop.type}
                          </p>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="px-5 py-3 border-t border-white/20">
                  <Link 
                    to="/join"
                    onClick={() => setShowLoopSelector(false)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                  >
                    + Create New Loop
                  </Link>
                </div>
              </GlassmorphicCard>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-3 text-gray-500 hover:text-indigo-600 transition-colors relative group rounded-xl hover:bg-gray-50/50">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-lg shadow-elegant hover:scale-105 transition-transform duration-300 cursor-pointer"
              >
                {currentUser?.avatar || '👤'}
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <GlassmorphicCard className="absolute top-full right-0 mt-3 w-72 py-3 z-50">
                  <div className="px-5 py-4 border-b border-white/20">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-lg shadow-md">
                        {currentUser?.avatar || '👤'}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{currentUser?.name}</p>
                        <p className="text-sm text-gray-600">{currentUser?.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/app/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-5 py-3 text-gray-700 hover:bg-white/20 transition-colors"
                    >
                      <UserIcon className="w-5 h-5 text-gray-500" />
                      <span>View Profile</span>
                    </Link>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-5 py-3 text-red-600 hover:bg-red-50/50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out & Return Home</span>
                    </button>
                  </div>
                </GlassmorphicCard>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showLoopSelector || showUserMenu) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowLoopSelector(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;