import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getProfile() {
    // Return user profile
    return { message: 'User profile (stub)' };
  }

  updateProfile(dto: any) {
    // Update user profile
    return { message: 'Profile updated (stub)' };
  }
}
