import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Get, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto, RegisterResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponseDto> {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return {
      success: true,
      message: 'Profile retrieved successfully',
      user: {
        id: req.user.id,
        name: req.user.fullName,
        email: req.user.email,
        phoneNumber: req.user.phoneNumber,
      },
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    const { token } = await this.authService.refreshToken(req.user.id);
    return {
      success: true,
      message: 'Token refreshed successfully',
      token,
    };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout() {
    // In a real application, you might want to blacklist the token
    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
} 