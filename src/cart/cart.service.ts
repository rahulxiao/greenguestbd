import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
  ) {}

  async addToCart(dto: AddToCartDto): Promise<CartItem> {
    const cartItem = this.cartItemRepo.create({
      userId: 1, // In a real app, get from JWT token
      productId: Number(dto.productId),
      quantity: dto.quantity,
    });
    return this.cartItemRepo.save(cartItem);
  }

  async viewCart(): Promise<CartItem[]> {
    // In a real app, get user ID from JWT token
    return this.cartItemRepo.find({ where: { userId: 1 } });
  }

  async updateQuantity(itemId: number, dto: UpdateCartItemDto): Promise<CartItem | null> {
    await this.cartItemRepo.update(itemId, { quantity: dto.quantity });
    return this.cartItemRepo.findOneBy({ id: itemId });
  }

  async removeFromCart(itemId: number): Promise<boolean> {
    const result = await this.cartItemRepo.delete(itemId);
    return !!result.affected && result.affected > 0;
  }

  async create(cartItem: Omit<CartItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<CartItem> {
    const newCartItem = this.cartItemRepo.create(cartItem);
    return this.cartItemRepo.save(newCartItem);
  }

  async findAll(): Promise<CartItem[]> {
    return this.cartItemRepo.find();
  }

  async findOne(id: number): Promise<CartItem | null> {
    return this.cartItemRepo.findOneBy({ id });
  }

  async update(id: number, updateData: Partial<CartItem>): Promise<CartItem | null> {
    await this.cartItemRepo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.cartItemRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }
} 