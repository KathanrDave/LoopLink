import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Package, Calendar, Filter, Search } from 'lucide-react';
import { useApp } from '../context/AppContext';
import MapView from '../components/MapView';

const NeighborhoodMap = () => {
  const { currentLoop } = useApp();
  const [activeFilter, setActiveFilter] = useState<'all' | 'members' | 'items' | 'events'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!currentLoop || currentLoop.type !== 'neighborhood') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Map Not Available</h2>
          <p className="text-gray-600">Maps are only available for Neighborhood Loops</p>
          <Link to="/app" className="text-blue-600 hover:text-blue-700 mt-2 inline-block">
            Go Back
          </Link>
        </div>
      </div>
    );
  }

  const filters = [
    { id: 'all', label: 'All', icon: MapPin, count: currentLoop.members.length + currentLoop.items.length + currentLoop.events.length },
    { id: 'members', label: 'Members', icon: Users, count: currentLoop.members.length },
    { id: 'items', label: 'Items', icon: Package, count: currentLoop.items.length },
    { id: 'events', label: 'Events', icon: Calendar, count: currentLoop.events.length }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="px-4 py-6 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Link to="/app" className="p-2 -ml-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Neighborhood Map</h1>
            <p className="text-sm text-gray-600">{currentLoop.name}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-gray-900">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search members, items, or events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
          {filters.map((filter) => {
            const IconComponent = filter.icon;
            const isActive = activeFilter === filter.id;
            
            return (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span>{filter.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
                }`}>
                  {filter.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 p-4">
        <div className="h-[calc(100vh-280px)] min-h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
          <MapView
            center={currentLoop.settings.centerPoint ? 
              [currentLoop.settings.centerPoint.lat, currentLoop.settings.centerPoint.lng] : 
              [40.7128, -74.0060]
            }
            zoom={14}
            showMembers={activeFilter === 'all' || activeFilter === 'members'}
            showItems={activeFilter === 'all' || activeFilter === 'items'}
            showEvents={activeFilter === 'all' || activeFilter === 'events'}
            interactive={true}
          />
        </div>
      </div>

      {/* Bottom Info Panel */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{currentLoop.settings.radius}km</p>
            <p className="text-xs text-gray-600">Radius</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-blue-600">{currentLoop.members.length}</p>
            <p className="text-xs text-gray-600">Members</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-purple-600">{currentLoop.items.filter(i => i.status === 'available').length}</p>
            <p className="text-xs text-gray-600">Available</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodMap;