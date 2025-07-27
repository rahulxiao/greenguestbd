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