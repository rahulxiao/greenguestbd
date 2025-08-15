import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Input } from '../components';
import { authService, adminService, LoginData, AdminLoginData } from '../services';
import { Eye, EyeOff, User, Shield } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginMode, setLoginMode] = useState<'user' | 'admin'>('user');
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: ''
  });
  const [adminFormData, setAdminFormData] = useState<AdminLoginData>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the return URL from location state, or default to home
  const from = (location.state as any)?.from?.pathname || '/';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (loginMode === 'user') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setAdminFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginMode === 'user') {
      if (!formData.email.trim() || !formData.password.trim()) {
        setError('Please fill in all fields');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await authService.login(formData);
        
        if (response.success) {
          // Redirect to the page they were trying to access, or home
          navigate(from, { replace: true });
        } else {
          setError(response.message || 'Login failed. Please check your credentials.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
        setError(errorMessage);
        console.error('Login error:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Admin login
      if (!adminFormData.email.trim() || !adminFormData.password.trim()) {
        setError('Please fill in all fields');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await adminService.loginAdmin(adminFormData);
        
        if (response.success && response.admin) {
          // For admin login, always redirect to admin page
          navigate('/admin', { replace: true });
        } else {
          setError(response.message || 'Admin login failed. Please check your credentials.');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Admin login failed. Please try again.';
        setError(errorMessage);
        console.error('Admin login error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const toggleLoginMode = () => {
    setLoginMode(prev => prev === 'user' ? 'admin' : 'user');
    setError(null);
    setFormData({ email: '', password: '' });
    setAdminFormData({ email: '', password: '' });
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
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-full shadow-lg">
                <span className="text-3xl">🌳</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">
              {loginMode === 'user' ? 'Welcome Back' : 'Admin Access'}
            </h1>
            <p className="text-green-600">
              {loginMode === 'user' 
                ? 'Sign in to continue your bonsai journey' 
                : 'Access admin dashboard and management tools'
              }
            </p>
          </div>

          {/* Login Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-green-200">
              <div className="flex">
                <button
                  onClick={() => setLoginMode('user')}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    loginMode === 'user'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-green-600 hover:text-green-800'
                  }`}
                >
                  <User className="h-4 w-4" />
                  User Login
                </button>
                <button
                  onClick={() => setLoginMode('admin')}
                  className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    loginMode === 'admin'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-green-600 hover:text-green-800'
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Admin Login
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              <div className="flex items-center">
                <span className="text-red-500 mr-2">⚠️</span>
                {error}
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-200">
            <form onSubmit={handleLogin} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={loginMode === 'user' ? formData.email : adminFormData.email}
                onChange={handleInputChange}
                required
                fullWidth
                icon="📧"
                disabled={loading}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={loginMode === 'user' ? (showPassword ? 'text' : 'password') : (showAdminPassword ? 'text' : 'password')}
                  name="password"
                  placeholder="Enter your password"
                  value={loginMode === 'user' ? formData.password : adminFormData.password}
                  onChange={handleInputChange}
                  required
                  fullWidth
                  icon="🔒"
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => loginMode === 'user' ? setShowPassword(!showPassword) : setShowAdminPassword(!showAdminPassword)}
                  disabled={loading}
                >
                  {loginMode === 'user' ? (
                    showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />
                  ) : (
                    showAdminPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Remember Me & Forgot Password - Only for User Login */}
              {loginMode === 'user' && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                      disabled={loading}
                    />
                    <label htmlFor="remember-me" className="ml-2 text-sm text-green-700">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link to="/forgot-password" className="text-green-600 hover:text-green-800 font-semibold transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {loginMode === 'user' ? 'Signing In...' : 'Admin Signing In...'}
                  </div>
                ) : (
                  loginMode === 'user' ? '🌱 Sign In' : '🛡️ Admin Sign In'
                )}
              </Button>
            </form>

            {/* Signup Link - Only for User Login */}
            {loginMode === 'user' && (
              <div className="mt-8 text-center">
                <p className="text-green-600">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-green-700 font-semibold hover:text-green-800 transition-colors">
                    Create one here
                  </Link>
                </p>
              </div>
            )}

            {/* Admin Info - Only for Admin Login */}
            {loginMode === 'admin' && (
              <div className="mt-8 text-center">
                <p className="text-green-600 text-sm">
                  Need admin access? Contact your system administrator
                </p>
              </div>
            )}
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <button
              onClick={handleBackToHome}
              className="text-green-600 hover:text-green-800 transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <span>←</span>
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 