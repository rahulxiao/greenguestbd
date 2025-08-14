import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Eye, ArrowLeft, Loader2 } from 'lucide-react';
import { Header, Footer } from '../components';
import { wishlistService, WishlistItem } from '../services/wishlist.service';
import { formatCurrency } from '../utils/price';

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<number | null>(null);
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  // Fetch real wishlist data from backend
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await wishlistService.getUserWishlist();
        setWishlistItems(data);
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
        setError('Failed to load your wishlist. Please try again later.');
        setWishlistItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (itemId: number) => {
    try {
      setRemovingItem(itemId);
      await wishlistService.removeFromWishlist(itemId);
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Failed to remove item from wishlist:', err);
      setError('Failed to remove item from wishlist. Please try again.');
    } finally {
      setRemovingItem(null);
    }
  };

  const addToCart = async (item: WishlistItem) => {
    try {
      setAddingToCart(item.id);
      await wishlistService.moveToCart(item.id);
      // Remove item from wishlist after moving to cart
      setWishlistItems(prev => prev.filter(wishlistItem => wishlistItem.id !== item.id));
    } catch (err) {
      console.error('Failed to add item to cart:', err);
      setError('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(null);
    }
  };

  const viewProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your wishlist...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heart className="mx-auto h-24 w-24 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Your wishlist is empty</h2>
            <p className="mt-2 text-gray-600">Start adding products you love to your wishlist!</p>
            <button
              onClick={handleContinueShopping}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Start Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-red-800">{error}</p>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                ×
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={handleContinueShopping}
              className="flex items-center text-green-600 hover:text-green-700 mr-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Continue Shopping
            </button>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          </div>
          <p className="text-gray-600">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400';
                  }}
                />
                
                {/* Stock Status Badge */}
                {!item.inStock && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}
                
                {/* Remove from Wishlist Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  disabled={removingItem === item.id}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                >
                  {removingItem === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                  {item.productName}
                </h3>
                
                {/* Category */}
                <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                
                {/* Price */}
                <div className="text-right mb-3">
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(item.price)}
                  </p>
                </div>
                
                {/* Stock Info */}
                {item.inStock ? (
                  <p className="text-sm text-green-600 mb-3">
                    In Stock
                  </p>
                ) : (
                  <p className="text-sm text-red-600 mb-3">
                    Out of Stock
                  </p>
                )}
                
                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => viewProduct(item.productId)}
                    className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                  
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!item.inStock || addingToCart === item.id}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {addingToCart === item.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <ShoppingCart className="h-4 w-4 mr-1" />
                    )}
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Wishlist Summary */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Wishlist Summary</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{wishlistItems.length}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">Total Value:</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(wishlistItems.reduce((sum, item) => sum + item.price, 0))}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {wishlistItems.filter(item => item.inStock).length}
              </p>
              <p className="text-sm text-gray-600">In Stock</p>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleContinueShopping}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Continue Shopping
              </button>
              
              <button
                onClick={async () => {
                  const inStockItems = wishlistItems.filter(item => item.inStock);
                  if (inStockItems.length > 0) {
                    try {
                      // Add all in-stock items to cart
                      for (const item of inStockItems) {
                        await wishlistService.moveToCart(item.id);
                      }
                      // Remove all in-stock items from wishlist
                      setWishlistItems(prev => prev.filter(item => !item.inStock));
                    } catch (err) {
                      setError('Failed to add some items to cart. Please try again.');
                    }
                  } else {
                    setError('No items in stock to add to cart.');
                  }
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add All In-Stock to Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist; 