import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Header, Footer, Card, Button } from './components';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProductDetails from './pages/ProductDetails';
import AdminPage from './pages/AdminPage';
import UserProfile from './pages/UserProfile';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Wishlist from './pages/Wishlist';
import Search from './pages/Search';
import Orders from './pages/Orders';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import { productService, Product } from './services/product.service';
import { cartService } from './services/cart.service';
import { wishlistService } from './services/wishlist.service';
import { formatCurrency } from './utils/price';
import { getProductImage, handleImageError } from './utils/image';
import { authService } from './services/auth.service';

function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = authService.isAuthenticated();
      setIsAuthenticated(authStatus);
    };
    
    checkAuth();
    
    // Listen for authentication changes
    const handleAuthChange = () => {
      checkAuth();
    };
    
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authFailed', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authFailed', handleAuthChange);
    };
  }, []);

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await productService.getAllProducts();
        setProducts(allProducts);
        
        // Get popular products (top rated or most reviewed)
        const popular = allProducts
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 4);
        setPopularProducts(popular);
      } catch (err) {
        setError('Failed to load products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleGetStarted = () => {
    navigate('/search');
  };

  const handleLearnMore = () => {
    navigate('/about');
  };

  const handleMenuClick = () => {
    alert('Mobile menu clicked!');
  };

  const handleAddToCart = async (product: Product) => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      alert('Please login to add items to your cart');
      navigate('/login');
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
      await cartService.addToCart({ productId: product.id, quantity: 1 });
      // Dispatch event to update header cart count
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      // Show success feedback
      alert(`${product.name} added to cart successfully!`);
    } catch (err) {
      console.error('Failed to add to cart:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to add to cart';
      alert(errorMessage);
    }
  };

  const handleAddToWishlist = async (product: Product) => {
    // Check if user is authenticated
    if (!authService.isAuthenticated()) {
      alert('Please login to add items to your wishlist');
      navigate('/login');
      return;
    }

    try {
      await wishlistService.addToWishlist(product.id);
      // Dispatch event to update header wishlist count
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
      // Show success feedback
      alert(`${product.name} added to wishlist successfully!`);
    } catch (err) {
      console.error('Failed to add to wishlist:', err);
      alert('Failed to add to wishlist. Please try again.');
    }
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/search?category=${categoryName.toLowerCase()}`);
  };

  const handleViewAllProducts = () => {
    navigate('/search');
  };

  const handleViewCart = () => {
    navigate('/cart');
  };

  const handleViewWishlist = () => {
    navigate('/wishlist');
  };

  const handleContactUs = () => {
    navigate('/contact');
  };

  // Auto-scroll carousel
  useEffect(() => {
    if (popularProducts.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % popularProducts.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [popularProducts.length]);

  const categories = [
    {
      name: "Trees",
      description: "Discover our bonsai tree collection",
      icon: "🌳"
    },
    {
      name: "Tools",
      description: "Professional bonsai tools and equipment",
      icon: "🔧"
    },
    {
      name: "Pots",
      description: "Beautiful ceramic and stone containers",
      icon: "🏺"
    },
    {
      name: "Accessories",
      description: "Care products and decorative items",
      icon: "✨"
    }
  ];

  const renderStars = (rating: number) => {
    const stars: React.ReactElement[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600 text-lg">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="primary">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Background Leaf Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-8xl text-green-600 transform rotate-12">🍃</div>
        <div className="absolute top-40 right-20 text-6xl text-green-500 transform -rotate-12">🌿</div>
        <div className="absolute bottom-40 left-20 text-7xl text-green-600 transform rotate-45">🌱</div>
        <div className="absolute bottom-20 right-10 text-5xl text-green-500 transform -rotate-30">🍀</div>
        <div className="absolute top-1/2 left-1/4 text-6xl text-green-400 transform rotate-15">🌾</div>
        <div className="absolute top-1/3 right-1/3 text-5xl text-green-600 transform -rotate-45">🌺</div>
      </div>

      <Header onMenuClick={handleMenuClick} />
      
      {/* Authentication Banner for Unauthenticated Users */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span className="text-sm">🔒 Please login to add products to your cart and wishlist</span>
            <Button 
              variant="secondary" 
              size="small" 
              onClick={() => navigate('/login')}
              className="ml-4 bg-white text-blue-600 hover:bg-gray-100"
            >
              Login Now
            </Button>
          </div>
        </div>
      )}
      
      <main className="flex-1 relative z-10">
        {/* Hero Section with Product Slider */}
        <section className="relative py-20 overflow-hidden">
          {/* Hero Background with Nature Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800">
            <div className="absolute inset-0 bg-black/20"></div>
            {/* Floating Leaves */}
            <div className="absolute top-10 left-10 animate-bounce text-4xl text-green-300/30">🍃</div>
            <div className="absolute top-20 right-20 animate-pulse text-3xl text-green-200/40">🌿</div>
            <div className="absolute bottom-20 left-20 animate-bounce text-5xl text-green-300/30" style={{animationDelay: '1s'}}>🌱</div>
            <div className="absolute bottom-10 right-10 animate-pulse text-4xl text-green-200/40" style={{animationDelay: '2s'}}>🍀</div>
          </div>
          
          <div className="relative z-10 max-w-8xl mx-auto px-8">
            <div className="flex flex-col justify-center items-center min-h-[200px]">
              {/* Product Slider - Full Width */}
              <div className="w-full max-w-7xl">
                <div className="text-center mb-10">
                  <h3 className="text-4xl font-bold text-white mb-4">🌟 Most Popular Products</h3>
                  <p className="text-xl text-green-100">Discover our best-selling bonsai collection</p>
                </div>
                
                {/* Product Carousel */}
                <div className="relative">
                  <div className="flex space-x-8 overflow-hidden">
                    {popularProducts.map((product, index) => (
                      <div 
                        key={product.id}
                        className={`flex-shrink-0 w-96 bg-gradient-to-br from-white/20 via-white/15 to-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/30 hover:border-white/50 hover:bg-gradient-to-br hover:from-white/30 hover:via-white/25 hover:to-white/20 transition-all duration-500 cursor-pointer transform shadow-2xl hover:shadow-white/20 ${
                          index === currentSlide ? 'scale-105 opacity-100 shadow-white/30' : 'scale-95 opacity-70'
                        }`}
                        onClick={() => handleProductClick(product.id)}
                        style={{
                          transform: `translateX(-${currentSlide * 100}%)`,
                          transition: 'transform 0.5s ease-in-out'
                        }}
                      >
                        {/* Product Image Container */}
                        <div className="relative bg-gradient-to-br from-white/30 to-white/10 rounded-xl h-56 mb-6 overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                          <img 
                            src={getProductImage(product.imageUrl)} 
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={handleImageError}
                          />
                          {/* Floating Badge */}
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                            Popular
                          </div>
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-green-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-4">
                          <h4 className="text-2xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
                            {product.name}
                          </h4>
                          
                          {/* Rating and Price Row */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {renderStars(product.rating || 0)}
                              </div>
                              <span className="text-green-200 font-medium">({product.rating || 0})</span>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-bold bg-gradient-to-r from-green-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-sm">
                                {formatCurrency(product.price)}
                              </span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <button 
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-500/25 mt-4"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (isAuthenticated) {
                                handleAddToCart(product);
                              } else {
                                alert('Please login to add items to your cart');
                                navigate('/login');
                              }
                            }}
                          >
                            {isAuthenticated ? 'Add to Cart →' : 'Login to Add →'}
                          </button>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-2 left-2 w-2 h-2 bg-green-400 rounded-full opacity-60"></div>
                        <div className="absolute top-2 right-2 w-1 h-1 bg-emerald-300 rounded-full opacity-40"></div>
                        <div className="absolute bottom-2 left-2 w-1 h-1 bg-green-300 rounded-full opacity-40"></div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Carousel Navigation Dots */}
                  <div className="flex justify-center mt-8 space-x-4">
                    {popularProducts.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-5 h-5 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-400 scale-125 shadow-lg shadow-green-400/50' 
                            : 'bg-white/30 hover:bg-white/50 hover:scale-110'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="relative z-10 max-w-7xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-800 mb-4">🌱 Featured Products</h2>
              <p className="text-green-600 text-lg">Discover our handpicked selection of premium bonsai</p>
            </div>
            
            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.slice(0, 8).map((product) => (
                  <Card 
                    key={product.id} 
                    variant="elevated" 
                    size="medium" 
                    className="bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer group"
                    onClick={() => handleProductClick(product.id)}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img 
                        src={getProductImage(product.imageUrl)} 
                        alt={product.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={handleImageError}
                      />
                      {product.createdAt && new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
                        <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          New
                        </div>
                      )}
                      {!product.available && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-medium">Out of Stock</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 text-lg line-clamp-2 group-hover:text-green-600 transition-colors">
                        {product.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {product.description || 'Beautiful bonsai tree for your collection'}
                      </p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent drop-shadow-sm">
                          {formatCurrency(product.price)}
                        </span>
                        <div className="flex items-center gap-1">
                          {renderStars(product.rating || 0)}
                          <span className="text-sm text-green-500 ml-1 font-medium">({product.reviewCount || 0})</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="primary" 
                          size="small" 
                          className="flex-1"
                          disabled={!product.available}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isAuthenticated) {
                              handleAddToCart(product);
                            } else {
                              alert('Please login to add items to your cart');
                              navigate('/login');
                            }
                          }}
                        >
                          {!isAuthenticated ? 'Login to Add' : (product.available ? 'Add to Cart' : 'Out of Stock')}
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isAuthenticated) {
                              handleAddToWishlist(product);
                            } else {
                              alert('Please login to add items to your wishlist');
                              navigate('/login');
                            }
                          }}
                        >
                          {isAuthenticated ? '♥' : '♡'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🌱</div>
                <h3 className="text-xl font-medium text-gray-600 mb-2">No products available</h3>
                <p className="text-gray-500">Check back soon for new arrivals!</p>
              </div>
            )}
            
            {products.length > 8 && (
              <div className="text-center mt-12">
                <Button variant="primary" size="large" onClick={handleViewAllProducts}>
                  View All Products →
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Categories Section with Nature Background */}
        <section className="py-16 bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 relative">
          {/* Floating Nature Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 text-4xl text-green-400/30 animate-bounce">🍃</div>
            <div className="absolute top-20 right-20 text-3xl text-emerald-400/40 animate-pulse" style={{animationDelay: '1s'}}>🌿</div>
            <div className="absolute bottom-20 left-20 text-5xl text-teal-400/30 animate-bounce" style={{animationDelay: '2s'}}>🌱</div>
            <div className="absolute bottom-10 right-10 text-4xl text-green-400/40 animate-pulse" style={{animationDelay: '3s'}}>🍀</div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-800 mb-4">🌿 Shop by Category</h2>
              <p className="text-green-600 text-lg">Explore our complete bonsai collection</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <Card 
                  key={index} 
                  variant="elevated" 
                  size="medium" 
                  className="text-center bg-white/90 backdrop-blur-sm border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group cursor-pointer"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <div className="bg-gradient-to-br from-green-200 to-emerald-300 h-32 mb-4 rounded-lg flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-300/30 to-emerald-400/30"></div>
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">{category.name}</h3>
                  <p className="text-green-600 text-sm">{category.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call-to-Action Section */}
        <section className="py-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <div className="relative z-10 max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4">Quick Links</h3>
                <ul className="space-y-4">
                  <li onClick={handleViewAllProducts} className="cursor-pointer hover:text-white/90 transition-colors">All Products</li>
                  <li onClick={handleViewCart} className="cursor-pointer hover:text-white/90 transition-colors">View Cart</li>
                  <li onClick={handleViewWishlist} className="cursor-pointer hover:text-white/90 transition-colors">Wishlist</li>
                  <li onClick={handleContactUs} className="cursor-pointer hover:text-white/90 transition-colors">Contact Us</li>
                </ul>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4">About Us</h3>
                <p className="text-lg mb-4">
                  We are passionate about bonsai, offering a wide range of high-quality bonsai trees, tools, and accessories.
                  Our mission is to provide exceptional bonsai experiences for enthusiasts of all levels.
                </p>
                <Button variant="secondary" size="medium" onClick={handleLearnMore} className="bg-white text-green-600 hover:bg-white/90">
                  Learn More →
                </Button>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold mb-4">Newsletter</h3>
                <p className="text-lg mb-4">
                  Subscribe to our newsletter to receive updates about new products, promotions, and bonsai tips.
                </p>
                <div className="flex gap-2">
                  <input type="email" placeholder="Enter your email" className="p-3 rounded-lg border border-white/50 text-black" />
                  <Button variant="primary" size="medium" className="bg-white text-green-600 hover:bg-white/90">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/order-confirmation" element={
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        } />
        <Route path="/wishlist" element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        } />
        <Route path="/search" element={<Search />} />
        <Route path="/orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Router>
  );
}

export default App;
