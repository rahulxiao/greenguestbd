import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Header, Footer } from '../components';
import { Star, Heart, ShoppingCart, Truck, Shield, Leaf, ArrowLeft, Share2, MessageCircle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  images: string[];
  category: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockQuantity: number;
  dimensions: {
    height: string;
    width: string;
    depth: string;
  };
  careLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  age: string;
  features: string[];
  specifications: Record<string, string>;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState<Review[]>([]);

  // Mock product data
  const mockProduct: Product = {
    id: 1,
    name: "Premium Juniper Bonsai Tree - 5 Year Old Specimen",
    price: 189.99,
    originalPrice: 249.99,
    description: "A stunning 5-year-old Juniper bonsai with beautiful natural curves and mature foliage. Perfect for both beginners and experienced enthusiasts.",
    longDescription: "This exceptional Juniper bonsai specimen has been carefully cultivated for over 5 years, developing a natural, windswept appearance that mimics ancient trees found in nature. The tree features a thick, gnarled trunk with beautiful bark texture, multiple branches that create depth and dimension, and dense, healthy foliage that responds well to pruning and shaping.\n\nJuniper bonsai are known for their resilience and adaptability, making them excellent choices for bonsai enthusiasts of all skill levels. This specimen has been trained using traditional Japanese techniques and comes with detailed care instructions to help you maintain its beauty for years to come.\n\nThe tree is potted in a high-quality ceramic pot that complements its natural beauty and provides excellent drainage. Each tree is unique, with its own character and personality, making it a truly special addition to your collection.",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
      "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600"
    ],
    category: "Trees",
    rating: 4.8,
    reviewCount: 127,
    inStock: true,
    stockQuantity: 8,
    dimensions: {
      height: "12 inches",
      width: "8 inches",
      depth: "6 inches"
    },
    careLevel: "Beginner",
    age: "5 years",
    features: [
      "Naturally curved trunk with mature bark",
      "Dense, healthy foliage",
      "Professional training and shaping",
      "High-quality ceramic pot included",
      "Detailed care instructions",
      "Certificate of authenticity"
    ],
    specifications: {
      "Species": "Juniperus chinensis",
      "Style": "Windswept (Fukinagashi)",
      "Pot Material": "Unglazed ceramic",
      "Soil Type": "Well-draining bonsai mix",
      "Watering": "Moderate",
      "Light": "Full sun to partial shade",
      "Temperature": "Hardy to -20°F (-29°C)",
      "Fertilizer": "Balanced, slow-release"
    }
  };

  // Mock reviews data
  const mockReviews: Review[] = [
    {
      id: 1,
      userName: "Sarah M.",
      rating: 5,
      date: "2024-01-15",
      comment: "Absolutely beautiful tree! The quality exceeded my expectations. It arrived in perfect condition and the care instructions are very helpful. Highly recommend!",
      helpful: 12
    },
    {
      id: 2,
      userName: "Michael R.",
      rating: 5,
      date: "2024-01-10",
      comment: "This is my first bonsai and I'm so glad I chose this one. The tree is healthy and well-shaped. The customer service was excellent too.",
      helpful: 8
    },
    {
      id: 3,
      userName: "Jennifer L.",
      rating: 4,
      date: "2024-01-05",
      comment: "Great quality bonsai. The trunk has nice character and the foliage is dense. Only giving 4 stars because shipping took longer than expected.",
      helpful: 5
    }
  ];

  useEffect(() => {
    // Simulate API call
    const fetchProduct = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setProduct(mockProduct);
      setReviews(mockReviews);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product?.stockQuantity!) {
      setQuantity(newQuantity);
    }
  };

  const addToCart = () => {
    // Add to cart logic here
    alert(`${quantity} ${product?.name} added to cart!`);
  };

  const addToWishlist = () => {
    // Add to wishlist logic here
    alert(`${product?.name} added to wishlist!`);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-12 bg-gray-200 rounded w-1/3"></div>
              </div>
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-green-600 hover:text-green-700 transition-colors text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Previous Page
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 sm:mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg"
              />
              {product.originalPrice && (
                <div className="absolute top-4 left-4 bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                  Sale
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index 
                      ? 'border-green-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-16 sm:h-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                </div>
                <span className="text-gray-600 text-sm sm:text-base">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              <p className="text-gray-600 text-sm sm:text-base">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3">
              <span className="text-3xl sm:text-4xl font-bold text-green-600">
                ৳{product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ৳{product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                product.inStock ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className={`text-sm ${
                product.inStock ? 'text-green-600' : 'text-red-600'
              }`}>
                {product.inStock ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
              </span>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-200">
              <div>
                <span className="text-sm text-gray-500">Care Level</span>
                <p className="font-medium text-gray-900">{product.careLevel}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Age</span>
                <p className="font-medium text-gray-900">{product.age}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Height</span>
                <p className="font-medium text-gray-900">{product.dimensions.height}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Width</span>
                <p className="font-medium text-gray-900">{product.dimensions.width}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span id="quantity" className="px-4 py-2 border-x border-gray-300 text-center min-w-[3rem]">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stockQuantity}
                  className="px-3 py-2 text-gray-600 hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <Button
                variant="primary"
                onClick={addToCart}
                disabled={!product.inStock}
                className="flex-1"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              <Button
                variant="secondary"
                onClick={addToWishlist}
                className="flex-1"
              >
                <Heart className="h-4 w-4 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Additional Actions */}
            <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
              <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </button>
              <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Ask Question
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <Truck className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">30-Day Returns</p>
              </div>
              <div className="text-center">
                <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Expert Care</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-4 sm:px-6 overflow-x-auto">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'features', label: 'Features' },
                { id: 'reviews', label: `Reviews (${reviews.length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm sm:text-base whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                  {product.longDescription}
                </p>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border-b border-gray-100 pb-3">
                    <dt className="font-medium text-gray-900 text-sm sm:text-base">{key}</dt>
                    <dd className="text-gray-600 text-sm sm:text-base">{value}</dd>
                  </div>
                ))}
              </div>
            )}

            {/* Features Tab */}
            {activeTab === 'features' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {reviews.map(review => (
                  <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm sm:text-base">{review.userName}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm sm:text-base mt-2">{review.comment}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        Helpful ({review.helpful})
                      </button>
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

export default ProductDetails; 