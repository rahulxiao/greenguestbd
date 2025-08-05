import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Mail, Home, Package } from 'lucide-react';
import { Header, Footer } from '../components';

interface OrderConfirmationProps {
  orderNumber?: string;
  orderData?: any;
  orderItems?: any[];
  total?: number;
}

const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderNumber, orderData, orderItems, total } = location.state as OrderConfirmationProps || {};

  // Fallback data if no state is passed
  const fallbackData = {
    orderNumber: orderNumber || `ORD-${Date.now()}`,
    orderData: orderData || {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'US'
    },
    orderItems: orderItems || [
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
    ],
    total: total || 469.97
  };

  const { orderNumber: finalOrderNumber, orderData: finalOrderData, orderItems: finalOrderItems, total: finalTotal } = fallbackData;

  const handleDownloadInvoice = () => {
    // Mock invoice download
    alert('Invoice download started...');
  };

  const handleEmailReceipt = () => {
    // Mock email receipt
    alert('Receipt sent to your email!');
  };

  const handleContinueShopping = () => {
    navigate('/');
  };

  const handleTrackOrder = () => {
    navigate('/orders');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Thank you for your order!
          </h1>
          <p className="text-lg text-gray-600">
            Your order has been successfully placed and is being processed.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Order Number: <span className="font-semibold">{finalOrderNumber}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="h-5 w-5 mr-2 text-green-600" />
              Order Details
            </h2>
            
            <div className="space-y-4">
              {finalOrderItems.map((item) => (
                <div key={item.id} className="flex items-center border-b border-gray-100 pb-4 last:border-b-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    <p className="text-sm font-medium text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-gray-200 mt-4 pt-4">
              <div className="flex justify-between text-lg font-semibold text-gray-900">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Shipping Information</h2>
            
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {finalOrderData.firstName} {finalOrderData.lastName}
                </p>
                <p className="text-sm text-gray-600">{finalOrderData.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">
                  {finalOrderData.address}<br />
                  {finalOrderData.city}, {finalOrderData.state} {finalOrderData.zipCode}<br />
                  {finalOrderData.country}
                </p>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-2">What's Next?</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• You'll receive an email confirmation shortly</li>
                <li>• Your order will be processed within 24 hours</li>
                <li>• Shipping updates will be sent to your email</li>
                <li>• Expected delivery: 3-5 business days</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </button>
          
          <button
            onClick={handleEmailReceipt}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Receipt
          </button>
          
          <button
            onClick={handleTrackOrder}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Package className="h-4 w-4 mr-2" />
            Track Order
          </button>
          
          <button
            onClick={handleContinueShopping}
            className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Home className="h-4 w-4 mr-2" />
            Continue Shopping
          </button>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Customer Support</h4>
              <p className="text-sm text-gray-600">
                Our support team is available 24/7 to help with any questions about your order.
              </p>
              <p className="text-sm text-green-600 mt-1">support@bonsaimarket.com</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Returns & Exchanges</h4>
              <p className="text-sm text-gray-600">
                Not satisfied? We offer free returns within 30 days of purchase.
              </p>
              <p className="text-sm text-green-600 mt-1">View Return Policy</p>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Order Status</h4>
              <p className="text-sm text-gray-600">
                Track your order status and get real-time updates on shipping progress.
              </p>
              <p className="text-sm text-green-600 mt-1">Track My Order</p>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Timeline</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-medium">
                1
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Order Placed</p>
                <p className="text-sm text-gray-600">Your order has been successfully placed</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-sm font-medium">
                2
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Processing</p>
                <p className="text-sm text-gray-600">We're preparing your order for shipment</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-sm font-medium">
                3
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Shipped</p>
                <p className="text-sm text-gray-600">Your order is on its way to you</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 text-sm font-medium">
                4
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Delivered</p>
                <p className="text-sm text-gray-600">Your order has been delivered</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderConfirmation; 