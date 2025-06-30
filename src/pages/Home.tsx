import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Calendar, Users, MapPin, Building2, Crown, Zap, Map, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import GlassmorphicCard from '../components/GlassmorphicCard';
import NeuomorphicButton from '../components/NeuomorphicButton';
import FloatingActionButton from '../components/FloatingActionButton';

const Home = () => {
  const { currentLoop, currentUser, subscriptionLimits, loopsLoading } = useApp();

  // Show loading state
  if (loopsLoading) {
    return (
      <div className="px-4 py-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show no loops state
  if (!currentLoop) {
    return (
      <div className="px-4 py-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
        <div className="text-center py-16">
          <div className="text-8xl mb-6">🔗</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to LoopLink!</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You're not part of any loops yet. Create your first loop or join an existing one to get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/join">
              <NeuomorphicButton variant="primary" size="lg">
                <div className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Create Your First Loop</span>
                </div>
              </NeuomorphicButton>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <div>Loading user...</div>;
  }

  const recentItems = currentLoop.items.slice(0, 4);
  const upcomingEvents = currentLoop.events.slice(0, 2);
  const availableItems = currentLoop.items.filter(item => item.status === 'available').length;
  const borrowedItems = currentLoop.items.filter(item => item.status === 'borrowed').length;

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
    <div className="px-4 py-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Welcome Section */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Welcome back, {currentUser.name.split(' ')[0]}! ✨
          </h1>
          <p className="text-gray-600 mt-1">Here's what's happening in your {currentLoop.type} loop</p>
        </div>

        {/* Hero Loop Card */}
        <GlassmorphicCard 
          className={`p-6 bg-gradient-to-br ${getLoopGradient(currentLoop.type)} text-white relative overflow-hidden`}
          gradient="from-white/10 to-white/5"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <LoopIcon className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{currentLoop.name}</h2>
                  <p className="text-white/80 capitalize">{currentLoop.type} Loop</p>
                </div>
              </div>
              {currentLoop.subscriptionTier !== 'free' && (
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Crown className="w-4 h-4" />
                  <span className="text-sm font-medium capitalize">{currentLoop.subscriptionTier}</span>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold">{currentLoop.members.length}</p>
                <p className="text-sm text-white/80">Members</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{currentLoop.items.length}</p>
                <p className="text-sm text-white/80">Items</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{currentLoop.events.length}</p>
                <p className="text-sm text-white/80">Events</p>
              </div>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <GlassmorphicCard className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{availableItems}</p>
                <p className="text-xs text-gray-600">Available Items</p>
              </div>
            </div>
          </GlassmorphicCard>

          <GlassmorphicCard className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{upcomingEvents.length}</p>
                <p className="text-xs text-gray-600">Upcoming Events</p>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>

      {/* Map Access for Neighborhood Loops */}
      {currentLoop.type === 'neighborhood' && (
        <GlassmorphicCard className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Neighborhood Map</h3>
                <p className="text-sm text-gray-600">See members, items, and events near you</p>
              </div>
            </div>
            <Link to="/app/map">
              <NeuomorphicButton variant="accent" size="sm">
                <div className="flex items-center space-x-2">
                  <Navigation className="w-4 h-4" />
                  <span>Explore</span>
                </div>
              </NeuomorphicButton>
            </Link>
          </div>
        </GlassmorphicCard>
      )}

      {/* Subscription Limits Warning */}
      {currentLoop.subscriptionTier === 'free' && (
        <GlassmorphicCard className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
          <div className="flex items-start space-x-3">
            <Zap className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-medium text-amber-900">Free Plan Limits</h3>
              <p className="text-sm text-amber-700 mt-1">
                {currentLoop.members.length}/{subscriptionLimits.maxMembers} members • 
                {currentLoop.events.length}/{subscriptionLimits.maxEvents} events this month
              </p>
              <Link to="/upgrade" className="text-sm text-amber-800 font-medium hover:text-amber-900">
                Upgrade to Pro →
              </Link>
            </div>
          </div>
        </GlassmorphicCard>
      )}

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-4">
          {currentLoop.settings.allowItemSharing && (
            <Link to="/app/create-item">
              <NeuomorphicButton variant="primary" className="w-full">
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Share Item</span>
                </div>
              </NeuomorphicButton>
            </Link>
          )}
          {currentLoop.settings.allowEvents && (
            <Link to="/app/create-event">
              <NeuomorphicButton variant="accent" className="w-full">
                <div className="flex items-center justify-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Plan Event</span>
                </div>
              </NeuomorphicButton>
            </Link>
          )}
        </div>
      </div>

      {/* Recent Items */}
      {recentItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Recently Shared</h2>
            <Link to="/app/share" className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {recentItems.map((item) => (
              <ItemCard key={item.id} item={item} compact />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
            <Link to="/app/events" className="text-blue-600 text-sm font-medium hover:text-blue-700">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <GlassmorphicCard key={event.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>{event.date}</span>
                      <span>{event.time}</span>
                      <span>{event.attendees?.length || 0} attending</span>
                    </div>
                  </div>
                  <div className="text-2xl">📅</div>
                </div>
              </GlassmorphicCard>
            ))}
          </div>
        </div>
      )}

      {/* Loop Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <div className="space-y-3">
          <GlassmorphicCard className="p-4">
            <div className="flex items-center space-x-3">
              <div className="text-xl">👨‍💻</div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">Welcome to {currentLoop.name}!</span>
                </p>
                <p className="text-xs text-gray-500">Start sharing items and organizing events</p>
              </div>
            </div>
          </GlassmorphicCard>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => {
          // Navigate to create item or event based on loop settings
          if (currentLoop.settings.allowItemSharing) {
            window.location.href = '/app/create-item';
          } else if (currentLoop.settings.allowEvents) {
            window.location.href = '/app/create-event';
          }
        }}
        gradient={getLoopGradient(currentLoop.type)}
      />
    </div>
  );
};

export default Home;