import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto, ProductResponseDto, ProductDetailDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async createProduct(createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    // Check if product with same SKU already exists (if SKU is provided)
    if (createProductDto.sku) {
      const existingProduct = await this.productRepo.findOne({ where: { sku: createProductDto.sku } });
      if (existingProduct) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    const newProduct = this.productRepo.create(createProductDto);
    const savedProduct = await this.productRepo.save(newProduct);
    return this.mapToResponseDto(savedProduct);
  }

  async getAllProducts(): Promise<ProductResponseDto[]> {
    const products = await this.productRepo.find();
    return products.map(product => this.mapToResponseDto(product));
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
    products: ProductResponseDto[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  }> {
    const { page, limit, category, search, minPrice, maxPrice, rating, sortBy } = params;
    
    // Build query builder
    let queryBuilder = this.productRepo.createQueryBuilder('product');
    
    // Apply filters
    if (category) {
      queryBuilder = queryBuilder.andWhere('product.category = :category', { category });
    }
    
    if (search) {
      queryBuilder = queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }
    
    if (minPrice !== undefined) {
      queryBuilder = queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    }
    
    if (maxPrice !== undefined) {
      queryBuilder = queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }
    
    if (rating !== undefined) {
      queryBuilder = queryBuilder.andWhere('product.rating >= :rating', { rating });
    }
    
    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 'price-low':
          queryBuilder = queryBuilder.orderBy('product.price', 'ASC');
          break;
        case 'price-high':
          queryBuilder = queryBuilder.orderBy('product.price', 'DESC');
          break;
        case 'rating':
          queryBuilder = queryBuilder.orderBy('product.rating', 'DESC');
          break;
        case 'newest':
          queryBuilder = queryBuilder.orderBy('product.createdAt', 'DESC');
          break;
        default:
          queryBuilder = queryBuilder.orderBy('product.id', 'ASC');
      }
    } else {
      queryBuilder = queryBuilder.orderBy('product.id', 'ASC');
    }
    
    // Get total count
    const total = await queryBuilder.getCount();
    
    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder = queryBuilder.skip(offset).take(limit);
    
    // Get products
    const products = await queryBuilder.getMany();
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;
    
    return {
      products: products.map(product => this.mapToResponseDto(product)),
      total,
      page,
      limit,
      totalPages,
      hasNext,
      hasPrev
    };
  }

  async getProductById(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.mapToResponseDto(product);
  }

  async getProductDetail(id: number): Promise<ProductDetailDto> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.mapToDetailDto(product);
  }

  async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<ProductResponseDto> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Check if SKU is being updated and conflicts with existing product
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingProduct = await this.productRepo.findOne({ where: { sku: updateProductDto.sku } });
      if (existingProduct) {
        throw new ConflictException('Product with this SKU already exists');
      }
    }

    await this.productRepo.update(id, updateProductDto);
    const updatedProduct = await this.productRepo.findOneBy({ id });
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found after update`);
    }
    return this.mapToResponseDto(updatedProduct);
  }

  async deleteProduct(id: number): Promise<boolean> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const result = await this.productRepo.delete(id);
    return !!result.affected && result.affected > 0;
  }

  async getProductsByCategory(category: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepo.find({
      where: { category: category }
    });
    return products.map(product => this.mapToResponseDto(product));
  }

  async getProductsByName(name: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepo.find({
      where: { name: name }
    });
    return products.map(product => this.mapToResponseDto(product));
  }

  async getAvailableProducts(): Promise<ProductResponseDto[]> {
    const products = await this.productRepo.find({
      where: { available: true }
    });
    return products.map(product => this.mapToResponseDto(product));
  }

  async getProductsByBrand(brand: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepo.find({
      where: { brand: brand }
    });
    return products.map(product => this.mapToResponseDto(product));
  }

  async getProductsInStock(): Promise<ProductResponseDto[]> {
    const products = await this.productRepo.find({
      where: { stock: 0 }
    });
    return products.map(product => this.mapToResponseDto(product));
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.productRepo
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .where('product.category IS NOT NULL')
      .andWhere('product.category != :empty', { empty: '' })
      .orderBy('product.category', 'ASC')
      .getRawMany();
    
    return categories.map(cat => cat.category);
  }

  async updateProductStock(id: number, newStock: number): Promise<ProductResponseDto> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    if (newStock < 0) {
      throw new Error('Stock cannot be negative');
    }

    await this.productRepo.update(id, { stock: newStock });
    const updatedProduct = await this.productRepo.findOneBy({ id });
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found after stock update`);
    }
    return this.mapToResponseDto(updatedProduct);
  }

  async toggleProductAvailability(id: number): Promise<ProductResponseDto> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.productRepo.update(id, { available: !product.available });
    const updatedProduct = await this.productRepo.findOneBy({ id });
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found after availability toggle`);
    }
    return this.mapToResponseDto(updatedProduct);
  }

  private mapToResponseDto(product: Product): ProductResponseDto {
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      stock: product.stock,
      available: product.available,
      brand: product.brand,
      sku: product.sku,
      weight: product.weight,
      dimensions: product.dimensions,
      specifications: product.specifications,
      rating: product.rating,
      reviewCount: product.reviewCount,
      tags: product.tags,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  private mapToDetailDto(product: Product): ProductDetailDto {
    return {
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      stock: product.stock,
      available: product.available,
      brand: product.brand,
      sku: product.sku,
      weight: product.weight,
      dimensions: product.dimensions,
      specifications: product.specifications,
      rating: product.rating,
      reviewCount: product.reviewCount,
      tags: product.tags,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }
} 