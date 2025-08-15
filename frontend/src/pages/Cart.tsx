import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Heart, Loader2 } from 'lucide-react';
import { Header, Footer, Button } from '../components';
import { cartService, CartItem } from '../services/cart.service';
import { wishlistService } from '../services/wishlist.service';
import { productService } from '../services/product.service';
import { formatCurrency } from '../utils/price';
import { getProductImage, handleImageError } from '../utils/image';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);
  const [removingItem, setRemovingItem] = useState<number | null>(null);
  const [movingToWishlist, setMovingToWishlist] = useState<number | null>(null);

  // Utility function to safely convert price to number
  const safePrice = (price: any): number => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const converted = parseFloat(price);
      return isNaN(converted) ? 0 : converted;
    }
    return 0;
  };

  // Function to fetch missing product details
  const fetchMissingProductDetails = async (cartItems: CartItem[]): Promise<CartItem[]> => {
    const enhancedItems = await Promise.all(
      cartItems.map(async (item, index) => {
        // If product data is missing or incomplete, fetch it
        if (!item.product || !item.product.name || item.product.price === 0 || typeof item.product.price !== 'number') {
          try {
            const productDetails = await productService.getProductById(item.productId);
            
            // Convert price to number if it's a string
            let price = productDetails.price;
            if (typeof price === 'string') {
              price = parseFloat(price);
            }
            
            // Update the cart item with product details
            item.product = {
              id: productDetails.id,
              name: productDetails.name,
              price: typeof price === 'number' && !isNaN(price) ? price : 0,
              imageUrl: productDetails.imageUrl,
              stock: productDetails.stock || 0,
              available: productDetails.available || false
            };
          } catch (err) {
            console.error('Failed to fetch product details for ID:', item.productId, err);
            // Create a better fallback with at least some price data
            if (!item.product) {
              item.product = {
                id: item.productId,
                name: `Product ${item.productId}`,
                price: 0,
                imageUrl: undefined,
                stock: 0,
                available: false
              };
            }
          }
        }
        return item;
      })
    );
    
    return enhancedItems;
  };

  // Function to force refresh all product data
  const forceRefreshProductData = async () => {
    try {
      setLoading(true);
      
      // Fetch fresh cart data
      const freshCartData = await cartService.getCartItems();
      
      // Force fetch all product details regardless of what's already there
      const enhancedItems = await Promise.all(
        freshCartData.map(async (item) => {
          try {
            const productDetails = await productService.getProductById(item.productId);
            
            // Convert price to number if it's a string
            let price = productDetails.price;
            if (typeof price === 'string') {
              price = parseFloat(price);
            }
            
            return {
              ...item,
              product: {
                id: productDetails.id,
                name: productDetails.name,
                price: typeof price === 'number' && !isNaN(price) ? price : 0,
                imageUrl: productDetails.imageUrl,
                stock: productDetails.stock || 0,
                available: productDetails.available || false
              },
              createdAt: item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt),
              updatedAt: item.updatedAt instanceof Date ? item.updatedAt : new Date(item.updatedAt)
            };
          } catch (err) {
            console.error('Failed to fetch product details for ID:', item.productId, err);
            return {
              ...item,
              product: {
                id: item.productId,
                name: `Product ${item.productId}`,
                price: 0,
                imageUrl: undefined,
                stock: 0,
                available: false
              },
              createdAt: item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt),
              updatedAt: item.updatedAt instanceof Date ? item.updatedAt : new Date(item.updatedAt)
            };
          }
        })
      );
      
      setCartItems(enhancedItems);
      setError(null);
      
    } catch (err) {
      console.error('Failed to refresh product data:', err);
      setError('Failed to refresh product data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch real cart data from backend
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching cart items...');
        const data = await cartService.getCartItems();
        
        if (!Array.isArray(data)) {
          console.error('Cart data is not an array:', typeof data, data);
          setError('Invalid cart data received from server');
          setCartItems([]);
          return;
        }
        
        // Validate and transform the data to ensure proper formatting
        const transformedData = data.map(item => {
          // Check if product data is missing
          if (!item.product) {
            // Create a fallback product object
            item.product = {
              id: item.productId,
              name: `Product ${item.productId}`,
              price: 0,
              imageUrl: undefined,
              stock: 0,
              available: false
            };
          }
          
          // Ensure price is a number
          if (typeof item.product.price !== 'number') {
            // Convert string price to number if possible
            if (typeof item.product.price === 'string') {
              const convertedPrice = parseFloat(item.product.price);
              if (!isNaN(convertedPrice)) {
                item.product.price = convertedPrice;
              } else {
                item.product.price = 0;
              }
            } else {
              item.product.price = 0;
            }
          }
          
          return {
            ...item,
            createdAt: item.createdAt instanceof Date ? item.createdAt : new Date(item.createdAt),
            updatedAt: item.updatedAt instanceof Date ? item.updatedAt : new Date(item.updatedAt)
          };
        });
        
        // Fetch missing product details if needed
        const enhancedData = await fetchMissingProductDetails(transformedData);
        
        setCartItems(enhancedData);
      } catch (err) {
        console.error('Failed to fetch cart items:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load your cart. Please try again later.';
        setError(errorMessage);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdatingItem(itemId);
      const updatedItem = await cartService.updateCartItem(itemId, { quantity: newQuantity });
      
      // Update local state with the updated item
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId 
            ? { ...item, quantity: updatedItem.quantity }
            : item
        )
      );
      
      // Dispatch event to update header cart count
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Failed to update quantity. Please try again.');
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      setRemovingItem(itemId);
      await cartService.removeFromCart(itemId);
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      // Dispatch event to update header cart count
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error('Failed to remove item:', err);
      setError('Failed to remove item. Please try again.');
    } finally {
      setRemovingItem(null);
    }
  };

  const moveToWishlist = async (itemId: number) => {
    try {
      setMovingToWishlist(itemId);
      await cartService.moveToWishlist(itemId);
      // Remove item from cart after moving to wishlist
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      // Dispatch events to update header counts
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      window.dispatchEvent(new CustomEvent('wishlistUpdated'));
    } catch (err) {
      console.error('Failed to move item to wishlist:', err);
      setError('Failed to move item to wishlist. Please try again.');
    } finally {
      setMovingToWishlist(null);
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCartItems([]);
      
      // Dispatch event to update header cart count
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (err) {
      console.error('Failed to clear cart:', err);
      setError('Failed to clear cart. Please try again.');
    }
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => {
      const price = safePrice(item.product?.price);
      return sum + (price * item.quantity);
    }, 0);
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    return subtotal > 100 ? 0 : 15.99;
  };

  const getTotal = () => {
    const subtotal = getSubtotal();
    const shipping = getShipping();
    return subtotal + shipping;
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleViewWishlist = () => {
    navigate('/wishlist');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="animate-spin h-12 w-12 border-green-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="mt-2 text-gray-600">Looks like you haven't added any items to your cart yet.</p>
            <div className="mt-6 space-x-4">
              <button
                onClick={handleContinueShopping}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Continue Shopping
              </button>
              <button
                onClick={handleViewWishlist}
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <Heart className="mr-2 h-5 w-5" />
                View Wishlist
              </button>
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

        <div className="flex items-center mb-8">
          <button
            onClick={handleContinueShopping}
            className="flex items-center text-green-600 hover:text-green-700 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Cart Items ({cartItems.length})
                  </h2>
                  <div className="flex space-x-3">
                    <button
                      onClick={forceRefreshProductData}
                      className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                      disabled={loading}
                    >
                      {loading ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )}
                      Refresh
                    </button>
                    <button
                      onClick={handleViewWishlist}
                      className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                    >
                      <Heart className="h-4 w-4 mr-1" />
                      View Wishlist
                    </button>
                    <button
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                {/* Cart Summary */}
                <div className="p-4 bg-gray-50 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Cart Summary</h3>
                      <p className="text-sm text-gray-600">
                        {cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Subtotal</p>
                      <p className="text-2xl font-bold text-green-600">
                        ৳{getSubtotal().toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500">
                        Shipping: {getShipping() === 0 ? 'Free' : `৳${getShipping().toFixed(2)}`}
                      </p>
                    </div>
                  </div>
                </div>
                
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-center">
                      <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                        {item.product?.imageUrl ? (
                          <img
                            src={getProductImage(item.product.imageUrl)}
                            alt={item.product.name || "Product"}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                        ) : null}
                        {/* Placeholder icon for when no image or image fails */}
                        <div className={`placeholder-icon ${item.product?.imageUrl ? 'hidden' : ''} text-gray-400`}>
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <h3 className="text-lg font-medium text-gray-900">{item.product?.name || "Product Name"}</h3>
                        <p className="text-gray-600">Stock: {item.product?.stock || 0} available</p>
                        <p className="text-lg font-semibold text-green-600">
                          ৳{safePrice(item.product?.price).toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50"
                            disabled={item.quantity <= 1 || updatingItem === item.id}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-4 py-2 text-center min-w-[3rem]">
                            {updatingItem === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 disabled:opacity-50"
                            disabled={item.quantity >= (item.product?.stock || 0) || updatingItem === item.id}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-semibold text-green-600">
                            ৳{(safePrice(item.product?.price) * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total: ৳{(safePrice(item.product?.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => moveToWishlist(item.id)}
                            disabled={movingToWishlist === item.id}
                            className="text-green-600 hover:text-green-700 p-2 disabled:opacity-50"
                            title="Move to Wishlist"
                          >
                            {movingToWishlist === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Heart className="h-4 w-4" />
                            )}
                          </button>
                          
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={removingItem === item.id}
                            className="text-red-600 hover:text-red-700 p-2 disabled:opacity-50"
                            title="Remove Item"
                          >
                            {removingItem === item.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Subtotal:</span>
                  <span className="font-medium">৳{getSubtotal().toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center py-2">
                  <span className="font-medium">Shipping:</span>
                  <span className="font-medium">
                    {getShipping() === 0 ? 'Free' : `৳${getShipping().toFixed(2)}`}
                  </span>
                </div>
                
                {getShipping() > 0 && (
                  <div className="text-sm text-gray-600 text-center py-2 border-t border-gray-200">
                    Add ৳{(100 - getSubtotal()).toFixed(2)} more for free shipping
                  </div>
                )}
                
                <div className="flex justify-between items-center py-2 border-t border-gray-200">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold text-green-600">৳{getTotal().toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-sm text-gray-600">
                <p>• Secure checkout with SSL encryption</p>
                <p>• Free returns within 30 days</p>
                <p>• Customer support available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart; 