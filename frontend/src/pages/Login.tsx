import React, { useState } from 'react';
import { Button, Input } from '../components';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Login functionality would be implemented here!');
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full shadow-lg">
                <span className="text-3xl">🌳</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Welcome Back</h1>
            <p className="text-green-600">Sign in to your BonsaiMarket account</p>
          </div>

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200">
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                icon="📧"
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                icon="🔒"
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                  />
                  <span className="ml-2 text-sm text-green-700">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-800 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                🌱 Sign In
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-green-600">
                Don't have an account?{' '}
                <Link to="/signup" className="text-green-700 font-semibold hover:text-green-800 transition-colors">
                  Sign up here
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

export default Login; 