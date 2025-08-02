import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components';

interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  profile?: Profile;
}

interface Profile {
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
}

interface WishlistItem {
  id: number;
  productName: string;
  price: number;
  imageUrl: string;
}

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Mock user data
  const [user, setUser] = useState<User>({
    id: 1,
    name: "Kohn Doe",
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
      bio: "Passionate bonsai enthusiast with over 5 years of experience in cultivating miniature trees. Love exploring different bonsai styles and techniques.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
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
      createdAt: new Date('2024-01-10')
    },
    {
      id: "ORD-002",
      totalAmount: 189.99,
      status: "shipped",
      createdAt: new Date('2024-01-05')
    },
    {
      id: "ORD-003",
      totalAmount: 45.99,
      status: "pending",
      createdAt: new Date('2024-01-01')
    }
  ];

  // Mock wishlist data
  const wishlistItems: WishlistItem[] = [
    {
      id: 1,
      productName: "Premium Juniper Bonsai",
      price: 189.99,
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=150"
    },
    {
      id: 2,
      productName: "Japanese Maple Bonsai",
      price: 249.99,
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=150"
    },
    {
      id: 3,
      productName: "Ceramic Bonsai Pot",
      price: 34.99,
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=150"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'processing': return '🔄';
      case 'shipped': return '🚚';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-green-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-xl">
                <span className="text-2xl text-white">👤</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">User Profile</h1>
                <p className="text-green-600">Manage your account and preferences</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="text-green-600 hover:text-green-800 transition-colors"
              >
                ← Back to Store
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-2 shadow-sm mb-8 overflow-x-auto">
          {[
            { id: 'profile', label: 'Profile', icon: '👤' },
            { id: 'orders', label: 'Orders', icon: '📦' },
            { id: 'wishlist', label: 'Wishlist', icon: '💜' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Profile Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <Card variant="elevated" className="bg-white">
                <div className="text-center p-6">
                  <div className="relative inline-block mb-4">
                    <img
                      src={user.profile?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover border-4 border-green-200"
                    />
                    <button className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors">
                      📷
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.name}</h2>
                  <p className="text-gray-600 mb-4">{user.email}</p>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Member since {user.createdAt.toLocaleDateString()}</p>
                    <p>Last updated {user.updatedAt.toLocaleDateString()}</p>
                  </div>
                  <div className="mt-6 space-y-2">
                    <Button 
                      variant="primary" 
                      fullWidth
                      onClick={() => setShowChangePasswordModal(true)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500"
                    >
                      🔒 Change Password
                    </Button>
                    <Button 
                      variant="secondary" 
                      fullWidth
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? 'Cancel Edit' : '✏️ Edit Profile'}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Card variant="elevated" className="bg-white">
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-6">Profile Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                      <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  {isEditing && (
                    <div className="flex space-x-3 mt-6">
                      <Button 
                        variant="primary" 
                        onClick={handleSave}
                        className="bg-gradient-to-r from-green-500 to-emerald-500"
                      >
                        💾 Save Changes
                      </Button>
                      <Button 
                        variant="secondary" 
                        onClick={handleCancel}
                      >
                        ❌ Cancel
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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">📦 My Orders</h2>
              <Button variant="primary" className="bg-gradient-to-r from-green-500 to-emerald-500">
                📊 Order History
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Order ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Total Amount</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-800">{order.id}</td>
                        <td className="py-4 px-6 font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{order.createdAt.toLocaleDateString()}</td>
                        <td className="py-4 px-6">
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
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">💜 My Wishlist</h2>
              <Button variant="primary" className="bg-gradient-to-r from-purple-500 to-purple-600">
                🛒 Add to Cart All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item) => (
                <Card key={item.id} variant="elevated" className="bg-white hover:shadow-lg transition-shadow">
                  <div className="p-4">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.productName}</h3>
                    <p className="text-2xl font-bold text-green-600 mb-4">${item.price.toFixed(2)}</p>
                    <div className="flex space-x-2">
                      <Button variant="primary" size="small" className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500">
                        🛒 Add to Cart
                      </Button>
                      <Button variant="secondary" size="small">
                        ❌ Remove
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
            <h2 className="text-2xl font-bold text-gray-800">⚙️ Account Settings</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card variant="elevated" className="bg-white">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🔔 Notifications</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-700">Order updates</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-700">New products</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">Promotional emails</span>
                    </label>
                  </div>
                </div>
              </Card>

              <Card variant="elevated" className="bg-white">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">🔒 Privacy</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-700">Public profile</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" />
                      <span className="text-gray-700">Show email to others</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-3" defaultChecked />
                      <span className="text-gray-700">Allow reviews</span>
                    </label>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">🔒 Change Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                variant="primary" 
                onClick={() => setShowChangePasswordModal(false)}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500"
              >
                Update Password
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowChangePasswordModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 