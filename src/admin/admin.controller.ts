import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { AdminService, Admin } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() admin: Omit<Admin, 'id'>): Admin {
    return this.adminService.create(admin);
  }

  @Get()
  findAll(): Admin[] {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Admin {
    const admin = this.adminService.findOne(Number(id));
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateData: Partial<Omit<Admin, 'id'>>): Admin {
    const admin = this.adminService.update(Number(id), updateData);
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  @Delete(':id')
  remove(@Param('id') id: string): { success: boolean } {
    const success = this.adminService.remove(Number(id));
    if (!success) throw new NotFoundException('Admin not found');
    return { success };
  }
}

// Product management endpoints will be handled in ProductController
