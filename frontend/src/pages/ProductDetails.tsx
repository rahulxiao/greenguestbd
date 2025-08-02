import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Header } from '../components';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  stock: number;
  available: boolean;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: string;
  specifications?: string;
  rating: number;
  reviewCount: number;
  tags?: string;
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Mock product data - in real app, this would come from API
    const mockProduct: Product = {
      id: parseInt(id || '1'),
      name: "Premium Juniper Bonsai",
      category: "Trees",
      price: 189.99,
      description: "A stunning 5-year-old Juniper bonsai with intricate branch structure.",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      stock: 15,
      available: true,
      brand: "BonsaiMaster",
      sku: "JUN-001",
      weight: 2.5,
      dimensions: "12\" x 8\" x 6\"",
      specifications: "Age: 5 years\nHeight: 12 inches\nPot: Unglazed ceramic",
      rating: 4.8,
      reviewCount: 127,
      tags: "juniper,bonsai,outdoor"
    };

    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 500);
  }, [id]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>★</span>
    ));
  };

  const handleMenuClick = () => {
    alert('Mobile menu clicked!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Product Not Found</h2>
          <Button variant="primary" onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header onMenuClick={handleMenuClick} showCategories={false} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-green-600">
            <li><button onClick={() => navigate('/')} className="hover:text-green-800">Home</button></li>
            <li>/</li>
            <li><button onClick={() => navigate('/')} className="hover:text-green-800">{product.category}</button></li>
            <li>/</li>
            <li className="text-green-800 font-medium">{product.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="bg-white rounded-xl overflow-hidden shadow-lg">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-green-800 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {renderStars(product.rating)}
                  <span className="text-sm text-green-600 ml-2">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <span className="text-sm text-green-600">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price and Stock */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex items-baseline space-x-2 mb-4">
                <span className="text-4xl font-bold text-green-600">${product.price}</span>
                <span className="text-lg text-gray-500 line-through">$249.99</span>
                <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">24% OFF</span>
              </div>
              
              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${product.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-sm ${product.available ? 'text-green-600' : 'text-red-600'}`}>
                  {product.available ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>

              {/* Quantity */}
              <div className="flex items-center space-x-4 mb-6">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >-</button>
                  <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                  >+</button>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-y-3">
                <Button variant="primary" size="medium" fullWidth disabled={!product.available}>
                  🛒 Add to Cart
                </Button>
                <Button variant="secondary" size="medium" fullWidth disabled={!product.available}>
                  💳 Buy Now
                </Button>
              </div>
            </div>

            {/* Quick Info */}
            <Card variant="outlined" className="bg-white/80">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-gray-600">Brand:</span> <span className="ml-2 font-medium text-green-800">{product.brand}</span></div>
                <div><span className="text-gray-600">Category:</span> <span className="ml-2 font-medium text-green-800">{product.category}</span></div>
                <div><span className="text-gray-600">Weight:</span> <span className="ml-2 font-medium text-green-800">{product.weight} lbs</span></div>
                <div><span className="text-gray-600">Dimensions:</span> <span className="ml-2 font-medium text-green-800">{product.dimensions}</span></div>
              </div>
            </Card>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button className="py-4 px-1 border-b-2 border-green-500 text-green-600 font-medium">Description</button>
                <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">Specifications</button>
                <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">Reviews</button>
              </nav>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Product Description</h3>
              <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
              
              <h4 className="text-lg font-semibold text-green-800 mb-3">Key Features</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
                <li>Carefully cultivated specimen</li>
                <li>Dense, healthy foliage</li>
                <li>Well-developed root system</li>
                <li>Includes care guide</li>
              </ul>

              {product.specifications && (
                <>
                  <h4 className="text-lg font-semibold text-green-800 mb-3">Technical Specifications</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-line">{product.specifications}</pre>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 