import apiService from './api';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  stock: number;
  available: boolean;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: string;
  specifications?: string;
  rating: number;
  reviewCount: number;
  tags?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSearchParams {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'relevance' | 'price-low' | 'price-high' | 'rating' | 'newest';
}

export interface CreateProductData {
  name: string;
  category: string;
  price: number;
  description?: string;
  imageUrl?: string;
  stock: number;
  brand?: string;
  sku?: string;
  weight?: number;
  dimensions?: string;
  specifications?: string;
  tags?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  available?: boolean;
}

class ProductService {
  async getAllProducts(): Promise<Product[]> {
    try {
      return await apiService.get<Product[]>('/products/getAllProducts');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch products');
    }
  }

  async getProductsPaginated(params: {
    page: number;
    limit: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    rating?: number;
    sortBy?: string;
  }): Promise<{
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', params.page.toString());
      queryParams.append('limit', params.limit.toString());
      
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.rating) queryParams.append('rating', params.rating.toString());
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);

      const endpoint = `/products/getProductsPaginated?${queryParams.toString()}`;
      return await apiService.get(endpoint);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch paginated products');
    }
  }

  async getProductById(id: number): Promise<Product> {
    try {
      return await apiService.get<Product>(`/products/getProductById/${id}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch product');
    }
  }

  async getProductDetail(id: number): Promise<Product> {
    try {
      return await apiService.get<Product>(`/products/getProductDetail/${id}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch product details');
    }
  }

  async searchProducts(params: ProductSearchParams): Promise<Product[]> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.category) queryParams.append('category', params.category);
      if (params.brand) queryParams.append('brand', params.brand);
      if (params.minPrice) queryParams.append('minPrice', params.minPrice.toString());
      if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
      if (params.rating) queryParams.append('rating', params.rating.toString());
      if (params.inStock !== undefined) queryParams.append('inStock', params.inStock.toString());
      if (params.search) queryParams.append('name', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);

      const endpoint = `/products/search?${queryParams.toString()}`;
      return await apiService.get<Product[]>(endpoint);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to search products');
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      return await apiService.get<Product[]>(`/products/getProductsByCategory?category=${category}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch products by category');
    }
  }

  async getProductsByName(name: string): Promise<Product[]> {
    try {
      return await apiService.get<Product[]>(`/products/getProductsByName?name=${name}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch products by name');
    }
  }

  async getAvailableProducts(): Promise<Product[]> {
    try {
      return await apiService.get<Product[]>('/products/getAvailableProducts');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch available products');
    }
  }

  async getProductsInStock(): Promise<Product[]> {
    try {
      return await apiService.get<Product[]>('/products/getProductsInStock');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch products in stock');
    }
  }

  async getCategories(): Promise<string[]> {
    try {
      return await apiService.get<string[]>('/products/getCategories');
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch categories');
    }
  }

  async createProduct(productData: CreateProductData): Promise<Product> {
    try {
      return await apiService.post<Product>('/products/createProduct', productData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to create product');
    }
  }

  async updateProduct(id: number, productData: UpdateProductData): Promise<Product> {
    try {
      return await apiService.put<Product>(`/products/updateProduct/${id}`, productData);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update product');
    }
  }

  async updateProductStock(id: number, stock: number): Promise<Product> {
    try {
      return await apiService.put<Product>(`/products/updateProductStock/${id}`, { stock });
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to update product stock');
    }
  }

  async toggleProductAvailability(id: number): Promise<Product> {
    try {
      return await apiService.put<Product>(`/products/toggleProductAvailability/${id}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to toggle product availability');
    }
  }

  async deleteProduct(id: number): Promise<{ success: boolean; message: string }> {
    try {
      return await apiService.delete<{ success: boolean; message: string }>(`/products/deleteProductById/${id}`);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to delete product');
    }
  }
}

export const productService = new ProductService();
export default productService;
