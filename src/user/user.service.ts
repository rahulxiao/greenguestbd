import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Profile } from './profile.entity';
import { CreateUserDto, UpdateUserDto, UpdateProfileDto, UserResponseDto, UserProfileDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    // Check if user with email already exists
    const existingUser = await this.userRepo.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = this.userRepo.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepo.save(newUser);
    return this.mapToResponseDto(savedUser);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find();
    return users.map(user => this.mapToResponseDto(user));
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return this.mapToResponseDto(user);
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOneBy({ email });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // If email is being updated, check for conflicts
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.userRepo.findOne({ where: { email: updateUserDto.email } });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepo.update(id, updateUserDto);
    const updatedUser = await this.userRepo.findOneBy({ id });
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found after update`);
    }
    return this.mapToResponseDto(updatedUser);
  }

  async updateUserProfile(id: number, updateProfileDto: UpdateProfileDto): Promise<UserProfileDto> {
    const user = await this.userRepo.findOne({ 
      where: { id }
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Get existing profile
    const existingProfile = await this.profileRepo.findOne({
      where: { user: { id: user.id } }
    });

    let updatedProfile: Profile;

    // Create profile if it doesn't exist
    if (!existingProfile) {
      const newProfile = this.profileRepo.create({
        ...updateProfileDto,
        user: user
      });
      updatedProfile = await this.profileRepo.save(newProfile);
    } else {
      // Update existing profile
      await this.profileRepo.update(existingProfile.id, updateProfileDto);
      const foundProfile = await this.profileRepo.findOne({
        where: { id: existingProfile.id }
      });
      if (!foundProfile) {
        throw new NotFoundException('Profile not found after update');
      }
      updatedProfile = foundProfile;
    }

    return this.mapToProfileDto(user, updatedProfile);
  }

  async getUserProfile(id: number): Promise<UserProfileDto> {
    const user = await this.userRepo.findOne({ 
      where: { id }
    });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Get profile separately to avoid relationship issues
    const profile = await this.profileRepo.findOne({
      where: { user: { id: user.id } }
    });

    return this.mapToProfileDto(user, profile || undefined);
  }

  async getUsersByName(name: string): Promise<UserResponseDto[]> {
    const users = await this.userRepo.find({
      where: [
        { firstName: name },
        { lastName: name }
      ]
    });
    return users.map(user => this.mapToResponseDto(user));
  }

  async deleteUser(id: number): Promise<boolean> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const result = await this.userRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }

  private mapToResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private mapToProfileDto(user: User, profile?: Profile): UserProfileDto {
    return {
      id: user.id,
      name: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: profile?.address,
      city: profile?.city,
      state: profile?.state,
      country: profile?.country,
      postalCode: profile?.postalCode,
      bio: profile?.bio,
      avatar: profile?.avatar,
      createdAt: user.createdAt,
    };
  }
}
