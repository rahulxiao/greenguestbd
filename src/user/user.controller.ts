import { Controller, Get, Put, Body } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('users')
export class UserController {
  @Get('profile')
  getProfile() {
    // Return user profile (JWT required)
    return { message: 'User profile (stub)' };
  }

  @Put('profile')
  updateProfile(@Body() dto: UpdateProfileDto) {
    // Update user profile (JWT required)
    return { message: 'Profile updated (stub)' };
  }
}
