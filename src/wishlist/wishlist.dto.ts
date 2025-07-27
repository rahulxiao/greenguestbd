import { IsNumber, IsPositive } from 'class-validator';

export class AddToWishlistDto {
  @IsNumber({}, { message: 'Product ID must be a number' })
  @IsPositive({ message: 'Product ID must be positive' })
  productId: number;
}

export class WishlistItemResponseDto {
  id: number;
  userId: number;
  productId: number;
  product?: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
    available: boolean;
    stock: number;
    brand?: string;
    category: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export class WishlistResponseDto {
  items: WishlistItemResponseDto[];
  totalItems: number;
} 