import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, Button, Header, Footer } from '../components';
import { Search as SearchIcon, Filter, Grid, List, Star, ShoppingCart, Heart, ChevronDown, ChevronUp, X } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  isNew?: boolean;
  isSale?: boolean;
}

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  const query = searchParams.get('q') || '';

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Premium Juniper Bonsai Tree",
      price: 189.99,
      originalPrice: 249.99,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
      category: "Trees",
      rating: 4.8,
      reviewCount: 127,
      inStock: true,
      isSale: true
    },
    {
      id: 2,
      name: "Japanese Maple Bonsai",
      price: 299.99,
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400",
      category: "Trees",
      rating: 4.9,
      reviewCount: 89,
      inStock: true,
      isNew: true
    },
    {
      id: 3,
      name: "Ceramic Bonsai Pot - Traditional",
      price: 34.99,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
      category: "Pots",
      rating: 4.6,
      reviewCount: 203,
      inStock: true
    },
    {
      id: 4,
      name: "Bonsai Pruning Shears",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
      category: "Tools",
      rating: 4.7,
      reviewCount: 156,
      inStock: true
    },
    {
      id: 5,
      name: "Organic Bonsai Soil Mix",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400",
      category: "Soil & Fertilizer",
      rating: 4.5,
      reviewCount: 98,
      inStock: true
    },
    {
      id: 6,
      name: "Bonsai Watering Can",
      price: 39.99,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
      category: "Tools",
      rating: 4.4,
      reviewCount: 67,
      inStock: false
    }
  ];

  const categories = ['Trees', 'Pots', 'Tools', 'Soil & Fertilizer', 'Books & Guides'];
  const ratings = [5, 4, 3, 2, 1];

  useEffect(() => {
    // Simulate API call
    const fetchProducts = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      let filteredProducts = mockProducts.filter(product => {
        const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
                           product.category.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const matchesRating = selectedRatings.length === 0 || selectedRatings.includes(Math.floor(product.rating));
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        
        return matchesQuery && matchesCategory && matchesRating && matchesPrice;
      });

      // Sort products
      switch (sortBy) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredProducts.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          filteredProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
          break;
        default:
          // relevance - keep original order
          break;
      }

      setProducts(filteredProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [query, sortBy, priceRange, selectedCategories, selectedRatings]);

  useEffect(() => {
    // Calculate active filter count
    const categoryCount = selectedCategories.length;
    const ratingCount = selectedRatings.length;
    const priceCount = priceRange[0] > 0 || priceRange[1] < 1000 ? 1 : 0;
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
    setPriceRange([0, 1000]);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 lg:py-8">
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
                <h3 className="font-medium text-gray-700 mb-3 text-sm sm:text-base">Categories</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryToggle(category)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-600">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-700 mb-3 text-sm sm:text-base">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Min"
                    />
                    <span className="text-gray-500 text-sm">-</span>
                    <input
                      type="number"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Max"
                    />
                  </div>
                  <div className="text-xs text-gray-500 text-center">
                    ${priceRange[0]} - ${priceRange[1]}
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
            {products.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-gray-400 mb-4">
                  <SearchIcon className="h-12 w-12 sm:h-16 sm:w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            ) : (
              <div className={`grid gap-3 sm:gap-4 lg:gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {products.map(product => (
                  <Card key={product.id} className="bg-white hover:shadow-lg transition-shadow">
                    <div className={viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}>
                      <div className={`relative ${viewMode === 'list' ? 'sm:w-48' : ''}`}>
                        <img
                          src={product.image}
                          alt={product.name}
                          className={`w-full object-cover rounded-lg ${
                            viewMode === 'list' ? 'h-32 sm:h-48' : 'h-40 sm:h-48 lg:h-56'
                          }`}
                        />
                        {product.isNew && (
                          <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            New
                          </span>
                        )}
                        {product.isSale && (
                          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            Sale
                          </span>
                        )}
                        {!product.inStock && (
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
                        
                        <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base line-clamp-2">
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
                            ${product.price.toFixed(2)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Button 
                            variant="primary" 
                            size="small" 
                            className="w-full"
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="small"
                            className="w-full"
                          >
                            <Heart className="h-4 w-4 mr-1" />
                            Wishlist
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
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