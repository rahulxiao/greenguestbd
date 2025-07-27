import { IsNumber, IsOptional, IsPositive, Min, Max } from 'class-validator';

export class AddToCartDto {
  @IsNumber({}, { message: 'Product ID must be a number' })
  @IsPositive({ message: 'Product ID must be positive' })
  productId: number;

  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsPositive({ message: 'Quantity must be positive' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(999, { message: 'Quantity cannot exceed 999' })
  quantity: number;
}

export class UpdateCartItemDto {
  @IsNumber({}, { message: 'Quantity must be a number' })
  @IsPositive({ message: 'Quantity must be positive' })
  @Min(1, { message: 'Quantity must be at least 1' })
  @Max(999, { message: 'Quantity cannot exceed 999' })
  quantity: number;
}

export class CartItemResponseDto {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  product?: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    available: boolean;
    stock: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class CartResponseDto {
  items: CartItemResponseDto[];
  totalItems: number;
  totalPrice: number;
} 