import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './wishlist-item.entity';
import { Product } from '../product/product.entity';
import { AddToWishlistDto, WishlistItemResponseDto, WishlistResponseDto } from './wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistItemRepo: Repository<WishlistItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async addToWishlist(userId: number, addToWishlistDto: AddToWishlistDto): Promise<WishlistItemResponseDto> {
    // Check if product exists
    const product = await this.productRepo.findOneBy({ id: addToWishlistDto.productId });
    if (!product) {
      throw new NotFoundException(`Product with ID ${addToWishlistDto.productId} not found`);
    }

    // Check if item already exists in wishlist
    const existingItem = await this.wishlistItemRepo.findOne({
      where: { userId, productId: addToWishlistDto.productId }
    });

    if (existingItem) {
      throw new ConflictException('Product already exists in wishlist');
    }

    // Create new wishlist item
    const wishlistItem = this.wishlistItemRepo.create({
      userId,
      productId: addToWishlistDto.productId,
    });
    const savedItem = await this.wishlistItemRepo.save(wishlistItem);
    return this.mapToResponseDto(savedItem, product);
  }

  async getUserWishlist(userId: number): Promise<WishlistResponseDto> {
    const wishlistItems = await this.wishlistItemRepo.find({
      where: { userId }
    });

    const items = await Promise.all(
      wishlistItems.map(async (item) => {
        const product = await this.productRepo.findOneBy({ id: item.productId });
        return this.mapToResponseDto(item, product || undefined);
      })
    );

    return {
      items,
      totalItems: items.length
    };
  }

  async removeFromWishlist(userId: number, itemId: number): Promise<boolean> {
    const wishlistItem = await this.wishlistItemRepo.findOne({
      where: { id: itemId, userId }
    });

    if (!wishlistItem) {
      throw new NotFoundException(`Wishlist item with ID ${itemId} not found`);
    }

    const result = await this.wishlistItemRepo.delete(itemId);
    return !!result.affected && result.affected > 0;
  }

  async clearUserWishlist(userId: number): Promise<boolean> {
    const result = await this.wishlistItemRepo.delete({ userId });
    return !!result.affected && result.affected > 0;
  }

  async getAllWishlists(): Promise<WishlistItemResponseDto[]> {
    const wishlistItems = await this.wishlistItemRepo.find();

    return Promise.all(
      wishlistItems.map(async (item) => {
        const product = await this.productRepo.findOneBy({ id: item.productId });
        return this.mapToResponseDto(item, product || undefined);
      })
    );
  }

  async getWishlistByUserId(userId: number): Promise<WishlistItemResponseDto[]> {
    const wishlistItems = await this.wishlistItemRepo.find({
      where: { userId }
    });

    return Promise.all(
      wishlistItems.map(async (item) => {
        const product = await this.productRepo.findOneBy({ id: item.productId });
        return this.mapToResponseDto(item, product || undefined);
      })
    );
  }

  async checkProductInWishlist(userId: number, productId: number): Promise<boolean> {
    const wishlistItem = await this.wishlistItemRepo.findOne({
      where: { userId, productId }
    });
    return !!wishlistItem;
  }

  private mapToResponseDto(wishlistItem: WishlistItem, product?: Product): WishlistItemResponseDto {
    return {
      id: wishlistItem.id,
      userId: wishlistItem.userId,
      productId: wishlistItem.productId,
      product: product ? {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        available: product.available,
        stock: product.stock,
        brand: product.brand,
        category: product.category,
      } : undefined,
      createdAt: wishlistItem.createdAt,
      updatedAt: wishlistItem.updatedAt,
    };
  }
} 