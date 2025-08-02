import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
  showCategories?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "BonsaiMarket", 
  onMenuClick,
  showCategories = true
}) => {
  return (
    <header className="bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg sticky top-0 z-50 border-b border-green-200">
      {/* Main Navigation */}
      <div className="max-w-6xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-full shadow-lg">
              <span className="text-2xl">🌳</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-800 bg-clip-text text-transparent">
              {title}
            </h1>
          </Link>
          
          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search bonsai trees, tools, and accessories..."
                className="w-full px-4 py-3 pl-12 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 bg-white/80 backdrop-blur-sm shadow-sm"
              />
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-500">
                🔍
              </span>
            </div>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-green-700 hover:text-green-800 transition-colors font-medium hover:scale-105">
              Sign In
            </Link>
            <button className="relative text-green-700 hover:text-green-800 transition-colors">
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-2 rounded-full shadow-sm">
                🛒
              </div>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                3
              </span>
            </button>
            {onMenuClick && (
              <button className="md:hidden flex flex-col bg-transparent border-none cursor-pointer p-2 gap-1" onClick={onMenuClick}>
                <span className="w-6 h-0.5 bg-green-600 rounded transition-all duration-300"></span>
                <span className="w-6 h-0.5 bg-green-600 rounded transition-all duration-300"></span>
                <span className="w-6 h-0.5 bg-green-600 rounded transition-all duration-300"></span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Category Navigation */}
      {showCategories && (
        <div className="border-t border-green-200 bg-gradient-to-r from-green-100/50 to-emerald-100/50">
          <div className="max-w-6xl mx-auto px-8">
            <nav className="hidden md:flex items-center justify-center py-4">
              <ul className="flex list-none m-0 p-0 gap-8">
                <li><a href="#trees" className="text-green-700 no-underline font-medium transition-all duration-300 hover:text-green-800 hover:scale-105 flex items-center gap-1">🌳 Trees</a></li>
                <li><a href="#tools" className="text-green-700 no-underline font-medium transition-all duration-300 hover:text-green-800 hover:scale-105 flex items-center gap-1">🔧 Tools</a></li>
                <li><a href="#pots" className="text-green-700 no-underline font-medium transition-all duration-300 hover:text-green-800 hover:scale-105 flex items-center gap-1">🏺 Pots</a></li>
                <li><a href="#accessories" className="text-green-700 no-underline font-medium transition-all duration-300 hover:text-green-800 hover:scale-105 flex items-center gap-1">✨ Accessories</a></li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 