import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, Matches } from 'class-validator';

export class RegisterDto {
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  lastName: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;

  @IsString({ message: 'Confirm password must be a string' })
  @IsNotEmpty({ message: 'Confirm password is required' })
  confirmPassword: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @Matches(/^[\+]?[1-9][\d]{0,15}$/, { 
    message: 'Please provide a valid phone number' 
  })
  phoneNumber?: string;
} 