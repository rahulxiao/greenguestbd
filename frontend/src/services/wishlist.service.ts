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
      const response = await apiService.get<{ items: any[]; totalItems: number }>('/wishlist/getUserWishlist');
      const items = Array.isArray(response?.items) ? response.items : [];
      const mapped: WishlistItem[] = items.map((it: any) => {
        const product = it.product || {};
        const priceNumber = typeof product.price === 'string' ? parseFloat(product.price) : (product.price ?? 0);
        return {
          id: it.id,
          productId: it.productId ?? product.id,
          productName: product.name ?? 'Product',
          price: isNaN(priceNumber) ? 0 : priceNumber,
          imageUrl: product.imageUrl ?? '/placeholder-product.jpg',
          category: product.category ?? '',
          inStock: !!product.available && (product.stock ?? 0) > 0,
          addedAt: it.createdAt ? new Date(it.createdAt) : new Date()
        } as WishlistItem;
      });
      return mapped;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch wishlist');
    }
  }

  async addToWishlist(productId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.post<{ success: boolean; message: string }>('/wishlist/addToWishlist', { productId });
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to add item to wishlist');
    }
  }

  async removeFromWishlist(itemId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.delete<{ success: boolean; message: string }>(`/wishlist/removeFromWishlist/${itemId}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to remove item from wishlist');
    }
  }

  async removeProductFromWishlist(productId: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiService.delete<{ success: boolean; message: string }>(`/wishlist/product/${productId}`);
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to remove product from wishlist');
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
      const response = await apiService.delete<{ success: boolean; message: string }>('/wishlist/clearUserWishlist');
      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to clear wishlist');
    }
  }

  async isInWishlist(productId: number): Promise<boolean> {
    try {
      const response = await apiService.get<{ isInWishlist: boolean }>(`/wishlist/checkProductInWishlist?productId=${productId}`);
      return response.isInWishlist;
    } catch (error) {
      return false;
    }
  }
}

export const wishlistService = new WishlistService();
export default wishlistService;
