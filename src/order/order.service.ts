import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { PlaceOrderDto } from './dto/place-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async placeOrder(dto: PlaceOrderDto): Promise<Order> {
    const order = this.orderRepo.create({
      userId: 1, // In a real app, get from JWT token
      items: dto.items,
      address: dto.address,
      paymentMethod: dto.paymentMethod,
    });
    return this.orderRepo.save(order);
  }

  async viewMyOrders(): Promise<Order[]> {
    // In a real app, get user ID from JWT token
    return this.orderRepo.find({ where: { userId: 1 } });
  }

  async viewAllOrders(): Promise<Order[]> {
    return this.orderRepo.find();
  }

  async updateOrderStatus(id: number, dto: UpdateOrderStatusDto): Promise<Order | null> {
    await this.orderRepo.update(id, { status: dto.status });
    return this.orderRepo.findOneBy({ id });
  }

  async create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const newOrder = this.orderRepo.create(order);
    return this.orderRepo.save(newOrder);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find();
  }

  async findOne(id: number): Promise<Order | null> {
    return this.orderRepo.findOneBy({ id });
  }

  async update(id: number, updateData: Partial<Order>): Promise<Order | null> {
    await this.orderRepo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.orderRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }
} 