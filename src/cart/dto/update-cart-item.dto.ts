import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateCartItemDto {
  @ApiProperty({ example: 2 })
  @IsNumber()
  quantity: number;
} 