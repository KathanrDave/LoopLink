import React from 'react';
import { Settings, Award, TrendingUp, Calendar, Package, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import GlassmorphicCard from '../components/GlassmorphicCard';
import NeuomorphicButton from '../components/NeuomorphicButton';

const Profile = () => {
  const { currentUser, currentLoop } = useApp();

  if (!currentUser || !currentLoop) {
    return <div>Loading...</div>;
  }

  const userItems = currentLoop.items.filter(item => item.owner === currentUser.id);
  const userEvents = currentLoop.events.filter(event => event.organizer === currentUser.id);
  const borrowedItems = currentLoop.items.filter(item => item.borrower === currentUser.id);

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 90) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100', gradient: 'from-green-500 to-emerald-500' };
    if (reputation >= 75) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100', gradient: 'from-blue-500 to-cyan-500' };
    if (reputation >= 50) return { level: 'Fair', color: 'text-amber-600', bg: 'bg-amber-100', gradient: 'from-amber-500 to-orange-500' };
    return { level: 'New', color: 'text-gray-600', bg: 'bg-gray-100', gradient: 'from-gray-500 to-gray-600' };
  };

  const reputationInfo = getReputationLevel(currentUser.reputation);

  return (
    <div className="px-4 py-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Profile Header */}
      <GlassmorphicCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-2xl">
              {currentUser.avatar}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
              <p className="text-gray-600 capitalize font-medium">{currentUser.role} • {currentLoop.name}</p>
              <p className="text-sm text-gray-500">{currentUser.email}</p>
            </div>
          </div>
          <NeuomorphicButton variant="secondary" size="sm">
            <Settings className="w-4 h-4" />
          </NeuomorphicButton>
        </div>

        {/* Reputation */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-gray-900">Reputation Score</span>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${reputationInfo.gradient} text-white shadow-lg`}>
              {reputationInfo.level}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className={`bg-gradient-to-r ${reputationInfo.gradient} h-3 rounded-full transition-all duration-500 shadow-inner`}
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
        <GlassmorphicCard className="p-4">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span>Achievement Badges</span>
          </h2>
          <div className="flex flex-wrap gap-3">
            {currentUser.badges.map((badge, index) => (
              <div key={index} className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2 shadow-lg hover:scale-105 transition-transform">
                <Star className="w-4 h-4" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </GlassmorphicCard>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <GlassmorphicCard className="p-4 text-center hover:scale-105 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{userItems.length}</p>
          <p className="text-xs text-gray-600 font-medium">Items Shared</p>
        </GlassmorphicCard>

        <GlassmorphicCard className="p-4 text-center hover:scale-105 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{userEvents.length}</p>
          <p className="text-xs text-gray-600 font-medium">Events Organized</p>
        </GlassmorphicCard>

        <GlassmorphicCard className="p-4 text-center hover:scale-105 transition-all duration-300">
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{borrowedItems.length}</p>
          <p className="text-xs text-gray-600 font-medium">Items Borrowed</p>
        </GlassmorphicCard>
      </div>

      {/* My Items */}
      {userItems.length > 0 && (
        <GlassmorphicCard className="p-4">
          <h2 className="font-bold text-gray-900 mb-4">My Shared Items</h2>
          <div className="space-y-3">
            {userItems.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-all duration-200">
                <div className="text-2xl">{item.image}</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-600 capitalize">{item.status}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'available' ? 'bg-green-100 text-green-800' :
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
        <GlassmorphicCard className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200">
          <h2 className="font-bold text-amber-900 mb-4">Currently Borrowed</h2>
          <div className="space-y-3">
            {borrowedItems.map((item) => {
              const owner = currentLoop.members.find(m => m.id === item.owner);
              return (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-white/70 rounded-xl">
                  <div className="text-2xl">{item.image}</div>
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
      <GlassmorphicCard className="p-4">
        <h2 className="font-bold text-gray-900 mb-4">Loop Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2">
            <span className="text-gray-600">Loop Name</span>
            <span className="font-semibold text-gray-900">{currentLoop.name}</span>
          </div>
          <div className="flex justify-between items-center p-2">
            <span className="text-gray-600">Members</span>
            <span className="font-semibold text-gray-900">{currentLoop.members.length}</span>
          </div>
          <div className="flex justify-between items-center p-2">
            <span className="text-gray-600">Total Items</span>
            <span className="font-semibold text-gray-900">{currentLoop.items.length}</span>
          </div>
          <div className="flex justify-between items-center p-2">
            <span className="text-gray-600">Loop Code</span>
            <span className="font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">{currentLoop.code}</span>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default Profile;