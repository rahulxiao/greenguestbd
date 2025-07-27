import { 
  Body, 
  Controller, 
  Delete, 
  Param, 
  Post, 
  Query, 
  Get, 
  Put, 
  ParseIntPipe,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { OrderService } from './order.service';
import {
  PlaceOrderDto,
  UpdateOrderStatusDto,
  OrderResponseDto,
  OrderDetailDto
} from './order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) { }

  @Post('placeOrder')
  @HttpCode(HttpStatus.CREATED)
  async placeOrder(
    @Body() placeOrderDto: PlaceOrderDto,
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<OrderResponseDto> {
    return await this.orderService.placeOrder(userId, placeOrderDto);
  }

  @Get('getUserOrders')
  async getUserOrders(
    @Query('userId') userId: number = 1 // In real app, get from JWT token
  ): Promise<OrderResponseDto[]> {
    return await this.orderService.getUserOrders(userId);
  }

  @Get('getAllOrders')
  async getAllOrders(): Promise<OrderDetailDto[]> {
    return await this.orderService.getAllOrders();
  }

  @Get('getOrderById/:orderId')
  async getOrderById(
    @Param('orderId', ParseIntPipe) orderId: number
  ): Promise<OrderDetailDto> {
    return await this.orderService.getOrderById(orderId);
  }

  @Put('updateOrderStatus/:orderId')
  async updateOrderStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto
  ): Promise<OrderResponseDto> {
    return await this.orderService.updateOrderStatus(orderId, updateOrderStatusDto);
  }

  @Delete('deleteOrder/:orderId')
  @HttpCode(HttpStatus.OK)
  async deleteOrder(
    @Param('orderId', ParseIntPipe) orderId: number
  ): Promise<{ success: boolean; message: string }> {
    const success = await this.orderService.deleteOrder(orderId);
    return {
      success,
      message: success ? 'Order deleted successfully' : 'Failed to delete order'
    };
  }

  @Get('getOrdersByStatus')
  async getOrdersByStatus(@Query('status') status: string): Promise<OrderResponseDto[]> {
    return await this.orderService.getOrdersByStatus(status);
  }
} 