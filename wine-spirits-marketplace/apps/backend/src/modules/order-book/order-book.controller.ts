import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { OrderBookService } from './order-book.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '../../entities/order-book-entry.entity';

@Controller('order-book')
export class OrderBookController {
  constructor(private readonly orderBookService: OrderBookService) {}

  @Post('orders')
  placeOrder(@Body(ValidationPipe) createOrderDto: CreateOrderDto) {
    return this.orderBookService.placeOrder(createOrderDto);
  }

  @Get('products/:productId/depth')
  getMarketDepth(@Param('productId') productId: string) {
    return this.orderBookService.getOrderBook(productId);
  }

  @Get('products/:productId/history')
  getOrderHistory(
    @Param('productId') productId: string,
    @Query('limit') limit?: number,
  ) {
    return this.orderBookService.getOrderHistory(productId, limit);
  }

  @Get('users/:userId/orders')
  getUserOrders(
    @Param('userId') userId: string,
    @Query('status') status?: OrderStatus,
  ) {
    return this.orderBookService.getUserOrders(userId, status);
  }

  @Patch('orders/:orderId/cancel')
  cancelOrder(
    @Param('orderId') orderId: string,
    @Body('userId') userId: string,
  ) {
    return this.orderBookService.cancelOrder(orderId, userId);
  }
} 