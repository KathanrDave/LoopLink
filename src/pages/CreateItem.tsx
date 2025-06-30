import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

const CreateItem = () => {
  const navigate = useNavigate();
  const { addItem, currentUser } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',
    image: '📦'
  });

  const categories = ['Tools', 'Books', 'Games', 'Kitchen', 'Electronics', 'Other'];
  const categoryEmojis: { [key: string]: string } = {
    'Tools': '🔧',
    'Books': '📚',
    'Games': '🎲',
    'Kitchen': '🍽️',
    'Electronics': '📱',
    'Other': '📦'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    addItem({
      ...formData,
      status: 'available',
      owner_id: currentUser.id,
      image: categoryEmojis[formData.category] || '📦'
    });

    navigate('/app/share');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="px-4 py-6 bg-white border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Link to="/app/share" className="p-2 -ml-2 text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">Share New Item</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Item Photo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            <div className="text-4xl mb-2">{categoryEmojis[formData.category] || '📦'}</div>
            <button
              type="button"
              className="flex items-center space-x-2 mx-auto text-blue-600 hover:text-blue-700"
            >
              <Camera className="w-4 h-4" />
              <span className="text-sm">Add Photo</span>
            </button>
            <p className="text-xs text-gray-500 mt-2">
              Photo upload coming soon! For now, we'll use category icons.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Item Name *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Power Drill, JavaScript Book"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the item, its condition, and any special instructions..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {categoryEmojis[category]} {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <h3 className="font-semibold text-blue-900 mb-2">Sharing Guidelines</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Only share items you own and are comfortable lending</li>
            <li>• Be honest about the item's condition</li>
            <li>• Set clear expectations for care and return</li>
            <li>• Items will be tracked with QR codes for easy pickup/return</li>
          </ul>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Share Item</span>
        </button>
      </form>
    </div>
  );
};

export default CreateItem;