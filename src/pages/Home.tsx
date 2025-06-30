import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, Building2, Crown, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useModal } from '../context/ModalContext';
import GlassmorphicCard from '../components/GlassmorphicCard';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import ActionCenter from '../components/dashboard/ActionCenter';
import PermissionGate from '../components/rbac/PermissionGate';

const Home = () => {
  const { currentLoop, currentUser, subscriptionLimits, loopsLoading, isAdmin } = useApp();
  const { openModal } = useModal();

  // Show loading state
  if (loopsLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded-xl w-3/4"></div>
          <div className="h-40 bg-gray-200 rounded-3xl"></div>
          <div className="grid grid-cols-2 gap-6">
            <div className="h-24 bg-gray-200 rounded-2xl"></div>
            <div className="h-24 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show no loops state
  if (!currentLoop) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="text-8xl mb-8">🔗</div>
        <h3 className="text-4xl font-bold text-gray-900 mb-6">Welcome to LoopLink!</h3>
        <p className="text-gray-600 mb-10 max-w-2xl mx-auto text-xl leading-relaxed">
          You're not part of any loops yet. Create your first loop or join an existing one to get started.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/join" className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
            Create Your First Loop
          </Link>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <div>Loading user...</div>;
  }

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
      case 'friend': return 'from-purple-500 via-pink-500 to-rose-500';
      case 'neighborhood': return 'from-emerald-500 via-teal-500 to-cyan-500';
      case 'organization': return 'from-blue-500 via-indigo-500 to-violet-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const LoopIcon = getLoopIcon(currentLoop.type);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {currentUser.name.split(' ')[0]}!
            </h1>
            <p className="text-gray-600 text-lg">Here's what's happening in your {currentLoop.type} loop</p>
          </div>
          
          {/* Role Badge */}
          <div className="flex items-center space-x-3">
            <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
              isAdmin() ? 'bg-amber-100 text-amber-800' : 
              currentUser.role === 'member' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {isAdmin() && <Crown className="w-4 h-4" />}
              <span className="text-sm font-semibold capitalize">{currentUser.role}</span>
            </div>
          </div>
        </div>

        {/* Hero Loop Card */}
        <GlassmorphicCard 
          className={`p-8 bg-gradient-to-br ${getLoopGradient(currentLoop.type)} text-white relative overflow-hidden`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
                  <LoopIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{currentLoop.name}</h2>
                  <p className="text-white/80 capitalize text-lg">{currentLoop.type} Loop</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {currentLoop.subscriptionTier !== 'free' && (
                  <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2">
                    <Crown className="w-5 h-5 text-white" />
                    <span className="text-sm font-medium capitalize text-white">{currentLoop.subscriptionTier}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold mb-1 text-white">{currentLoop.members.length}</p>
                <p className="text-sm text-white/80 font-medium">Members</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold mb-1 text-white">{currentLoop.items.length}</p>
                <p className="text-sm text-white/80 font-medium">Items</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold mb-1 text-white">{currentLoop.events.length}</p>
                <p className="text-sm text-white/80 font-medium">Events</p>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Main Dashboard Layout - 60/40 Split */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* LEFT COLUMN (60%) - Activity Feed */}
        <div className="lg:col-span-3">
          <ActivityFeed />
        </div>

        {/* RIGHT COLUMN (40%) - Action Center */}
        <div className="lg:col-span-2">
          <ActionCenter />
        </div>
      </div>

      {/* Subscription Limits Warning */}
      {currentLoop.subscriptionTier === 'free' && (
        <div className="mt-8">
          <GlassmorphicCard className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
            <div className="flex items-start space-x-4">
              <Zap className="w-6 h-6 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-amber-900 mb-2">Free Plan Limits</h3>
                <p className="text-sm text-amber-700 mb-3">
                  {currentLoop.members.length}/{subscriptionLimits.maxMembers} members • 
                  {currentLoop.events.length}/{subscriptionLimits.maxEvents} events this month
                </p>
                <PermissionGate permission="manage_loop">
                  <button 
                    onClick={() => openModal('subscription', { currentPlan: currentLoop.subscriptionTier })}
                    className="text-sm text-amber-800 font-medium hover:text-amber-900 transition-colors bg-amber-200 px-3 py-1 rounded-lg hover:bg-amber-300"
                  >
                    Upgrade to Pro →
                  </button>
                </PermissionGate>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      )}
    </div>
  );
};

export default Home;