import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, TrendingUp, Calendar, Users, MapPin, Building2, Crown, Zap, Map, Navigation, MessageCircle, QrCode, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import GlassmorphicCard from '../components/GlassmorphicCard';
import NeuomorphicButton from '../components/NeuomorphicButton';
import FloatingActionButton from '../components/FloatingActionButton';
import Chat from '../components/Chat';
import QRGenerator from '../components/QRGenerator';
import CameraCapture from '../components/CameraCapture';
import { cameraService, PhotoResult } from '../services/camera';

const Home = () => {
  const { currentLoop, currentUser, subscriptionLimits, loopsLoading } = useApp();
  const [showChat, setShowChat] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

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
          <Link to="/join">
            <NeuomorphicButton variant="primary" size="lg">
              <div className="flex items-center space-x-3">
                <Plus className="w-6 h-6" />
                <span>Create Your First Loop</span>
              </div>
            </NeuomorphicButton>
          </Link>
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

  const handlePhotoTaken = (photo: PhotoResult) => {
    console.log('Photo taken:', photo);
    setShowCamera(false);
  };

  const LoopIcon = getLoopIcon(currentLoop.type);

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* FIXED: Proper 12-column grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content - 8 columns */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Welcome Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-gradient-primary mb-3">
                Welcome back, {currentUser.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-600 text-lg">Here's what's happening in your {currentLoop.type} loop</p>
            </div>

            {/* Hero Loop Card */}
            <GlassmorphicCard 
              className={`p-8 bg-gradient-to-br ${getLoopGradient(currentLoop.type)} text-white relative overflow-hidden`}
              variant="primary"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-20 translate-x-20"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-16 -translate-x-16"></div>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-elegant">
                      <LoopIcon className="w-8 h-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold">{currentLoop.name}</h2>
                      <p className="text-white/80 capitalize text-lg">{currentLoop.type} Loop</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {currentLoop.subscriptionTier !== 'free' && (
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-5 py-2">
                        <Crown className="w-5 h-5" />
                        <span className="text-sm font-medium capitalize">{currentLoop.subscriptionTier}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <p className="text-4xl font-bold mb-1">{currentLoop.members.length}</p>
                    <p className="text-sm text-white/80 font-medium">Members</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold mb-1">{currentLoop.items.length}</p>
                    <p className="text-sm text-white/80 font-medium">Items</p>
                  </div>
                  <div className="text-center">
                    <p className="text-4xl font-bold mb-1">{currentLoop.events.length}</p>
                    <p className="text-sm text-white/80 font-medium">Events</p>
                  </div>
                </div>
              </div>
            </GlassmorphicCard>
          </div>

          {/* Quick Actions Grid - 4 columns */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <NeuomorphicButton
                onClick={() => setShowChat(true)}
                variant="secondary"
                className="flex flex-col items-center space-y-3 p-6 h-auto"
              >
                <MessageCircle className="w-7 h-7 text-indigo-600" />
                <span className="text-sm font-medium">Chat</span>
              </NeuomorphicButton>

              {currentLoop.type === 'organization' && (
                <NeuomorphicButton
                  onClick={() => setShowQR(true)}
                  variant="secondary"
                  className="flex flex-col items-center space-y-3 p-6 h-auto"
                >
                  <QrCode className="w-7 h-7 text-purple-600" />
                  <span className="text-sm font-medium">QR Code</span>
                </NeuomorphicButton>
              )}

              <NeuomorphicButton
                onClick={() => setShowCamera(true)}
                variant="secondary"
                className="flex flex-col items-center space-y-3 p-6 h-auto"
              >
                <Camera className="w-7 h-7 text-emerald-600" />
                <span className="text-sm font-medium">Camera</span>
              </NeuomorphicButton>

              {currentLoop.type === 'neighborhood' && (
                <Link to="/app/map">
                  <NeuomorphicButton
                    variant="secondary"
                    className="w-full flex flex-col items-center space-y-3 p-6 h-auto"
                  >
                    <Map className="w-7 h-7 text-cyan-600" />
                    <span className="text-sm font-medium">Map</span>
                  </NeuomorphicButton>
                </Link>
              )}
            </div>
          </div>

          {/* Recent Items */}
          {recentItems.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Recently Shared</h2>
                <Link to="/app/share" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors">
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {recentItems.map((item) => (
                  <ItemCard key={item.id} item={item} compact />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-6">
            {currentLoop.settings.allowItemSharing && (
              <Link to="/app/create-item">
                <NeuomorphicButton variant="primary" className="w-full py-6">
                  <div className="flex items-center justify-center space-x-3">
                    <Plus className="w-6 h-6" />
                    <span className="text-lg">Share Item</span>
                  </div>
                </NeuomorphicButton>
              </Link>
            )}
            {currentLoop.settings.allowEvents && (
              <Link to="/app/create-event">
                <NeuomorphicButton variant="accent" className="w-full py-6">
                  <div className="flex items-center justify-center space-x-3">
                    <Calendar className="w-6 h-6" />
                    <span className="text-lg">Plan Event</span>
                  </div>
                </NeuomorphicButton>
              </Link>
            )}
          </div>
        </div>

        {/* Sidebar - 4 columns */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Quick Stats */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Loop Stats</h2>
            <div className="space-y-4">
              <GlassmorphicCard className="p-6" hover={false}>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-elegant">
                    <TrendingUp className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{availableItems}</p>
                    <p className="text-sm text-gray-600 font-medium">Available Items</p>
                  </div>
                </div>
              </GlassmorphicCard>

              <GlassmorphicCard className="p-6" hover={false}>
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-elegant">
                    <Calendar className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{upcomingEvents.length}</p>
                    <p className="text-sm text-gray-600 font-medium">Upcoming Events</p>
                  </div>
                </div>
              </GlassmorphicCard>
            </div>
          </div>

          {/* Map Access for Neighborhood Loops */}
          {currentLoop.type === 'neighborhood' && (
            <GlassmorphicCard className="p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-elegant">
                    <Map className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">Neighborhood Map</h3>
                    <p className="text-sm text-gray-600">See members, items, and events near you</p>
                  </div>
                </div>
                <Link to="/app/map">
                  <NeuomorphicButton variant="accent" className="w-full">
                    <div className="flex items-center justify-center space-x-2">
                      <Navigation className="w-5 h-5" />
                      <span>Explore Map</span>
                    </div>
                  </NeuomorphicButton>
                </Link>
              </div>
            </GlassmorphicCard>
          )}

          {/* Subscription Limits Warning */}
          {currentLoop.subscriptionTier === 'free' && (
            <GlassmorphicCard className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
              <div className="flex items-start space-x-4">
                <Zap className="w-6 h-6 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900">Free Plan Limits</h3>
                  <p className="text-sm text-amber-700 mt-1">
                    {currentLoop.members.length}/{subscriptionLimits.maxMembers} members • 
                    {currentLoop.events.length}/{subscriptionLimits.maxEvents} events this month
                  </p>
                  <Link to="/upgrade" className="text-sm text-amber-800 font-medium hover:text-amber-900 transition-colors">
                    Upgrade to Pro →
                  </Link>
                </div>
              </div>
            </GlassmorphicCard>
          )}

          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                <Link to="/app/events" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <GlassmorphicCard key={event.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                        <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                        <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                          <span>{event.date}</span>
                          <span>{event.time}</span>
                          <span>{event.attendees?.length || 0} attending</span>
                        </div>
                      </div>
                      <div className="text-3xl">📅</div>
                    </div>
                  </GlassmorphicCard>
                ))}
              </div>
            </div>
          )}

          {/* Loop Activity */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <div className="space-y-4">
              <GlassmorphicCard className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">👨‍💻</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">Welcome to {currentLoop.name}!</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Start sharing items and organizing events</p>
                  </div>
                </div>
              </GlassmorphicCard>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => {
          if (currentLoop.settings.allowItemSharing) {
            window.location.href = '/app/create-item';
          } else if (currentLoop.settings.allowEvents) {
            window.location.href = '/app/create-event';
          }
        }}
        gradient={getLoopGradient(currentLoop.type)}
      />

      {/* Chat Component */}
      <Chat 
        isOpen={showChat} 
        onClose={() => setShowChat(false)}
        roomId={currentLoop.id}
      />

      {/* QR Generator */}
      <QRGenerator
        isOpen={showQR}
        onClose={() => setShowQR(false)}
        type="profile"
        data={{
          socialLinks: {},
          website: '',
          address: '',
          phone: ''
        }}
      />

      {/* Camera Capture */}
      <CameraCapture
        isOpen={showCamera}
        onClose={() => setShowCamera(false)}
        onPhotoTaken={handlePhotoTaken}
      />
    </div>
  );
};

export default Home;