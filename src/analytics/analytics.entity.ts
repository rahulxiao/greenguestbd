import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity()
@Index(['userId', 'eventType', 'createdAt'])
@Index(['eventType', 'createdAt'])
export class UserEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  userId: number;

  @Column()
  eventType: string; // 'page_view', 'product_view', 'add_to_cart', 'purchase', 'search', etc.

  @Column({ type: 'jsonb', nullable: true })
  eventData: any;

  @Column({ nullable: true })
  sessionId: string;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  referrer: string;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity()
@Index(['date', 'metricType'])
export class DailyMetrics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  metricType: string; // 'sales', 'orders', 'users', 'page_views', etc.

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  value: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @CreateDateColumn()
  createdAt: Date;
}

@Entity()
@Index(['productId', 'date'])
export class ProductAnalytics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  addToCartCount: number;

  @Column({ default: 0 })
  purchases: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  revenue: number;

  @CreateDateColumn()
  createdAt: Date;
} 