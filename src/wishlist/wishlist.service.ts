import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WishlistItem } from './wishlist-item.entity';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(WishlistItem)
    private readonly wishlistItemRepo: Repository<WishlistItem>,
  ) {}

  async addToWishlist(dto: AddToWishlistDto): Promise<WishlistItem> {
    const wishlistItem = this.wishlistItemRepo.create({
      userId: 1, // In a real app, get from JWT token
      productId: Number(dto.productId),
    });
    return this.wishlistItemRepo.save(wishlistItem);
  }

  async getWishlist(): Promise<WishlistItem[]> {
    // In a real app, get user ID from JWT token
    return this.wishlistItemRepo.find({ where: { userId: 1 } });
  }

  async removeFromWishlist(id: number): Promise<boolean> {
    const result = await this.wishlistItemRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }

  async create(wishlistItem: Omit<WishlistItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<WishlistItem> {
    const newWishlistItem = this.wishlistItemRepo.create(wishlistItem);
    return this.wishlistItemRepo.save(newWishlistItem);
  }

  async findAll(): Promise<WishlistItem[]> {
    return this.wishlistItemRepo.find();
  }

  async findOne(id: number): Promise<WishlistItem | null> {
    return this.wishlistItemRepo.findOneBy({ id });
  }

  async update(id: number, updateData: Partial<WishlistItem>): Promise<WishlistItem | null> {
    await this.wishlistItemRepo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.wishlistItemRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }
} 