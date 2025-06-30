import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import GlassmorphicCard from '../components/GlassmorphicCard';
import NeuomorphicButton from '../components/NeuomorphicButton';
import FloatingActionButton from '../components/FloatingActionButton';

const Share = () => {
  const { currentLoop } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  if (!currentLoop) {
    return <div>Loading...</div>;
  }

  const categories = ['All', 'Tools', 'Books', 'Games', 'Kitchen', 'Electronics', 'Other'];
  const statuses = ['All', 'available', 'borrowed', 'maintenance'];

  const filteredItems = currentLoop.items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getLoopGradient = (type: string) => {
    switch (type) {
      case 'friend': return 'from-purple-500 via-pink-500 to-rose-500';
      case 'neighborhood': return 'from-emerald-500 via-teal-500 to-cyan-500';
      case 'organization': return 'from-blue-500 via-indigo-500 to-violet-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="px-4 py-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Community Items 📦
          </h1>
          <p className="text-gray-600 mt-1">{filteredItems.length} items available in your loop</p>
        </div>
      </div>

      {/* Search */}
      <GlassmorphicCard className="p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
          />
        </div>
      </GlassmorphicCard>

      {/* Filters */}
      <div className="space-y-4">
        {/* Category Filter */}
        <GlassmorphicCard className="p-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">Category</p>
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg scale-105'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70 hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </GlassmorphicCard>

        {/* Status Filter */}
        <GlassmorphicCard className="p-4">
          <p className="text-sm font-semibold text-gray-900 mb-3">Status</p>
          <div className="flex space-x-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-200 ${
                  selectedStatus === status
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg scale-105'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70 hover:scale-105'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </GlassmorphicCard>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <div className="text-8xl mb-6">📦</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">No items found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchTerm || selectedCategory !== 'All' || selectedStatus !== 'All' 
              ? 'Try adjusting your search or filters to find what you\'re looking for.'
              : 'Be the first to share an item with your community!'
            }
          </p>
          <Link to="/app/create-item">
            <NeuomorphicButton variant="primary" size="lg">
              <div className="flex items-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Share an Item</span>
              </div>
            </NeuomorphicButton>
          </Link>
        </div>
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        onClick={() => window.location.href = '/app/create-item'}
        icon={<Plus className="w-6 h-6" />}
        gradient={getLoopGradient(currentLoop.type)}
      />
    </div>
  );
};

export default Share;