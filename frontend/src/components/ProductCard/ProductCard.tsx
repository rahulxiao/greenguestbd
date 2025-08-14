import React from 'react';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import Button from '../Button';
import { Product } from '../../services/product.service';
import { formatCurrency } from '../../utils/price';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  viewMode = 'grid',
  onAddToCart,
  onAddToWishlist,
  onQuickView
}) => {
  const renderStars = (rating: number) => {
    const stars: React.ReactElement[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Star key="half" className="h-4 w-4 fill-yellow-400 text-yellow-400" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
      viewMode === 'list' ? 'flex' : ''
    }`}>
      {/* Product Image */}
      <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
        <img
          src={product.imageUrl || '/placeholder-product.jpg'}
          alt={product.name}
          className={`w-full object-cover ${
            viewMode === 'list' ? 'h-48' : 'h-48 lg:h-56'
          }`}
        />
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.createdAt && new Date(product.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000 && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              New
            </span>
          )}
          {!product.available && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className={`p-4 ${viewMode === 'list' ? 'flex-1 ml-4' : ''}`}>
        {/* Category */}
        <div className="mb-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-800 mb-2 text-sm line-clamp-2">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center mr-2">
            {renderStars(product.rating)}
          </div>
          <span className="text-xs text-gray-600">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-green-600">
            {formatCurrency(product.price)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-2">
          <Button
            variant="primary"
            size="small"
            className="w-full"
            disabled={!product.available}
            onClick={() => onAddToCart?.(product)}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            {product.available ? 'Add to Cart' : 'Out of Stock'}
          </Button>
          
          <Button
            variant="secondary"
            size="small"
            className="w-full"
            onClick={() => onAddToWishlist?.(product)}
          >
            <Heart className="h-4 w-4 mr-1" />
            Wishlist
          </Button>
          
          <Button
            variant="outline"
            size="small"
            className="w-full"
            onClick={() => onQuickView?.(product)}
          >
            <Eye className="h-4 w-4 mr-1" />
            Quick View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;