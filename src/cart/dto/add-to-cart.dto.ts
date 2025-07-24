import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 'productId123' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;
} 