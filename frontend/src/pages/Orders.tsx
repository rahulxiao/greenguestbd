import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Eye, Download, Truck, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Header, Footer } from '../components';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: OrderItem[];
  shippingAddress: string;
  trackingNumber?: string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock orders data - replace with actual API call
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        date: '2024-01-15',
        status: 'delivered',
        total: 469.97,
        trackingNumber: 'TRK123456789',
        shippingAddress: '123 Main St, New York, NY 10001',
        items: [
          {
            id: 1,
            name: "Premium Juniper Bonsai",
            price: 189.99,
            quantity: 2,
            imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          },
          {
            id: 2,
            name: "Beginner Bonsai Kit",
            price: 89.99,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          }
        ]
      },
      {
        id: '2',
        orderNumber: 'ORD-2024-002',
        date: '2024-01-20',
        status: 'shipped',
        total: 299.99,
        trackingNumber: 'TRK987654321',
        shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
        items: [
          {
            id: 3,
            name: "Pine Bonsai Collection",
            price: 299.99,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          }
        ]
      },
      {
        id: '3',
        orderNumber: 'ORD-2024-003',
        date: '2024-01-25',
        status: 'processing',
        total: 134.98,
        shippingAddress: '789 Pine St, Chicago, IL 60601',
        items: [
          {
            id: 4,
            name: "Bonsai Pruning Shears",
            price: 45.99,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          },
          {
            id: 5,
            name: "Ceramic Bonsai Pot",
            price: 34.99,
            quantity: 2,
            imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          }
        ]
      },
      {
        id: '4',
        orderNumber: 'ORD-2024-004',
        date: '2024-01-30',
        status: 'pending',
        total: 89.99,
        shippingAddress: '321 Elm St, Miami, FL 33101',
        items: [
          {
            id: 6,
            name: "Beginner Bonsai Kit",
            price: 89.99,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
          }
        ]
      }
    ];
    setOrders(mockOrders);
    setLoading(false);
  }, []);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
  };

  const handleDownloadInvoice = (orderNumber: string) => {
    alert(`Downloading invoice for ${orderNumber}...`);
  };

  const handleTrackOrder = (trackingNumber: string) => {
    alert(`Tracking order: ${trackingNumber}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track your orders and view order history
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-24 w-24 text-gray-400" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900">No orders yet</h2>
            <p className="mt-2 text-gray-600">Start shopping to see your orders here.</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Order #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          Placed on {formatDate(order.date)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="flex items-center px-3 py-1 text-sm text-green-600 hover:text-green-700"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </button>
                      
                      <button
                        onClick={() => handleDownloadInvoice(order.orderNumber)}
                        className="flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-700"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Invoice
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Order Items</h4>
                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} • ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Order Summary</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total:</span>
                          <span className="font-medium">${order.total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping Address:</span>
                          <span className="text-gray-900">{order.shippingAddress}</span>
                        </div>
                        {order.trackingNumber && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Tracking:</span>
                            <button
                              onClick={() => handleTrackOrder(order.trackingNumber!)}
                              className="text-green-600 hover:text-green-700 font-medium"
                            >
                              {order.trackingNumber}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Order Details - {selectedOrder.orderNumber}
                  </h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Order Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Order Number:</p>
                        <p className="font-medium">{selectedOrder.orderNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Order Date:</p>
                        <p className="font-medium">{formatDate(selectedOrder.date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status:</p>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(selectedOrder.status)}
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedOrder.status)}`}>
                            {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-600">Total:</p>
                        <p className="font-medium">${selectedOrder.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
                    <p className="text-sm text-gray-600">{selectedOrder.shippingAddress}</p>
                  </div>
                  
                  {selectedOrder.trackingNumber && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Tracking Information</h3>
                      <button
                        onClick={() => handleTrackOrder(selectedOrder.trackingNumber!)}
                        className="text-green-600 hover:text-green-700 font-medium text-sm"
                      >
                        Track Package: {selectedOrder.trackingNumber}
                      </button>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Order Items</h3>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm text-gray-600">
                              Price: ${item.price.toFixed(2)} each
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleDownloadInvoice(selectedOrder.orderNumber)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Download Invoice
                  </button>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Orders; 