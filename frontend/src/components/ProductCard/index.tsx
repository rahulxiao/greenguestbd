import React from 'react';
import { Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../Button';

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
  stock?: number;
  brand?: string;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  onAddToCart?: (productId: number) => void;
  onAddToWishlist?: (productId: number) => void;
  onQuickView?: (productId: number) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = 'grid',
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  className = ''
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
    if (!product.originalPrice || product.originalPrice <= product.price) return 0;
    return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  };

  return (
    <div className={`bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow ${className}`}>
      <div className={viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''}>
        {/* Product Image */}
        <div className={`relative ${viewMode === 'list' ? 'sm:w-48' : ''}`}>
          <Link to={`/product/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              className={`w-full object-cover rounded-t-lg ${
                viewMode === 'list' 
                  ? 'h-32 sm:h-48 rounded-l-lg rounded-t-none sm:rounded-t-none sm:rounded-l-lg' 
                  : 'h-40 sm:h-48 lg:h-56'
              }`}
            />
          </Link>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 space-y-1">
            {product.isNew && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full block">
                New
              </span>
            )}
            {product.isSale && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full block">
                {getDiscountPercentage()}% OFF
              </span>
            )}
          </div>
          
          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <span className="text-white font-medium text-sm">Out of Stock</span>
            </div>
          )}
          
          {/* Quick Actions */}
          <div className="absolute top-2 right-2 space-y-1">
            {onQuickView && (
              <button
                onClick={() => onQuickView(product.id)}
                className="w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110"
                title="Quick View"
              >
                <Eye className="h-4 w-4 text-gray-600" />
              </button>
            )}
            {onAddToWishlist && (
              <button
                onClick={() => onAddToWishlist(product.id)}
                className="w-8 h-8 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full flex items-center justify-center shadow-sm transition-all hover:scale-110"
                title="Add to Wishlist"
              >
                <Heart className="h-4 w-4 text-gray-600 hover:text-red-500" />
              </button>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className={`p-3 sm:p-4 ${viewMode === 'list' ? 'sm:flex-1 sm:ml-4' : ''}`}>
          {/* Category & Brand */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-xs text-gray-500 font-medium">
                {product.brand}
              </span>
            )}
          </div>
          
          {/* Product Name */}
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base line-clamp-2 hover:text-green-600 transition-colors">
              {product.name}
            </h3>
          </Link>
          
          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center mr-2">
              {renderStars(product.rating)}
            </div>
            <span className="text-xs text-gray-600">({product.reviewCount})</span>
          </div>
          
          {/* Price */}
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
          
          {/* Stock Info */}
          {product.stock !== undefined && product.stock > 0 && (
            <div className="mb-3 text-xs text-gray-600">
              {product.stock < 10 ? (
                <span className="text-orange-600 font-medium">Only {product.stock} left in stock</span>
              ) : (
                <span className="text-green-600">In Stock</span>
              )}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col space-y-2">
            <Button 
              variant="primary" 
              size="small" 
              className="w-full"
              disabled={!product.inStock}
              onClick={() => onAddToCart?.(product.id)}
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            
            {viewMode === 'grid' && onAddToWishlist && (
              <Button 
                variant="secondary" 
                size="small"
                className="w-full"
                onClick={() => onAddToWishlist(product.id)}
              >
                <Heart className="h-4 w-4 mr-1" />
                Wishlist
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard; 