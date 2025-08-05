import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  productId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column('int')
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: false })
  isModerated: boolean;

  @Column({ nullable: true })
  moderatorNotes: string;

  @Column({ default: 0 })
  helpfulVotes: number;

  @Column({ default: 0 })
  totalVotes: number;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ nullable: true })
  title: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Virtual property for helpful percentage
  get helpfulPercentage(): number {
    if (this.totalVotes === 0) return 0;
    return Math.round((this.helpfulVotes / this.totalVotes) * 100);
  }
} 