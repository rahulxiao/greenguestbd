import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/user.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginResponseDto, RegisterResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResponseDto> {
    const { firstName, lastName, email, password, confirmPassword, phoneNumber } = registerDto;

    // Check if passwords match
    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = this.userRepository.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
    });

    const savedUser = await this.userRepository.save(user);

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: savedUser.id,
        name: savedUser.fullName,
        email: savedUser.email,
        phoneNumber: savedUser.phoneNumber,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { 
      sub: user.id, 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    
    const token = this.jwtService.sign(payload);

    return {
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    };
  }

  async validateUser(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }
    return user;
  }

  async refreshToken(userId: number): Promise<{ token: string }> {
    const user = await this.validateUser(userId);
    
    const payload = { 
      sub: user.id, 
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    
    const token = this.jwtService.sign(payload);
    
    return { token };
  }
} 