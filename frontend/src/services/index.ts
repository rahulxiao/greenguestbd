export { authService } from './auth.service';
export { productService } from './product.service';
export { cartService } from './cart.service';
export { orderService } from './order.service';
export { wishlistService } from './wishlist.service';
export { reviewService } from './review.service';
export { userService } from './user.service';

// Export types
export type { Product, ProductSearchParams, CreateProductData, UpdateProductData } from './product.service';
export type { LoginData, RegisterData, AuthResponse, UserProfile } from './auth.service';
export type { UpdateProfileData, UserProfile as UserProfileData } from './user.service';

export type {
  CartItem,
  AddToCartData,
  UpdateCartItemData
} from './cart.service';

export type {
  Order,
  OrderItem,
  OrderDetail
} from './order.service';

export type {
  WishlistItem
} from './wishlist.service';

export type {
  Review,
  CreateReviewData,
  UpdateReviewData,
  ReviewVoteData
} from './review.service';
