import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { SearchQueryDto, SearchResponseDto, AutocompleteQueryDto, AutocompleteResponseDto } from './search.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async searchProducts(searchQuery: SearchQueryDto): Promise<SearchResponseDto> {
    const cacheKey = `search_${JSON.stringify(searchQuery)}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached as SearchResponseDto;
    }

    const page = searchQuery.page || 1;
    const limit = searchQuery.limit || 20;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepo.createQueryBuilder('product');

    // Full-text search using PostgreSQL full-text search
    if (searchQuery.q) {
      queryBuilder.andWhere(
        `to_tsvector('english', product.name || ' ' || COALESCE(product.description, '') || ' ' || COALESCE(product.tags, '')) @@ plainto_tsquery('english', :query)`,
        { query: searchQuery.q }
      );
    }

    // Apply filters
    if (searchQuery.category) {
      queryBuilder.andWhere('product.category = :category', { category: searchQuery.category });
    }

    if (searchQuery.minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice: searchQuery.minPrice });
    }

    if (searchQuery.maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice: searchQuery.maxPrice });
    }

    if (searchQuery.minRating !== undefined) {
      queryBuilder.andWhere('product.rating >= :minRating', { minRating: searchQuery.minRating });
    }

    if (searchQuery.available !== undefined) {
      queryBuilder.andWhere('product.available = :available', { available: searchQuery.available });
    }

    if (searchQuery.brand) {
      queryBuilder.andWhere('product.brand = :brand', { brand: searchQuery.brand });
    }

    if (searchQuery.tags && searchQuery.tags.length > 0) {
      const tagConditions = searchQuery.tags.map((tag, index) => 
        `product.tags LIKE :tag${index}`
      ).join(' OR ');
      queryBuilder.andWhere(`(${tagConditions})`);
      
      searchQuery.tags.forEach((tag, index) => {
        queryBuilder.setParameter(`tag${index}`, `%${tag}%`);
      });
    }

    // Apply sorting
    const sortBy = searchQuery.sortBy || 'name';
    const sortOrder = searchQuery.sortOrder || 'ASC';
    queryBuilder.orderBy(`product.${sortBy}`, sortOrder);

    // Get total count for pagination
    const total = await queryBuilder.getCount();

    // Get paginated results
    const products = await queryBuilder
      .skip(skip)
      .take(limit)
      .getMany();

    // Get facets for filtering
    const facets = await this.getFacets(searchQuery);

    const result: SearchResponseDto = {
      products: products.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        imageUrl: product.imageUrl,
        stock: product.stock,
        available: product.available,
        brand: product.brand,
        rating: product.rating,
        reviewCount: product.reviewCount,
        tags: product.tags,
        createdAt: product.createdAt,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      facets,
    };

    // Cache for 5 minutes
    await this.cacheManager.set(cacheKey, result, 300000);

    return result;
  }

  async autocomplete(query: AutocompleteQueryDto): Promise<AutocompleteResponseDto> {
    const cacheKey = `autocomplete_${query.q}_${query.limit || 5}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached as AutocompleteResponseDto;
    }

    const limit = query.limit || 5;
    const suggestions: AutocompleteResponseDto['suggestions'] = [];

    // Search in product names
    const productSuggestions = await this.productRepo
      .createQueryBuilder('product')
      .select(['product.name', 'product.id'])
      .where('product.name ILIKE :query', { query: `%${query.q}%` })
      .limit(limit)
      .getMany();

    suggestions.push(...productSuggestions.map(p => ({
      text: p.name,
      type: 'product' as const,
      id: p.id,
    })));

    // Search in categories
    const categorySuggestions = await this.productRepo
      .createQueryBuilder('product')
      .select('DISTINCT product.category', 'category')
      .where('product.category ILIKE :query', { query: `%${query.q}%` })
      .limit(limit)
      .getRawMany();

    suggestions.push(...categorySuggestions.map(c => ({
      text: c.category,
      type: 'category' as const,
    })));

    // Search in brands
    const brandSuggestions = await this.productRepo
      .createQueryBuilder('product')
      .select('DISTINCT product.brand', 'brand')
      .where('product.brand ILIKE :query', { query: `%${query.q}%` })
      .andWhere('product.brand IS NOT NULL')
      .limit(limit)
      .getRawMany();

    suggestions.push(...brandSuggestions.map(b => ({
      text: b.brand,
      type: 'brand' as const,
    })));

    // Remove duplicates and limit results
    const uniqueSuggestions = suggestions
      .filter((suggestion, index, self) => 
        index === self.findIndex(s => s.text === suggestion.text)
      )
      .slice(0, limit);

    const result: AutocompleteResponseDto = {
      suggestions: uniqueSuggestions,
    };

    // Cache for 2 minutes
    await this.cacheManager.set(cacheKey, result, 120000);

    return result;
  }

  private async getFacets(searchQuery: SearchQueryDto) {
    const baseQuery = this.productRepo.createQueryBuilder('product');

    // Apply the same filters as the main search, but exclude the facet being calculated
    if (searchQuery.q) {
      baseQuery.andWhere(
        `to_tsvector('english', product.name || ' ' || COALESCE(product.description, '') || ' ' || COALESCE(product.tags, '')) @@ plainto_tsquery('english', :query)`,
        { query: searchQuery.q }
      );
    }

    if (searchQuery.minPrice !== undefined) {
      baseQuery.andWhere('product.price >= :minPrice', { minPrice: searchQuery.minPrice });
    }

    if (searchQuery.maxPrice !== undefined) {
      baseQuery.andWhere('product.price <= :maxPrice', { maxPrice: searchQuery.maxPrice });
    }

    if (searchQuery.minRating !== undefined) {
      baseQuery.andWhere('product.rating >= :minRating', { minRating: searchQuery.minRating });
    }

    if (searchQuery.available !== undefined) {
      baseQuery.andWhere('product.available = :available', { available: searchQuery.available });
    }

    if (searchQuery.tags && searchQuery.tags.length > 0) {
      const tagConditions = searchQuery.tags.map((tag, index) => 
        `product.tags LIKE :tag${index}`
      ).join(' OR ');
      baseQuery.andWhere(`(${tagConditions})`);
      
      searchQuery.tags.forEach((tag, index) => {
        baseQuery.setParameter(`tag${index}`, `%${tag}%`);
      });
    }

    // Categories facet
    const categories = await baseQuery
      .clone()
      .select(['product.category as name', 'COUNT(*) as count'])
      .groupBy('product.category')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Brands facet
    const brands = await baseQuery
      .clone()
      .select(['product.brand as name', 'COUNT(*) as count'])
      .where('product.brand IS NOT NULL')
      .groupBy('product.brand')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    // Price ranges facet
    const priceRanges = await this.getPriceRanges(baseQuery.clone());

    // Ratings facet
    const ratings = await baseQuery
      .clone()
      .select([
        'FLOOR(product.rating) as rating',
        'COUNT(*) as count'
      ])
      .groupBy('FLOOR(product.rating)')
      .orderBy('rating', 'DESC')
      .getRawMany();

    return {
      categories: categories.map(c => ({ name: c.name, count: parseInt(c.count) })),
      brands: brands.map(b => ({ name: b.name, count: parseInt(b.count) })),
      priceRanges,
      ratings: ratings.map(r => ({ rating: parseInt(r.rating), count: parseInt(r.count) })),
    };
  }

  private async getPriceRanges(baseQuery: any) {
    const priceStats = await baseQuery
      .select([
        'MIN(product.price) as minPrice',
        'MAX(product.price) as maxPrice'
      ])
      .getRawOne();

    const minPrice = parseFloat(priceStats.minPrice) || 0;
    const maxPrice = parseFloat(priceStats.maxPrice) || 1000;
    const rangeSize = (maxPrice - minPrice) / 5;

    const ranges: { range: string; count: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const rangeStart = minPrice + (i * rangeSize);
      const rangeEnd = minPrice + ((i + 1) * rangeSize);
      
      const count = await baseQuery
        .clone()
        .where('product.price >= :start', { start: rangeStart })
        .andWhere('product.price < :end', { end: rangeEnd })
        .getCount();

      ranges.push({
        range: `$${rangeStart.toFixed(0)} - $${rangeEnd.toFixed(0)}`,
        count,
      });
    }

    return ranges;
  }

  async getPopularSearches(): Promise<string[]> {
    // This would typically come from analytics data
    // For now, return some sample popular searches
    return [
      'bonsai tree',
      'japanese maple',
      'bonsai tools',
      'bonsai pot',
      'bonsai soil',
    ];
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    const cacheKey = `suggestions_${query}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached as string[];
    }

    // Get similar product names
    const suggestions = await this.productRepo
      .createQueryBuilder('product')
      .select('product.name')
      .where('product.name ILIKE :query', { query: `%${query}%` })
      .limit(5)
      .getMany();

    const result = suggestions.map(s => s.name);

    // Cache for 10 minutes
    await this.cacheManager.set(cacheKey, result, 600000);

    return result;
  }
} 