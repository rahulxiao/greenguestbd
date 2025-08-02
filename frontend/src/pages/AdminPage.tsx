import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components';

interface AdminStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  lowStockItems: number;
  totalAdmins: number;
}

interface RecentOrder {
  id: string;
  customer: string;
  product: string;
  amount: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
  permissions: string[];
}

interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
  wishlistItems: number;
  status: 'active' | 'inactive' | 'suspended';
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  stock: number;
  available: boolean;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: string;
  specifications?: string;
  rating: number;
  reviewCount: number;
  tags?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'admin' as const,
    permissions: [] as string[]
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: 0,
    description: '',
    imageUrl: '',
    stock: 0,
    available: true,
    brand: '',
    sku: '',
    weight: 0,
    dimensions: '',
    specifications: '',
    tags: ''
  });

  // Mock product data
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "Premium Juniper Bonsai",
      category: "Trees",
      price: 189.99,
      description: "A stunning 5-year-old Juniper bonsai with intricate branch structure",
      imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
      stock: 15,
      available: true,
      brand: "BonsaiMaster",
      sku: "JUN-001",
      weight: 2.5,
      dimensions: "12\" x 8\" x 6\"",
      specifications: "Age: 5 years\nHeight: 12 inches\nPot: Unglazed ceramic",
      rating: 4.8,
      reviewCount: 127,
      tags: "juniper,bonsai,outdoor",
      createdAt: new Date('2023-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 2,
      name: "Japanese Maple Bonsai",
      category: "Trees",
      price: 249.99,
      description: "Beautiful red-leaved maple perfect for autumn display",
      imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600",
      stock: 8,
      available: true,
      brand: "BonsaiMaster",
      sku: "MAP-002",
      weight: 3.2,
      dimensions: "14\" x 10\" x 7\"",
      specifications: "Age: 7 years\nHeight: 14 inches\nPot: Glazed ceramic",
      rating: 4.9,
      reviewCount: 89,
      tags: "maple,bonsai,autumn",
      createdAt: new Date('2023-02-20'),
      updatedAt: new Date('2024-01-14')
    },
    {
      id: 3,
      name: "Bonsai Pruning Shears",
      category: "Tools",
      price: 45.99,
      description: "Professional-grade stainless steel shears",
      imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600",
      stock: 50,
      available: true,
      brand: "BonsaiTools",
      sku: "TOOL-003",
      weight: 0.5,
      dimensions: "8\" x 2\" x 1\"",
      specifications: "Material: Stainless steel\nLength: 8 inches\nWeight: 0.5 lbs",
      rating: 4.8,
      reviewCount: 189,
      tags: "tools,pruning,shears",
      createdAt: new Date('2023-03-10'),
      updatedAt: new Date('2024-01-13')
    }
  ]);

  // Mock admin data
  const stats: AdminStats = {
    totalProducts: 156,
    totalOrders: 892,
    totalRevenue: 45678.90,
    totalCustomers: 234,
    pendingOrders: 23,
    lowStockItems: 8,
    totalAdmins: 5
  };

  const adminUsers: AdminUser[] = [
    {
      id: 'ADM-001',
      name: 'John Admin',
      email: 'john.admin@bonsaimarket.com',
      role: 'super_admin',
      status: 'active',
      createdAt: '2023-01-15',
      lastLogin: '2024-01-15 10:30',
      permissions: ['all']
    },
    {
      id: 'ADM-002',
      name: 'Sarah Manager',
      email: 'sarah.manager@bonsaimarket.com',
      role: 'admin',
      status: 'active',
      createdAt: '2023-03-20',
      lastLogin: '2024-01-14 15:45',
      permissions: ['products', 'orders', 'customers']
    },
    {
      id: 'ADM-003',
      name: 'Mike Moderator',
      email: 'mike.moderator@bonsaimarket.com',
      role: 'moderator',
      status: 'active',
      createdAt: '2023-06-10',
      lastLogin: '2024-01-13 09:15',
      permissions: ['orders', 'customers']
    },
    {
      id: 'ADM-004',
      name: 'Lisa Support',
      email: 'lisa.support@bonsaimarket.com',
      role: 'admin',
      status: 'inactive',
      createdAt: '2023-08-05',
      lastLogin: '2024-01-10 14:20',
      permissions: ['customers', 'orders']
    },
    {
      id: 'ADM-005',
      name: 'David Analyst',
      email: 'david.analyst@bonsaimarket.com',
      role: 'admin',
      status: 'active',
      createdAt: '2023-11-12',
      lastLogin: '2024-01-15 11:00',
      permissions: ['analytics', 'reports']
    }
  ];

  const customerUsers: CustomerUser[] = [
    {
      id: 'CUST-001',
      name: 'Alice Johnson',
      email: 'alice.johnson@email.com',
      phone: '+1 (555) 123-4567',
      createdAt: '2023-02-15',
      lastLogin: '2024-01-15 12:30',
      totalOrders: 8,
      totalSpent: 1245.67,
      wishlistItems: 3,
      status: 'active'
    },
    {
      id: 'CUST-002',
      name: 'Bob Smith',
      email: 'bob.smith@email.com',
      phone: '+1 (555) 234-5678',
      createdAt: '2023-04-20',
      lastLogin: '2024-01-14 16:45',
      totalOrders: 12,
      totalSpent: 2890.45,
      wishlistItems: 7,
      status: 'active'
    },
    {
      id: 'CUST-003',
      name: 'Carol Davis',
      email: 'carol.davis@email.com',
      phone: '+1 (555) 345-6789',
      createdAt: '2023-06-10',
      lastLogin: '2024-01-13 09:15',
      totalOrders: 3,
      totalSpent: 456.78,
      wishlistItems: 2,
      status: 'active'
    },
    {
      id: 'CUST-004',
      name: 'David Wilson',
      email: 'david.wilson@email.com',
      phone: '+1 (555) 456-7890',
      createdAt: '2023-08-05',
      lastLogin: '2024-01-10 14:20',
      totalOrders: 0,
      totalSpent: 0,
      wishlistItems: 5,
      status: 'inactive'
    },
    {
      id: 'CUST-005',
      name: 'Eva Brown',
      email: 'eva.brown@email.com',
      phone: '+1 (555) 567-8901',
      createdAt: '2023-11-12',
      lastLogin: '2024-01-15 11:00',
      totalOrders: 15,
      totalSpent: 3456.89,
      wishlistItems: 1,
      status: 'active'
    }
  ];

  const recentOrders: RecentOrder[] = [
    { id: '#ORD-001', customer: 'John Doe', product: 'Premium Juniper Bonsai', amount: 189.99, status: 'pending', date: '2024-01-15' },
    { id: '#ORD-002', customer: 'Jane Smith', product: 'Japanese Maple Bonsai', amount: 249.99, status: 'shipped', date: '2024-01-14' },
    { id: '#ORD-003', customer: 'Mike Johnson', product: 'Bonsai Pruning Shears', amount: 45.99, status: 'delivered', date: '2024-01-13' },
    { id: '#ORD-004', customer: 'Sarah Wilson', product: 'Ceramic Bonsai Pot', amount: 34.99, status: 'cancelled', date: '2024-01-12' },
    { id: '#ORD-005', customer: 'David Brown', product: 'Ficus Bonsai Tree', amount: 159.99, status: 'pending', date: '2024-01-11' }
  ];

  // Mock order data
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerName: "John Doe",
      customerEmail: "john.doe@email.com",
      totalAmount: 235.98,
      status: "pending",
      items: [
        { id: "1", productName: "Premium Juniper Bonsai", quantity: 1, price: 189.99, total: 189.99 },
        { id: "2", productName: "Bonsai Pruning Shears", quantity: 1, price: 45.99, total: 45.99 }
      ],
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: "ORD-002",
      customerName: "Jane Smith",
      customerEmail: "jane.smith@email.com",
      totalAmount: 249.99,
      status: "shipped",
      items: [
        { id: "3", productName: "Japanese Maple Bonsai", quantity: 1, price: 249.99, total: 249.99 }
      ],
      createdAt: new Date('2024-01-14'),
      updatedAt: new Date('2024-01-14')
    },
    {
      id: "ORD-003",
      customerName: "Mike Johnson",
      customerEmail: "mike.johnson@email.com",
      totalAmount: 45.99,
      status: "delivered",
      items: [
        { id: "4", productName: "Bonsai Pruning Shears", quantity: 1, price: 45.99, total: 45.99 }
      ],
      createdAt: new Date('2024-01-13'),
      updatedAt: new Date('2024-01-13')
    }
  ]);

  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date() }
        : order
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'shipped': return '🚚';
      case 'delivered': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-blue-100 text-blue-800';
      case 'moderator': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return '👑';
      case 'admin': return '👨‍💼';
      case 'moderator': return '🛡️';
      default: return '👤';
    }
  };

  const handleAddAdmin = () => {
    // Mock function to add admin
    alert(`Admin ${newAdmin.name} added successfully!`);
    setShowAddAdminModal(false);
    setNewAdmin({ name: '', email: '', role: 'admin', permissions: [] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Admin Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl">
                <span className="text-2xl text-white">👨‍💼</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                <p className="text-gray-600">Manage your BonsaiMarket store</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Store
              </button>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* <div className="w-full px-6 py-8"> */}
      <div className="max-w-8xl mx-auto px-6 py-8">

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-2 shadow-sm mb-8 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: '📊' },
            { id: 'admins', label: 'Admins', icon: '👨‍💼' },
            { id: 'customers', label: 'Customers', icon: '👥' },
            { id: 'products', label: 'Products', icon: '🌳' },
            { id: 'orders', label: 'Orders', icon: '📦' },
            { id: 'analytics', label: 'Analytics', icon: '📈' },
            { id: 'settings', label: 'Settings', icon: '⚙️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card variant="elevated" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Products</p>
                    <p className="text-3xl font-bold">{stats.totalProducts}</p>
                    <p className="text-blue-200 text-xs">+12% from last month</p>
                  </div>
                  <div className="text-4xl">🌳</div>
                </div>
              </Card>

              <Card variant="elevated" className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-green-200 text-xs">+8% from last month</p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </Card>

              <Card variant="elevated" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Customers</p>
                    <p className="text-3xl font-bold">{stats.totalCustomers}</p>
                    <p className="text-purple-200 text-xs">+15% from last month</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </Card>

              <Card variant="elevated" className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Total Admins</p>
                    <p className="text-3xl font-bold">{stats.totalAdmins}</p>
                    <p className="text-orange-200 text-xs">+1 from last month</p>
                  </div>
                  <div className="text-4xl">👨‍💼</div>
                </div>
              </Card>
            </div>

            {/* Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card variant="elevated" className="bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">⚠️ Alerts</h3>
                  <Button variant="primary" size="small">View All</Button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-red-500">🔴</span>
                      <span className="text-sm font-medium text-red-800">{stats.pendingOrders} orders pending</span>
                    </div>
                    <Button variant="secondary" size="small">Review</Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <span className="text-yellow-500">🟡</span>
                      <span className="text-sm font-medium text-yellow-800">{stats.lowStockItems} items low in stock</span>
                    </div>
                    <Button variant="secondary" size="small">Restock</Button>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              <Card variant="elevated" className="bg-white">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">⚡ Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="primary" 
                    fullWidth 
                    className="bg-gradient-to-r from-blue-500 to-blue-600"
                    onClick={() => setShowAddAdminModal(true)}
                  >
                    ➕ Add Admin
                  </Button>
                  <Button variant="secondary" fullWidth>
                    📦 View Orders
                  </Button>
                  <Button variant="secondary" fullWidth>
                    👥 Manage Users
                  </Button>
                  <Button variant="secondary" fullWidth>
                    📊 View Reports
                  </Button>
                </div>
              </Card>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">📋 Recent Orders</h3>
                <Button variant="primary" size="small">View All Orders</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Order ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Total Amount</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Date</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-800">{order.id}</td>
                        <td className="py-4 px-6 text-gray-600">{order.customerName}</td>
                        <td className="py-4 px-6 font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{order.createdAt.toLocaleDateString()}</td>
                        <td className="py-4 px-6">
                          <Button variant="secondary" size="small">View</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Admins Management */}
        {activeTab === 'admins' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">👨‍💼 Admin Management</h2>
              <Button 
                variant="primary" 
                onClick={() => setShowAddAdminModal(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                ➕ Add New Admin
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Admin ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Role</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Created</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Last Login</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {adminUsers.map((admin) => (
                      <tr key={admin.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-800">{admin.id}</td>
                        <td className="py-4 px-6 text-gray-800 font-medium">{admin.name}</td>
                        <td className="py-4 px-6 text-gray-600">{admin.email}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(admin.role)}`}>
                            {getRoleIcon(admin.role)} {admin.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {admin.status === 'active' ? '✅ Active' : '❌ Inactive'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{admin.createdAt}</td>
                        <td className="py-4 px-6 text-gray-600">{admin.lastLogin}</td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <Button variant="secondary" size="small">Edit</Button>
                            <Button variant="secondary" size="small">View</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Customers Management */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">👥 Customer Management</h2>
              <div className="flex space-x-2">
                <Button variant="secondary">Export Data</Button>
                <Button variant="primary" className="bg-gradient-to-r from-green-500 to-green-600">
                  📊 Analytics
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Email</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Phone</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Orders</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Total Spent</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Wishlist</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Created</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerUsers.map((customer) => (
                      <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-800">{customer.id}</td>
                        <td className="py-4 px-6 text-gray-800 font-medium">{customer.name}</td>
                        <td className="py-4 px-6 text-gray-600">{customer.email}</td>
                        <td className="py-4 px-6 text-gray-600">{customer.phone}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            customer.status === 'active' ? 'bg-green-100 text-green-800' : 
                            customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {customer.status === 'active' ? '✅ Active' : 
                             customer.status === 'inactive' ? '⏸️ Inactive' : '🚫 Suspended'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-800 font-medium">{customer.totalOrders}</td>
                        <td className="py-4 px-6 text-gray-800 font-medium">${customer.totalSpent.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            💜 {customer.wishlistItems} items
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{customer.createdAt}</td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <Button variant="secondary" size="small">View</Button>
                            <Button variant="secondary" size="small">Edit</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Management */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">🌳 Product Management</h2>
              <Button 
                variant="primary" 
                onClick={() => setShowAddProductModal(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                ➕ Add New Product
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Name</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Category</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Price</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Stock</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Available</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Created</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Updated</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-800">{product.id}</td>
                        <td className="py-4 px-6 text-gray-800 font-medium">{product.name}</td>
                        <td className="py-4 px-6 text-gray-600">{product.category}</td>
                        <td className="py-4 px-6 font-semibold text-gray-800">${product.price.toFixed(2)}</td>
                        <td className="py-4 px-6 text-gray-800 font-medium">{product.stock}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {product.available ? '✅ Available' : '❌ Out of Stock'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{product.createdAt.toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-gray-600">{product.updatedAt.toLocaleDateString()}</td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <Button variant="secondary" size="small" onClick={() => setSelectedProduct(product)}>Edit</Button>
                            <Button variant="secondary" size="small">View</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Orders Management */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">📦 Order Management</h2>
              <Button 
                variant="primary" 
                className="bg-gradient-to-r from-blue-500 to-blue-600"
              >
                ➕ New Order
              </Button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Order ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Customer</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Total Amount</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Created</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Updated</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-6 font-medium text-gray-800">{order.id}</td>
                        <td className="py-4 px-6 text-gray-600">{order.customerName}</td>
                        <td className="py-4 px-6 font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</td>
                        <td className="py-4 px-6">
                          <select
                            value={order.status}
                            onChange={(e) => handleOrderStatusChange(order.id, e.target.value as Order['status'])}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{order.createdAt.toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-gray-600">{order.updatedAt.toLocaleDateString()}</td>
                        <td className="py-4 px-6">
                          <div className="flex space-x-2">
                            <Button variant="secondary" size="small">View</Button>
                            <Button variant="secondary" size="small">Edit</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other Tab Content Placeholders */}
        {!['dashboard', 'admins', 'customers', 'products', 'orders'].includes(activeTab) && (
          <Card variant="elevated" className="bg-white">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">
                {activeTab === 'analytics' && '📈'}
                {activeTab === 'settings' && '⚙️'}
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
              </h3>
              <p className="text-gray-600 mb-6">This section is under development</p>
              <Button variant="primary">Coming Soon</Button>
            </div>
          </Card>
        )}
      </div>

      {/* Add Admin Modal */}
      {showAddAdminModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Add New Admin</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newAdmin.name}
                  onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter admin name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter admin email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newAdmin.role}
                  onChange={(e) => setNewAdmin({...newAdmin, role: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                variant="primary" 
                onClick={handleAddAdmin}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600"
              >
                Add Admin
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowAddAdminModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">➕ Add New Product</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product category"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value, 10)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product stock"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
                <select
                  value={newProduct.available ? 'true' : 'false'}
                  onChange={(e) => setNewProduct({...newProduct, available: e.target.value === 'true'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                variant="primary" 
                onClick={() => {
                  const newId = Math.max(...products.map(p => p.id)) + 1;
                  const newProductData = {
                    id: newId,
                    name: newProduct.name,
                    category: newProduct.category,
                    price: newProduct.price,
                    description: '', // Placeholder
                    imageUrl: '', // Placeholder
                    stock: newProduct.stock,
                    available: newProduct.available,
                    brand: '', // Placeholder
                    sku: '', // Placeholder
                    weight: 0, // Placeholder
                    dimensions: '', // Placeholder
                    specifications: '', // Placeholder
                    rating: 0, // Placeholder
                    reviewCount: 0, // Placeholder
                    tags: '', // Placeholder
                    createdAt: new Date(),
                    updatedAt: new Date()
                  };
                  setProducts([...products, newProductData]);
                  setShowAddProductModal(false);
                  setNewProduct({ name: '', category: '', price: 0, description: '', imageUrl: '', stock: 0, available: true, brand: '', sku: '', weight: 0, dimensions: '', specifications: '', tags: '' });
                }}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600"
              >
                Add Product
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => setShowAddProductModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-800 mb-4">✏️ Edit Product</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product category"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value, 10)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product stock"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Available</label>
                <select
                  value={newProduct.available ? 'true' : 'false'}
                  onChange={(e) => setNewProduct({...newProduct, available: e.target.value === 'true'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                variant="primary" 
                onClick={() => {
                  const updatedProducts = products.map(p => 
                    p.id === selectedProduct.id ? { ...p, ...newProduct, updatedAt: new Date() } : p
                  );
                  setProducts(updatedProducts);
                  setShowEditProductModal(false);
                  setSelectedProduct(null);
                  setNewProduct({ name: '', category: '', price: 0, description: '', imageUrl: '', stock: 0, available: true, brand: '', sku: '', weight: 0, dimensions: '', specifications: '', tags: '' });
                }}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600"
              >
                Save Changes
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowEditProductModal(false);
                  setSelectedProduct(null);
                  setNewProduct({ name: '', category: '', price: 0, description: '', imageUrl: '', stock: 0, available: true, brand: '', sku: '', weight: 0, dimensions: '', specifications: '', tags: '' });
                }}
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

export default AdminPage; 