import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getProfile(): Promise<User | null> {
    // In a real app, you'd get the user ID from JWT token
    return this.userRepo.findOne({ where: { id: 1 } });
  }

  async updateProfile(dto: UpdateProfileDto): Promise<User | null> {
    // In a real app, you'd get the user ID from JWT token
    await this.userRepo.update(1, dto);
    return this.userRepo.findOne({ where: { id: 1 } });
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const newUser = this.userRepo.create(user);
    return this.userRepo.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findOne(id: number): Promise<User | null> {
    return this.userRepo.findOneBy({ id });
  }

  async update(id: number, dto: UpdateProfileDto): Promise<User | null> {
    await this.userRepo.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.userRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }
}
