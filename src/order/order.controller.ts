import { Controller, Post, Get, Put, Param, Body } from '@nestjs/common';
import { PlaceOrderDto } from './dto/place-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrderController {
  @Post()
  placeOrder(@Body() dto: PlaceOrderDto) {
    // Place order
    return { message: 'Order placed (stub)' };
  }

  @Get('my')
  viewMyOrders() {
    // View my orders
    return { orders: [] };
  }

  @Get()
  viewAllOrders() {
    // View all orders (Admin only)
    return { orders: [] };
  }

  @Put(':id/status')
  updateOrderStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    // Update order status (Admin only)
    return { message: 'Order status updated (stub)' };
  }
} 