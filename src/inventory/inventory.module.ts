import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { 
  Supplier, 
  InventoryHistory, 
  LowStockAlert, 
  PurchaseOrder, 
  PurchaseOrderItem 
} from './inventory.entity';
import { Product } from '../product/product.entity';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Supplier, 
      InventoryHistory, 
      LowStockAlert, 
      PurchaseOrder, 
      PurchaseOrderItem,
      Product
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [InventoryService],
})
export class InventoryModule {} 
 