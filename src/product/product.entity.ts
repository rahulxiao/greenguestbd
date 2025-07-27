import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from '../order/order-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: 0 })
  stock: number;

  @Column({ default: true })
  available: boolean;

  @Column({ nullable: true })
  brand?: string;

  @Column({ nullable: true })
  sku?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  weight?: number;

  @Column({ nullable: true })
  dimensions?: string;

  @Column({ type: 'text', nullable: true })
  specifications?: string;

  @Column({ default: 0 })
  rating: number;

  @Column({ default: 0 })
  reviewCount: number;

  @Column({ nullable: true })
  tags?: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 