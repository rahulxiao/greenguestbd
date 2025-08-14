import apiService from './api';

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  title: string;
  isVerified: boolean;
  isModerated: boolean;
  helpfulVotes: number;
  totalVotes: number;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
  };
  product?: {
    id: number;
    name: string;
  };
}

export interface CreateReviewData {
  productId: number;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
}

export interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface ReviewVoteData {
  isHelpful: boolean;
}

class ReviewService {
  async getProductReviews(productId: number): Promise<Review[]> {
    try {
      return await apiService.get<Review[]>(`/reviews/getProductReviews/${productId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch product reviews');
    }
  }

  async getUserReviews(): Promise<Review[]> {
    try {
      return await apiService.get<Review[]>('/reviews/getUserReviews');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch user reviews');
    }
  }

  async createReview(reviewData: CreateReviewData): Promise<Review> {
    try {
      return await apiService.post<Review>('/reviews/createReview', reviewData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create review');
    }
  }

  async updateReview(reviewId: number, reviewData: UpdateReviewData): Promise<Review> {
    try {
      return await apiService.put<Review>(`/reviews/updateReview/${reviewId}`, reviewData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update review');
    }
  }

  async deleteReview(reviewId: number): Promise<{ success: boolean; message: string }> {
    try {
      return await apiService.delete<{ success: boolean; message: string }>(`/reviews/deleteReview/${reviewId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete review');
    }
  }

  async voteReview(reviewId: number, voteData: ReviewVoteData): Promise<Review> {
    try {
      return await apiService.post<Review>(`/reviews/voteReview/${reviewId}`, voteData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to vote on review');
    }
  }

  async getReviewById(reviewId: number): Promise<Review> {
    try {
      return await apiService.get<Review>(`/reviews/getReviewById/${reviewId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch review');
    }
  }

  async getProductRatingStats(productId: number): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: { [key: number]: number };
  }> {
    try {
      return await apiService.get<{
        averageRating: number;
        totalReviews: number;
        ratingDistribution: { [key: number]: number };
      }>(`/reviews/getProductRatingStats/${productId}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch product rating stats');
    }
  }
}

export const reviewService = new ReviewService();
export default reviewService;
