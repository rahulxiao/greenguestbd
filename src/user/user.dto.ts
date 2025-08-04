import { IsEmail, IsString, IsOptional, MinLength, MaxLength, Matches, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(25, { message: 'First name cannot exceed 25 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'First name can only contain letters and spaces' })
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(25, { message: 'Last name cannot exceed 25 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Last name can only contain letters and spaces' })
  lastName: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(100, { message: 'Email cannot exceed 100 characters' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
    message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' 
  })
  password: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  @Matches(/^\+?[1-9][\d\s()-]{0,15}$/, { message: 'Please provide a valid phone number' })
  phoneNumber?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: 'First name must be at least 2 characters long' })
  @MaxLength(25, { message: 'First name cannot exceed 25 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'First name can only contain letters and spaces' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: 'Last name must be at least 2 characters long' })
  @MaxLength(25, { message: 'Last name cannot exceed 25 characters' })
  @Matches(/^[a-zA-Z\s]+$/, { message: 'Last name can only contain letters and spaces' })
  lastName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(100, { message: 'Email cannot exceed 100 characters' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
    message: 'Password must contain at least one lowercase letter, one uppercase letter, and one number' 
  })
  password?: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @MaxLength(20, { message: 'Phone number cannot exceed 20 characters' })
  @Matches(/^\+?[1-9][\d\s()-]{0,15}$/, { message: 'Please provide a valid phone number' })
  phoneNumber?: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @MaxLength(200, { message: 'Address cannot exceed 200 characters' })
  address?: string;

  @IsOptional()
  @IsString({ message: 'City must be a string' })
  @MaxLength(50, { message: 'City cannot exceed 50 characters' })
  city?: string;

  @IsOptional()
  @IsString({ message: 'State must be a string' })
  @MaxLength(50, { message: 'State cannot exceed 50 characters' })
  state?: string;

  @IsOptional()
  @IsString({ message: 'Country must be a string' })
  @MaxLength(50, { message: 'Country cannot exceed 50 characters' })
  country?: string;

  @IsOptional()
  @IsString({ message: 'Postal code must be a string' })
  @MaxLength(10, { message: 'Postal code cannot exceed 10 characters' })
  postalCode?: string;

  @IsOptional()
  @IsString({ message: 'Bio must be a string' })
  @MaxLength(500, { message: 'Bio cannot exceed 500 characters' })
  bio?: string;

  @IsOptional()
  @IsString({ message: 'Avatar must be a string' })
  @MaxLength(255, { message: 'Avatar URL cannot exceed 255 characters' })
  avatar?: string;
}

export class LoginUserDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  @MaxLength(100, { message: 'Email cannot exceed 100 characters' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @MaxLength(128, { message: 'Password cannot exceed 128 characters' })
  password: string;
}

export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserProfileDto {
  id: number;
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  bio?: string;
  avatar?: string;
  createdAt: Date;
}
