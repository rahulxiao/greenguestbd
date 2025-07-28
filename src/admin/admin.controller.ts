import { 
  Body, Controller, Delete, Param, Post, Query, Get, Put, ParseIntPipe,Req,HttpStatus,HttpCode} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  CreateAdminDto,
  UpdateAdminDto,
  LoginAdminDto,
  AdminResponseDto,
  AdminProfileDto
} from './admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Post('createAdmin')
  @HttpCode(HttpStatus.CREATED)
  async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
    return await this.adminService.createAdmin(createAdminDto);
  }

  @Get('getAllAdmins')
  async getAllAdmins(): Promise<AdminResponseDto[]> {
    return await this.adminService.getAllAdmins();
  }

  @Get('getAdminById/:id')
  async getAdminById(@Param('id', ParseIntPipe) id: number): Promise<AdminResponseDto> {
    return await this.adminService.getAdminById(id);
  }

  @Get('getAdminProfile/:id')
  async getAdminProfile(@Param('id', ParseIntPipe) id: number): Promise<AdminProfileDto> {
    return await this.adminService.getAdminProfile(id);
  }

  @Put('updateAdmin/:id')
  async updateAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto
  ): Promise<AdminResponseDto> {
    return await this.adminService.updateAdmin(id, updateAdminDto);
  }

  @Put('toggleAdminStatus/:id')
  async toggleAdminStatus(@Param('id', ParseIntPipe) id: number): Promise<AdminResponseDto> {
    return await this.adminService.toggleAdminStatus(id);
  }

  @Post('loginAdmin')
  @HttpCode(HttpStatus.OK)
  async loginAdmin(
    @Body() loginAdminDto: LoginAdminDto,
    @Req() req: any
  ): Promise<{ admin: AdminResponseDto; message: string }> {
    const admin = await this.adminService.findAdminByEmail(loginAdminDto.email);

    if (!admin) {
      throw new Error('Invalid credentials');
    }

    // Update last login info
    await this.adminService.updateAdminLastLogin(admin.id, req.ip || 'unknown');

    return {
      admin: this.adminService['mapToResponseDto'](admin),
      message: 'Login successful'
    };
  }

  @Delete('deleteAdminById/:id')
  @HttpCode(HttpStatus.OK)
  async deleteAdminById(@Param('id', ParseIntPipe) id: number): Promise<{ success: boolean; message: string }> {
    const success = await this.adminService.deleteAdmin(id);
    return {
      success,
      message: success ? 'Admin deleted successfully' : 'Failed to delete admin'
    };
  }

  @Get('getAdminByEmail')
  async getAdminByEmail(@Query('email') email: string): Promise<AdminResponseDto | null> {
    const admin = await this.adminService.findAdminByEmail(email);
    return admin ? this.adminService['mapToResponseDto'](admin) : null;
  }

  @Get('getAdminByName')
  async getAdminByName(@Query('name') name: string): Promise<AdminResponseDto[]> {
    return await this.adminService.getAdminsByName(name);
  }

  @Get('getActiveAdmins')
  async getActiveAdmins(): Promise<AdminResponseDto[]> {
    return await this.adminService.getActiveAdmins();
  }

  @Get('getInactiveAdmins')
  async getInactiveAdmins(): Promise<AdminResponseDto[]> {
    return await this.adminService.getInactiveAdmins();
  }
}
