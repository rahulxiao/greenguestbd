import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { 
  CreateReviewDto, 
  UpdateReviewDto, 
  ReviewResponseDto, 
  ReviewVoteDto, 
  ReviewFilterDto,
  ProductRatingSummaryDto 
} from './review.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepo: Repository<Review>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async createReview(userId: number, productId: number, createReviewDto: CreateReviewDto): Promise<ReviewResponseDto> {
    // Check if user has already reviewed this product
    const existingReview = await this.reviewRepo.findOne({
      where: { userId, productId }
    });

    if (existingReview) {
      throw new ConflictException('You have already reviewed this product');
    }

    // Verify product exists
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Create review
    const review = this.reviewRepo.create({
      userId,
      productId,
      ...createReviewDto,
    });

    const savedReview = await this.reviewRepo.save(review);

    // Update product rating
    await this.updateProductRating(productId);

    // Clear cache
    await this.cacheManager.del(`product_${productId}_reviews`);
    await this.cacheManager.del(`product_${productId}_rating`);

    return this.mapToResponseDto(savedReview);
  }

  async updateReview(userId: number, reviewId: number, updateReviewDto: UpdateReviewDto): Promise<ReviewResponseDto> {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId, userId }
    });

    if (!review) {
      throw new NotFoundException('Review not found or you are not authorized to update it');
    }

    await this.reviewRepo.update(reviewId, updateReviewDto);
    const updatedReview = await this.reviewRepo.findOne({ where: { id: reviewId } });

    if (!updatedReview) {
      throw new NotFoundException('Review not found after update');
    }

    // Update product rating
    await this.updateProductRating(review.productId);

    // Clear cache
    await this.cacheManager.del(`product_${review.productId}_reviews`);
    await this.cacheManager.del(`product_${review.productId}_rating`);

    return this.mapToResponseDto(updatedReview);
  }

  async deleteReview(userId: number, reviewId: number): Promise<void> {
    const review = await this.reviewRepo.findOne({
      where: { id: reviewId, userId }
    });

    if (!review) {
      throw new NotFoundException('Review not found or you are not authorized to delete it');
    }

    await this.reviewRepo.delete(reviewId);

    // Update product rating
    await this.updateProductRating(review.productId);

    // Clear cache
    await this.cacheManager.del(`product_${review.productId}_reviews`);
    await this.cacheManager.del(`product_${review.productId}_rating`);
  }

  async getProductReviews(productId: number, filterDto: ReviewFilterDto = {}): Promise<{
    reviews: ReviewResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const cacheKey = `product_${productId}_reviews_${JSON.stringify(filterDto)}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached as any;
    }

    const page = filterDto.page || 1;
    const limit = filterDto.limit || 10;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reviewRepo
      .createQueryBuilder('review')
      .leftJoinAndSelect('review.user', 'user')
      .where('review.productId = :productId', { productId });

    // Apply filters
    if (filterDto.rating) {
      queryBuilder.andWhere('review.rating = :rating', { rating: filterDto.rating });
    }

    if (filterDto.isVerified !== undefined) {
      queryBuilder.andWhere('review.isVerified = :isVerified', { isVerified: filterDto.isVerified });
    }

    // Apply sorting
    const sortBy = filterDto.sortBy || 'createdAt';
    const sortOrder = filterDto.sortOrder || 'DESC';
    queryBuilder.orderBy(`review.${sortBy}`, sortOrder);

    const [reviews, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    const result = {
      reviews: reviews.map(review => this.mapToResponseDto(review)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300000);

    return result;
  }

  async getProductRatingSummary(productId: number): Promise<ProductRatingSummaryDto> {
    const cacheKey = `product_${productId}_rating`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached as ProductRatingSummaryDto;
    }

    const result = await this.reviewRepo
      .createQueryBuilder('review')
      .select([
        'AVG(review.rating) as averageRating',
        'COUNT(*) as totalReviews',
        'COUNT(CASE WHEN review.isVerified = true THEN 1 END) as verifiedReviews',
        'COUNT(CASE WHEN review.rating = 1 THEN 1 END) as rating1',
        'COUNT(CASE WHEN review.rating = 2 THEN 1 END) as rating2',
        'COUNT(CASE WHEN review.rating = 3 THEN 1 END) as rating3',
        'COUNT(CASE WHEN review.rating = 4 THEN 1 END) as rating4',
        'COUNT(CASE WHEN review.rating = 5 THEN 1 END) as rating5',
      ])
      .where('review.productId = :productId', { productId })
      .getRawOne();

    const summary: ProductRatingSummaryDto = {
      averageRating: parseFloat(result.averageRating) || 0,
      totalReviews: parseInt(result.totalReviews) || 0,
      verifiedReviews: parseInt(result.verifiedReviews) || 0,
      ratingDistribution: {
        '1': parseInt(result.rating1) || 0,
        '2': parseInt(result.rating2) || 0,
        '3': parseInt(result.rating3) || 0,
        '4': parseInt(result.rating4) || 0,
        '5': parseInt(result.rating5) || 0,
      },
    };

    // Cache for 10 minutes
    await this.cacheManager.set(cacheKey, summary, 600000);

    return summary;
  }

  async voteReview(reviewId: number, voteDto: ReviewVoteDto): Promise<void> {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (voteDto.isHelpful) {
      review.helpfulVotes += 1;
    }
    review.totalVotes += 1;

    await this.reviewRepo.save(review);
  }

  async moderateReview(reviewId: number, isModerated: boolean, notes?: string): Promise<ReviewResponseDto> {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.isModerated = isModerated;
    if (notes) {
      review.moderatorNotes = notes;
    }

    const updatedReview = await this.reviewRepo.save(review);
    return this.mapToResponseDto(updatedReview);
  }

  async verifyReview(reviewId: number, isVerified: boolean): Promise<ReviewResponseDto> {
    const review = await this.reviewRepo.findOne({ where: { id: reviewId } });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    review.isVerified = isVerified;
    const updatedReview = await this.reviewRepo.save(review);

    // Update product rating
    await this.updateProductRating(review.productId);

    // Clear cache
    await this.cacheManager.del(`product_${review.productId}_reviews`);
    await this.cacheManager.del(`product_${review.productId}_rating`);

    return this.mapToResponseDto(updatedReview);
  }

  private async updateProductRating(productId: number): Promise<void> {
    const ratingSummary = await this.getProductRatingSummary(productId);
    
    await this.productRepo.update(productId, {
      rating: ratingSummary.averageRating,
      reviewCount: ratingSummary.totalReviews,
    });
  }

  private mapToResponseDto(review: Review): ReviewResponseDto {
    return {
      id: review.id,
      userId: review.userId,
      productId: review.productId,
      rating: review.rating,
      comment: review.comment,
      title: review.title,
      isVerified: review.isVerified,
      isModerated: review.isModerated,
      helpfulVotes: review.helpfulVotes,
      totalVotes: review.totalVotes,
      helpfulPercentage: review.helpfulPercentage,
      images: review.images,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
      user: review.user ? {
        id: review.user.id,
        firstName: review.user.firstName,
        lastName: review.user.lastName,
        email: review.user.email,
      } : undefined,
    };
  }
} 