import { 
  Body, 
  Controller, 
  Delete, 
  Param, 
  Post, 
  Query, 
  Get, 
  ParseIntPipe,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import {
  AddToWishlistDto,
  WishlistItemResponseDto,
  WishlistResponseDto
} from './wishlist.dto';

@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Post('addToWishlist')
  @HttpCode(HttpStatus.CREATED)
  async addToWishlist(
    @Body() addToWishlistDto: AddToWishlistDto,
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<WishlistItemResponseDto> {
    return await this.wishlistService.addToWishlist(userId, addToWishlistDto);
  }

  @Get('getUserWishlist')
  async getUserWishlist(
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<WishlistResponseDto> {
    return await this.wishlistService.getUserWishlist(userId);
  }

  @Delete('removeFromWishlist/:itemId')
  @HttpCode(HttpStatus.OK)
  async removeFromWishlist(
    @Param('itemId', ParseIntPipe) itemId: number,
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<{ success: boolean; message: string }> {
    const success = await this.wishlistService.removeFromWishlist(userId, itemId);
    return {
      success,
      message: success ? 'Item removed from wishlist successfully' : 'Failed to remove item from wishlist'
    };
  }

  @Delete('clearUserWishlist')
  @HttpCode(HttpStatus.OK)
  async clearUserWishlist(
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<{ success: boolean; message: string }> {
    const success = await this.wishlistService.clearUserWishlist(userId);
    return {
      success,
      message: success ? 'Wishlist cleared successfully' : 'Failed to clear wishlist'
    };
  }

  // Admin endpoints
  @Get('getAllWishlists')
  async getAllWishlists(): Promise<WishlistItemResponseDto[]> {
    return await this.wishlistService.getAllWishlists();
  }

  @Get('getWishlistByUserId')
  async getWishlistByUserId(@Query('userId') userId: number): Promise<WishlistItemResponseDto[]> {
    return await this.wishlistService.getWishlistByUserId(userId);
  }

  @Get('checkProductInWishlist')
  async checkProductInWishlist(
    @Query('userId') userId: number,
    @Query('productId') productId: number
  ): Promise<{ isInWishlist: boolean }> {
    const isInWishlist = await this.wishlistService.checkProductInWishlist(userId, productId);
    return { isInWishlist };
  }
} 