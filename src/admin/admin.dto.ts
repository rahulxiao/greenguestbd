import {
    IsEmail,
    IsString,
    IsOptional,
    IsBoolean,
    MinLength,
    MaxLength,
    Matches,
    IsNotEmpty
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateAdminDto {
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
    @Matches(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' })
    name: string;

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
    @Matches(/^\+?[1-9][\d\s()-]{0,15}$/, {
        message: 'Please provide a valid phone number (e.g., +1234567890)',
    })
    phoneNumber?: string;


    @IsOptional()
    @IsString({ message: 'Role must be a string' })
    @MaxLength(20, { message: 'Role cannot exceed 20 characters' })
    @Matches(/^[a-zA-Z_]+$/, { message: 'Role can only contain letters and underscores' })
    role?: string;

    @IsOptional()
    @IsBoolean({ message: 'isActive must be a boolean value' })
    @Transform(({ value }) => value === 'true' || value === true)
    isActive?: boolean;

    @IsOptional()
    @IsString({ message: 'Position must be a string' })
    @MaxLength(100, { message: 'Position cannot exceed 100 characters' })
    @Matches(/^[a-zA-Z\s\-_]+$/, { message: 'Position can only contain letters, spaces, hyphens, and underscores' })
    position?: string;

    @IsOptional()
    @IsString({ message: 'Bio must be a string' })
    @MaxLength(500, { message: 'Bio cannot exceed 500 characters' })
    bio?: string;

    @IsOptional()
    @IsString({ message: 'Timezone must be a string' })
    @MaxLength(50, { message: 'Timezone cannot exceed 50 characters' })
    @Matches(/^[a-zA-Z/_-]+$/, {
        message: 'Please provide a valid timezone format (e.g., America/New_York)',
    })
    timezone?: string;

}

export class UpdateAdminDto {
    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    @MinLength(2, { message: 'Name must be at least 2 characters long' })
    @MaxLength(50, { message: 'Name cannot exceed 50 characters' })
    @Matches(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' })
    name?: string;

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
    @Matches(/^\+?[1-9][\d\s()-]{0,15}$/, {
        message: 'Please provide a valid phone number',
    })
    phoneNumber?: string;


    @IsOptional()
    @IsString({ message: 'Role must be a string' })
    @MaxLength(20, { message: 'Role cannot exceed 20 characters' })
    @Matches(/^[a-zA-Z_]+$/, { message: 'Role can only contain letters and underscores' })
    role?: string;

    @IsOptional()
    @IsBoolean({ message: 'isActive must be a boolean value' })
    @Transform(({ value }) => value === 'true' || value === true)
    isActive?: boolean;

    @IsOptional()
    @IsString({ message: 'Position must be a string' })
    @MaxLength(100, { message: 'Position cannot exceed 100 characters' })
    @Matches(/^[a-zA-Z\s\-_]+$/, { message: 'Position can only contain letters, spaces, hyphens, and underscores' })
    position?: string;

    @IsOptional()
    @IsString({ message: 'Bio must be a string' })
    @MaxLength(500, { message: 'Bio cannot exceed 500 characters' })
    bio?: string;

    @IsOptional()
    @IsString({ message: 'Timezone must be a string' })
    @MaxLength(50, { message: 'Timezone cannot exceed 50 characters' })
    @Matches(/^[A-Za-z_/-]+$/, {
        message: 'Please provide a valid timezone format (e.g., America/New_York)',
    })
    timezone?: string;


}

export class LoginAdminDto {
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

export class AdminResponseDto {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    role: string;
    isActive: boolean;
    lastLoginAt?: Date;
    lastLoginIp?: string;
    position?: string;
    bio?: string;
    timezone?: string;
    createdAt: Date;
    updatedAt: Date;
}

export class AdminProfileDto {
    id: number;
    name: string;
    email: string;
    phoneNumber?: string;
    role: string;
    position?: string;
    bio?: string;
    timezone?: string;
    createdAt: Date;
}
