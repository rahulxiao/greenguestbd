import apiService from './api';

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
  addedAt: Date;
}

export interface AddToWishlistData {
  productId: number;
}

class WishlistService {
  async getUserWishlist(): Promise<WishlistItem[]> {
    try {
      const response = await apiService.get<WishlistItem[]>('/wishlist/user-wishlist');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch wishlist');
    }
  }

  async addToWishlist(productId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>('/wishlist/add', { productId });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to add item to wishlist');
    }
  }

  async removeFromWishlist(itemId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.delete<{ success: boolean; message: string }>(`/wishlist/${itemId}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to remove item from wishlist');
    }
  }

  async moveToCart(itemId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>(`/wishlist/${itemId}/move-to-cart`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to move item to cart');
    }
  }

  async clearWishlist(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.delete<{ success: boolean; message: string }>('/wishlist/clear');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to clear wishlist');
    }
  }

  async isInWishlist(productId: number): Promise<boolean> {
    try {
      const response = await apiService.get<{ inWishlist: boolean }>(`/wishlist/check/${productId}`);
      return response.inWishlist;
    } catch (error) {
      return false;
    }
  }
}

export const wishlistService = new WishlistService();
export default wishlistService;
