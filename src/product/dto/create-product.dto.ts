export class CreateProductDto {
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  stock?: number;
  available?: boolean;
} 