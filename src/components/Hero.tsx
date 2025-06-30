import React from 'react';
import { Search, ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="pt-20 pb-12 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                UNLEASH INSPIRATION<br />
                <span className="text-purple-600">LIVE STYLISHLY</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
                Mooda is a planning app for modern home decoration. With our unique ML-powered design platform, you can create beautiful spaces that reflect your personal style.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                placeholder="SEARCH FOR INSPIRATION"
              />
              <button className="absolute right-1 top-1 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-start space-x-4">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 bg-pink-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-blue-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-green-400 rounded-full border-2 border-white"></div>
                <div className="w-8 h-8 bg-yellow-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="text-sm text-gray-600 max-w-xs">
                <p className="font-medium">"Mooda is so convenient. I can become inspiration for my room, and can organize them at all in one place!"</p>
                <p className="text-gray-500 mt-1">- Kana, Austin, England</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Modern interior design"
                className="w-full h-80 object-cover"
              />
              
              {/* Window Controls */}
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>

            {/* Floating notification */}
            <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-lg max-w-xs">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-400 rounded-full"></div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">We are waiting for you.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;