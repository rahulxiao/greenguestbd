import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from '../order/order-item.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'product_name' })
  name: string;

  @Column({ name: 'product_category' })
  category: string;

  @Column('decimal', { precision: 10, scale: 2, name: 'product_price' })
  price: number;

  @Column({ nullable: true, name: 'product_description' })
  description?: string;

  @Column({ nullable: true, name: 'product_image' })
  imageUrl?: string;

  @Column({ default: 0, name: 'stock_quantity' })
  stock: number;

  @Column({ default: true, name: 'is_available' })
  available: boolean;

  @Column({ nullable: true, name: 'product_brand' })
  brand?: string;

  @Column({ nullable: true, name: 'product_sku' })
  sku?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true, name: 'product_weight' })
  weight?: number;

  @Column({ nullable: true, name: 'product_dimensions' })
  dimensions?: string;

  @Column({ type: 'text', nullable: true, name: 'product_specifications' })
  specifications?: string;

  @Column({ default: 0, name: 'average_rating' })
  rating: number;

  @Column({ default: 0, name: 'total_reviews' })
  reviewCount: number;

  @Column({ nullable: true, name: 'product_tags' })
  tags?: string;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @CreateDateColumn({ name: 'created_date' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_date' })
  updatedAt: Date;
} 