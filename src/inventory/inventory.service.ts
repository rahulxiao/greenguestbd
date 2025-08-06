import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { 
  Supplier, 
  InventoryHistory, 
  LowStockAlert, 
  PurchaseOrder, 
  PurchaseOrderItem 
} from './inventory.entity';
import { Product } from '../product/product.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Cron, CronExpression } from '@nestjs/schedule';

interface InventoryHistoryData {
  productId: number;
  type: 'in' | 'out' | 'adjustment' | 'return';
  quantity: number;
  reason?: string;
  reference?: string;
  supplierId?: number;
  cost?: number;
  notes?: string;
}

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Supplier)
    private readonly supplierRepo: Repository<Supplier>,
    @InjectRepository(InventoryHistory)
    private readonly inventoryHistoryRepo: Repository<InventoryHistory>,
    @InjectRepository(LowStockAlert)
    private readonly lowStockAlertRepo: Repository<LowStockAlert>,
    @InjectRepository(PurchaseOrder)
    private readonly purchaseOrderRepo: Repository<PurchaseOrder>,
    @InjectRepository(PurchaseOrderItem)
    private readonly purchaseOrderItemRepo: Repository<PurchaseOrderItem>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  // Supplier Management
  async createSupplier(supplierData: Partial<Supplier>): Promise<Supplier> {
    const supplier = this.supplierRepo.create(supplierData);
    return await this.supplierRepo.save(supplier);
  }

  async getSuppliers(): Promise<Supplier[]> {
    return await this.supplierRepo.find({ where: { isActive: true } });
  }

  async getSupplier(id: number): Promise<Supplier> {
    const supplier = await this.supplierRepo.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException('Supplier not found');
    }
    return supplier;
  }

  async updateSupplier(id: number, supplierData: Partial<Supplier>): Promise<Supplier> {
    await this.supplierRepo.update(id, supplierData);
    return await this.getSupplier(id);
  }

  // Inventory History
  async addInventoryHistory(data: InventoryHistoryData): Promise<InventoryHistory> {
    const history = this.inventoryHistoryRepo.create(data);

    const savedHistory = await this.inventoryHistoryRepo.save(history);

    // Update product stock
    await this.updateProductStock(data.productId, data.type, data.quantity);

    // Clear cache
    await this.cacheManager.del(`product_${data.productId}_history`);
    await this.cacheManager.del(`product_${data.productId}_stock`);

    return savedHistory;
  }

  async getInventoryHistory(productId: number, limit: number = 50): Promise<InventoryHistory[]> {
    const cacheKey = `product_${productId}_history_${limit}`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached as InventoryHistory[];
    }

    const history = await this.inventoryHistoryRepo.find({
      where: { productId },
      relations: ['supplier'],
      order: { createdAt: 'DESC' },
      take: limit,
    });

    await this.cacheManager.set(cacheKey, history, 300000); // 5 minutes
    return history;
  }

  // Stock Management
  private async updateProductStock(productId: number, type: string, quantity: number): Promise<void> {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let newStock = product.stock;
    switch (type) {
      case 'in':
      case 'return':
        newStock += quantity;
        break;
      case 'out':
        newStock -= quantity;
        break;
      case 'adjustment':
        newStock = quantity; // Direct adjustment
        break;
    }

    if (newStock < 0) {
      throw new BadRequestException('Stock cannot be negative');
    }

    await this.productRepo.update(productId, { stock: newStock });
  }

  async getCurrentStock(productId: number): Promise<number> {
    const cacheKey = `product_${productId}_stock`;
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached as number;
    }

    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    await this.cacheManager.set(cacheKey, product.stock, 300000); // 5 minutes
    return product.stock;
  }

  // Low Stock Alerts
  async checkLowStockAlerts(): Promise<void> {
    const products = await this.productRepo.find({
      where: { available: true },
    });

    for (const product of products) {
      const threshold = this.getStockThreshold(product);
      
      if (product.stock <= threshold) {
        await this.createLowStockAlert(product.id, threshold, product.stock);
      }
    }
  }

  private getStockThreshold(product: Product): number {
    // Simple threshold logic - can be enhanced with more sophisticated algorithms
    return Math.max(5, Math.floor(product.stock * 0.1)); // 10% of current stock or minimum 5
  }

  async createLowStockAlert(productId: number, threshold: number, currentStock: number): Promise<LowStockAlert> {
    // Check if alert already exists
    const existingAlert = await this.lowStockAlertRepo.findOne({
      where: { productId, isResolved: false },
    });

    if (existingAlert) {
      // Update existing alert
      existingAlert.currentStock = currentStock;
      return await this.lowStockAlertRepo.save(existingAlert);
    }

    const alert = this.lowStockAlertRepo.create({
      productId,
      threshold,
      currentStock,
    });

    return await this.lowStockAlertRepo.save(alert);
  }

  async getLowStockAlerts(resolved: boolean = false): Promise<LowStockAlert[]> {
    return await this.lowStockAlertRepo.find({
      where: { isResolved: resolved },
      relations: ['product'],
      order: { createdAt: 'DESC' },
    });
  }

  async resolveLowStockAlert(alertId: number, resolvedBy: number, notes?: string): Promise<LowStockAlert> {
    const alert = await this.lowStockAlertRepo.findOne({ where: { id: alertId } });
    if (!alert) {
      throw new NotFoundException('Low stock alert not found');
    }

    alert.isResolved = true;
    alert.resolvedAt = new Date();
    alert.resolvedBy = resolvedBy;
    if (notes) {
      alert.notes = notes;
    }

    return await this.lowStockAlertRepo.save(alert);
  }

  // Purchase Orders
  async createPurchaseOrder(
    supplierId: number,
    items: Array<{ productId: number; quantity: number; unitCost: number }>,
    notes?: string,
    expectedDeliveryDate?: Date,
  ): Promise<PurchaseOrder> {
    const purchaseOrder = this.purchaseOrderRepo.create({
      supplierId,
      status: 'draft',
      notes,
      expectedDeliveryDate,
    });

    const savedPO = await this.purchaseOrderRepo.save(purchaseOrder);

    // Create PO items
    for (const item of items) {
      const poItem = this.purchaseOrderItemRepo.create({
        purchaseOrderId: savedPO.id,
        productId: item.productId,
        quantity: item.quantity,
        unitCost: item.unitCost,
      });
      await this.purchaseOrderItemRepo.save(poItem);
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.unitCost), 0);
    await this.purchaseOrderRepo.update(savedPO.id, { totalAmount });

    return await this.getPurchaseOrder(savedPO.id);
  }

  async getPurchaseOrder(id: number): Promise<PurchaseOrder> {
    const po = await this.purchaseOrderRepo.findOne({
      where: { id },
      relations: ['supplier', 'items', 'items.product'],
    });
    if (!po) {
      throw new NotFoundException('Purchase order not found');
    }
    return po;
  }

  async getPurchaseOrders(status?: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled'): Promise<PurchaseOrder[]> {
    const where = status ? { status } : {};
    return await this.purchaseOrderRepo.find({
      where,
      relations: ['supplier'],
      order: { createdAt: 'DESC' },
    });
  }

  async updatePurchaseOrderStatus(id: number, status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled'): Promise<PurchaseOrder> {
    await this.purchaseOrderRepo.update(id, { status });
    return await this.getPurchaseOrder(id);
  }

  async receivePurchaseOrder(id: number): Promise<void> {
    const po = await this.getPurchaseOrder(id);
    if (po.status !== 'confirmed') {
      throw new BadRequestException('Purchase order must be confirmed before receiving');
    }

    const items = await this.purchaseOrderItemRepo.find({
      where: { purchaseOrderId: id },
      relations: ['product'],
    });

    for (const item of items) {
      if (item.receivedQuantity !== item.quantity) {
        // Add received quantity to inventory
        await this.addInventoryHistory({
          productId: item.productId,
          type: 'in',
          quantity: item.receivedQuantity || item.quantity,
          reason: 'Purchase order received',
          reference: `PO-${po.id}`,
          supplierId: po.supplierId,
          cost: item.unitCost,
        });

        // Update PO item
        await this.purchaseOrderItemRepo.update(item.id, {
          receivedQuantity: item.quantity,
          receivedAt: new Date(),
        });
      }
    }

    // Update PO status
    await this.purchaseOrderRepo.update(id, {
      status: 'received',
      actualDeliveryDate: new Date(),
    });
  }

  // Automated Reordering
  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async checkAutomatedReordering(): Promise<void> {
    const lowStockProducts = await this.productRepo
      .createQueryBuilder('product')
      .where('product.stock <= :threshold', { threshold: 10 })
      .andWhere('product.available = true')
      .getMany();

    for (const product of lowStockProducts) {
      await this.createAutomatedPurchaseOrder(product);
    }
  }

  private async createAutomatedPurchaseOrder(product: Product): Promise<void> {
    // Find preferred supplier for the product
    const suppliers = await this.getSuppliers();
    if (suppliers.length === 0) {
      return;
    }

    const preferredSupplier = suppliers[0]; // Simple logic - can be enhanced
    const reorderQuantity = Math.max(20, product.stock * 2); // Reorder 2x current stock or minimum 20

    await this.createPurchaseOrder(
      preferredSupplier.id,
      [{
        productId: product.id,
        quantity: reorderQuantity,
        unitCost: product.price * 0.6, // Assume 40% margin
      }],
      'Automated reorder - low stock',
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    );
  }

  // Analytics
  async getInventoryAnalytics(): Promise<any> {
    const cacheKey = 'inventory_analytics';
    const cached = await this.cacheManager.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const totalProducts = await this.productRepo.count();
    const lowStockProducts = await this.productRepo.count({
      where: { stock: { $lte: 10 } as any },
    });
    const outOfStockProducts = await this.productRepo.count({
      where: { stock: 0 },
    });

    const totalValue = await this.productRepo
      .createQueryBuilder('product')
      .select('SUM(product.stock * product.price)', 'total')
      .getRawOne();

    const result = {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalInventoryValue: parseFloat(totalValue.total) || 0,
      lowStockPercentage: totalProducts > 0 ? (lowStockProducts / totalProducts) * 100 : 0,
    };

    await this.cacheManager.set(cacheKey, result, 600000); // 10 minutes
    return result;
  }
} 