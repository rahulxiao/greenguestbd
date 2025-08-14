import React from 'react';
import { Minus, Plus, Trash2, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../Button';

interface CartItemProps {
  id: number;
  productId: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  inStock: boolean;
  stock?: number;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onRemove: (itemId: number) => void;
  onMoveToWishlist: (itemId: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  productId,
  name,
  price,
  originalPrice,
  image,
  quantity,
  inStock,
  stock,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    if (stock !== undefined && newQuantity > stock) return;
    onUpdateQuantity(id, newQuantity);
  };

  const getDiscountPercentage = () => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const totalPrice = price * quantity;
  const totalOriginalPrice = originalPrice ? originalPrice * quantity : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
          <Link to={`/product/${productId}`}>
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-lg"
            />
          </Link>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 min-w-0">
              <Link to={`/product/${productId}`}>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 hover:text-green-600 transition-colors">
                  {name}
                </h3>
              </Link>
              
              {/* Price Info */}
              <div className="flex items-center space-x-2 mt-2">
                <span className="text-lg font-bold text-green-600">
                  ৳{price.toFixed(2)}
                </span>
                {originalPrice && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      ৳{originalPrice.toFixed(2)}
                    </span>
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                      {getDiscountPercentage()}% OFF
                    </span>
                  </>
                )}
              </div>

              {/* Stock Status */}
              {!inStock && (
                <div className="mt-2">
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                </div>
              )}
              {stock !== undefined && stock < 10 && stock > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-orange-600 font-medium">
                    Only {stock} left in stock
                  </span>
                </div>
              )}
            </div>

            {/* Quantity Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mt-3 sm:mt-0">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="h-4 w-4 text-gray-600" />
                </button>
                
                <span className="w-12 text-center text-sm font-medium text-gray-700">
                  {quantity}
                </span>
                
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={stock !== undefined && quantity >= stock}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Total Price */}
              <div className="text-right">
                <p className="text-sm text-gray-600">
                  ৳{totalPrice.toFixed(2)}
                </p>
                {totalOriginalPrice && (
                  <p className="text-xs text-gray-500 line-through">
                    ৳{totalOriginalPrice.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="secondary"
              size="small"
              onClick={() => onMoveToWishlist(id)}
              className="flex items-center space-x-2"
            >
              <Heart className="h-4 w-4" />
              <span>Move to Wishlist</span>
            </Button>
            
            <Button
              variant="secondary"
              size="small"
              onClick={() => onRemove(id)}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              <span>Remove</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem; 