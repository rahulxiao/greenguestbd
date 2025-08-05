import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon, Filter, Grid, List, Star, Heart, ShoppingCart } from 'lucide-react';
import { Header, Footer } from '../components';

interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviews: number;
  category: string;
  brand: string;
  inStock: boolean;
  stock: number;
}

interface FilterOptions {
  category: string[];
  brand: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
}

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    category: [],
    brand: [],
    priceRange: [0, 1000],
    rating: 0,
    inStock: false
  });

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';

  // Mock search results - replace with actual API call
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: 1,
        name: "Premium Juniper Bonsai",
        price: 189.99,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        rating: 4.8,
        reviews: 127,
        category: "Trees",
        brand: "BonsaiMaster",
        inStock: true,
        stock: 10
      },
      {
        id: 2,
        name: "Japanese Maple Bonsai",
        price: 249.99,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        rating: 4.9,
        reviews: 89,
        category: "Trees",
        brand: "BonsaiMaster",
        inStock: true,
        stock: 5
      },
      {
        id: 3,
        name: "Beginner Bonsai Kit",
        price: 89.99,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        rating: 4.7,
        reviews: 234,
        category: "Kits",
        brand: "BonsaiStarter",
        inStock: true,
        stock: 15
      },
      {
        id: 4,
        name: "Ficus Bonsai Tree",
        price: 159.99,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        rating: 4.6,
        reviews: 156,
        category: "Trees",
        brand: "BonsaiMaster",
        inStock: true,
        stock: 8
      },
      {
        id: 5,
        name: "Pine Bonsai Collection",
        price: 299.99,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        rating: 4.9,
        reviews: 67,
        category: "Collections",
        brand: "BonsaiElite",
        inStock: true,
        stock: 3
      },
      {
        id: 6,
        name: "Bonsai Pruning Shears",
        price: 45.99,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        rating: 4.8,
        reviews: 189,
        category: "Tools",
        brand: "BonsaiTools",
        inStock: true,
        stock: 25
      },
      {
        id: 7,
        name: "Ceramic Bonsai Pot",
        price: 34.99,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        rating: 4.7,
        reviews: 98,
        category: "Pots",
        brand: "BonsaiPots",
        inStock: false,
        stock: 0
      },
      {
        id: 8,
        name: "Bonsai Care Guide",
        price: 19.99,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        rating: 4.9,
        reviews: 312,
        category: "Supplies",
        brand: "BonsaiStarter",
        inStock: true,
        stock: 50
      }
    ];

    // Filter products based on search query and category
    let filteredProducts = mockProducts;
    
    if (query) {
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
      );
    }
    
    if (category) {
      filteredProducts = filteredProducts.filter(product =>
        product.category.toLowerCase() === category.toLowerCase()
      );
    }

    setProducts(filteredProducts);
    setFilteredProducts(filteredProducts);
    setSearchInput(query);
    setLoading(false);
  }, [query, category]);

  // Apply filters to products
  useEffect(() => {
    let filtered = products;

    // Apply category filter
    if (filters.category.length > 0) {
      filtered = filtered.filter(product => filters.category.includes(product.category));
    }

    // Apply brand filter
    if (filters.brand.length > 0) {
      filtered = filtered.filter(product => filters.brand.includes(product.brand));
    }

    // Apply price range filter
    filtered = filtered.filter(product => 
      product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]
    );

    // Apply rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter(product => product.rating >= filters.rating);
    }

    // Apply in-stock filter
    if (filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterChange = (filterType: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: [],
      brand: [],
      priceRange: [0, 1000],
      rating: 0,
      inStock: false
    });
  };

  const addToCart = (product: Product) => {
    alert(`${product.name} added to cart!`);
  };

  const addToWishlist = (product: Product) => {
    alert(`${product.name} added to wishlist!`);
  };

  const renderStars = (rating: number) => {
    const stars: React.ReactElement[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      );
    }
    return stars;
  };

  const categories = ['Trees', 'Kits', 'Tools', 'Pots', 'Supplies', 'Collections'];
  const brands = ['BonsaiMaster', 'BonsaiStarter', 'BonsaiElite', 'BonsaiTools', 'BonsaiPots', 'BonsaiSoil'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {query ? `Search Results for "${query}"` : 'Search Products'}
          </h1>
          {category && (
            <p className="text-green-600 mb-2">Category: {category}</p>
          )}
          <p className="text-gray-600">
            Found {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for bonsai trees, tools, accessories..."
                className="w-full px-4 py-3 pl-12 pr-20 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-400"
              />
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-lg transition-colors duration-300"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.category.includes(cat)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange('category', [...filters.category, cat]);
                          } else {
                            handleFilterChange('category', filters.category.filter(c => c !== cat));
                          }
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Brands</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.brand.includes(brand)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange('brand', [...filters.brand, brand]);
                          } else {
                            handleFilterChange('brand', filters.brand.filter(b => b !== brand));
                          }
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">${filters.priceRange[0]}</span>
                    <span className="text-sm text-gray-600">${filters.priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.priceRange[1]}
                    onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Minimum Rating</h3>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('rating', rating)}
                      className={`p-1 rounded ${
                        filters.rating === rating ? 'bg-green-100 text-green-600' : 'text-gray-400'
                      }`}
                    >
                      <Star className={`h-4 w-4 ${filters.rating >= rating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400'
                  }`}
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${
                    viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
              
              <div className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchParams({});
                    setSearchInput('');
                    clearFilters();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className={`w-full object-cover ${
                          viewMode === 'list' ? 'h-32' : 'h-48'
                        }`}
                      />
                    </div>
                    
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center space-x-1 ml-2">
                          {renderStars(product.rating)}
                          <span className="text-sm text-gray-600">({product.reviews})</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                      <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-green-600">
                          ${product.price}
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                          product.inStock 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => addToCart(product)}
                          disabled={!product.inStock}
                          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          onClick={() => addToWishlist(product)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-300"
                        >
                          <Heart className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
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