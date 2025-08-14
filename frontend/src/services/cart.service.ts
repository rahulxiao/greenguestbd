import apiService from './api';

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product?: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    stock: number;
    available: boolean;
  };
}

export interface AddToCartData {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemData {
  quantity: number;
}

class CartService {
  async getCartItems(): Promise<CartItem[]> {
    try {
      return await apiService.get<CartItem[]>('/cart/getCartItems');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch cart items');
    }
  }

  async addToCart(data: AddToCartData): Promise<CartItem> {
    try {
      return await apiService.post<CartItem>('/cart/addToCart', data);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to add item to cart');
    }
  }

  async updateCartItem(itemId: number, data: UpdateCartItemData): Promise<CartItem> {
    try {
      return await apiService.put<CartItem>(`/cart/updateCartItem/${itemId}`, data);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update cart item');
    }
  }

  async removeFromCart(itemId: number): Promise<{ success: boolean; message: string }> {
    try {
      return await apiService.delete<{ success: boolean; message: string }>(`/cart/removeFromCart/${itemId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to remove item from cart');
    }
  }

  async clearCart(): Promise<{ success: boolean; message: string }> {
    try {
      return await apiService.delete<{ success: boolean; message: string }>('/cart/clearCart');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to clear cart');
    }
  }

  async getCartTotal(): Promise<{ total: number; itemCount: number }> {
    try {
      return await apiService.get<{ total: number; itemCount: number }>('/cart/getCartTotal');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to get cart total');
    }
  }

  async moveToWishlist(itemId: number): Promise<{ success: boolean; message: string }> {
    try {
      return await apiService.post<{ success: boolean; message: string }>(`/cart/moveToWishlist/${itemId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to move item to wishlist');
    }
  }
}

export const cartService = new CartService();
export default cartService;
