import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Controller('cart')
export class CartController {
  @Post()
  addToCart(@Body() dto: AddToCartDto) {
    // Add to cart
    return { message: 'Added to cart (stub)' };
  }

  @Get()
  viewCart() {
    // View cart
    return { items: [] };
  }

  @Put(':itemId')
  updateQuantity(@Param('itemId') itemId: string, @Body() dto: UpdateCartItemDto) {
    // Update quantity
    return { message: 'Quantity updated (stub)' };
  }

  @Delete(':itemId')
  removeFromCart(@Param('itemId') itemId: string) {
    // Remove from cart
    return { message: 'Removed from cart (stub)' };
  }
} 