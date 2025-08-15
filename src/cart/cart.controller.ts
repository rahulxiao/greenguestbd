import { 
  Body, 
  Controller, 
  Delete, 
  Param, 
  Post, 
  Query, 
  Get, 
  Put, 
  ParseIntPipe,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { CartService } from './cart.service';
import {
  AddToCartDto,
  UpdateCartItemDto,
  CartItemResponseDto,
  CartResponseDto
} from './cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Get('health')
  async healthCheck(): Promise<{ status: string; message: string }> {
    return {
      status: 'ok',
      message: 'Cart controller is working!'
    };
  }

  @Get('debug')
  async debugCart(@Query('userId') userId: number = 1): Promise<any> {
    const cartItems = await this.cartService.getCartByUserId(userId);
    const rawItems = await this.cartService['cartItemRepo'].find({
      where: { userId },
      relations: ['product']
    });
    
    return {
      processed: cartItems,
      raw: rawItems,
      message: 'Debug information for cart data'
    };
  }

  @Get('test-product')
  async testProduct(): Promise<any> {
    try {
      const product = await this.cartService['productRepo'].findOneBy({ id: 1 });
      return {
        product,
        message: 'Test product data',
        hasPrice: !!product?.price,
        priceType: typeof product?.price,
        priceValue: product?.price,
        hasImage: !!product?.imageUrl,
        imageUrl: product?.imageUrl
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'Failed to fetch test product'
      };
    }
  }

  @Get('check-products')
  async checkProducts(): Promise<any> {
    try {
      const products = await this.cartService['productRepo'].find();
      return {
        message: 'Product data check',
        totalProducts: products.length,
        products: products.map(p => ({
          id: p.id,
          name: p.name,
          price: p.price,
          hasImage: !!p.imageUrl,
          imageUrl: p.imageUrl
        }))
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'Failed to check products'
      };
    }
  }

  @Get('fix-images')
  async fixImages(): Promise<any> {
    try {
      const products = await this.cartService['productRepo'].find();
      const results: Array<{
        id: number;
        name: string;
        oldImageUrl?: string;
        newImageUrl?: string;
        imageUrl?: string;
        updated: boolean;
      }> = [];
      
      for (const product of products) {
        if (!product.imageUrl) {
          // Set sample image URLs based on product category/name
          let imageUrl = '';
          if (product.name.toLowerCase().includes('bonsai')) {
            imageUrl = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400';
          } else if (product.name.toLowerCase().includes('soil') || product.name.toLowerCase().includes('pot')) {
            imageUrl = 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400';
          } else if (product.name.toLowerCase().includes('tool') || product.name.toLowerCase().includes('shear')) {
            imageUrl = 'https://images.unsplash.com/photo-1581147033417-4b519e7a1c1a?w=400';
          } else {
            imageUrl = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400';
          }
          
          await this.cartService['productRepo'].update(product.id, { imageUrl });
          results.push({
            id: product.id,
            name: product.name,
            oldImageUrl: product.imageUrl,
            newImageUrl: imageUrl,
            updated: true
          });
        } else {
          results.push({
            id: product.id,
            name: product.name,
            imageUrl: product.imageUrl,
            updated: false
          });
        }
      }
      
      return {
        message: 'Image URLs check completed',
        results,
        totalProducts: products.length
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'Failed to fix images'
      };
    }
  }

  @Get('fix-prices')
  async fixPrices(): Promise<any> {
    try {
      // Get all products
      const products = await this.cartService['productRepo'].find();
      const results: Array<{
        id: number;
        name: string;
        oldPrice?: number;
        newPrice?: number;
        price?: number;
        updated: boolean;
      }> = [];
      
      for (const product of products) {
        if (!product.price || product.price === 0) {
          // Set a default price based on product ID (for testing)
          const newPrice = (product.id * 10) + 9.99; // ID 1 = 19.99, ID 2 = 29.99, etc.
          await this.cartService['productRepo'].update(product.id, { price: newPrice });
          results.push({
            id: product.id,
            name: product.name,
            oldPrice: product.price,
            newPrice: newPrice,
            updated: true
          });
        } else {
          results.push({
            id: product.id,
            name: product.name,
            price: product.price,
            updated: false
          });
        }
      }
      
      return {
        message: 'Price check completed',
        results,
        totalProducts: products.length
      };
    } catch (error) {
      return {
        error: error.message,
        message: 'Failed to fix prices'
      };
    }
  }

  @Post('addToCart')
  @HttpCode(HttpStatus.CREATED)
  async addToCart(
    @Body() addToCartDto: AddToCartDto,
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<CartItemResponseDto> {
    return await this.cartService.addToCart(userId, addToCartDto);
  }

  @Get('getUserCart')
  async getUserCart(
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<CartResponseDto> {
    return await this.cartService.getUserCart(userId);
  }

  @Get('getCartItems')
  async getCartItems(
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<CartItemResponseDto[]> {
    return await this.cartService.getCartByUserId(userId);
  }

  @Get('getCartTotal')
  async getCartTotal(
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<{ total: number; itemCount: number }> {
    const cart = await this.cartService.getUserCart(userId);
    return {
      total: cart.totalPrice,
      itemCount: cart.totalItems
    };
  }

  @Put('updateCartItemQuantity/:itemId')
  async updateCartItemQuantity(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Body() updateCartItemDto: UpdateCartItemDto,
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<CartItemResponseDto> {
    return await this.cartService.updateCartItemQuantity(userId, itemId, updateCartItemDto);
  }

  @Delete('removeFromCart/:itemId')
  @HttpCode(HttpStatus.OK)
  async removeFromCart(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<{ success: boolean; message: string }> {
    const success = await this.cartService.removeFromCart(userId, itemId);
    return {
      success,
      message: success ? 'Item removed from cart successfully' : 'Failed to remove item from cart'
    };
  }

  @Delete('clearUserCart')
  @HttpCode(HttpStatus.OK)
  async clearUserCart(
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<{ success: boolean; message: string }> {
    const success = await this.cartService.clearUserCart(userId);
    return {
      success,
      message: success ? 'Cart cleared successfully' : 'Failed to clear cart'
    };
  }

  @Post('moveToWishlist/:itemId')
  @HttpCode(HttpStatus.OK)
  async moveToWishlist(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<{ success: boolean; message: string }> {
    return await this.cartService.moveToWishlist(userId, itemId);
  }

  // Admin endpoints
  @Get('getAllCarts')
  async getAllCarts(): Promise<CartItemResponseDto[]> {
    return await this.cartService.getAllCarts();
  }

  @Get('getCartByUserId')
  async getCartByUserId(@Query('userId') userId: number): Promise<CartItemResponseDto[]> {
    return await this.cartService.getCartByUserId(userId);
  }
} 