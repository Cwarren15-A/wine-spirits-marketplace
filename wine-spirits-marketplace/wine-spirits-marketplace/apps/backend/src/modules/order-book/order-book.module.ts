import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderBookService } from './order-book.service';
import { OrderBookController } from './order-book.controller';
import { OrderBookGateway } from './order-book.gateway';
import { OrderBookEntry } from '../../entities/order-book-entry.entity';
import { Product } from '../../entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderBookEntry, Product])],
  controllers: [OrderBookController],
  providers: [OrderBookService, OrderBookGateway],
  exports: [OrderBookService, OrderBookGateway],
})
export class OrderBookModule {} 