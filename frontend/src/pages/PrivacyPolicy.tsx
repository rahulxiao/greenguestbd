import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
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
            <h1 className="text-4xl font-bold text-green-800 mb-2">Privacy Policy</h1>
            <p className="text-green-600">Last updated: {new Date().toLocaleDateString()}</p>
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200">
            <div className="prose prose-green max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">1. Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 mb-2">Personal Information</h3>
                    <p className="text-green-700">
                      We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This may include your name, email address, phone number, shipping address, and payment information.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 mb-2">Usage Information</h3>
                    <p className="text-green-700">
                      We automatically collect certain information about your use of our website, including your IP address, browser type, operating system, pages visited, and time spent on pages.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">2. How We Use Your Information</h2>
                <p className="text-green-700 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-green-700 space-y-2 ml-4">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your account and orders</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Prevent fraud and ensure security</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">3. Information Sharing</h2>
                <p className="text-green-700 mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc list-inside text-green-700 space-y-2 ml-4">
                  <li>With your explicit consent</li>
                  <li>To process payments (payment processors)</li>
                  <li>To fulfill orders (shipping partners)</li>
                  <li>To comply with legal requirements</li>
                  <li>To protect our rights and safety</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">4. Cookies and Tracking</h2>
                <p className="text-green-700 mb-4">
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand where our visitors are coming from. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">5. Data Security</h2>
                <p className="text-green-700 mb-4">
                  We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">6. Your Rights</h2>
                <p className="text-green-700 mb-4">
                  You have the right to:
                </p>
                <ul className="list-disc list-inside text-green-700 space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent for data processing</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">7. Children's Privacy</h2>
                <p className="text-green-700 mb-4">
                  Our website is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">8. International Transfers</h2>
                <p className="text-green-700 mb-4">
                  Your information may be transferred to and processed in countries other than your own. We ensure that such transfers comply with applicable data protection laws and implement appropriate safeguards.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">9. Third-Party Links</h2>
                <p className="text-green-700 mb-4">
                  Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">10. Changes to This Policy</h2>
                <p className="text-green-700 mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">11. Contact Us</h2>
                <p className="text-green-700 mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us at:
                </p>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-green-700">Email: privacy@bonsaimarket.com</p>
                  <p className="text-green-700">Phone: +1 (555) 123-4567</p>
                  <p className="text-green-700">Address: 123 Bonsai Street, Garden City, GC 12345</p>
                </div>
              </section>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center mt-8 space-y-4">
            <Link 
              to="/terms" 
              className="inline-block text-green-600 hover:text-green-800 transition-colors font-semibold"
            >
              View Terms of Service →
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

export default PrivacyPolicy; 