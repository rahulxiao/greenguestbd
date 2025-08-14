import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, name: 'profile_address' })
  address: string;

  @Column({ nullable: true, name: 'profile_city' })
  city: string;

  @Column({ nullable: true, name: 'profile_state' })
  state: string;

  @Column({ nullable: true, name: 'profile_country' })
  country: string;

  @Column({ nullable: true, name: 'profile_postal_code' })
  postalCode: string;

  @Column({ type: 'text', nullable: true, name: 'profile_bio' })
  bio: string;

  @Column({ nullable: true, name: 'profile_avatar' })
  avatar: string;

  @OneToOne(() => User, user => user.profile)
  @JoinColumn()
  user: User;
} 

// hello