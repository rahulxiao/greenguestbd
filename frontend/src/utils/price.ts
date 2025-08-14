/**
 * Safely formats a price value to 2 decimal places
 * Handles cases where price might be a string or undefined
 */
export const formatPrice = (price: any): string => {
  if (typeof price === 'number') {
    return price.toFixed(2);
  }
  
  if (typeof price === 'string') {
    const parsed = parseFloat(price);
    if (!isNaN(parsed)) {
      return parsed.toFixed(2);
    }
  }
  
  return '0.00';
};

/**
 * Safely converts a price value to a number
 * Returns 0 if the price cannot be converted
 */
export const parsePrice = (price: any): number => {
  if (typeof price === 'number') {
    return price;
  }
  
  if (typeof price === 'string') {
    const parsed = parseFloat(price);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }
  
  return 0;
};

/**
 * Formats a price as currency with taka symbol
 */
export const formatCurrency = (price: any): string => {
  return `৳${formatPrice(price)}`;
};
