import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import { CreateAdminDto, UpdateAdminDto, AdminResponseDto, AdminProfileDto } from './admin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  async createAdmin(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    // Check if admin with email already exists
    const existingAdmin = await this.adminRepo.findOne({ where: { email: createAdminDto.email } });
    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createAdminDto.password, 10);

    const newAdmin = this.adminRepo.create({
      ...createAdminDto,
      password: hashedPassword,
    });

    const savedAdmin = await this.adminRepo.save(newAdmin);
    return this.mapToResponseDto(savedAdmin);
  }

  async getAllAdmins(): Promise<AdminResponseDto[]> {
    const admins = await this.adminRepo.find();
    return admins.map(admin => this.mapToResponseDto(admin));
  }

  async getAdminById(id: number): Promise<AdminResponseDto> {
    const admin = await this.adminRepo.findOneBy({ id });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return this.mapToResponseDto(admin);
  }

  async findAdminByEmail(email: string): Promise<Admin | null> {
    return this.adminRepo.findOneBy({ email });
  }

  async updateAdmin(id: number, updateAdminDto: UpdateAdminDto): Promise<AdminResponseDto> {
    const admin = await this.adminRepo.findOneBy({ id });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    // If email is being updated, check for conflicts
    if (updateAdminDto.email && updateAdminDto.email !== admin.email) {
      const existingAdmin = await this.adminRepo.findOne({ where: { email: updateAdminDto.email } });
      if (existingAdmin) {
        throw new ConflictException('Admin with this email already exists');
      }
    }

    // Hash password if it's being updated
    if (updateAdminDto.password) {
      updateAdminDto.password = await bcrypt.hash(updateAdminDto.password, 10);
    }

    await this.adminRepo.update(id, updateAdminDto);
    const updatedAdmin = await this.adminRepo.findOneBy({ id });
    if (!updatedAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found after update`);
    }
    return this.mapToResponseDto(updatedAdmin);
  }

  async updateAdminLastLogin(id: number, ipAddress: string): Promise<void> {
    await this.adminRepo.update(id, {
      lastLoginAt: new Date(),
      lastLoginIp: ipAddress,
    });
  }

  async toggleAdminStatus(id: number): Promise<AdminResponseDto> {
    const admin = await this.adminRepo.findOneBy({ id });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    await this.adminRepo.update(id, { isActive: !admin.isActive });
    const updatedAdmin = await this.adminRepo.findOneBy({ id });
    if (!updatedAdmin) {
      throw new NotFoundException(`Admin with ID ${id} not found after status update`);
    }
    return this.mapToResponseDto(updatedAdmin);
  }

  async getAdminProfile(id: number): Promise<AdminProfileDto> {
    const admin = await this.adminRepo.findOneBy({ id });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    return {
      id: admin.id,
      name: admin.fullName,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      role: admin.role,
      position: admin.position,
      bio: admin.bio,
      timezone: admin.timezone,
      createdAt: admin.createdAt,
    };
  }

  async deleteAdmin(id: number): Promise<boolean> {
    const admin = await this.adminRepo.findOneBy({ id });
    if (!admin) {
      throw new NotFoundException(`Admin with ID ${id} not found`);
    }

    const result = await this.adminRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }

  async getAdminsByName(name: string): Promise<AdminResponseDto[]> {
    const admins = await this.adminRepo.find({
      where: [
        { firstName: name },
        { lastName: name }
      ]
    });
    return admins.map(admin => this.mapToResponseDto(admin));
  }

  async getActiveAdmins(): Promise<AdminResponseDto[]> {
    const admins = await this.adminRepo.find({
      where: { isActive: true }
    });
    return admins.map(admin => this.mapToResponseDto(admin));
  }

  async getInactiveAdmins(): Promise<AdminResponseDto[]> {
    const admins = await this.adminRepo.find({
      where: { isActive: false }
    });
    return admins.map(admin => this.mapToResponseDto(admin));
  }

  private mapToResponseDto(admin: Admin): AdminResponseDto {
    return {
      id: admin.id,
      name: admin.fullName,
      email: admin.email,
      phoneNumber: admin.phoneNumber,
      role: admin.role,
      isActive: admin.isActive,
      lastLoginAt: admin.lastLoginAt,
      lastLoginIp: admin.lastLoginIp,
      position: admin.position,
      bio: admin.bio,
      timezone: admin.timezone,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    };
  }
}

export { Admin };

