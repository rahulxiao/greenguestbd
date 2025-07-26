import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  async create(admin: Omit<Admin, 'id' | 'createdAt'>): Promise<Admin> {
    const newAdmin = this.adminRepo.create(admin);
    return this.adminRepo.save(newAdmin);
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepo.find();
  }

  async findOne(id: number): Promise<Admin | null> {
    return this.adminRepo.findOneBy({ id });
  }

  async update(id: number, updateData: Partial<Omit<Admin, 'id' | 'createdAt'>>): Promise<Admin | null> {
    await this.adminRepo.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.adminRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }
}
