import React from 'react';
import { Search, Heart, Share2 } from 'lucide-react';

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">How it works</h2>
          <div className="w-16 h-0.5 bg-purple-600 mx-auto"></div>
        </div>

        <div className="space-y-16">
          {/* Step 1 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-purple-600">Step 1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Search with any keywords for project inspiration</h3>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors">
                Explore
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <img
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Interior 1"
                className="w-full h-32 object-cover rounded-lg"
              />
              <img
                src="https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Interior 2"
                className="w-full h-32 object-cover rounded-lg"
              />
              <img
                src="https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Interior 3"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:order-2 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-purple-600">Step 2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Save favorites to your personal collection for later</h3>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors">
                Explore
              </button>
            </div>
            <div className="lg:order-1 relative">
              <img
                src="https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Save favorites"
                className="w-full h-64 object-cover rounded-lg"
              />
              <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg">
                <Heart className="w-5 h-5 text-red-500 fill-current" />
              </div>
              <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
                <p className="text-sm font-medium text-gray-900">Saved to favorites</p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <Share2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-purple-600">Step 3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Share your cool creations to inspire others</h3>
              <button className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors">
                Explore
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <img
                src="https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Share creation 1"
                className="w-full h-40 object-cover rounded-lg"
              />
              <img
                src="https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=300"
                alt="Share creation 2"
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;