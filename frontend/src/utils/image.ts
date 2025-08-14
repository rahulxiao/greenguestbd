/**
 * Utility functions for handling product images
 */

// Default placeholder image for products without images
export const DEFAULT_PRODUCT_IMAGE = '/placeholder-product.jpg';

// Fallback image for when product image fails to load
export const FALLBACK_IMAGE = '/placeholder-product.jpg';

/**
 * Gets the product image URL with fallback
 */
export const getProductImage = (imageUrl?: string): string => {
  if (!imageUrl || imageUrl.trim() === '') {
    return DEFAULT_PRODUCT_IMAGE;
  }
  return imageUrl;
};

/**
 * Handles image load errors by setting fallback image
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>): void => {
  const target = event.target as HTMLImageElement;
  target.src = FALLBACK_IMAGE;
  target.onerror = null; // Prevent infinite loop
};

/**
 * Checks if an image URL is valid
 */
export const isValidImageUrl = (url?: string): boolean => {
  if (!url || url.trim() === '') return false;
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};
