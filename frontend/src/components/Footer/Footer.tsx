import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  companyName?: string;
  year?: number;
}

const Footer: React.FC<FooterProps> = ({
  companyName = "BonsaiMarket",
  year = new Date().getFullYear()
}) => {
  return (
    <footer className="bg-gradient-to-br from-green-800 via-emerald-800 to-teal-800 text-white py-8 sm:py-12 lg:py-16 relative overflow-hidden">
      {/* Background Nature Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-4 sm:left-10 text-4xl sm:text-6xl text-green-300 transform rotate-12">🍃</div>
        <div className="absolute top-20 right-4 sm:right-20 text-3xl sm:text-4xl text-emerald-300 transform -rotate-12">🌿</div>
        <div className="absolute bottom-20 left-4 sm:left-20 text-4xl sm:text-5xl text-teal-300 transform rotate-45">🌱</div>
        <div className="absolute bottom-10 right-4 sm:right-10 text-2xl sm:text-3xl text-green-300 transform -rotate-30">🍀</div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-2 rounded-full shadow-lg">
                <span className="text-xl sm:text-2xl">🌳</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                {companyName}
              </h3>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Your trusted source for authentic bonsai trees, tools, and accessories. 
              Cultivating beauty and tranquility for over 20 years.
            </p>
          </div>
          
          {/* Shop Links */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-green-200 flex items-center gap-2">
              🛍️ Shop
            </h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-2 sm:gap-3">
              <li><Link to="/search" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">🔍 Search Products</Link></li>
              <li><Link to="/cart" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">🛒 Shopping Cart</Link></li>
              <li><Link to="/wishlist" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">❤️ Wishlist</Link></li>
              <li><Link to="/orders" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">📦 Order History</Link></li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-green-200 flex items-center gap-2">
              🆘 Support
            </h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-2 sm:gap-3">
              <li><Link to="/about" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">ℹ️ About Us</Link></li>
              <li><Link to="/contact" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">📞 Contact Us</Link></li>
              <li><Link to="/terms" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">📋 Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">🔒 Privacy Policy</Link></li>
            </ul>
          </div>
          
          {/* Connect */}
          <div className="flex flex-col gap-3 sm:gap-4">
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-green-200 flex items-center gap-2">
              🌐 Connect
            </h4>
            <div className="flex gap-2 sm:gap-3">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-700 to-emerald-700 rounded-xl flex items-center justify-center text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-110 shadow-lg">
                📘
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-700 to-emerald-700 rounded-xl flex items-center justify-center text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-110 shadow-lg">
                🐦
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-700 to-emerald-700 rounded-xl flex items-center justify-center text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-110 shadow-lg">
                📷
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-green-700 pt-6 sm:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-green-100 text-sm text-center sm:text-left">
              © {year} {companyName}. All rights reserved. 🌱
            </p>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap justify-center">
              <Link to="/terms" className="text-green-100 no-underline text-sm transition-colors duration-300 hover:text-green-200">Terms of Service</Link>
              <span className="text-green-200 font-semibold">•</span>
              <Link to="/privacy" className="text-green-100 no-underline text-sm transition-colors duration-300 hover:text-green-200">Privacy Policy</Link>
              <span className="text-green-200 font-semibold">•</span>
              <Link to="/contact" className="text-green-100 no-underline text-sm transition-colors duration-300 hover:text-green-200">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 