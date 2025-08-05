import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, Eye, ArrowLeft } from 'lucide-react';
import { Header, Footer } from '../components';

interface WishlistItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  stock: number;
}

const Wishlist: React.FC = () => {
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock wishlist data - replace with actual API call
  useEffect(() => {
    const mockWishlistItems: WishlistItem[] = [
      {
        id: 1,
        productId: 1,
        name: "Premium Juniper Bonsai",
        price: 189.99,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        rating: 4.8,
        reviews: 127,
        inStock: true,
        stock: 10
      },
      {
        id: 2,
        productId: 2,
        name: "Japanese Maple Bonsai",
        price: 249.99,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        rating: 4.9,
        reviews: 89,
        inStock: true,
        stock: 5
      },
      {
        id: 3,
        productId: 5,
        name: "Pine Bonsai Collection",
        price: 299.99,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        rating: 4.9,
        reviews: 67,
        inStock: false,
        stock: 0
      },
      {
        id: 4,
        productId: 7,
        name: "Ceramic Bonsai Pot",
        price: 34.99,
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
        rating: 4.7,
        reviews: 203,
        inStock: true,
        stock: 25
      }
    ];
    setWishlistItems(mockWishlistItems);
    setLoading(false);
  }, []);

  const removeFromWishlist = (itemId: number) => {
    setWishlistItems(prev => prev.filter(item => item.id !== itemId));
  };

  const addToCart = (item: WishlistItem) => {
    // Mock add to cart functionality
    alert(`${item.name} added to cart!`);
  };

  const viewProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const renderStars = (rating: number) => {
    const stars: React.ReactElement[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

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
                  alt={item.name}
                  className="w-full h-48 object-cover"
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
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                  {item.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {renderStars(item.rating)}
                  </div>
                  <span className="text-sm text-gray-600 ml-1">
                    ({item.reviews})
                  </span>
                </div>
                
                {/* Price */}
                <p className="text-xl font-semibold text-green-600 mb-3">
                  ${item.price.toFixed(2)}
                </p>
                
                {/* Stock Info */}
                {item.inStock ? (
                  <p className="text-sm text-green-600 mb-3">
                    In Stock ({item.stock} available)
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
                    disabled={!item.inStock}
                    className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
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
              <p className="text-2xl font-bold text-green-600">
                ${wishlistItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">Total Value</p>
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
                onClick={() => {
                  const inStockItems = wishlistItems.filter(item => item.inStock);
                  if (inStockItems.length > 0) {
                    alert(`Adding ${inStockItems.length} in-stock items to cart!`);
                  } else {
                    alert('No items in stock to add to cart.');
                  }
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add All In-Stock to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Mock recommendation items */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
                  alt="Recommended product"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Recommended Bonsai {i}
                  </h3>
                  <div className="flex items-center mb-2">
                    {renderStars(4.5)}
                    <span className="text-sm text-gray-600 ml-1">(45)</span>
                  </div>
                  <p className="text-xl font-semibold text-green-600 mb-3">
                    ${(99.99 + i * 10).toFixed(2)}
                  </p>
                  <button className="w-full px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Add to Wishlist
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist; 