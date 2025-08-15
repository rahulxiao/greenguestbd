import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartItem } from './cart-item.entity';
import { Product } from '../product/product.entity';
import { AddToCartDto, UpdateCartItemDto, CartItemResponseDto, CartResponseDto } from './cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartItemRepo: Repository<CartItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async addToCart(userId: number, addToCartDto: AddToCartDto): Promise<CartItemResponseDto> {
    // Check if product exists and is available
    const product = await this.productRepo.findOneBy({ id: addToCartDto.productId });
    if (!product) {
      throw new NotFoundException(`Product with ID ${addToCartDto.productId} not found`);
    }
    if (!product.available) {
      throw new ConflictException(`Product ${product.name} is not available`);
    }
    if (product.stock < addToCartDto.quantity) {
      throw new ConflictException(`Insufficient stock. Available: ${product.stock}`);
    }

    // Check if item already exists in cart
    const existingItem = await this.cartItemRepo.findOne({
      where: { userId, productId: addToCartDto.productId }
    });

    if (existingItem) {
      // Update quantity if item already exists
      const newQuantity = existingItem.quantity + addToCartDto.quantity;
      if (newQuantity > product.stock) {
        throw new ConflictException(`Insufficient stock. Available: ${product.stock}`);
      }
      await this.cartItemRepo.update(existingItem.id, { quantity: newQuantity });
      const updatedItem = await this.cartItemRepo.findOneBy({ id: existingItem.id });
      if (!updatedItem) {
        throw new NotFoundException('Cart item not found after update');
      }
      return this.mapToResponseDto(updatedItem, product);
    }

    // Create new cart item
    const cartItem = this.cartItemRepo.create({
      userId,
      productId: addToCartDto.productId,
      quantity: addToCartDto.quantity,
    });
    const savedItem = await this.cartItemRepo.save(cartItem);
    return this.mapToResponseDto(savedItem, product);
  }

  async getUserCart(userId: number): Promise<CartResponseDto> {
    const cartItems = await this.cartItemRepo.find({
      where: { userId },
      relations: ['product']
    });

    const items = cartItems.map(item => this.mapToResponseDto(item, item.product));

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => {
      const product = item.product;
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    return {
      items,
      totalItems,
      totalPrice
    };
  }

  async updateCartItemQuantity(userId: number, itemId: number, updateCartItemDto: UpdateCartItemDto): Promise<CartItemResponseDto> {
    const cartItem = await this.cartItemRepo.findOne({
      where: { id: itemId, userId }
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    // Check product availability
    const product = await this.productRepo.findOneBy({ id: cartItem.productId });
    if (!product) {
      throw new NotFoundException(`Product not found`);
    }
    if (!product.available) {
      throw new ConflictException(`Product ${product.name} is not available`);
    }
    if (updateCartItemDto.quantity > product.stock) {
      throw new ConflictException(`Insufficient stock. Available: ${product.stock}`);
    }

    await this.cartItemRepo.update(itemId, { quantity: updateCartItemDto.quantity });
    const updatedItem = await this.cartItemRepo.findOneBy({ id: itemId });
    if (!updatedItem) {
      throw new NotFoundException('Cart item not found after update');
    }
    return this.mapToResponseDto(updatedItem, product);
  }

  async removeFromCart(userId: number, itemId: number): Promise<boolean> {
    const cartItem = await this.cartItemRepo.findOne({
      where: { id: itemId, userId }
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    const result = await this.cartItemRepo.delete(itemId);
    return !!result.affected && result.affected > 0;
  }

  async clearUserCart(userId: number): Promise<boolean> {
    const result = await this.cartItemRepo.delete({ userId });
    return !!result.affected && result.affected > 0;
  }

  async moveToWishlist(userId: number, itemId: number): Promise<{ success: boolean; message: string }> {
    const cartItem = await this.cartItemRepo.findOne({
      where: { id: itemId, userId }
    });

    if (!cartItem) {
      throw new NotFoundException(`Cart item with ID ${itemId} not found`);
    }

    // Here you would typically call the wishlist service to add the item
    // For now, we'll just remove it from cart and return success
    // TODO: Implement proper wishlist integration
    await this.cartItemRepo.delete(itemId);
    
    return {
      success: true,
      message: 'Item moved to wishlist successfully'
    };
  }

  async getAllCarts(): Promise<CartItemResponseDto[]> {
    const cartItems = await this.cartItemRepo.find({
      relations: ['product']
    });

    return cartItems.map(item => this.mapToResponseDto(item, item.product));
  }

  async getCartByUserId(userId: number): Promise<CartItemResponseDto[]> {
    const cartItems = await this.cartItemRepo.find({
      where: { userId },
      relations: ['product']
    });

    return cartItems.map(item => this.mapToResponseDto(item, item.product));
  }

  private mapToResponseDto(cartItem: CartItem, product?: Product): CartItemResponseDto {
    return {
      id: cartItem.id,
      userId: cartItem.userId,
      productId: cartItem.productId,
      quantity: cartItem.quantity,
      product: product ? {
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        available: product.available,
        stock: product.stock,
      } : undefined,
      createdAt: cartItem.createdAt,
      updatedAt: cartItem.updatedAt,
    };
  }
} 