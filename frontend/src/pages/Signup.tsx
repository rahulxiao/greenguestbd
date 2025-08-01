import React, { useState } from 'react';
import { Button, Input } from '../components';
import { Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    alert('Signup functionality would be implemented here!');
  };

  const handleGoogleSignup = () => {
    alert('Google signup would be implemented here!');
  };

  const handleFacebookSignup = () => {
    alert('Facebook signup would be implemented here!');
  };

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

      {/* Floating Animation Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-4xl text-green-400/30 animate-bounce">🍃</div>
        <div className="absolute top-20 right-20 text-3xl text-emerald-400/40 animate-pulse" style={{animationDelay: '1s'}}>🌿</div>
        <div className="absolute bottom-20 left-20 text-5xl text-teal-400/30 animate-bounce" style={{animationDelay: '2s'}}>🌱</div>
        <div className="absolute bottom-10 right-10 text-4xl text-green-400/40 animate-pulse" style={{animationDelay: '3s'}}>🍀</div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full shadow-lg">
                <span className="text-3xl">🌳</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Join BonsaiMarket</h1>
            <p className="text-green-600">Create your account and start your bonsai journey</p>
          </div>

          {/* Signup Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200">
            <form onSubmit={handleSignup} className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  icon="👤"
                />
                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  icon="👤"
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                fullWidth
                icon="📧"
              />

              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleInputChange}
                required
                fullWidth
                icon="🔒"
              />

              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                fullWidth
                icon="🔒"
              />

              {/* Terms and Conditions */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500 mt-1"
                  required
                />
                <label className="ml-2 text-sm text-green-700">
                  I agree to the{' '}
                  <Link to="/terms" className="text-green-600 hover:text-green-800 font-semibold">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-green-600 hover:text-green-800 font-semibold">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                🌱 Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-1 border-t border-green-200"></div>
              <span className="px-4 text-sm text-green-600">or sign up with</span>
              <div className="flex-1 border-t border-green-200"></div>
            </div>

            {/* Social Signup Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                size="medium"
                fullWidth
                onClick={handleGoogleSignup}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <span className="mr-2">🔍</span>
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                size="medium"
                fullWidth
                onClick={handleFacebookSignup}
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <span className="mr-2">📘</span>
                Continue with Facebook
              </Button>
            </div>

            {/* Login Link */}
            <div className="mt-8 text-center">
              <p className="text-green-600">
                Already have an account?{' '}
                <Link to="/login" className="text-green-700 font-semibold hover:text-green-800 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link to="/" className="text-green-600 hover:text-green-800 transition-colors flex items-center justify-center gap-2">
              <span>←</span>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 