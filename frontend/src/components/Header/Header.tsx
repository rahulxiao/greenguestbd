import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, ShoppingCart, Heart, Wifi, User, LogOut, Package, Settings, ChevronDown } from 'lucide-react';
import ConnectionTestService from '../../services/connection-test';
import { authService } from '../../services/auth.service';

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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsUserMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if API call fails
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsUserMenuOpen(false);
      navigate('/');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
    } else {
      navigate('/search');
      setIsSearchExpanded(false);
    }
  };

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
    } else {
      navigate('/search');
      setIsSearchExpanded(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const closeUserMenu = () => {
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-green-50 to-emerald-50 shadow-lg sticky top-0 z-50 border-b border-green-200">
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-full shadow-lg">
              <span className="text-xl sm:text-2xl">🌳</span>
            </div>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-800 bg-clip-text text-transparent">
              {title}
            </h1>
          </Link>
          
          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bonsai trees, tools, and accessories..."
                className="w-full px-4 py-3 pl-12 pr-12 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 bg-white/80 backdrop-blur-sm shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg transition-colors duration-300 text-sm"
                onClick={handleSearchClick}
              >
                Search
              </button>
            </form>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Connection Test Button (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <button
                onClick={async () => {
                  console.log('🔍 Testing backend connection...');
                  await ConnectionTestService.runFullConnectionTest();
                }}
                className="hidden lg:flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors duration-300 text-sm"
                title="Test Backend Connection"
              >
                <Wifi className="h-4 w-4" />
                Test API
              </button>
            )}
            
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-6">
              <Link to="/about" className="text-green-700 hover:text-green-800 transition-colors font-medium hover:scale-105">
                About
              </Link>
              <Link to="/contact" className="text-green-700 hover:text-green-800 transition-colors font-medium hover:scale-105">
                Contact
              </Link>
            </div>
            
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              className="md:hidden p-2 text-green-700 hover:text-green-800 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* User Authentication Section */}
            {!loading && (
              <>
                {user ? (
                  // User is logged in - show user menu
                  <div className="relative">
                    <button
                      onClick={toggleUserMenu}
                      className="hidden sm:flex items-center gap-2 text-green-700 hover:text-green-800 transition-colors font-medium hover:scale-105 bg-green-100 px-3 py-2 rounded-lg"
                    >
                      <User className="h-4 w-4" />
                      <span className="max-w-24 truncate">
                        {user.firstName ? `${user.firstName} ${user.lastName}` : user.name || 'User'}
                      </span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* User Dropdown Menu */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-green-200 py-2 z-50">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-green-700 hover:bg-green-50 transition-colors"
                          onClick={closeUserMenu}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center gap-3 px-4 py-2 text-green-700 hover:bg-green-50 transition-colors"
                          onClick={closeUserMenu}
                        >
                          <Package className="h-4 w-4" />
                          Orders
                        </Link>
                        <Link
                          to="/wishlist"
                          className="flex items-center gap-3 px-4 py-2 text-green-700 hover:bg-green-50 transition-colors"
                          onClick={closeUserMenu}
                        >
                          <Heart className="h-4 w-4" />
                          Wishlist
                        </Link>
                        <hr className="my-2 border-green-200" />
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  // User is not logged in - show sign in button
                  <Link to="/login" className="hidden sm:block text-green-700 hover:text-green-800 transition-colors font-medium hover:scale-105">
                    Sign In
                  </Link>
                )}
              </>
            )}
            
            <Link to="/wishlist" className="relative text-green-700 hover:text-green-800 transition-colors">
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-2 rounded-full shadow-sm">
                <Heart className="h-4 w-4" />
              </div>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                2
              </span>
            </Link>
            
            <Link to="/cart" className="relative text-green-700 hover:text-green-800 transition-colors">
              <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-2 rounded-full shadow-sm">
                <ShoppingCart className="h-4 w-4" />
              </div>
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                3
              </span>
            </Link>
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden flex flex-col bg-transparent border-none cursor-pointer p-2 gap-1" 
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-green-600" />
              ) : (
                <Menu className="h-6 w-6 text-green-600" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Search Bar */}
      {isSearchExpanded && (
        <div className="md:hidden border-t border-green-200 bg-white px-4 py-3">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bonsai trees, tools, and accessories..."
              className="w-full px-4 py-3 pl-12 pr-20 border-2 border-green-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400 bg-white shadow-sm"
              autoFocus
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-500" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-lg transition-colors duration-300 text-sm"
              onClick={handleSearchClick}
            >
              Search
            </button>
          </form>
        </div>
      )}
      
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-green-200 bg-white shadow-lg">
          <div className="px-4 py-3 space-y-3">
            <Link 
              to="/about" 
              className="block text-green-700 hover:text-green-800 transition-colors font-medium py-2"
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="block text-green-700 hover:text-green-800 transition-colors font-medium py-2"
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
            {user ? (
              <>
                <Link 
                  to="/profile" 
                  className="block text-green-700 hover:text-green-800 transition-colors font-medium py-2"
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
                <Link 
                  to="/orders" 
                  className="block text-green-700 hover:text-green-800 transition-colors font-medium py-2"
                  onClick={closeMobileMenu}
                >
                  Orders
                </Link>
                <button 
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="block text-red-600 hover:text-red-700 transition-colors font-medium py-2 w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="block text-green-700 hover:text-green-800 transition-colors font-medium py-2"
                onClick={closeMobileMenu}
              >
                Sign In
              </Link>
            )}
            <Link 
              to="/search" 
              className="block text-green-700 hover:text-green-800 transition-colors font-medium py-2"
              onClick={closeMobileMenu}
            >
              Search All
            </Link>
          </div>
        </div>
      )}
      
      {/* Category Navigation */}
      {showCategories && (
        <div className="border-t border-green-200 bg-gradient-to-r from-green-100/50 to-emerald-100/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Categories */}
            <nav className="hidden md:flex items-center justify-center py-4">
              <ul className="flex list-none m-0 p-0 gap-4 lg:gap-8 flex-wrap justify-center">
                <li><a href="#trees" className="text-green-700 no-underline font-medium transition-all duration-300 hover:text-green-800 hover:scale-105 flex items-center gap-1">🌳 Trees</a></li>
                <li><a href="#tools" className="text-green-700 no-underline font-medium transition-all duration-300 hover:text-green-800 hover:scale-105 flex items-center gap-1">🔧 Tools</a></li>
                <li><a href="#pots" className="text-green-700 no-underline font-medium transition-all duration-300 hover:text-green-800 hover:scale-105 flex items-center gap-1">🏺 Pots</a></li>
                <li><a href="#accessories" className="text-green-700 no-underline font-medium transition-all duration-300 hover:text-green-800 hover:scale-105 flex items-center gap-1">✨ Accessories</a></li>
                <li><Link to="/search" className="text-green-700 no-underline font-medium transition-all duration-300 hover:text-green-800 hover:scale-105 flex items-center gap-1">🔍 Search All</Link></li>
                <li><Link to="/orders" className="text-green-700 no-underline font-medium transition-all duration-300 hover:text-green-800 hover:scale-105 flex items-center gap-1">📦 Orders</Link></li>
              </ul>
            </nav>
            
            {/* Mobile Categories */}
            <div className="md:hidden py-3 overflow-x-auto">
              <div className="flex space-x-4 px-2 min-w-max">
                <a href="#trees" className="text-green-700 no-underline font-medium text-sm whitespace-nowrap">🌳 Trees</a>
                <a href="#tools" className="text-green-700 no-underline font-medium text-sm whitespace-nowrap">🔧 Tools</a>
                <a href="#pots" className="text-green-700 no-underline font-medium text-sm whitespace-nowrap">🏺 Pots</a>
                <a href="#accessories" className="text-green-700 no-underline font-medium text-sm whitespace-nowrap">✨ Accessories</a>
                <Link to="/search" className="text-green-700 no-underline font-medium text-sm whitespace-nowrap">🔍 Search</Link>
                <Link to="/orders" className="text-green-700 no-underline font-medium text-sm whitespace-nowrap">📦 Orders</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={closeUserMenu}
        />
      )}
    </header>
  );
};

export default Header; 