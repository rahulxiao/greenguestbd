import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  Query, 
  UseGuards, 
  HttpCode, 
  HttpStatus,
  ParseIntPipe 
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  // Supplier endpoints
  @Post('suppliers')
  @HttpCode(HttpStatus.CREATED)
  async createSupplier(@Body() supplierData: any) {
    return await this.inventoryService.createSupplier(supplierData);
  }

  @Get('suppliers')
  async getSuppliers() {
    return await this.inventoryService.getSuppliers();
  }

  @Get('suppliers/:id')
  async getSupplier(@Param('id', ParseIntPipe) id: number) {
    return await this.inventoryService.getSupplier(id);
  }

  @Put('suppliers/:id')
  async updateSupplier(
    @Param('id', ParseIntPipe) id: number,
    @Body() supplierData: any,
  ) {
    return await this.inventoryService.updateSupplier(id, supplierData);
  }

  // Inventory history endpoints
  @Post('history')
  @HttpCode(HttpStatus.CREATED)
  async addInventoryHistory(@Body() historyData: any) {
    const {
      productId,
      type,
      quantity,
      reason,
      reference,
      supplierId,
      cost,
      notes,
    } = historyData;

    return await this.inventoryService.addInventoryHistory(
      productId,
      type,
      quantity,
      reason,
      reference,
      supplierId,
      cost,
      notes,
    );
  }

  @Get('history/:productId')
  async getInventoryHistory(
    @Param('productId', ParseIntPipe) productId: number,
    @Query('limit') limit: number = 50,
  ) {
    return await this.inventoryService.getInventoryHistory(productId, limit);
  }

  @Get('stock/:productId')
  async getCurrentStock(@Param('productId', ParseIntPipe) productId: number) {
    return await this.inventoryService.getCurrentStock(productId);
  }

  // Low stock alerts
  @Get('alerts/low-stock')
  async getLowStockAlerts(@Query('resolved') resolved: boolean = false) {
    return await this.inventoryService.getLowStockAlerts(resolved);
  }

  @Put('alerts/low-stock/:id/resolve')
  async resolveLowStockAlert(
    @Param('id', ParseIntPipe) alertId: number,
    @Body() body: { resolvedBy: number; notes?: string },
  ) {
    return await this.inventoryService.resolveLowStockAlert(
      alertId,
      body.resolvedBy,
      body.notes,
    );
  }

  // Purchase orders
  @Post('purchase-orders')
  @HttpCode(HttpStatus.CREATED)
  async createPurchaseOrder(@Body() poData: any) {
    const { supplierId, items, notes, expectedDeliveryDate } = poData;
    return await this.inventoryService.createPurchaseOrder(
      supplierId,
      items,
      notes,
      expectedDeliveryDate ? new Date(expectedDeliveryDate) : undefined,
    );
  }

  @Get('purchase-orders')
  async getPurchaseOrders(@Query('status') status?: string) {
    return await this.inventoryService.getPurchaseOrders(status as any);
  }

  @Get('purchase-orders/:id')
  async getPurchaseOrder(@Param('id', ParseIntPipe) id: number) {
    return await this.inventoryService.getPurchaseOrder(id);
  }

  @Put('purchase-orders/:id/status')
  async updatePurchaseOrderStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { status: string },
  ) {
    return await this.inventoryService.updatePurchaseOrderStatus(id, body.status as any);
  }

  @Put('purchase-orders/:id/receive')
  @HttpCode(HttpStatus.OK)
  async receivePurchaseOrder(@Param('id', ParseIntPipe) id: number) {
    await this.inventoryService.receivePurchaseOrder(id);
    return { message: 'Purchase order received successfully' };
  }

  // Analytics
  @Get('analytics')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  async getInventoryAnalytics() {
    return await this.inventoryService.getInventoryAnalytics();
  }

  // Manual stock check
  @Post('check-low-stock')
  @HttpCode(HttpStatus.OK)
  async checkLowStockAlerts() {
    await this.inventoryService.checkLowStockAlerts();
    return { message: 'Low stock check completed' };
  }
} 