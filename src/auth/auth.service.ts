import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  register(dto: any) {
    // Registration logic here
    return { message: 'User registered (stub)' };
  }

  login(dto: any) {
    // Login logic here
    return { token: 'jwt-token-stub' };
  }
} 