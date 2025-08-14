import React from 'react';
import { ShoppingCart, Trash2, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../Button';

interface WishlistItemProps {
  id: number;
  productId: number;
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
  onAddToCart: (itemId: number) => void;
  onRemove: (itemId: number) => void;
}

const WishlistItem: React.FC<WishlistItemProps> = ({
  id,
  productId,
  name,
  price,
  originalPrice,
  image,
  category,
  rating,
  reviewCount,
  inStock,
  isNew,
  isSale,
  onAddToCart,
  onRemove
}) => {
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

  const getDiscountPercentage = () => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 relative">
          <Link to={`/product/${productId}`}>
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-lg"
            />
          </Link>
          
          {/* Badges */}
          <div className="absolute top-0 left-0 space-y-1">
            {isNew && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full block">
                New
              </span>
            )}
            {isSale && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full block">
                {getDiscountPercentage()}% OFF
              </span>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1 min-w-0">
              {/* Category */}
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full inline-block mb-2">
                {category}
              </span>
              
              {/* Product Name */}
              <Link to={`/product/${productId}`}>
                <h3 className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2 hover:text-green-600 transition-colors mb-2">
                  {name}
                </h3>
              </Link>
              
              {/* Rating */}
              <div className="flex items-center mb-2">
                <div className="flex items-center mr-2">
                  {renderStars(rating)}
                </div>
                <span className="text-xs text-gray-600">({reviewCount})</span>
              </div>
              
              {/* Price Info */}
              <div className="flex items-center space-x-2 mb-3">
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    ৳{price.toFixed(2)}
                  </p>
                  {originalPrice && (
                    <p className="text-sm text-gray-500 line-through">
                      ৳{originalPrice.toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {/* Stock Status */}
              {!inStock && (
                <div className="mb-3">
                  <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mt-3 sm:mt-0">
              <Button
                variant="primary"
                size="small"
                onClick={() => onAddToCart(id)}
                disabled={!inStock}
                className="flex items-center space-x-2"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </Button>
              
              <Link to={`/product/${productId}`}>
                <Button
                  variant="secondary"
                  size="small"
                  className="flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Details</span>
                </Button>
              </Link>
              
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
    </div>
  );
};

export default WishlistItem; 