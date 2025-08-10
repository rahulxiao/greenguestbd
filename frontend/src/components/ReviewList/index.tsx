import React, { useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, User, Calendar, CheckCircle } from 'lucide-react';

interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  isVerified: boolean;
  helpfulVotes: number;
  totalVotes: number;
  images?: string[];
}

interface ReviewListProps {
  reviews: Review[];
  onHelpfulVote?: (reviewId: number, isHelpful: boolean) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onHelpfulVote }) => {
  const [votedReviews, setVotedReviews] = useState<{ [key: number]: 'helpful' | 'not-helpful' | null }>({});

  const handleHelpfulVote = (reviewId: number, isHelpful: boolean) => {
    if (votedReviews[reviewId]) return; // Already voted
    
    setVotedReviews(prev => ({
      ...prev,
      [reviewId]: isHelpful ? 'helpful' : 'not-helpful'
    }));
    
    onHelpfulVote?.(reviewId, isHelpful);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getHelpfulPercentage = (helpfulVotes: number, totalVotes: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((helpfulVotes / totalVotes) * 100);
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">
          <Star className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-600">Be the first to review this product!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          {/* Review Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-900">{review.userName}</h4>
                  {review.isVerified && (
                    <div title="Verified Purchase">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(review.createdAt)}</span>
                </div>
              </div>
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-1">
              {renderStars(review.rating)}
              <span className="text-sm text-gray-600 ml-1">{review.rating}/5</span>
            </div>
          </div>

          {/* Review Title */}
          <h5 className="font-semibold text-gray-800 mb-2">{review.title}</h5>

          {/* Review Comment */}
          <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

          {/* Review Images */}
          {review.images && review.images.length > 0 && (
            <div className="mb-4">
              <div className="flex space-x-2 overflow-x-auto">
                {review.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Review ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200 flex-shrink-0"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Helpful Voting */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Was this review helpful?</span>
              <button
                onClick={() => handleHelpfulVote(review.id, true)}
                disabled={votedReviews[review.id] !== undefined}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
                  votedReviews[review.id] === 'helpful'
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{review.helpfulVotes + (votedReviews[review.id] === 'helpful' ? 1 : 0)}</span>
              </button>
              <button
                onClick={() => handleHelpfulVote(review.id, false)}
                disabled={votedReviews[review.id] !== undefined}
                className={`flex items-center space-x-1 px-2 py-1 rounded text-sm transition-colors ${
                  votedReviews[review.id] === 'not-helpful'
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <ThumbsDown className="h-4 w-4" />
                <span>{review.totalVotes - review.helpfulVotes + (votedReviews[review.id] === 'not-helpful' ? 1 : 0)}</span>
              </button>
            </div>
            
            {review.totalVotes > 0 && (
              <span className="text-xs text-gray-500">
                {getHelpfulPercentage(review.helpfulVotes, review.totalVotes)}% found this helpful
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewList; 