import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEvent, DailyMetrics, ProductAnalytics } from './analytics.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(UserEvent)
    private readonly userEventRepo: Repository<UserEvent>,
    @InjectRepository(DailyMetrics)
    private readonly dailyMetricsRepo: Repository<DailyMetrics>,
    @InjectRepository(ProductAnalytics)
    private readonly productAnalyticsRepo: Repository<ProductAnalytics>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async trackEvent(
    eventType: string,
    eventData: any = {},
    userId?: number,
    sessionId?: string,
    userAgent?: string,
    ipAddress?: string,
    referrer?: string,
  ): Promise<void> {
    const event = this.userEventRepo.create({
      eventType,
      eventData,
      userId,
      sessionId,
      userAgent,
      ipAddress,
      referrer,
    });

    await this.userEventRepo.save(event);
  }

  async getSalesAnalytics(startDate: Date, endDate: Date) {
    const cacheKey = `sales_analytics_${startDate.toISOString()}_${endDate.toISOString()}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const metrics = await this.dailyMetricsRepo
      .createQueryBuilder('metrics')
      .where('metrics.metricType = :type', { type: 'sales' })
      .andWhere('metrics.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('metrics.date', 'ASC')
      .getMany();

    const result = {
      totalSales: metrics.reduce((sum, m) => sum + parseFloat(m.value.toString()), 0),
      dailySales: metrics.map(m => ({
        date: m.date,
        sales: parseFloat(m.value.toString()),
      })),
      averageDailySales: metrics.length > 0 
        ? metrics.reduce((sum, m) => sum + parseFloat(m.value.toString()), 0) / metrics.length 
        : 0,
    };

    await this.cacheManager.set(cacheKey, result, 300000); // 5 minutes
    return result;
  }

  async getUserBehaviorAnalytics(startDate: Date, endDate: Date) {
    const cacheKey = `user_behavior_${startDate.toISOString()}_${endDate.toISOString()}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const events = await this.userEventRepo
      .createQueryBuilder('event')
      .select([
        'event.eventType',
        'COUNT(*) as count',
        'COUNT(DISTINCT event.userId) as uniqueUsers'
      ])
      .where('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .groupBy('event.eventType')
      .getRawMany();

    const result = {
      totalEvents: events.reduce((sum, e) => sum + parseInt(e.count), 0),
      uniqueUsers: events.reduce((sum, e) => sum + parseInt(e.uniqueUsers), 0),
      eventBreakdown: events.map(e => ({
        eventType: e.eventType,
        count: parseInt(e.count),
        uniqueUsers: parseInt(e.uniqueUsers),
      })),
    };

    await this.cacheManager.set(cacheKey, result, 300000);
    return result;
  }

  async getProductPerformanceAnalytics(productId: number, startDate: Date, endDate: Date) {
    const cacheKey = `product_performance_${productId}_${startDate.toISOString()}_${endDate.toISOString()}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const analytics = await this.productAnalyticsRepo
      .createQueryBuilder('analytics')
      .where('analytics.productId = :productId', { productId })
      .andWhere('analytics.date BETWEEN :startDate AND :endDate', { startDate, endDate })
      .orderBy('analytics.date', 'ASC')
      .getMany();

    const result = {
      totalViews: analytics.reduce((sum, a) => sum + a.views, 0),
      totalAddToCart: analytics.reduce((sum, a) => sum + a.addToCartCount, 0),
      totalPurchases: analytics.reduce((sum, a) => sum + a.purchases, 0),
      totalRevenue: analytics.reduce((sum, a) => sum + parseFloat(a.revenue.toString()), 0),
      conversionRate: analytics.reduce((sum, a) => sum + a.views, 0) > 0 
        ? (analytics.reduce((sum, a) => sum + a.purchases, 0) / analytics.reduce((sum, a) => sum + a.views, 0)) * 100 
        : 0,
      dailyMetrics: analytics.map(a => ({
        date: a.date,
        views: a.views,
        addToCart: a.addToCartCount,
        purchases: a.purchases,
        revenue: parseFloat(a.revenue.toString()),
      })),
    };

    await this.cacheManager.set(cacheKey, result, 300000);
    return result;
  }

  async getTopProducts(limit: number = 10, period: 'day' | 'week' | 'month' = 'month') {
    const cacheKey = `top_products_${limit}_${period}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const startDate = new Date();
    switch (period) {
      case 'day':
        startDate.setDate(startDate.getDate() - 1);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
    }

    const topProducts = await this.productAnalyticsRepo
      .createQueryBuilder('analytics')
      .select([
        'analytics.productId',
        'SUM(analytics.views) as totalViews',
        'SUM(analytics.addToCartCount) as totalAddToCart',
        'SUM(analytics.purchases) as totalPurchases',
        'SUM(analytics.revenue) as totalRevenue'
      ])
      .where('analytics.date >= :startDate', { startDate })
      .groupBy('analytics.productId')
      .orderBy('totalRevenue', 'DESC')
      .limit(limit)
      .getRawMany();

    const result = topProducts.map(p => ({
      productId: p.productId,
      totalViews: parseInt(p.totalViews),
      totalAddToCart: parseInt(p.totalAddToCart),
      totalPurchases: parseInt(p.totalPurchases),
      totalRevenue: parseFloat(p.totalRevenue),
      conversionRate: parseInt(p.totalViews) > 0 
        ? (parseInt(p.totalPurchases) / parseInt(p.totalViews)) * 100 
        : 0,
    }));

    await this.cacheManager.set(cacheKey, result, 600000); // 10 minutes
    return result;
  }

  async getSearchAnalytics(startDate: Date, endDate: Date) {
    const cacheKey = `search_analytics_${startDate.toISOString()}_${endDate.toISOString()}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const searchEvents = await this.userEventRepo
      .createQueryBuilder('event')
      .where('event.eventType = :type', { type: 'search' })
      .andWhere('event.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getMany();

    const searchTerms = searchEvents
      .map(e => e.eventData?.query || e.eventData?.q)
      .filter(Boolean);

    const termFrequency = searchTerms.reduce((acc, term) => {
      acc[term] = (acc[term] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const result = {
      totalSearches: searchEvents.length,
      uniqueSearches: new Set(searchTerms).size,
      topSearchTerms: Object.entries(termFrequency)
        .sort(([,a], [,b]) => (b as number) - (a as number))
        .slice(0, 10)
        .map(([term, count]) => ({ term, count })),
    };

    await this.cacheManager.set(cacheKey, result, 300000);
    return result;
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async generateDailyMetrics() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    // Calculate daily sales
    const salesEvents = await this.userEventRepo
      .createQueryBuilder('event')
      .where('event.eventType = :type', { type: 'purchase' })
      .andWhere('DATE(event.createdAt) = :date', { date: dateStr })
      .getMany();

    const totalSales = salesEvents.reduce((sum, event) => {
      return sum + (event.eventData?.totalAmount || 0);
    }, 0);

    await this.dailyMetricsRepo.save({
      date: yesterday,
      metricType: 'sales',
      value: totalSales,
      metadata: { orderCount: salesEvents.length },
    });

    // Calculate daily page views
    const pageViews = await this.userEventRepo
      .createQueryBuilder('event')
      .where('event.eventType = :type', { type: 'page_view' })
      .andWhere('DATE(event.createdAt) = :date', { date: dateStr })
      .getCount();

    await this.dailyMetricsRepo.save({
      date: yesterday,
      metricType: 'page_views',
      value: pageViews,
    });

    // Calculate daily unique users
    const uniqueUsers = await this.userEventRepo
      .createQueryBuilder('event')
      .select('COUNT(DISTINCT event.userId)', 'count')
      .where('DATE(event.createdAt) = :date', { date: dateStr })
      .andWhere('event.userId IS NOT NULL')
      .getRawOne();

    await this.dailyMetricsRepo.save({
      date: yesterday,
      metricType: 'unique_users',
      value: parseInt(uniqueUsers.count) || 0,
    });
  }

  async getSystemHealth() {
    const cacheKey = 'system_health';
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const recentEvents = await this.userEventRepo
      .createQueryBuilder('event')
      .where('event.createdAt >= :time', { time: oneHourAgo })
      .getCount();

    const result = {
      status: 'healthy',
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      recentActivity: recentEvents,
      lastChecked: now,
    };

    await this.cacheManager.set(cacheKey, result, 60000); // 1 minute
    return result;
  }
} 