import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReviewDto {
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  comment: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}

export class ReviewResponseDto {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  title?: string;
  isVerified: boolean;
  isModerated: boolean;
  helpfulVotes: number;
  totalVotes: number;
  helpfulPercentage: number;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export class ReviewVoteDto {
  @IsBoolean()
  isHelpful: boolean;
}

export class ReviewFilterDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  rating?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isVerified?: boolean;

  @IsOptional()
  @IsString()
  sortBy?: 'rating' | 'createdAt' | 'helpfulVotes';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}

export class ProductRatingSummaryDto {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  verifiedReviews: number;
} 