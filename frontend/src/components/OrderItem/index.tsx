import React from 'react';
import { Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../Button';

interface OrderItemProps {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
  rating?: number;
  reviewCount?: number;
  canReview?: boolean;
  onReview?: (productId: number) => void;
}

const OrderItem: React.FC<OrderItemProps> = ({
  id,
  productId,
  name,
  price,
  image,
  quantity,
  category,
  rating,
  reviewCount,
  canReview = false,
  onReview
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

  const totalPrice = price * quantity;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
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
              {rating !== undefined && (
                <div className="flex items-center mb-2">
                  <div className="flex items-center mr-2">
                    {renderStars(rating)}
                  </div>
                  <span className="text-xs text-gray-600">({reviewCount || 0})</span>
                </div>
              )}
              
              {/* Price & Quantity */}
              <div className="flex items-center space-x-4 mb-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Price:</span> ${price.toFixed(2)}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Quantity:</span> {quantity}
                </div>
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Total:</span> ${totalPrice.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mt-3 sm:mt-0">
              <Link to={`/product/${productId}`}>
                <Button
                  variant="secondary"
                  size="small"
                  className="flex items-center space-x-2"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Product</span>
                </Button>
              </Link>
              
              {canReview && onReview && (
                <Button
                  variant="primary"
                  size="small"
                  onClick={() => onReview(productId)}
                  className="flex items-center space-x-2"
                >
                  <Star className="h-4 w-4" />
                  <span>Write Review</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem; 