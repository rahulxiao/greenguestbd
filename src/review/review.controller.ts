import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  HttpCode, 
  HttpStatus,
  ParseIntPipe 
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { 
  CreateReviewDto, 
  UpdateReviewDto, 
  ReviewVoteDto, 
  ReviewFilterDto,
  ReviewResponseDto,
  ProductRatingSummaryDto 
} from './review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../auth/decorators/user.decorator';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post('products/:productId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() createReviewDto: CreateReviewDto,
    @User('id') userId: number,
  ): Promise<ReviewResponseDto> {
    return await this.reviewService.createReview(userId, productId, createReviewDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @Param('id', ParseIntPipe) reviewId: number,
    @Body() updateReviewDto: UpdateReviewDto,
    @User('id') userId: number,
  ): Promise<ReviewResponseDto> {
    return await this.reviewService.updateReview(userId, reviewId, updateReviewDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteReview(
    @Param('id', ParseIntPipe) reviewId: number,
    @User('id') userId: number,
  ): Promise<void> {
    await this.reviewService.deleteReview(userId, reviewId);
  }

  @Get('products/:productId')
  async getProductReviews(
    @Param('productId', ParseIntPipe) productId: number,
    @Query() filterDto: ReviewFilterDto,
  ): Promise<{
    reviews: ReviewResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return await this.reviewService.getProductReviews(productId, filterDto);
  }

  @Get('products/:productId/rating')
  async getProductRatingSummary(
    @Param('productId', ParseIntPipe) productId: number,
  ): Promise<ProductRatingSummaryDto> {
    return await this.reviewService.getProductRatingSummary(productId);
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async voteReview(
    @Param('id', ParseIntPipe) reviewId: number,
    @Body() voteDto: ReviewVoteDto,
  ): Promise<void> {
    await this.reviewService.voteReview(reviewId, voteDto);
  }

  // Admin endpoints
  @Put(':id/moderate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async moderateReview(
    @Param('id', ParseIntPipe) reviewId: number,
    @Body() body: { isModerated: boolean; notes?: string },
  ): Promise<ReviewResponseDto> {
    return await this.reviewService.moderateReview(reviewId, body.isModerated, body.notes);
  }

  @Put(':id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async verifyReview(
    @Param('id', ParseIntPipe) reviewId: number,
    @Body() body: { isVerified: boolean },
  ): Promise<ReviewResponseDto> {
    return await this.reviewService.verifyReview(reviewId, body.isVerified);
  }

  @Get('pending-moderation')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async getPendingModerationReviews(
    @Query() filterDto: ReviewFilterDto,
  ): Promise<{
    reviews: ReviewResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // This would need to be implemented in the service
    // For now, return empty result
    return {
      reviews: [],
      total: 0,
      page: filterDto.page || 1,
      limit: filterDto.limit || 10,
      totalPages: 0,
    };
  }
} 