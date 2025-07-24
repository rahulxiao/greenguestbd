import { Controller, Post, Body } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  @Post('register')
  register(@Body() dto: RegisterDto) {
    // Registration logic here
    return { message: 'User registered (stub)' };
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    // Login logic here
    return { token: 'jwt-token-stub' };
  }
} 