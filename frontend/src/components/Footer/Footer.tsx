import React from 'react';

interface FooterProps {
  companyName?: string;
  year?: number;
}

const Footer: React.FC<FooterProps> = ({
  companyName = "BonsaiMarket",
  year = new Date().getFullYear()
}) => {
  return (
    <footer className="bg-gradient-to-br from-green-800 via-emerald-800 to-teal-800 text-white py-16 relative overflow-hidden">
      {/* Background Nature Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 text-6xl text-green-300 transform rotate-12">🍃</div>
        <div className="absolute top-20 right-20 text-4xl text-emerald-300 transform -rotate-12">🌿</div>
        <div className="absolute bottom-20 left-20 text-5xl text-teal-300 transform rotate-45">🌱</div>
        <div className="absolute bottom-10 right-10 text-3xl text-green-300 transform -rotate-30">🍀</div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-2 rounded-full shadow-lg">
                <span className="text-2xl">🌳</span>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                {companyName}
              </h3>
            </div>
            <p className="text-green-100 text-sm leading-relaxed">
              Your trusted source for authentic bonsai trees, tools, and accessories. 
              Cultivating beauty and tranquility for over 20 years.
            </p>
          </div>
          
          {/* Shop Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold mb-4 text-green-200 flex items-center gap-2">
              🛍️ Shop
            </h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              <li><a href="#bonsai-trees" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">🌳 Bonsai Trees</a></li>
              <li><a href="#tools-supplies" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">🔧 Tools & Supplies</a></li>
              <li><a href="#pots-containers" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">🏺 Pots & Containers</a></li>
              <li><a href="#care-accessories" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">✨ Care Accessories</a></li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold mb-4 text-green-200 flex items-center gap-2">
              🆘 Support
            </h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              <li><a href="#care-guides" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">📖 Care Guides</a></li>
              <li><a href="#shipping-info" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">🚚 Shipping Info</a></li>
              <li><a href="#returns" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">↩️ Returns</a></li>
              <li><a href="#contact-us" className="text-green-100 no-underline transition-all duration-300 text-sm hover:text-green-200 hover:translate-x-1 flex items-center gap-2">📞 Contact Us</a></li>
            </ul>
          </div>
          
          {/* Connect */}
          <div className="flex flex-col gap-4">
            <h4 className="text-lg font-semibold mb-4 text-green-200 flex items-center gap-2">
              🌐 Connect
            </h4>
            <div className="flex gap-3">
              <a href="#" className="w-12 h-12 bg-gradient-to-br from-green-700 to-emerald-700 rounded-xl flex items-center justify-center text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-110 shadow-lg">
                📘
              </a>
              <a href="#" className="w-12 h-12 bg-gradient-to-br from-green-700 to-emerald-700 rounded-xl flex items-center justify-center text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-110 shadow-lg">
                🐦
              </a>
              <a href="#" className="w-12 h-12 bg-gradient-to-br from-green-700 to-emerald-700 rounded-xl flex items-center justify-center text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-110 shadow-lg">
                📷
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="border-t border-green-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-green-100 text-sm">
              © {year} {companyName}. All rights reserved. 🌱
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <a href="#terms" className="text-green-100 no-underline text-sm transition-colors duration-300 hover:text-green-200">Terms of Service</a>
              <span className="text-green-200 font-semibold">•</span>
              <a href="#privacy" className="text-green-100 no-underline text-sm transition-colors duration-300 hover:text-green-200">Privacy Policy</a>
              <span className="text-green-200 font-semibold">•</span>
              <a href="#cookies" className="text-green-100 no-underline text-sm transition-colors duration-300 hover:text-green-200">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 