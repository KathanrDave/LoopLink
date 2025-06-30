import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-purple-50 to-blue-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">About us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">Press</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">Contact</a></li>
            </ul>
          </div>

          {/* Community */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Community</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">Discover</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">Success stories</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">Community</a></li>
            </ul>
          </div>

          {/* Help center */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Help center</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">Getting started</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">Suggest a feature</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">Report a bug</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">Terms & Privacy</a></li>
            </ul>
          </div>

          {/* Product */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900 text-sm">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">For home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">For business</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">For developers</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors text-sm">Mooda for teams</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Logo and Copyright */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-xs">M</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">MOODA</span>
              </div>
              <p className="text-gray-600 text-sm">© 2024 Mooda. All rights reserved.</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-3">
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-600 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Made with Visily */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm flex items-center justify-center space-x-1">
              <span>Made with</span>
              <span className="font-semibold text-blue-600">Visily</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;