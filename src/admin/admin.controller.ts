import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { AdminService, Admin } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() admin: Omit<Admin, 'id'>): Promise<Admin> {
    return this.adminService.create(admin);
  }

  @Get()
  findAll(): Promise<Admin[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Admin> {
    const admin = await this.adminService.findOne(Number(id));

    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateData: Partial<Omit<Admin, 'id'>>): Promise<Admin> {
    const admin = await this.adminService.update(Number(id), updateData);
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ success: boolean }> {
    const success = await this.adminService.remove(Number(id));
    if (!success) throw new NotFoundException('Admin not found');
    return { success };
  }
}

// Product management endpoints will be handled in ProductController
