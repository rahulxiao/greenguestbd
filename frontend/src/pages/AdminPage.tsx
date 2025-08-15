import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '../components';
import { adminService, productService, orderService, userService } from '../services';

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
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  createdAt: Date;
  orderNumber?: string;
  shippingAddress?: string;
  paymentMethod?: string;
}

interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Real data states
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerUser[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    totalAdmins: 0
  });
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [adminsLoading, setAdminsLoading] = useState(false);
  const [updatingProduct, setUpdatingProduct] = useState(false);

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
    tags: '',
    rating: 0,
    reviewCount: 0
  });

  const handleOrderStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date() }
        : order
    ));
  };

  // Data fetching functions
  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      const allProducts = await productService.getAllProducts();
      setProducts(allProducts);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      setCustomersLoading(true);
      const allCustomers = await userService.getAllUsers();
      // Map UserProfile to CustomerUser interface
      const mappedCustomers: CustomerUser[] = allCustomers.map(user => ({
        id: `CUST-${user.id}`,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phone: user.phoneNumber || 'N/A',
        createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown',
        lastLogin: 'Unknown', // This would need a separate API call
        totalOrders: 0, // This would need a separate API call
        totalSpent: 0, // This would need a separate API call
        wishlistItems: 0, // This would need a separate API call
        status: 'active' as const
      }));
      setCustomers(mappedCustomers);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setCustomersLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setAdminsLoading(true);
      const allAdmins = await adminService.getAllAdmins();
      // Map AdminResponse to AdminUser interface
      const mappedAdmins: AdminUser[] = allAdmins.map(admin => ({
        id: `ADM-${admin.id}`,
        name: admin.name,
        email: admin.email,
        role: admin.role as 'super_admin' | 'admin' | 'moderator',
        status: admin.isActive ? 'active' : 'inactive',
        createdAt: admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : 'Unknown',
        lastLogin: admin.lastLoginAt ? new Date(admin.lastLoginAt).toLocaleString() : 'Never',
        permissions: [] // This would need a separate API call
      }));
      setAdmins(mappedAdmins);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    } finally {
      setAdminsLoading(false);
    }
  };

  const calculateStats = () => {
    const totalProducts = products.length;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalCustomers = customers.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const lowStockItems = products.filter(product => product.stock < 10).length;
    const totalAdmins = admins.length;

    setStats({
      totalProducts,
      totalOrders,
      totalRevenue,
      totalCustomers,
      pendingOrders,
      lowStockItems,
      totalAdmins
    });
  };

  // Fetch all data when component mounts or tab changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
      fetchOrders();
      fetchCustomers();
      fetchAdmins();
    }
  }, [isAuthenticated]);

  // Calculate stats when data changes
  useEffect(() => {
    if (products.length > 0 || orders.length > 0 || customers.length > 0 || admins.length > 0) {
      calculateStats();
    }
  }, [products, orders, customers, admins]);

  // Fetch data based on active tab
  useEffect(() => {
    if (!isAuthenticated) return;

    switch (activeTab) {
      case 'products':
        fetchProducts();
        break;
      case 'orders':
        fetchOrders();
        break;
      case 'customers':
        fetchCustomers();
        break;
      case 'admins':
        fetchAdmins();
        break;
    }
  }, [activeTab, isAuthenticated]);

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

  // Utility function to safely format prices
  const formatPrice = (price: any): string => {
    if (typeof price === 'string') {
      const numPrice = parseFloat(price);
      return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    } else if (typeof price === 'number') {
      return price.toFixed(2);
    }
    return '0.00';
  };

  // Utility function to safely format dates
  const formatDate = (date: any): string => {
    if (date instanceof Date) {
      return date.toLocaleDateString();
    } else if (typeof date === 'string') {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? 'Invalid Date' : parsedDate.toLocaleDateString();
    }
    return 'Invalid Date';
  };

  const handleAddAdmin = () => {
    // Mock function to add admin
    alert(`Admin ${newAdmin.name} added successfully!`);
    setShowAddAdminModal(false);
    setNewAdmin({ name: '', email: '', role: 'admin', permissions: [] });
  };

  // Handle product update with database integration
  const handleUpdateProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      setUpdatingProduct(true);
      
      // Prepare update data (exclude protected fields)
      const updateData = {
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        description: newProduct.description,
        stock: newProduct.stock,
        available: newProduct.available,
        brand: newProduct.brand,
        sku: newProduct.sku,
        weight: newProduct.weight,
        dimensions: newProduct.dimensions,
        specifications: newProduct.specifications,
        tags: newProduct.tags
      };

      // Call backend API to update product
      const updatedProduct = await productService.updateProduct(selectedProduct.id, updateData);
      
      // Update local state with the response from backend
      const updatedProducts = products.map(p => 
        p.id === selectedProduct.id ? updatedProduct : p
      );
      setProducts(updatedProducts);
      
      // Close modal and reset form
      setShowEditProductModal(false);
      setSelectedProduct(null);
      setNewProduct({ name: '', category: '', price: 0, description: '', imageUrl: '', stock: 0, available: true, brand: '', sku: '', weight: 0, dimensions: '', specifications: '', tags: '', rating: 0, reviewCount: 0 });
      
      // Show success message
      alert('Product updated successfully in database!');
      
    } catch (error) {
      console.error('Failed to update product:', error);
      alert(`Failed to update product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUpdatingProduct(false);
    }
  };

  // Handle product creation with database integration
  const handleCreateProduct = async () => {
    try {
      setUpdatingProduct(true);
      
      // Prepare create data
      const createData = {
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        description: newProduct.description,
        stock: newProduct.stock,
        available: newProduct.available,
        brand: newProduct.brand,
        sku: newProduct.sku,
        weight: newProduct.weight,
        dimensions: newProduct.dimensions,
        specifications: newProduct.specifications,
        tags: newProduct.tags
      };

      // Call backend API to create product
      const createdProduct = await productService.createProduct(createData);
      
      // Add new product to local state
      setProducts([...products, createdProduct]);
      
      // Close modal and reset form
      setShowAddProductModal(false);
      setNewProduct({ name: '', category: '', price: 0, description: '', imageUrl: '', stock: 0, available: true, brand: '', sku: '', weight: 0, dimensions: '', specifications: '', tags: '', rating: 0, reviewCount: 0 });
      
      // Show success message
      alert('Product created successfully in database!');
      
    } catch (error) {
      console.error('Failed to create product:', error);
      alert(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUpdatingProduct(false);
    }
  };

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = adminService.isAdminAuthenticated();
      if (!adminAuth) {
        navigate('/login');
        return;
      }
      
      setIsAuthenticated(true);
      const admin = adminService.getCurrentAdmin();
      setCurrentAdmin(admin);
    };

    checkAuth();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await adminService.logoutAdmin();
      setIsAuthenticated(false);
      setCurrentAdmin(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if there's an error
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      setIsAuthenticated(false);
      setCurrentAdmin(null);
      navigate('/login');
    }
  };

  // If not authenticated, show loading
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Admin Info and Logout */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-2 rounded-lg">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-sm text-gray-600">
                  Welcome back, {currentAdmin?.name || 'Admin'} ({currentAdmin?.role || 'admin'})
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Last login</p>
                <p className="text-xs text-gray-500">
                  {currentAdmin?.lastLoginAt ? new Date(currentAdmin.lastLoginAt).toLocaleString() : 'Unknown'}
                </p>
              </div>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              >
                🚪 Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
              { id: 'products', label: '🌱 Products', icon: '🌱' },
              { id: 'orders', label: '📦 Orders', icon: '📦' },
              { id: 'customers', label: '👥 Customers', icon: '👥' },
              { id: 'admins', label: '🛡️ Admins', icon: '🛡️' },
              { id: 'analytics', label: '📈 Analytics', icon: '📈' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Dashboard Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card variant="elevated" className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-medium">Total Products</p>
                    <p className="text-3xl font-bold">
                      {loading ? '...' : stats.totalProducts}
                    </p>
                    <p className="text-blue-200 text-xs">+12% from last month</p>
                  </div>
                  <div className="text-4xl">🌳</div>
                </div>
              </Card>

              <Card variant="elevated" className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-medium">Total Revenue</p>
                    <p className="text-3xl font-bold">
                      {loading ? '...' : `৳${stats.totalRevenue.toLocaleString()}`}
                    </p>
                    <p className="text-green-200 text-xs">+8% from last month</p>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
              </Card>

              <Card variant="elevated" className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-medium">Total Customers</p>
                    <p className="text-3xl font-bold">
                      {loading ? '...' : stats.totalCustomers}
                    </p>
                    <p className="text-purple-200 text-xs">+15% from last month</p>
                  </div>
                  <div className="text-4xl">👥</div>
                </div>
              </Card>

              <Card variant="elevated" className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-medium">Total Admins</p>
                    <p className="text-3xl font-bold">
                      {loading ? '...' : stats.totalAdmins}
                    </p>
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
                        <td className="py-4 px-6 text-gray-600">
                          {order.items.length > 0 ? order.items[0].productName : 'N/A'}
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-800">৳{formatPrice(order.totalAmount)}</td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)} {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{formatDate(order.createdAt)}</td>
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
                    {admins.map((admin) => (
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
                    {customers.map((customer) => (
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
                        <td className="py-4 px-6 text-gray-800 font-medium">৳{customer.totalSpent.toFixed(2)}</td>
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
                {productsLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading products...</p>
                  </div>
                ) : (
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
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="text-center py-8 text-gray-500">
                            No products found
                          </td>
                        </tr>
                      ) : (
                        products.map((product) => (
                          <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-6 font-medium text-gray-800">{product.id}</td>
                            <td className="py-4 px-6 text-gray-800 font-medium">{product.name}</td>
                            <td className="py-4 px-6 text-gray-600">{product.category}</td>
                            <td className="py-4 px-6 font-semibold text-gray-800">
                              ৳{formatPrice(product.price)}
                            </td>
                            <td className="py-4 px-6 text-gray-800 font-medium">{product.stock}</td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {product.available ? '✅ Available' : '❌ Out of Stock'}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-gray-600">{formatDate(product.createdAt)}</td>
                            <td className="py-4 px-6">
                              <div className="flex space-x-2">
                                <Button variant="secondary" size="small" onClick={() => {
                                  setSelectedProduct(product);
                                  setNewProduct({
                                    name: product.name,
                                    category: product.category,
                                    price: product.price,
                                    description: product.description || '',
                                    imageUrl: product.imageUrl || '',
                                    stock: product.stock,
                                    available: product.available,
                                    brand: product.brand || '',
                                    sku: product.sku || '',
                                    weight: product.weight || 0,
                                    dimensions: product.dimensions || '',
                                    specifications: product.specifications || '',
                                    tags: product.tags || '',
                                    rating: product.rating,
                                    reviewCount: product.reviewCount
                                  });
                                  setShowEditProductModal(true);
                                }}>Edit</Button>
                                <Button variant="secondary" size="small">View</Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                )}
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
                        <td className="py-4 px-6 text-gray-600">
                          {order.items.length > 0 ? order.items[0].productName : 'N/A'}
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-800">৳{formatPrice(order.totalAmount)}</td>
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
                        <td className="py-4 px-6 text-gray-600">{formatDate(order.createdAt)}</td>
                        <td className="py-4 px-6 text-gray-600">{formatDate(order.createdAt)}</td>
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
                onClick={handleCreateProduct}
                disabled={updatingProduct}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingProduct ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating...
                  </div>
                ) : (
                  'Add Product'
                )}
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
          <div className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800">✏️ Edit Product</h3>
              <button
                onClick={() => {
                  setShowEditProductModal(false);
                  setSelectedProduct(null);
                  setNewProduct({ name: '', category: '', price: 0, description: '', imageUrl: '', stock: 0, available: true, brand: '', sku: '', weight: 0, dimensions: '', specifications: '', tags: '', rating: 0, reviewCount: 0 });
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product ID (Read-only)</label>
                  <input
                    type="text"
                    value={selectedProduct.id}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product category"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (৳) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <input
                    type="text"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({...newProduct, brand: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">SKU</label>
                  <input
                    type="text"
                    value={newProduct.sku}
                    onChange={(e) => setNewProduct({...newProduct, sku: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter product SKU"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.weight}
                    onChange={(e) => setNewProduct({...newProduct, weight: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dimensions</label>
                  <input
                    type="text"
                    value={newProduct.dimensions}
                    onChange={(e) => setNewProduct({...newProduct, dimensions: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 10x5x2 cm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Status</label>
                  <select
                    value={newProduct.available ? 'true' : 'false'}
                    onChange={(e) => setNewProduct({...newProduct, available: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="true">✅ Available</option>
                    <option value="false">❌ Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <input
                    type="text"
                    value={newProduct.tags}
                    onChange={(e) => setNewProduct({...newProduct, tags: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., organic, premium, indoor"
                  />
                </div>
              </div>
            </div>

            {/* Full Width Fields */}
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specifications</label>
                <textarea
                  value={newProduct.specifications}
                  onChange={(e) => setNewProduct({...newProduct, specifications: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter product specifications"
                />
              </div>

              {/* Read-only Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Image URL (Read-only)</label>
                  <input
                    type="text"
                    value={selectedProduct.imageUrl || 'No image URL'}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Average Rating (Read-only)</label>
                  <input
                    type="text"
                    value={`${selectedProduct.rating || 0} / 5`}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Total Reviews (Read-only)</label>
                  <input
                    type="text"
                    value={selectedProduct.reviewCount || 0}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Created Date (Read-only)</label>
                  <input
                    type="text"
                    value={formatDate(selectedProduct.createdAt)}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Last Updated (Read-only)</label>
                  <input
                    type="text"
                    value={formatDate(selectedProduct.updatedAt)}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
              <Button 
                variant="primary" 
                onClick={handleUpdateProduct}
                disabled={updatingProduct}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updatingProduct ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Updating...
                  </div>
                ) : (
                  '💾 Save Changes'
                )}
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => {
                  setShowEditProductModal(false);
                  setSelectedProduct(null);
                  setNewProduct({ name: '', category: '', price: 0, description: '', imageUrl: '', stock: 0, available: true, brand: '', sku: '', weight: 0, dimensions: '', specifications: '', tags: '', rating: 0, reviewCount: 0 });
                }}
                className="flex-1"
              >
                ❌ Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage; 