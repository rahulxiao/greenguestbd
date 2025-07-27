import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { Order } from '../order/order.entity';
import { CartItem } from '../cart/cart-item.entity';
import { WishlistItem } from '../wishlist/wishlist-item.entity';
import { Profile } from './profile.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];

  @OneToMany(() => CartItem, cartItem => cartItem.user)
  cartItems: CartItem[];

  @OneToMany(() => WishlistItem, wishlistItem => wishlistItem.user)
  wishlistItems: WishlistItem[];

  @OneToOne(() => Profile, profile => profile.user)
  profile: Profile;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 