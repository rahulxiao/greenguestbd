import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchQueryDto, SearchResponseDto, AutocompleteQueryDto, AutocompleteResponseDto } from './search.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async searchProducts(@Query() searchQuery: SearchQueryDto): Promise<SearchResponseDto> {
    return await this.searchService.searchProducts(searchQuery);
  }

  @Get('autocomplete')
  @Throttle({ default: { ttl: 60000, limit: 30 } })
  @HttpCode(HttpStatus.OK)
  async autocomplete(@Query() query: AutocompleteQueryDto): Promise<AutocompleteResponseDto> {
    return await this.searchService.autocomplete(query);
  }

  @Get('suggestions')
  @Throttle({ default: { ttl: 60000, limit: 20 } })
  @HttpCode(HttpStatus.OK)
  async getSearchSuggestions(@Query('q') query: string): Promise<string[]> {
    return await this.searchService.getSearchSuggestions(query);
  }

  @Get('popular')
  @HttpCode(HttpStatus.OK)
  async getPopularSearches(): Promise<string[]> {
    return await this.searchService.getPopularSearches();
  }
} 