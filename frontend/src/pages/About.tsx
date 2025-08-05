import React from 'react';
import { TreePine, Heart, Shield, Truck, Users, Award } from 'lucide-react';
import { Header, Footer } from '../components';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <TreePine className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About BonsaiMarket
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Cultivating the art of bonsai and bringing the beauty of miniature trees to enthusiasts worldwide.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                Founded in 2020, BonsaiMarket began as a passion project by a group of bonsai enthusiasts 
                who wanted to make the ancient art of bonsai more accessible to everyone. What started as 
                a small local nursery has grown into a trusted destination for bonsai lovers worldwide.
              </p>
              <p>
                Our journey began when our founder, a master bonsai artist with over 20 years of experience, 
                realized that many people were intimidated by the complexity of bonsai care. We set out to 
                change that by providing not just beautiful trees, but also comprehensive education and 
                support for every step of the bonsai journey.
              </p>
              <p>
                Today, we're proud to serve thousands of customers across the globe, from complete beginners 
                to experienced collectors. Our mission remains the same: to share the beauty, tranquility, 
                and mindfulness that bonsai brings to our lives.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800"
              alt="Bonsai garden"
              className="rounded-lg shadow-lg w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Mission & Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Passion for Bonsai</h3>
              <p className="text-gray-600">
                We're driven by our deep love for bonsai and the desire to share this beautiful art form 
                with others. Every tree we offer is carefully selected and nurtured with care.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality & Trust</h3>
              <p className="text-gray-600">
                We maintain the highest standards of quality in everything we do. From our trees to our 
                tools, you can trust that you're getting the best products available.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Community First</h3>
              <p className="text-gray-600">
                We believe in building a supportive community of bonsai enthusiasts. We're here to help 
                you succeed in your bonsai journey, no matter your experience level.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <Truck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reliable Service</h3>
              <p className="text-gray-600">
                We understand that your bonsai trees are precious. That's why we provide careful packaging, 
                fast shipping, and exceptional customer service to ensure your trees arrive safely.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Knowledge</h3>
              <p className="text-gray-600">
                Our team includes certified bonsai masters and horticultural experts who are always ready 
                to share their knowledge and help you care for your trees.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <TreePine className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sustainable Practices</h3>
              <p className="text-gray-600">
                We're committed to sustainable growing practices and environmental responsibility. 
                We work with responsible growers and use eco-friendly packaging materials.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                alt="Team member"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-1">David Chen</h3>
              <p className="text-green-600 mb-2">Founder & Master Bonsai Artist</p>
              <p className="text-gray-600 text-sm">
                With over 20 years of experience, David is a certified bonsai master who has won numerous 
                awards for his artistic creations.
              </p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400"
                alt="Team member"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Sarah Johnson</h3>
              <p className="text-green-600 mb-2">Head of Customer Experience</p>
              <p className="text-gray-600 text-sm">
                Sarah ensures every customer receives personalized attention and expert guidance 
                throughout their bonsai journey.
              </p>
            </div>
            
            <div className="text-center">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
                alt="Team member"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-1">Michael Rodriguez</h3>
              <p className="text-green-600 mb-2">Horticultural Specialist</p>
              <p className="text-gray-600 text-sm">
                Michael holds a degree in horticulture and specializes in bonsai care, helping customers 
                with technical questions and care advice.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">BonsaiMarket by the Numbers</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">10,000+</div>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <p className="text-gray-600">Bonsai Varieties</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">50+</div>
              <p className="text-gray-600">Countries Served</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">4.9★</div>
              <p className="text-gray-600">Customer Rating</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Bonsai Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who have discovered the joy of bonsai.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Shop Our Collection
            </button>
            <button className="px-8 py-3 border border-green-600 text-green-600 rounded-md font-medium hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Contact Us
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About; 