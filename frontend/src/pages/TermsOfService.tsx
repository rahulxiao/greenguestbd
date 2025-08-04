import React from 'react';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Background Nature Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 text-8xl text-green-600 transform rotate-12">🍃</div>
        <div className="absolute top-40 right-20 text-6xl text-green-500 transform -rotate-12">🌿</div>
        <div className="absolute bottom-40 left-20 text-7xl text-green-600 transform rotate-45">🌱</div>
        <div className="absolute bottom-20 right-10 text-5xl text-green-500 transform -rotate-30">🍀</div>
        <div className="absolute top-1/2 left-1/4 text-6xl text-green-400 transform rotate-15">🌾</div>
        <div className="absolute top-1/3 right-1/3 text-5xl text-green-600 transform -rotate-45">🌺</div>
      </div>

      <div className="relative z-10 min-h-screen py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full shadow-lg">
                <span className="text-3xl">🌳</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-green-800 mb-2">Terms of Service</h1>
            <p className="text-green-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200">
            <div className="prose prose-green max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">1. Acceptance of Terms</h2>
                <p className="text-green-700 mb-4">
                  By accessing and using BonsaiMarket ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">2. Description of Service</h2>
                <p className="text-green-700 mb-4">
                  BonsaiMarket is an online marketplace specializing in bonsai trees, tools, pots, and accessories. We provide a platform for users to browse, purchase, and learn about bonsai cultivation.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">3. User Accounts</h2>
                <p className="text-green-700 mb-4">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">4. Product Information</h2>
                <p className="text-green-700 mb-4">
                  We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">5. Pricing and Payment</h2>
                <p className="text-green-700 mb-4">
                  All prices are subject to change without notice. Payment must be made at the time of purchase. We accept various payment methods as indicated during checkout.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">6. Shipping and Delivery</h2>
                <p className="text-green-700 mb-4">
                  Shipping times may vary depending on product availability and location. We are not responsible for delays beyond our control. Live plants require special handling and may have specific shipping requirements.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">7. Returns and Refunds</h2>
                <p className="text-green-700 mb-4">
                  Due to the nature of live plants, returns are subject to specific conditions. Please review our return policy for detailed information about eligible items and return procedures.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">8. Prohibited Uses</h2>
                <p className="text-green-700 mb-4">
                  You may not use the Service for any unlawful purpose or to solicit others to perform unlawful acts. You may not violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">9. Intellectual Property</h2>
                <p className="text-green-700 mb-4">
                  The Service and its original content, features, and functionality are and will remain the exclusive property of BonsaiMarket and its licensors. The Service is protected by copyright, trademark, and other laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">10. Limitation of Liability</h2>
                <p className="text-green-700 mb-4">
                  In no event shall BonsaiMarket, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">11. Changes to Terms</h2>
                <p className="text-green-700 mb-4">
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">12. Contact Information</h2>
                <p className="text-green-700 mb-4">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700">Email: legal@bonsaimarket.com</p>
                  <p className="text-green-700">Phone: +1 (555) 123-4567</p>
                  <p className="text-green-700">Address: 123 Bonsai Street, Garden City, GC 12345</p>
                </div>
              </section>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center mt-8 space-y-4">
            <Link 
              to="/privacy" 
              className="inline-block text-green-600 hover:text-green-800 transition-colors font-semibold"
            >
              View Privacy Policy →
            </Link>
            <div>
              <Link 
                to="/" 
                className="text-green-600 hover:text-green-800 transition-colors flex items-center justify-center gap-2"
              >
                <span>←</span>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 