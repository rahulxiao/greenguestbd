import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, ChevronDown, ChevronUp, Grid, List, ShoppingCart, Heart, Star } from 'lucide-react';
import { Header, Footer, Card, Button } from '../components';
import { productService, Product } from '../services/product.service';
import { cartService } from '../services/cart.service';
import { wishlistService } from '../services/wishlist.service';
import { formatCurrency } from '../utils/price';
import { getProductImage, handleImageError } from '../utils/image';
import { authService } from '../services/auth.service';

// Custom styles for range sliders
const rangeSliderStyles = `
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  input[type="range"]::-ms-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #10b981;
    cursor: pointer;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const productsPerPage = 15;

  const query = searchParams.get('q') || '';

  const [categories, setCategories] = useState<string[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [pendingPriceRange, setPendingPriceRange] = useState([0, 100000]);
  const ratings = [5, 4, 3, 2, 1];

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `৳${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
    }
    return `৳${price}`;
  };

  const addToCart = async (productId: number) => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      alert('Please login to add items to your cart');
      navigate('/login');
      return;
    }

    // Find the product to check stock
    const product = products.find(p => p.id === productId);
    if (!product) {
      alert('Product not found');
      return;
    }

    // Check if product is available and in stock
    if (!product.available) {
      alert('This product is currently out of stock and cannot be added to cart');
      return;
    }

    if (product.stock <= 0) {
      alert('This product is currently out of stock and cannot be added to cart');
      return;
    }

    try {
      await cartService.addToCart({ productId, quantity: 1 });
      // Dispatch event to update header cart count
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      // Show success feedback (you can add a toast notification here)
      console.log('Product added to cart successfully');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to add to cart';
      alert(errorMessage);
    }
  };

  const addToWishlist = async (productId: number) => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      alert('Please login to add items to your wishlist');
      navigate('/login');
      return;
    }

    try {
      await wishlistService.addToWishlist(productId);
      // Dispatch event to update header wishlist count
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      // Show success feedback (you can add a toast notification here)
      console.log('Product added to wishlist successfully');
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      // Show error feedback (you can add a toast notification here)
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const fetchedCategories = await productService.getCategories();
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      // Fallback to some default categories if API fails
      setCategories(['Bonsai Trees', 'Pots & Containers', 'Tools & Equipment', 'Soil & Fertilizers']);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use paginated API instead of fetching all products
      const paginatedResult = await productService.getProductsPaginated({
        page: currentPage,
        limit: productsPerPage,
        category: selectedCategories.length > 0 ? selectedCategories[0] : undefined, // For now, use first category if multiple selected
        search: query.trim() || undefined,
        minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
        maxPrice: priceRange[1] < 100000 ? priceRange[1] : undefined,
        rating: selectedRatings.length > 0 ? Math.max(...selectedRatings) : undefined,
        sortBy: sortBy !== 'relevance' ? sortBy : undefined
      });

      // Update pagination state
      setProducts(paginatedResult.products);
      setTotalPages(paginatedResult.totalPages);
      setTotalProducts(paginatedResult.total);
      setHasNext(paginatedResult.hasNext);
      setHasPrev(paginatedResult.hasPrev);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
      setTotalPages(1);
      setTotalProducts(0);
      setHasNext(false);
      setHasPrev(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [query, sortBy, priceRange, selectedCategories, selectedRatings]);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, query, sortBy, priceRange, selectedCategories, selectedRatings]);

  useEffect(() => {
    // Fetch categories when component mounts
    fetchCategories();
  }, []);

  useEffect(() => {
    // Initialize pending price range when component mounts
    setPendingPriceRange([0, 100000]);
  }, []);

  useEffect(() => {
    // Calculate active filter count
    const categoryCount = selectedCategories.length;
    const ratingCount = selectedRatings.length;
    const priceCount = priceRange[0] > 0 || priceRange[1] < 100000 ? 1 : 0;
    const sortCount = sortBy !== 'relevance' ? 1 : 0;
    
    setActiveFilterCount(categoryCount + ratingCount + priceCount + sortCount);
  }, [selectedCategories, selectedRatings, priceRange, sortBy]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleRatingToggle = (rating: number) => {
    setSelectedRatings(prev => 
      prev.includes(rating) 
        ? prev.filter(r => r !== rating)
        : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRatings([]);
    setPriceRange([0, 100000]);
    setPendingPriceRange([0, 100000]);
    setSortBy('relevance');
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 sm:h-4 sm:w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-3 sm:p-4 lg:p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8">
          <div className="text-center py-8 sm:py-12">
            <div className="text-red-400 mb-4">
              <SearchIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
            <p className="text-gray-600 text-sm sm:text-base mb-4">{error}</p>
            <Button variant="primary" onClick={fetchProducts}>
              Try Again
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{rangeSliderStyles}</style>
      <Header />
      
      {/* Authentication Banner for Unauthenticated Users */}
      {!authService.isAuthenticated() && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span className="text-sm">🔒 Please login to add products to your cart and wishlist</span>
            <button 
              onClick={() => navigate('/login')}
              className="ml-4 bg-white text-blue-600 hover:bg-gray-100 px-3 py-1 rounded text-sm font-medium"
            >
              Login Now
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Search Results
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {products.length} results found for "{query}"
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full bg-white border border-gray-200 rounded-lg p-3 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center">
              <Filter className="h-5 w-5 text-gray-600 mr-2" />
              <span className="font-medium text-gray-800">Filters</span>
              {activeFilterCount > 0 && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            {showFilters ? (
              <ChevronUp className="h-5 w-5 text-gray-600" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 lg:flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                <div className="flex items-center space-x-2">
                  {activeFilterCount > 0 && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {activeFilterCount} active
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-700 text-sm sm:text-base">Categories</h3>
                  <button
                    onClick={fetchCategories}
                    disabled={categoriesLoading}
                    className="text-xs text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Refresh categories"
                  >
                    ↻
                  </button>
                </div>
                <div className="space-y-2">
                  {categoriesLoading ? (
                    // Loading state
                    <div className="animate-pulse space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center">
                          <div className="w-4 h-4 bg-gray-200 rounded"></div>
                          <div className="ml-2 h-4 bg-gray-200 rounded w-24"></div>
                        </div>
                      ))}
                    </div>
                  ) : categories.length === 0 ? (
                    // Empty state
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">No categories available</p>
                    </div>
                  ) : (
                    // Categories list
                    categories.map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category)}
                          onChange={() => handleCategoryToggle(category)}
                          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">{category}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-700 text-sm sm:text-base">Price Range</h3>
                  <button
                    onClick={() => {
                      setPriceRange([0, 100000]);
                      setPendingPriceRange([0, 100000]);
                    }}
                    disabled={priceRange[0] === 0 && priceRange[1] === 100000}
                    className="text-xs text-green-600 hover:text-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Reset price range"
                  >
                    Reset
                  </button>
                </div>
                <div className="space-y-4">
                  {/* Range Slider */}
                  <div className="relative">
                    <div className="h-2 bg-gray-200 rounded-lg">
                      <div 
                        className="h-2 bg-green-500 rounded-lg absolute"
                        style={{
                          left: `${(priceRange[0] / 100000) * 100}%`,
                          right: `${100 - (priceRange[1] / 100000) * 100}%`
                        }}
                      ></div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value <= priceRange[1]) {
                          setPriceRange([value, priceRange[1]]);
                        }
                      }}
                      className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none"
                      style={{
                        top: '-8px',
                        left: '0',
                        right: '0'
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100000"
                      step="1000"
                      value={priceRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value >= priceRange[0]) {
                          setPriceRange([priceRange[0], value]);
                        }
                      }}
                      className="absolute w-full h-2 bg-transparent appearance-none cursor-pointer pointer-events-none"
                      style={{
                        top: '-8px',
                        left: '0',
                        right: '0'
                      }}
                    />
                  </div>
                  
                  {/* Input Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">৳</span>
                        <input
                          type="number"
                          min="0"
                          max={priceRange[1]}
                          value={pendingPriceRange[0]}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0;
                            setPendingPriceRange([value, pendingPriceRange[1]]);
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const value = parseInt(e.currentTarget.value) || 0;
                              if (value <= priceRange[1]) {
                                setPriceRange([value, priceRange[1]]);
                                setPendingPriceRange([value, pendingPriceRange[1]]);
                              }
                            }
                          }}
                          onBlur={() => {
                            setPendingPriceRange([priceRange[0], pendingPriceRange[1]]);
                          }}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="0"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">৳</span>
                        <input
                          type="number"
                          min={priceRange[0]}
                          max="100000"
                          value={pendingPriceRange[1]}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 100000;
                            setPendingPriceRange([Math.min(priceRange[0], value), value]);
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const value = parseInt(e.currentTarget.value) || 100000;
                              setPriceRange([Math.min(priceRange[0], value), value]);
                              setPendingPriceRange([Math.min(priceRange[0], value), value]);
                            }
                          }}
                          onBlur={() => {
                            setPendingPriceRange([priceRange[0], priceRange[1]]);
                          }}
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="100000"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Price Display */}
                  <div className="text-center">
                    <span className="text-sm font-medium text-gray-700">
                      {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                    </span>
                  </div>
                  
                  {/* Quick Price Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[1000, 5000, 10000, 25000, 50000, 100000].map((price) => (
                      <button
                        key={price}
                        onClick={() => {
                          setPriceRange([0, price]);
                          setPendingPriceRange([0, price]);
                        }}
                        className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                          priceRange[1] === price
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        Under {formatPrice(price)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Ratings */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3 text-sm sm:text-base">Rating</h3>
                <div className="space-y-2">
                  {ratings.map(rating => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedRatings.includes(rating)}
                        onChange={() => handleRatingToggle(rating)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <div className="ml-2 flex items-center">
                        {renderStars(rating)}
                        <span className="ml-1 text-sm text-gray-600">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Close Button */}
              <div className="lg:hidden pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowFilters(false)}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 flex-1 sm:flex-none"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">View:</span>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${
                      viewMode === 'grid' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${
                      viewMode === 'list' ? 'bg-green-100 text-green-700' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products */}
            {!loading && products.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  {query ? `No products match "${query}"` : 'Try adjusting your filters or search terms'}
                </p>
                {query && (
                  <button
                    onClick={() => setSearchParams({})}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
            
            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map(product => (
                  <Card key={product.id} className="bg-white hover:shadow-lg transition-all duration-200 cursor-pointer group border border-gray-200 hover:border-green-300">
                    <div 
                      className={viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}
                      onClick={() => navigate(`/product/${product.id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          navigate(`/product/${product.id}`);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label={`View details for ${product.name}`}
                    >
                      <div className={`relative ${viewMode === 'list' ? 'sm:w-48' : ''}`}>
                        <img
                          src={getProductImage(product.imageUrl)}
                          alt={product.name}
                          onError={handleImageError}
                          className={`w-full object-cover rounded-lg transition-transform duration-200 group-hover:scale-105 ${
                            viewMode === 'list' ? 'h-32 sm:h-48' : 'h-40 sm:h-48 lg:h-56'
                          }`}
                        />
                        {product.createdAt && new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                        {!product.available && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                            <span className="text-white font-medium text-sm">Out of Stock</span>
                          </div>
                        )}
                      </div>

                      <div className={`p-3 sm:p-4 ${viewMode === 'list' ? 'sm:flex-1 sm:ml-4' : ''}`}>
                        <div className="mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            {product.category}
                          </span>
                        </div>
                        
                        <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base line-clamp-2 group-hover:text-green-600 transition-colors duration-200">
                          {product.name}
                        </h3>
                        
                        <div className="flex items-center mb-2">
                          <div className="flex items-center mr-2">
                            {renderStars(product.rating)}
                          </div>
                          <span className="text-xs text-gray-600">({product.reviewCount})</span>
                        </div>
                        
                        <div className="flex items-center mb-3 sm:mb-4">
                          <span className="text-lg sm:text-xl font-bold text-green-600">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="ml-auto text-xs text-gray-400 group-hover:text-green-500 transition-colors duration-200">
                            Click to view details →
                          </span>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button 
                            variant="primary" 
                            size="small" 
                            className="w-full"
                            disabled={!product.available}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (authService.isAuthenticated()) {
                                addToCart(product.id);
                              } else {
                                alert('Please login to add items to your cart');
                                navigate('/login');
                              }
                            }}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {!authService.isAuthenticated() ? 'Login to Add' : (product.available ? 'Add to Cart' : 'Out of Stock')}
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="small"
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (authService.isAuthenticated()) {
                                addToWishlist(product.id);
                              } else {
                                alert('Please login to add items to your wishlist');
                                navigate('/login');
                              }
                            }}
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            {authService.isAuthenticated() ? 'Wishlist' : 'Login to Wishlist'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            
            {/* Pagination Controls */}
            {!loading && products.length > 0 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * productsPerPage) + 1} to {Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} products
                </div>
                
                <div className="flex items-center space-x-2">
                  {/* Previous Page Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={!hasPrev}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === pageNum
                              ? 'bg-green-600 text-white'
                              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  {/* Next Page Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={!hasNext}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Search; 