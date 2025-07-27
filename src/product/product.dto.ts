import { IsString, IsNumber, IsOptional, IsBoolean, IsNotEmpty, MinLength, MaxLength, Min, Max, IsUrl } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name: string;

  @IsString({ message: 'Category must be a string' })
  @IsNotEmpty({ message: 'Category is required' })
  @MinLength(2, { message: 'Category must be at least 2 characters long' })
  @MaxLength(50, { message: 'Category cannot exceed 50 characters' })
  category: string;

  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @Max(999999.99, { message: 'Price cannot exceed 999999.99' })
  price: number;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid image URL' })
  @MaxLength(255, { message: 'Image URL cannot exceed 255 characters' })
  imageUrl?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be greater than or equal to 0' })
  @Max(999999, { message: 'Stock cannot exceed 999999' })
  stock?: number;

  @IsOptional()
  @IsBoolean({ message: 'Available must be a boolean value' })
  @Transform(({ value }) => value === 'true' || value === true)
  available?: boolean;

  @IsOptional()
  @IsString({ message: 'Brand must be a string' })
  @MaxLength(50, { message: 'Brand cannot exceed 50 characters' })
  brand?: string;

  @IsOptional()
  @IsString({ message: 'SKU must be a string' })
  @MaxLength(50, { message: 'SKU cannot exceed 50 characters' })
  sku?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Weight must be a number' })
  @Min(0, { message: 'Weight must be greater than or equal to 0' })
  @Max(999999, { message: 'Weight cannot exceed 999999' })
  weight?: number;

  @IsOptional()
  @IsString({ message: 'Dimensions must be a string' })
  @MaxLength(100, { message: 'Dimensions cannot exceed 100 characters' })
  dimensions?: string;

  @IsOptional()
  @IsString({ message: 'Specifications must be a string' })
  @MaxLength(2000, { message: 'Specifications cannot exceed 2000 characters' })
  specifications?: string;

  @IsOptional()
  @IsString({ message: 'Tags must be a string' })
  @MaxLength(500, { message: 'Tags cannot exceed 500 characters' })
  tags?: string;
}

export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  @MaxLength(100, { message: 'Name cannot exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  @MinLength(2, { message: 'Category must be at least 2 characters long' })
  @MaxLength(50, { message: 'Category cannot exceed 50 characters' })
  category?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Price must be a number' })
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  @Max(999999.99, { message: 'Price cannot exceed 999999.99' })
  price?: number;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  @MaxLength(1000, { message: 'Description cannot exceed 1000 characters' })
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid image URL' })
  @MaxLength(255, { message: 'Image URL cannot exceed 255 characters' })
  imageUrl?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be greater than or equal to 0' })
  @Max(999999, { message: 'Stock cannot exceed 999999' })
  stock?: number;

  @IsOptional()
  @IsBoolean({ message: 'Available must be a boolean value' })
  @Transform(({ value }) => value === 'true' || value === true)
  available?: boolean;

  @IsOptional()
  @IsString({ message: 'Brand must be a string' })
  @MaxLength(50, { message: 'Brand cannot exceed 50 characters' })
  brand?: string;

  @IsOptional()
  @IsString({ message: 'SKU must be a string' })
  @MaxLength(50, { message: 'SKU cannot exceed 50 characters' })
  sku?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Weight must be a number' })
  @Min(0, { message: 'Weight must be greater than or equal to 0' })
  @Max(999999, { message: 'Weight cannot exceed 999999' })
  weight?: number;

  @IsOptional()
  @IsString({ message: 'Dimensions must be a string' })
  @MaxLength(100, { message: 'Dimensions cannot exceed 100 characters' })
  dimensions?: string;

  @IsOptional()
  @IsString({ message: 'Specifications must be a string' })
  @MaxLength(2000, { message: 'Specifications cannot exceed 2000 characters' })
  specifications?: string;

  @IsOptional()
  @IsString({ message: 'Tags must be a string' })
  @MaxLength(500, { message: 'Tags cannot exceed 500 characters' })
  tags?: string;
}

export class ProductResponseDto {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  stock: number;
  available: boolean;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: string;
  specifications?: string;
  rating: number;
  reviewCount: number;
  tags?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductDetailDto {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  stock: number;
  available: boolean;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: string;
  specifications?: string;
  rating: number;
  reviewCount: number;
  tags?: string;
  createdAt: Date;
  updatedAt: Date;
}
