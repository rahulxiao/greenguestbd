import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddToWishlistDto {
  @ApiProperty({ example: 'productId123' })
  @IsString()
  productId: string;
} 