import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { PlaceOrderDto, UpdateOrderStatusDto, OrderResponseDto, OrderDetailDto } from './order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async placeOrder(userId: number, placeOrderDto: PlaceOrderDto): Promise<OrderResponseDto> {
    // Validate user exists
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Validate products and check stock
    const orderItems: Array<{product: Product, quantity: number}> = [];
    let totalAmount = 0;
    let totalItems = 0;

    for (const itemDto of placeOrderDto.items) {
      const product = await this.productRepo.findOneBy({ id: itemDto.productId });
      if (!product) {
        throw new NotFoundException(`Product with ID ${itemDto.productId} not found`);
      }
      if (!product.available) {
        throw new ConflictException(`Product ${product.name} is not available`);
      }
      if (product.stock < itemDto.quantity) {
        throw new ConflictException(`Insufficient stock for ${product.name}. Available: ${product.stock}`);
      }

      // Update product stock
      await this.productRepo.update(itemDto.productId, { 
        stock: product.stock - itemDto.quantity 
      });

      orderItems.push({
        product: product,
        quantity: itemDto.quantity
      });

      totalAmount += product.price * itemDto.quantity;
      totalItems += itemDto.quantity;
    }

    // Create order
    const order = this.orderRepo.create({
      userId,
      address: placeOrderDto.address,
      paymentMethod: placeOrderDto.paymentMethod,
      status: 'pending'
    });

    const savedOrder = await this.orderRepo.save(order);

    // Create order items
    const savedOrderItems = await Promise.all(
      orderItems.map(async (item) => {
        const orderItem = this.orderItemRepo.create({
          order: savedOrder,
          product: item.product,
          quantity: item.quantity
        });
        return this.orderItemRepo.save(orderItem);
      })
    );

    return this.mapToResponseDto(savedOrder, savedOrderItems, totalAmount, totalItems);
  }

  async getUserOrders(userId: number): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      where: { userId }
    });

    return Promise.all(
      orders.map(async (order) => {
        const orderItems = await this.orderItemRepo.find({
          where: { order: { id: order.id } },
          relations: ['product']
        });
        
        let totalAmount = 0;
        let totalItems = 0;
        
        for (const item of orderItems) {
          if (item.product) {
            totalAmount += item.product.price * item.quantity;
            totalItems += item.quantity;
          }
        }

        return this.mapToResponseDto(order, orderItems, totalAmount, totalItems);
      })
    );
  }

  async getAllOrders(): Promise<OrderDetailDto[]> {
    const orders = await this.orderRepo.find();

    return Promise.all(
      orders.map(async (order) => {
        const user = await this.userRepo.findOneBy({ id: order.userId });
        const orderItems = await this.orderItemRepo.find({
          where: { order: { id: order.id } },
          relations: ['product']
        });
        
        let totalAmount = 0;
        let totalItems = 0;
        
        for (const item of orderItems) {
          if (item.product) {
            totalAmount += item.product.price * item.quantity;
            totalItems += item.quantity;
          }
        }

        return this.mapToDetailDto(order, user, orderItems, totalAmount, totalItems);
      })
    );
  }

  async getOrderById(orderId: number): Promise<OrderDetailDto> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId }
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const user = await this.userRepo.findOneBy({ id: order.userId });
    const orderItems = await this.orderItemRepo.find({
      where: { order: { id: order.id } },
      relations: ['product']
    });
    
    let totalAmount = 0;
    let totalItems = 0;
    
    for (const item of orderItems) {
      if (item.product) {
        totalAmount += item.product.price * item.quantity;
        totalItems += item.quantity;
      }
    }

    return this.mapToDetailDto(order, user, orderItems, totalAmount, totalItems);
  }

  async updateOrderStatus(orderId: number, updateOrderStatusDto: UpdateOrderStatusDto): Promise<OrderResponseDto> {
    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    await this.orderRepo.update(orderId, { status: updateOrderStatusDto.status });
    const updatedOrder = await this.orderRepo.findOneBy({ id: orderId });
    if (!updatedOrder) {
      throw new NotFoundException(`Order with ID ${orderId} not found after update`);
    }

    const orderItems = await this.orderItemRepo.find({
      where: { order: { id: orderId } },
      relations: ['product']
    });
    
    let totalAmount = 0;
    let totalItems = 0;
    
    for (const item of orderItems) {
      if (item.product) {
        totalAmount += item.product.price * item.quantity;
        totalItems += item.quantity;
      }
    }

    return this.mapToResponseDto(updatedOrder, orderItems, totalAmount, totalItems);
  }

  async deleteOrder(orderId: number): Promise<boolean> {
    const order = await this.orderRepo.findOneBy({ id: orderId });
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    const result = await this.orderRepo.delete(orderId);
    return !!result.affected && result.affected > 0;
  }

  async getOrdersByStatus(status: string): Promise<OrderResponseDto[]> {
    const orders = await this.orderRepo.find({
      where: { status }
    });

    return Promise.all(
      orders.map(async (order) => {
        const orderItems = await this.orderItemRepo.find({
          where: { order: { id: order.id } },
          relations: ['product']
        });
        
        let totalAmount = 0;
        let totalItems = 0;
        
        for (const item of orderItems) {
          if (item.product) {
            totalAmount += item.product.price * item.quantity;
            totalItems += item.quantity;
          }
        }

        return this.mapToResponseDto(order, orderItems, totalAmount, totalItems);
      })
    );
  }

  private mapToResponseDto(order: Order, orderItems: OrderItem[], totalAmount: number, totalItems: number): OrderResponseDto {
    return {
      id: order.id,
      userId: order.userId,
      items: orderItems.map(item => ({
        id: item.id,
        productId: item.product?.id || 0,
        quantity: item.quantity
      })),
      address: order.address,
      paymentMethod: order.paymentMethod,
      status: order.status,
      totalAmount,
      totalItems,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private mapToDetailDto(order: Order, user: User | null, orderItems: OrderItem[], totalAmount: number, totalItems: number): OrderDetailDto {
    return {
      id: order.id,
      userId: order.userId,
      user: user ? {
        id: user.id,
        name: user.name,
        email: user.email,
      } : undefined,
      items: orderItems.map(item => ({
        id: item.id,
        productId: item.product?.id || 0,
        quantity: item.quantity
      })),
      address: order.address,
      paymentMethod: order.paymentMethod,
      status: order.status,
      totalAmount,
      totalItems,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }
} 