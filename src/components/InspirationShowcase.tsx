import React from 'react';
import { ArrowRight } from 'lucide-react';

const InspirationShowcase = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Unlimited inspiration</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We make everyone to become a creator on Mooda. Our platform is a gathering place for creative minds where you can find new inspiration or anything from users all around the world.
              </p>
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-white border border-purple-200 rounded-full text-purple-700 text-sm font-medium hover:bg-purple-600 hover:text-white transition-colors">
                Home
              </button>
              <button className="px-4 py-2 bg-white border border-purple-200 rounded-full text-purple-700 text-sm font-medium hover:bg-purple-600 hover:text-white transition-colors">
                Apartment & Condo
              </button>
              <button className="px-4 py-2 bg-white border border-purple-200 rounded-full text-purple-700 text-sm font-medium hover:bg-purple-600 hover:text-white transition-colors">
                Rooms
              </button>
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Interior inspiration 1"
                className="w-full h-32 object-cover rounded-lg"
              />
              <img
                src="https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Interior inspiration 2"
                className="w-full h-24 object-cover rounded-lg"
              />
            </div>
            <div className="pt-6">
              <img
                src="https://images.pexels.com/photos/1571453/pexels-photo-1571453.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Interior inspiration 3"
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Bottom CTA Section */}
        <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Modern living space"
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center justify-between">
              <div className="text-white">
                <h3 className="text-2xl font-bold mb-1">LET'S FIND SOME</h3>
                <p className="text-lg italic">INSPIRATION</p>
              </div>
              <button className="bg-purple-600 text-white px-6 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2">
                <span>Sign up</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InspirationShowcase;