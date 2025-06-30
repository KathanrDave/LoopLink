import React, { useState } from 'react';
import { ChevronDown, Bell, Users, MapPin, Building2, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';

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
      case 'neighborhood': return 'from-green-500 to-emerald-500';
      case 'organization': return 'from-blue-500 to-cyan-500';
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
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200/50 z-40 shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Loop Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLoopSelector(!showLoopSelector)}
              className="flex items-center space-x-3 hover:bg-gray-50 rounded-xl p-2 -ml-2 transition-all duration-200 group"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${getLoopGradient(currentLoop.type)} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                <LoopIcon className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-lg font-bold text-gray-900 line-clamp-1">
                  {currentLoop.name}
                </h1>
                <p className="text-xs text-gray-500 capitalize font-medium">{currentLoop.type} Loop • {currentLoop.members.length} members</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
            </button>

            {/* Loop Selector Dropdown */}
            {showLoopSelector && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Your Loops</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {userLoops.map((loop) => {
                    const Icon = getLoopIcon(loop.type);
                    const isActive = loop.id === currentLoop.id;
                    
                    return (
                      <button
                        key={loop.id}
                        onClick={() => handleLoopChange(loop)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-all duration-200 group ${
                          isActive ? 'bg-blue-50/50' : ''
                        }`}
                      >
                        <div className={`w-10 h-10 bg-gradient-to-br ${getLoopGradient(loop.type)} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-900 line-clamp-1">{loop.name}</p>
                          <p className="text-xs text-gray-500">
                            {loop.members.length} members • {loop.type}
                          </p>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="px-4 py-3 border-t border-gray-100">
                  <Link 
                    to="/join"
                    onClick={() => setShowLoopSelector(false)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    + Create New Loop
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors relative group">
              <Bell className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                {currentUser?.avatar || '👤'}
              </button>

              {/* User Menu Dropdown */}
              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200/50 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-gray-900">{currentUser?.name}</p>
                    <p className="text-sm text-gray-600">{currentUser?.email}</p>
                  </div>
                  
                  <div className="py-2">
                    <Link
                      to="/app/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm">{currentUser?.avatar}</span>
                      </div>
                      <span>View Profile</span>
                    </Link>
                    
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
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