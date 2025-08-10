import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Header, Footer } from '../components';
import { User, Calendar, Edit, Camera, Lock, Package, Heart, Settings, ArrowLeft } from 'lucide-react';

interface UserData {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: ProfileData;
}

interface ProfileData {
  id: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  bio?: string;
  avatar?: string;
}

interface Order {
  id: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  items: number;
}

interface WishlistItem {
  id: number;
  productName: string;
  price: number;
  imageUrl: string;
  category: string;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Mock user data
  const [user, setUser] = useState<UserData>({
    id: 1,
    name: "John Doe",
    email: "john.doe@email.com",
    phoneNumber: "+1 (555) 123-4567",
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-15'),
    profile: {
      id: 1,
      address: "123 Main Street",
      city: "New York",
      state: "NY",
      country: "USA",
      postalCode: "10001",
      bio: "Passionate bonsai enthusiast with over 5 years of experience in cultivating miniature trees. Love exploring different bonsai styles and techniques."
    }
  });

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber || '',
    address: user.profile?.address || '',
    city: user.profile?.city || '',
    state: user.profile?.state || '',
    country: user.profile?.country || '',
    postalCode: user.profile?.postalCode || '',
    bio: user.profile?.bio || ''
  });

  // Mock orders data
  const orders: Order[] = [
    {
      id: "ORD-001",
      totalAmount: 235.98,
      status: "delivered",
      createdAt: new Date('2024-01-10'),
      items: 3
    },
    {
      id: "ORD-002",
      totalAmount: 189.99,
      status: "shipped",
      createdAt: new Date('2024-01-05'),
      items: 1
    },
    {
      id: "ORD-003",
      totalAmount: 45.99,
      status: "pending",
      createdAt: new Date('2024-01-01'),
      items: 2
    }
  ];

  // Mock wishlist data
  const wishlistItems: WishlistItem[] = [
    {
      id: 1,
      productName: "Premium Juniper Bonsai",
      price: 189.99,
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150",
      category: "Trees"
    },
    {
      id: 2,
      productName: "Japanese Maple Bonsai",
      price: 249.99,
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150",
      category: "Trees"
    },
    {
      id: 3,
      productName: "Ceramic Bonsai Pot",
      price: 34.99,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150",
      category: "Pots"
    }
  ];

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

  const handleSave = () => {
    setUser({
      ...user,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      updatedAt: new Date(),
      profile: {
        ...user.profile!,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        postalCode: formData.postalCode,
        bio: formData.bio
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      address: user.profile?.address || '',
      city: user.profile?.city || '',
      state: user.profile?.state || '',
      country: user.profile?.country || '',
      postalCode: user.profile?.postalCode || '',
      bio: user.profile?.bio || ''
    });
    setIsEditing(false);
  };

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

        {/* Profile Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card className="bg-white">
                <div className="text-center p-4 sm:p-6">
                  <div className="relative inline-block mb-4">
                    <img
                      src={user.profile?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"}
                      alt={user.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-green-200"
                    />
                    <button className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors shadow-lg">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
                  <p className="text-gray-600 mb-4 text-sm sm:text-base">{user.email}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center justify-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span className="text-xs sm:text-sm">Member since {user.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
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
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">Profile Information</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        id="address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        id="city"
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        id="state"
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        id="country"
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                      <input
                        id="postalCode"
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100 text-sm sm:text-base"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                      <Button 
                        variant="primary" 
                        onClick={handleSave}
                        className="flex-1"
                      >
                        Save Changes
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={handleCancel}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Orders Content */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Orders</h2>
              <Button variant="primary" className="w-full sm:w-auto">
                View All Orders
              </Button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-700 text-sm">Order ID</th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-700 text-sm">Items</th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-700 text-sm">Total</th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-700 text-sm">Status</th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-700 text-sm">Date</th>
                      <th className="text-left py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-700 text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 sm:py-4 px-3 sm:px-6 font-medium text-gray-800 text-sm">{order.id}</td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-600 text-sm">{order.items} items</td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6 font-semibold text-gray-800 text-sm">${order.totalAmount.toFixed(2)}</td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {order.status}
                          </span>
                        </td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6 text-gray-600 text-sm">{order.createdAt.toLocaleDateString()}</td>
                        <td className="py-3 sm:py-4 px-3 sm:px-6">
                          <Button variant="secondary" size="small">View Details</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Content */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800">My Wishlist</h2>
              <Button variant="primary" className="w-full sm:w-auto">
                Add All to Cart
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} className="bg-white hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="mb-2">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        {item.category}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">{item.productName}</h3>
                    <p className="text-xl sm:text-2xl font-bold text-green-600 mb-4">${item.price.toFixed(2)}</p>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Button variant="primary" size="small" className="flex-1">
                        Add to Cart
                      </Button>
                      <Button variant="secondary" size="small" className="flex-1">
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Settings Content */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Account Settings</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white">
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3 w-4 h-4" defaultChecked />
                      <span className="text-gray-700 text-sm sm:text-base">Order updates</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3 w-4 h-4" defaultChecked />
                      <span className="text-gray-700 text-sm sm:text-base">New products</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3 w-4 h-4" />
                      <span className="text-gray-700 text-sm sm:text-base">Promotional emails</span>
                    </label>
                  </div>
                </div>
              </Card>

              <Card className="bg-white">
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Privacy</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3 w-4 h-4" defaultChecked />
                      <span className="text-gray-700 text-sm sm:text-base">Public profile</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3 w-4 h-4" />
                      <span className="text-gray-700 text-sm sm:text-base">Show email to others</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3 w-4 h-4" defaultChecked />
                      <span className="text-gray-700 text-sm sm:text-base">Allow reviews</span>
                    </label>
                  </div>
                </div>
              </Card>
            </div>
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