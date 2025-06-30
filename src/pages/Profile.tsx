import React from 'react';
import { Settings, Award, TrendingUp, Calendar, Package, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassmorphicCard from '../components/GlassmorphicCard';
import NeuomorphicButton from '../components/NeuomorphicButton';
import ProgressRing from '../components/ui/ProgressRing';
import StatusIndicator from '../components/ui/StatusIndicator';

const Profile = () => {
  const { currentUser, currentLoop } = useApp();

  if (!currentUser || !currentLoop) {
    return <div>Loading...</div>;
  }

  const userItems = currentLoop.items.filter(item => item.owner === currentUser.id);
  const userEvents = currentLoop.events.filter(event => event.organizer === currentUser.id);
  const borrowedItems = currentLoop.items.filter(item => item.borrower === currentUser.id);

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 90) return { level: 'Excellent', color: 'success', gradient: 'from-emerald-500 to-green-500' };
    if (reputation >= 75) return { level: 'Good', color: 'info', gradient: 'from-blue-500 to-cyan-500' };
    if (reputation >= 50) return { level: 'Fair', color: 'warning', gradient: 'from-amber-500 to-orange-500' };
    return { level: 'New', color: 'error', gradient: 'from-gray-500 to-gray-600' };
  };

  const reputationInfo = getReputationLevel(currentUser.reputation);

  return (
    <div className="px-6 py-8 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Profile Header */}
      <GlassmorphicCard className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-3xl flex items-center justify-center text-4xl shadow-elegant">
              {currentUser.avatar}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentUser.name}</h1>
              <p className="text-gray-600 capitalize font-medium text-lg">{currentUser.role} • {currentLoop.name}</p>
              <p className="text-sm text-gray-500 mt-1">{currentUser.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <StatusIndicator status="online" size="sm" showLabel />
              </div>
            </div>
          </div>
          <NeuomorphicButton variant="secondary" size="sm">
            <Settings className="w-4 h-4" />
          </NeuomorphicButton>
        </div>

        {/* Reputation */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-900">Reputation Score</span>
            <div className="flex items-center space-x-4">
              <ProgressRing 
                progress={currentUser.reputation} 
                size="md" 
                color={reputationInfo.color as any}
                showLabel 
              />
              <div className={`px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r ${reputationInfo.gradient} text-white shadow-elegant`}>
                {reputationInfo.level}
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
            <div 
              className={`bg-gradient-to-r ${reputationInfo.gradient} h-4 rounded-full transition-all duration-500 shadow-inner`}
              style={{ width: `${currentUser.reputation}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>0</span>
            <span className="font-bold text-gray-900">{currentUser.reputation}/100</span>
            <span>100</span>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Badges */}
      {currentUser.badges.length > 0 && (
        <GlassmorphicCard className="p-6">
          <h2 className="font-bold text-gray-900 mb-6 flex items-center space-x-3 text-xl">
            <Award className="w-6 h-6 text-amber-500" />
            <span>Achievement Badges</span>
          </h2>
          <div className="flex flex-wrap gap-4">
            {currentUser.badges.map((badge, index) => (
              <div key={index} className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-5 py-3 rounded-2xl text-sm font-semibold flex items-center space-x-2 shadow-elegant hover:scale-105 transition-transform">
                <Star className="w-4 h-4" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </GlassmorphicCard>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <GlassmorphicCard className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-elegant">
            <Package className="w-8 h-8 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{userItems.length}</p>
          <p className="text-sm text-gray-600 font-medium">Items Shared</p>
        </GlassmorphicCard>

        <GlassmorphicCard className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-elegant">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{userEvents.length}</p>
          <p className="text-sm text-gray-600 font-medium">Events Organized</p>
        </GlassmorphicCard>

        <GlassmorphicCard className="p-6 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-elegant">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{borrowedItems.length}</p>
          <p className="text-sm text-gray-600 font-medium">Items Borrowed</p>
        </GlassmorphicCard>
      </div>

      {/* My Items */}
      {userItems.length > 0 && (
        <GlassmorphicCard className="p-6">
          <h2 className="font-bold text-gray-900 mb-6 text-xl">My Shared Items</h2>
          <div className="space-y-4">
            {userItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/50 rounded-2xl hover:bg-white/70 transition-all duration-200">
                <div className="text-3xl">{item.image}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 capitalize">{item.status}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === 'available' ? 'bg-emerald-100 text-emerald-800' :
                  item.status === 'borrowed' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {item.status}
                </div>
              </div>
            ))}
            {userItems.length > 3 && (
              <p className="text-sm text-gray-500 text-center pt-2 font-medium">
                +{userItems.length - 3} more items
              </p>
            )}
          </div>
        </GlassmorphicCard>
      )}

      {/* Currently Borrowed */}
      {borrowedItems.length > 0 && (
        <GlassmorphicCard className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
          <h2 className="font-bold text-amber-900 mb-6 text-xl">Currently Borrowed</h2>
          <div className="space-y-4">
            {borrowedItems.map((item) => {
              const owner = currentLoop.members.find(m => m.id === item.owner);
              return (
                <div key={item.id} className="flex items-center space-x-4 p-4 bg-white/70 rounded-2xl">
                  <div className="text-3xl">{item.image}</div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-600">
                      From {owner?.name} • Due {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassmorphicCard>
      )}

      {/* Community Info */}
      <GlassmorphicCard className="p-6">
        <h2 className="font-bold text-gray-900 mb-6 text-xl">Loop Information</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
            <span className="text-gray-600 font-medium">Loop Name</span>
            <span className="font-semibold text-gray-900">{currentLoop.name}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
            <span className="text-gray-600 font-medium">Members</span>
            <span className="font-semibold text-gray-900">{currentLoop.members.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
            <span className="text-gray-600 font-medium">Total Items</span>
            <span className="font-semibold text-gray-900">{currentLoop.items.length}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
            <span className="text-gray-600 font-medium">Loop Code</span>
            <span className="font-mono text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl font-semibold">{currentLoop.code}</span>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default Profile;