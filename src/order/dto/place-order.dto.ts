import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class PlaceOrderDto {
  @ApiProperty({
    example: [
      { productId: 'productId123', quantity: 2 },
      { productId: 'productId456', quantity: 1 },
    ],
    type: [Object],
  })
  @IsArray()
  items: { productId: string; quantity: number }[];

  @ApiProperty({ example: '123 Main St, City' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'credit_card' })
  @IsString()
  paymentMethod: string;
} 