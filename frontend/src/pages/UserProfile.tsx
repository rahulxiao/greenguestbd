import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Header, Footer } from '../components';
import { User, Edit, Camera, Lock, Package, Heart, Settings, ArrowLeft, Save, X, CheckCircle } from 'lucide-react';
import { userService, UpdateProfileData } from '../services/user.service';
import { orderService, Order } from '../services/order.service';
import { wishlistService, WishlistItem } from '../services/wishlist.service';

interface UserData {
  id: number;
  firstName?: string;
  lastName?: string;
  name?: string; // For backward compatibility with existing data
  email: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  // Profile fields are now directly on the main object
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  bio?: string;
  avatar?: string;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Get user data from localStorage (from signup/login)
  const [user, setUser] = useState<UserData | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    bio: ''
  });

  // State for orders, wishlist, and settings
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    newProducts: true,
    promotionalEmails: false
  });
  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    showEmail: false,
    allowReviews: true
  });
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Load user data from localStorage and fetch profile from backend
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('user');
        
        if (!token || !userData) {
          navigate('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        console.log('Loaded user data from localStorage:', parsedUser);
        
        // Convert string dates back to Date objects
        const userWithDates = {
          ...parsedUser,
          createdAt: parsedUser.createdAt ? new Date(parsedUser.createdAt) : new Date(),
          updatedAt: parsedUser.updatedAt ? new Date(parsedUser.updatedAt) : new Date()
        };
        
        setUser(userWithDates);
        
        // Now fetch profile data from backend
        try {
          console.log('Loading profile data for user ID:', userWithDates.id);
          const profileData = await userService.getProfile();
          console.log('Fetched profile data from backend:', profileData);
          
          // Update user state with backend profile data
          setUser(prevUser => {
            if (!prevUser) return prevUser;
            return {
              ...prevUser,
              // Profile fields are now directly on the main object
              address: profileData.address,
              city: profileData.city,
              state: profileData.state,
              country: profileData.country,
              postalCode: profileData.postalCode,
              bio: profileData.bio,
              avatar: profileData.avatar
            };
          });
          
          // Initialize form data with backend profile data
          const initialFormData = {
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            email: profileData.email || '',
            phoneNumber: profileData.phoneNumber || '',
            address: profileData.address || '',
            city: profileData.city || '',
            state: profileData.state || '',
            country: profileData.country || '',
            postalCode: profileData.postalCode || '',
            bio: profileData.bio || ''
          };
          
          console.log('Setting form data with backend profile:', initialFormData);
          setFormData(initialFormData);
          
        } catch (profileError) {
          console.log('Could not fetch profile from backend:', profileError);
          
          // Fallback to localStorage data if backend fetch fails
          const initialFormData = {
            firstName: userWithDates.firstName || '',
            lastName: userWithDates.lastName || '',
            email: userWithDates.email || '',
            phoneNumber: userWithDates.phoneNumber || '',
            address: userWithDates.address || '',
            city: userWithDates.city || '',
            state: userWithDates.state || '',
            country: userWithDates.country || '',
            postalCode: userWithDates.postalCode || '',
            bio: userWithDates.bio || ''
          };

          // Handle name parsing - check different possible name fields
          if (userWithDates.firstName && userWithDates.lastName) {
            initialFormData.firstName = userWithDates.firstName;
            initialFormData.lastName = userWithDates.lastName;
          } else if (userWithDates.name) {
            const nameParts = userWithDates.name.trim().split(' ');
            if (nameParts.length >= 2) {
              initialFormData.firstName = nameParts[0];
              initialFormData.lastName = nameParts.slice(1).join(' ');
            } else if (nameParts.length === 1) {
              initialFormData.firstName = nameParts[0];
              initialFormData.lastName = '';
            }
          } else if (userWithDates.firstName) {
            initialFormData.firstName = userWithDates.firstName;
            initialFormData.lastName = '';
          } else if (userWithDates.lastName) {
            initialFormData.firstName = '';
            initialFormData.lastName = userWithDates.lastName;
          }
          
          console.log('Setting form data with localStorage fallback:', initialFormData);
          setFormData(initialFormData);
        }
        
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [navigate]);

  // Mock orders data (replace with real API call later)
  // const orders: Order[] = [
  //   {
  //     id: "ORD-001",
  //     totalAmount: 235.98,
  //     status: "delivered",
  //     createdAt: new Date('2024-01-10'),
  //     items: [
  //       {
  //         id: 1,
  //         productId: 1,
  //         productName: "Premium Juniper Bonsai",
  //         quantity: 2,
  //         price: 89.99,
  //         imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150"
  //       },
  //       {
  //         id: 2,
  //         productId: 2,
  //         productName: "Ceramic Bonsai Pot",
  //         quantity: 1,
  //         price: 56.00,
  //         imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150"
  //       }
  //     ],
  //     orderNumber: "ORD-001",
  //     shippingAddress: "Dhaka, Bangladesh",
  //     paymentMethod: "Credit Card"
  //   },
  //   {
  //     id: "ORD-002",
  //     totalAmount: 189.99,
  //     status: "shipped",
  //     createdAt: new Date('2024-01-05'),
  //     items: [
  //       {
  //         id: 3,
  //         productId: 3,
  //         productName: "Japanese Maple Bonsai",
  //         quantity: 1,
  //         price: 189.99,
  //         imageUrl: "https://images.unsplash.com/photo-1518709268805-4-9042af2176?w=150"
  //       }
  //     ],
  //     orderNumber: "ORD-002",
  //     shippingAddress: "Dhaka, Bangladesh",
  //     paymentMethod: "PayPal"
  //   },
  //   {
  //     id: "ORD-003",
  //     totalAmount: 45.99,
  //     status: "pending",
  //     createdAt: new Date('2024-01-01'),
  //     items: [
  //       {
  //         id: 4,
  //         productId: 4,
  //         productName: "Bonsai Tool Set",
  //         quantity: 1,
  //         price: 45.99,
  //         imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=150"
  //       },
  //       {
  //         id: 5,
  //         productId: 5,
  //         productName: "Bonsai Soil Mix",
  //         quantity: 1,
  //         price: 12.99,
  //         imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150"
  //       }
  //     ],
  //     orderNumber: "ORD-003",
  //     shippingAddress: "Dhaka, Bangladesh",
  //     paymentMethod: "Credit Card"
  //   }
  // ];

  // Mock wishlist data (replace with real API call later)
  // const wishlistItems: WishlistItem[] = [
  //   {
  //     id: 1,
  //     productId: 1,
  //     productName: "Premium Juniper Bonsai",
  //     price: 189.99,
  //     imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150",
  //     category: "Trees",
  //     inStock: true,
  //     addedAt: new Date('2024-01-10')
  //   },
  //   {
  //     id: 2,
  //     productId: 2,
  //     productName: "Japanese Maple Bonsai",
  //     price: 249.99,
  //     imageUrl: "https://images.unsplash.com/photo-1518709268805-4-9042af2176?w=150",
  //     category: "Trees",
  //     inStock: false,
  //     addedAt: new Date('2024-01-05')
  //   },
  //   {
  //     id: 3,
  //     productId: 3,
  //     productName: "Ceramic Bonsai Pot",
  //     price: 34.99,
  //     imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150",
  //     category: "Pots",
  //     inStock: true,
  //     addedAt: new Date('2024-01-01')
  //   }
  // ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'shipped': return '📦';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  // Fetch orders data
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const ordersData = await orderService.getUserOrders();
      setOrders(ordersData);
    } catch (error) {
      console.log('Could not fetch orders from backend:', error);
      // Set empty array if backend fails or user has no orders
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Fetch wishlist data
  const fetchWishlist = async () => {
    try {
      setWishlistLoading(true);
      const wishlistData = await wishlistService.getUserWishlist();
      setWishlistItems(wishlistData);
    } catch (error) {
      console.log('Could not fetch wishlist from backend:', error);
      // Set empty array if backend fails or user has no wishlist items
      setWishlistItems([]);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Fetch settings data
  const fetchSettings = async () => {
    try {
      setSettingsLoading(true);
      const [notifSettings, privSettings] = await Promise.all([
        userService.getNotificationSettings(),
        userService.getPrivacySettings()
      ]);
      setNotificationSettings(notifSettings);
      setPrivacySettings(privSettings);
    } catch (error) {
      console.log('Could not fetch settings from backend, using defaults:', error);
      // Keep default values if backend fails
    } finally {
      setSettingsLoading(false);
    }
  };

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'orders') {
      fetchOrders();
    } else if (activeTab === 'wishlist') {
      fetchWishlist();
    } else if (activeTab === 'settings') {
      fetchSettings();
    }
  }, [activeTab]);

  // Handle wishlist actions
  const handleRemoveFromWishlist = async (itemId: number) => {
    try {
      await wishlistService.removeFromWishlist(itemId);
      // Remove item from local state
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      setSuccess('Item removed from wishlist');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to remove item from wishlist');
    }
  };

  const handleMoveToCart = async (itemId: number) => {
    try {
      await wishlistService.moveToCart(itemId);
      // Remove item from wishlist after moving to cart
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      setSuccess('Item moved to cart successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to move item to cart');
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await orderService.cancelOrder(orderId);
      // Update order status in local state
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' as const }
          : order
      ));
      setSuccess('Order cancelled successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      setError('Failed to cancel order');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // No validation needed for first name and last name since they cannot be changed
      // Only profile information can be updated

      // Prepare data for backend update - only profile data
      const updateData: UpdateProfileData = {
        // firstName and lastName are NOT included - they cannot be changed
        // Profile fields go directly to the backend, not nested
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        state: formData.state.trim() || undefined,
        country: formData.country.trim() || undefined,
        postalCode: formData.postalCode.trim() || undefined,
        bio: formData.bio.trim() || undefined
      };

      // Call backend API to update user profile
      const updatedUser = await userService.updateProfile(updateData);
      
      // Update local state with response from backend
      setUser(updatedUser);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      setSuccess('Profile information updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('Profile update error:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!user) return;
    
    // Reset form data to current user data
    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
      city: user.city || '',
      state: user.state || '',
      country: user.country || '',
      postalCode: user.postalCode || '',
      bio: user.bio || ''
    });
    
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  // Utility function to safely format dates
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return 'N/A';
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return 'N/A';
      return dateObj.toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600 text-lg">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-4">User not found</p>
          <Button onClick={() => navigate('/login')} variant="primary">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Ensure user has required properties with fallbacks
  const safeUser = {
    id: user.id || 0,
    firstName: '',
    lastName: '',
    email: user.email || 'No email',
    phoneNumber: user.phoneNumber || '',
    createdAt: user.createdAt || new Date(),
    updatedAt: user.updatedAt || new Date(),
    address: user.address || '',
    city: user.city || '',
    state: user.state || '',
    country: user.country || '',
    postalCode: user.postalCode || '',
    bio: user.bio || '',
    avatar: user.avatar || ''
  };

  // Handle name parsing for safeUser as well
  if (user.firstName && user.lastName) {
    safeUser.firstName = user.firstName;
    safeUser.lastName = user.lastName;
  } else if (user.name) {
    const nameParts = user.name.trim().split(' ');
    if (nameParts.length >= 2) {
      safeUser.firstName = nameParts[0];
      safeUser.lastName = nameParts.slice(1).join(' ');
    } else if (nameParts.length === 1) {
      safeUser.firstName = nameParts[0];
      safeUser.lastName = '';
    }
  } else if (user.firstName) {
    safeUser.firstName = user.firstName;
    safeUser.lastName = '';
  } else if (user.lastName) {
    safeUser.firstName = '';
    safeUser.lastName = user.lastName;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-green-600 hover:text-green-700 mb-3 sm:mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm sm:text-base">Back to Store</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">Manage your profile, orders, and preferences</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 mb-6 sm:mb-8">
          <div className="flex space-x-1 overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-md font-medium transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-green-100 text-green-700 shadow-sm'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.charAt(0)}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
              <p className="text-sm font-medium text-green-800">{success}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading profile information...</p>
            </div>
          </div>
        )}

        {/* Profile Content */}
        {!loading && activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white">
                <div className="text-center p-4 sm:p-6">
                  <div className="relative inline-block mb-4">
                    <img
                      src={safeUser.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"}
                      alt={`${safeUser.firstName} ${safeUser.lastName}`}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-green-200 shadow-lg"
                    />
                    <button className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-lg">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    {safeUser.firstName} {safeUser.lastName}
                  </h2>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">{safeUser.email}</p>
                  <div className="text-center mb-6">
                    <p className="text-sm text-gray-600">Member since</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {formatDate(safeUser.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Button 
                      variant="primary" 
                      fullWidth
                      onClick={() => setShowPasswordModal(true)}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button 
                      variant="secondary" 
                      fullWidth
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card className="bg-white">
                <div className="p-4 sm:p-6">
                  
                  <div className="flex justify-between items-center mb-4 sm:mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800">Profile Information</h3>
                    <Button
                      variant={isEditing ? "secondary" : "primary"}
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-2"
                    >
                      {isEditing ? (
                        <>
                          <X className="h-4 w-4" />
                          Cancel Edit
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4" />
                          Edit Profile Info
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <User className="h-4 w-4 mr-2 text-green-600" />
                        First Name <span className="text-gray-400 text-xs ml-2">(Cannot be changed)</span>
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName || safeUser.firstName || ''}
                        onChange={handleInputChange}
                        disabled={true}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base cursor-not-allowed"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <User className="h-4 w-4 mr-2 text-green-600" />
                        Last Name <span className="text-gray-400 text-xs ml-2">(Cannot be changed)</span>
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName || safeUser.lastName || ''}
                        onChange={handleInputChange}
                        disabled={true}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base cursor-not-allowed"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <svg className="h-4 w-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Email Address <span className="text-gray-400 text-xs ml-2">(Cannot be changed)</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={true}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base cursor-not-allowed"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                        <svg className="h-4 w-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Phone Number <span className="text-gray-400 text-xs ml-2">(Cannot be changed)</span>
                      </label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        disabled={true}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base cursor-not-allowed"
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <Button 
                          variant="primary" 
                          onClick={handleSave}
                          className="flex-1"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="secondary" 
                          onClick={handleCancel}
                          className="flex-1"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <X className="h-4 w-4 mr-2" />
                              Cancel
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Profile Information Section */}
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-green-600" />
                      Additional Profile Information
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg className="h-4 w-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Address
                        </label>
                        <input
                          id="address"
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your street address"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg className="h-4 w-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                          City
                        </label>
                        <input
                          id="city"
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your city"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg className="h-4 w-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                          </svg>
                          State/Province
                        </label>
                        <input
                          id="state"
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your state or province"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg className="h-4 w-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Country
                        </label>
                        <input
                          id="country"
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your country"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg className="h-4 w-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          Postal Code
                        </label>
                        <input
                          id="postalCode"
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Enter your postal code"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <svg className="h-4 w-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Bio
                        </label>
                        <textarea
                          id="bio"
                          name="bio"
                          value={formData.bio}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          rows={4}
                          placeholder="Tell us about yourself..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Orders Content */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Orders</h2>
              <div className="text-sm text-gray-500">
                {ordersLoading ? 'Loading...' : `${orders.length} order${orders.length !== 1 ? 's' : ''}`}
              </div>
            </div>

            {ordersLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your orders...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/search')}
                  className="inline-flex items-center"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 sm:py-4 px-3 sm:px-6 font-medium text-gray-800 text-sm">{order.id}</td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-600 text-sm">{order.items.length} items</td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-800 text-sm">৳{order.totalAmount.toFixed(2)}</td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              <span className="mr-1">{getStatusIcon(order.status)}</span>
                              {order.status}
                            </span>
                          </td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-600 text-sm">{formatDate(order.createdAt)}</td>
                          <td className="py-3 sm:py-4 px-3 sm:px-6 text-sm font-medium">
                            <button className="text-green-600 hover:text-green-900 mr-3">View</button>
                            {order.status === 'pending' && (
                              <button 
                                className="text-red-600 hover:text-red-900"
                                onClick={() => handleCancelOrder(order.id)}
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Wishlist Content */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Wishlist</h2>
              <div className="text-sm text-gray-500">
                {wishlistLoading ? 'Loading...' : `${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''}`}
              </div>
            </div>

            {wishlistLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your wishlist...</p>
              </div>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Wishlist is Empty</h3>
                <p className="text-gray-500 mb-4">Start adding products you love to your wishlist!</p>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/search')}
                  className="inline-flex items-center"
                >
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2">{item.productName}</h3>
                        <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">৳{item.price.toFixed(2)}</span>
                        <div className="flex space-x-2">
                          <button 
                            className="text-green-600 hover:text-green-800 text-sm font-medium"
                            onClick={() => handleMoveToCart(item.id)}
                          >
                            Add to Cart
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                            onClick={() => handleRemoveFromWishlist(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Settings Content */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Account Settings</h2>
              <div className="text-sm text-gray-500">
                {settingsLoading ? 'Loading...' : 'Manage your preferences'}
              </div>
            </div>

            {settingsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading your settings...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <Card className="bg-white">
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-3 w-4 h-4" 
                          checked={notificationSettings.orderUpdates}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, orderUpdates: e.target.checked }))}
                        />
                        <span className="text-gray-700 text-sm sm:text-base">Order updates</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-3 w-4 h-4" 
                          checked={notificationSettings.newProducts}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, newProducts: e.target.checked }))}
                        />
                        <span className="text-gray-700 text-sm sm:text-base">New products</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-3 w-4 h-4" 
                          checked={notificationSettings.promotionalEmails}
                          onChange={(e) => setNotificationSettings(prev => ({ ...prev, promotionalEmails: e.target.checked }))}
                        />
                        <span className="text-gray-700 text-sm sm:text-base">Promotional emails</span>
                      </label>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant="primary" 
                        size="small"
                        onClick={async () => {
                          try {
                            await userService.updateNotificationSettings(notificationSettings);
                            setSuccess('Notification settings updated successfully!');
                            setTimeout(() => setSuccess(null), 3000);
                          } catch (error) {
                            setError('Failed to update notification settings');
                          }
                        }}
                      >
                        Save Notifications
                      </Button>
                    </div>
                  </div>
                </Card>

                <Card className="bg-white">
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Privacy</h3>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-3 w-4 h-4" 
                          checked={privacySettings.publicProfile}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, publicProfile: e.target.checked }))}
                        />
                        <span className="text-gray-700 text-sm sm:text-base">Public profile</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-3 w-4 h-4" 
                          checked={privacySettings.showEmail}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, showEmail: e.target.checked }))}
                        />
                        <span className="text-gray-700 text-sm sm:text-base">Show email to others</span>
                      </label>
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className="mr-3 w-4 h-4" 
                          checked={privacySettings.allowReviews}
                          onChange={(e) => setPrivacySettings(prev => ({ ...prev, allowReviews: e.target.checked }))}
                        />
                        <span className="text-gray-700 text-sm sm:text-base">Allow reviews</span>
                      </label>
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant="primary" 
                        size="small"
                        onClick={async () => {
                          try {
                            await userService.updatePrivacySettings(privacySettings);
                            setSuccess('Privacy settings updated successfully!');
                            setTimeout(() => setSuccess(null), 3000);
                          } catch (error) {
                            setError('Failed to update privacy settings');
                          }
                        }}
                      >
                        Save Privacy
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Change Password</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  id="currentPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  id="newPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              <Button 
                variant="primary" 
                onClick={() => setShowPasswordModal(false)}
                className="flex-1"
              >
                Update Password
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowPasswordModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default UserProfile; 