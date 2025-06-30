import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ItemCard from '../components/ItemCard';
import GlassmorphicCard from '../components/GlassmorphicCard';
import NeuomorphicButton from '../components/NeuomorphicButton';
import FloatingActionButton from '../components/FloatingActionButton';
import { BentoGrid, BentoItem } from '../components/ui/BentoGrid';

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
    <div className="px-6 py-8 space-y-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            Community Items
          </h1>
          <p className="text-gray-600 text-lg">{filteredItems.length} items available in your loop</p>
        </div>
      </div>

      {/* Search */}
      <GlassmorphicCard className="p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/50 backdrop-blur-sm border border-white/20 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-lg transition-all duration-300"
          />
        </div>
      </GlassmorphicCard>

      {/* Filters */}
      <div className="space-y-6">
        {/* Category Filter */}
        <GlassmorphicCard className="p-6">
          <p className="text-sm font-semibold text-gray-900 mb-4">Category</p>
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-3 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-elegant scale-105'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70 hover:scale-105 shadow-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </GlassmorphicCard>

        {/* Status Filter */}
        <GlassmorphicCard className="p-6">
          <p className="text-sm font-semibold text-gray-900 mb-4">Status</p>
          <div className="flex space-x-3">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-5 py-3 rounded-2xl text-sm font-medium capitalize transition-all duration-300 ${
                  selectedStatus === status
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-elegant scale-105'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70 hover:scale-105 shadow-sm'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </GlassmorphicCard>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-20">
          <div className="text-8xl mb-8">📦</div>
          <h3 className="text-3xl font-bold text-gray-900 mb-4">No items found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg leading-relaxed">
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