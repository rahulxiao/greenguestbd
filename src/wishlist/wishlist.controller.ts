import { Controller, Post, Get, Delete, Param, Body } from '@nestjs/common';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@Controller('wishlist')
export class WishlistController {
  @Post()
  addToWishlist(@Body() dto: AddToWishlistDto) {
    // Add product to wishlist
    return { message: 'Added to wishlist (stub)' };
  }

  @Get()
  getWishlist() {
    // Get wishlist
    return { items: [] };
  }

  @Delete(':id')
  removeFromWishlist(@Param('id') id: string) {
    // Remove from wishlist
    return { message: 'Removed from wishlist (stub)' };
  }
} 