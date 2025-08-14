import apiService from './api';

export interface Order {
  id: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  items: OrderItem[];
  orderNumber?: string;
  shippingAddress?: string;
  paymentMethod?: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
}

class OrderService {
  async getUserOrders(): Promise<Order[]> {
    try {
      const response = await apiService.get<Order[]>('/orders/user-orders');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch user orders');
    }
  }

  async getOrderById(orderId: string): Promise<OrderDetail> {
    try {
      const response = await apiService.get<OrderDetail>(`/orders/${orderId}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch order details');
    }
  }

  async cancelOrder(orderId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(`/orders/${orderId}/cancel`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to cancel order');
    }
  }

  async getOrderHistory(): Promise<Order[]> {
    try {
      const response = await apiService.get<Order[]>('/orders/history');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch order history');
    }
  }

  async getOrdersByStatus(status: string): Promise<Order[]> {
    try {
      const response = await apiService.get<Order[]>(`/orders/status/${status}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch orders by status');
    }
  }
}

export const orderService = new OrderService();
export default orderService;
