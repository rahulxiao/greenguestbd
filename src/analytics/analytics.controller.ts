import { Controller, Get, Query, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('analytics')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('sales')
  @HttpCode(HttpStatus.OK)
  async getSalesAnalytics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.analyticsService.getSalesAnalytics(start, end);
  }

  @Get('user-behavior')
  @HttpCode(HttpStatus.OK)
  async getUserBehaviorAnalytics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.analyticsService.getUserBehaviorAnalytics(start, end);
  }

  @Get('product/:productId')
  @HttpCode(HttpStatus.OK)
  async getProductPerformanceAnalytics(
    @Query('productId') productId: number,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.analyticsService.getProductPerformanceAnalytics(productId, start, end);
  }

  @Get('top-products')
  @HttpCode(HttpStatus.OK)
  async getTopProducts(
    @Query('limit') limit: number = 10,
    @Query('period') period: 'day' | 'week' | 'month' = 'month',
  ) {
    return await this.analyticsService.getTopProducts(limit, period);
  }

  @Get('search')
  @HttpCode(HttpStatus.OK)
  async getSearchAnalytics(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return await this.analyticsService.getSearchAnalytics(start, end);
  }

  @Get('health')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  @HttpCode(HttpStatus.OK)
  async getSystemHealth() {
    return await this.analyticsService.getSystemHealth();
  }
} 