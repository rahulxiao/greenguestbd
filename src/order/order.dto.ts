import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsPositive, Min, Max, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNumber({}, { message: 'Product ID must be a number' })
  @IsPositive({ message: 'Product ID must be positive' })
  productId: number;

  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsPositive({ message: 'Quantity must be positive' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(999, { message: 'Quantity cannot exceed 999' })
  quantity: number;
}

export class PlaceOrderDto {
  @IsArray({ message: 'Items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsString({ message: 'Address must be a string' })
  @IsNotEmpty({ message: 'Address is required' })
  address: string;

  @IsString({ message: 'Payment method must be a string' })
  @IsNotEmpty({ message: 'Payment method is required' })
  paymentMethod: string;
}

export class UpdateOrderStatusDto {
  @IsString({ message: 'Status must be a string' })
  @IsNotEmpty({ message: 'Status is required' })
  status: string;
}

export class OrderItemResponseDto {
  id: number;
  productId: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export class OrderResponseDto {
  id: number;
  userId: number;
  items: OrderItemResponseDto[];
  address: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
}

export class OrderDetailDto {
  id: number;
  userId: number;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  items: OrderItemResponseDto[];
  address: string;
  paymentMethod: string;
  status: string;
  totalAmount: number;
  totalItems: number;
  createdAt: Date;
  updatedAt: Date;
} 