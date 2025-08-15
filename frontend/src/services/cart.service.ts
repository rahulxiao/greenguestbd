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
      console.log('🔍 CartService: Fetching cart items...');
      const response = await apiService.get<CartItem[]>('/cart/getCartItems');
      console.log('✅ CartService: Successfully fetched cart items:', response);
      return response;
    } catch (error) {
      console.error('❌ CartService: Failed to fetch cart items:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch cart items');
    }
  }

  async addToCart(data: AddToCartData): Promise<CartItem> {
    try {
      console.log('🛒 CartService: Adding to cart:', data);
      const response = await apiService.post<CartItem>('/cart/addToCart', data);
      console.log('✅ CartService: Successfully added to cart:', response);
      return response;
    } catch (error) {
      console.error('❌ CartService: Failed to add to cart:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to add item to cart');
    }
  }

  async updateCartItem(itemId: number, data: UpdateCartItemData): Promise<CartItem> {
    try {
      console.log('✏️ CartService: Updating cart item:', itemId, data);
      const response = await apiService.put<CartItem>(`/cart/updateCartItemQuantity/${itemId}`, data);
      console.log('✅ CartService: Successfully updated cart item:', response);
      return response;
    } catch (error) {
      console.error('❌ CartService: Failed to update cart item:', error);
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
