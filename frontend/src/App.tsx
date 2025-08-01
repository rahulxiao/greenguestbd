import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Header, Card, Button, Input, Footer } from './components';
import Login from './pages/Login';
import Signup from './pages/Signup';

function HomePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGetStarted = () => {
    alert('Get Started clicked!');
  };

  const handleLearnMore = () => {
    alert('Learn More clicked!');
  };

  const handleMenuClick = () => {
    alert('Mobile menu clicked!');
  };

  const handleAddToCart = (productName: string) => {
    alert(`${productName} added to cart!`);
  };

  // Mock product data
  const products = [
    {
      id: 1,
      name: "Premium Juniper Bonsai",
      description: "A stunning 5-year-old Juniper bonsai with intricate branch structure",
      price: "$189.99",
      rating: 4.8,
      reviews: 127
    },
    {
      id: 2,
      name: "Japanese Maple Bonsai",
      description: "Beautiful red-leaved maple perfect for autumn display",
      price: "$249.99",
      rating: 4.9,
      reviews: 89
    },
    {
      id: 3,
      name: "Beginner Bonsai Kit",
      description: "Complete starter kit with tools and care guide",
      price: "$89.99",
      rating: 4.7,
      reviews: 234
    },
    {
      id: 4,
      name: "Ficus Bonsai Tree",
      description: "Indoor-friendly ficus with glossy green leaves",
      price: "$159.99",
      rating: 4.6,
      reviews: 156
    },
    {
      id: 5,
      name: "Pine Bonsai Collection",
      description: "Set of 3 miniature pine trees in decorative pots",
      price: "$299.99",
      rating: 4.9,
      reviews: 67
    },
    {
      id: 6,
      name: "Bonsai Pruning Shears",
      description: "Professional-grade stainless steel shears",
      price: "$45.99",
      rating: 4.8,
      reviews: 189
    },
    {
      id: 7,
      name: "Ceramic Bonsai Pot",
      description: "Handcrafted ceramic pot with drainage holes",
      price: "$34.99",
      rating: 4.7,
      reviews: 98
    },
    {
      id: 8,
      name: "Bonsai Care Guide",
      description: "Comprehensive care manual with seasonal tips",
      price: "$19.99",
      rating: 4.9,
      reviews: 312
    }
  ];

  const categories = [
    {
      name: "Trees",
      description: "Discover our bonsai tree collection",
      icon: "🌳"
    },
    {
      name: "Tools",
      description: "Professional bonsai tools and equipment",
      icon: "🔧"
    },
    {
      name: "Pots",
      description: "Beautiful ceramic and stone containers",
      icon: "🏺"
    },
    {
      name: "Accessories",
      description: "Care products and decorative items",
      icon: "✨"
    }
  ];

  const renderStars = (rating: number) => {
    const stars: React.ReactElement[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Background Leaf Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-8xl text-green-600 transform rotate-12">🍃</div>
        <div className="absolute top-40 right-20 text-6xl text-green-500 transform -rotate-12">🌿</div>
        <div className="absolute bottom-40 left-20 text-7xl text-green-600 transform rotate-45">🌱</div>
        <div className="absolute bottom-20 right-10 text-5xl text-green-500 transform -rotate-30">🍀</div>
        <div className="absolute top-1/2 left-1/4 text-6xl text-green-400 transform rotate-15">🌾</div>
        <div className="absolute top-1/3 right-1/3 text-5xl text-green-600 transform -rotate-45">🌺</div>
      </div>

      <Header onMenuClick={handleMenuClick} />
      
      <main className="flex-1 relative z-10">
        {/* Hero Section with Nature Background */}
        <section className="relative py-20 overflow-hidden">
          {/* Hero Background with Nature Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800">
            <div className="absolute inset-0 bg-black/20"></div>
            {/* Floating Leaves */}
            <div className="absolute top-10 left-10 animate-bounce text-4xl text-green-300/30">🍃</div>
            <div className="absolute top-20 right-20 animate-pulse text-3xl text-green-200/40">🌿</div>
            <div className="absolute bottom-20 left-20 animate-bounce text-5xl text-green-300/30" style={{animationDelay: '1s'}}>🌱</div>
            <div className="absolute bottom-10 right-10 animate-pulse text-4xl text-green-200/40" style={{animationDelay: '2s'}}>🍀</div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 shadow-2xl">
              <h1 className="text-6xl font-bold mb-6 text-white drop-shadow-lg">
                Welcome to BonsaiMarket
              </h1>
              <p className="text-xl mb-10 max-w-3xl mx-auto text-green-100 leading-relaxed">
                Your trusted source for authentic bonsai trees, tools, and accessories. 
                Cultivating beauty and tranquility for over 20 years.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button variant="secondary" size="large" onClick={handleGetStarted} className="shadow-lg">
                  🌱 Shop Now
                </Button>
                <Button variant="outline" size="large" onClick={handleLearnMore} className="border-white text-white hover:bg-white hover:text-green-800">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Section with Nature Theme */}
        <section className="py-16 relative">
          {/* Section Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-emerald-100/30"></div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-800 mb-4">🌳 Our Bonsai Collection</h2>
              <p className="text-green-600 text-lg">Discover the art of miniature trees</p>
            </div>
            
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-green-800">Trees</h3>
              <span className="text-green-600 bg-green-100 px-4 py-2 rounded-full">Showing {products.length} products</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {products.map((product) => (
                <Card key={product.id} variant="elevated" size="medium" className="h-full bg-white/80 backdrop-blur-sm border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-200 h-48 mb-4 rounded-lg flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-300/20 to-emerald-400/20"></div>
                    <span className="text-6xl">🌳</span>
                    <span className="absolute bottom-2 right-2 text-xs text-green-600 bg-white/80 px-2 py-1 rounded">Product Image</span>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">{product.name}</h3>
                  <p className="text-green-600 text-sm mb-3">{product.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">{product.price}</span>
                    <div className="flex items-center gap-1">
                      {renderStars(product.rating)}
                      <span className="text-sm text-green-500 ml-1">({product.reviews})</span>
                    </div>
                  </div>
                  <Button 
                    variant="primary" 
                    size="medium" 
                    fullWidth
                    onClick={() => handleAddToCart(product.name)}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    🛒 Add to Cart
                  </Button>
                </Card>
              ))}
            </div>

            {/* Pagination with Nature Theme */}
            <div className="flex justify-center items-center gap-3">
              <button className="px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors">‹</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-lg">1</button>
              <button className="px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors">2</button>
              <button className="px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors">3</button>
              <button className="px-4 py-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors">›</button>
            </div>
          </div>
        </section>

        {/* Categories Section with Nature Background */}
        <section className="py-16 bg-gradient-to-br from-emerald-100 via-green-100 to-teal-100 relative">
          {/* Floating Nature Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-10 left-10 text-4xl text-green-400/30 animate-bounce">🍃</div>
            <div className="absolute top-20 right-20 text-3xl text-emerald-400/40 animate-pulse" style={{animationDelay: '1s'}}>🌿</div>
            <div className="absolute bottom-20 left-20 text-5xl text-teal-400/30 animate-bounce" style={{animationDelay: '2s'}}>🌱</div>
            <div className="absolute bottom-10 right-10 text-4xl text-green-400/40 animate-pulse" style={{animationDelay: '3s'}}>🍀</div>
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-green-800 mb-4">🌿 Shop by Category</h2>
              <p className="text-green-600 text-lg">Explore our complete bonsai collection</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {categories.map((category, index) => (
                <Card key={index} variant="elevated" size="medium" className="text-center bg-white/90 backdrop-blur-sm border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
                  <div className="bg-gradient-to-br from-green-200 to-emerald-300 h-32 mb-4 rounded-lg flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-300/30 to-emerald-400/30"></div>
                    <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{category.icon}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-green-800 mb-2">{category.name}</h3>
                  <p className="text-green-600 text-sm">{category.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
