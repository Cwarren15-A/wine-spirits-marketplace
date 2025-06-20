import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { OrderBookEntry, OrderType, OrderStatus } from '../../entities/order-book-entry.entity';
import { Product, ProductStatus } from '../../entities/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';

export interface MarketDepth {
  bids: Array<{ price: number; quantity: number; orders: number }>;
  asks: Array<{ price: number; quantity: number; orders: number }>;
}

export interface OrderMatch {
  buyOrderId: string;
  sellOrderId: string;
  matchedQuantity: number;
  matchedPrice: number;
  timestamp: Date;
}

@Injectable()
export class OrderBookService {
  constructor(
    @InjectRepository(OrderBookEntry)
    private orderRepository: Repository<OrderBookEntry>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async placeOrder(createOrderDto: CreateOrderDto): Promise<OrderBookEntry> {
    // Validate product exists and is active
    const product = await this.productRepository.findOne({
      where: { id: createOrderDto.product_id, status: ProductStatus.ACTIVE },
    });

    if (!product) {
      throw new NotFoundException('Product not found or inactive');
    }

    // Validate order quantity and pricing
    this.validateOrder(createOrderDto, product);

    // Create the order
    const order = this.orderRepository.create({
      ...createOrderDto,
      remaining_quantity: createOrderDto.quantity,
      created_at: new Date(),
    });

    const savedOrder = await this.orderRepository.save(order);

    // Attempt to match the order immediately
    const matches = await this.matchOrder(savedOrder);

    // Broadcast order book updates
    await this.broadcastOrderBookUpdate(createOrderDto.product_id);

    // Broadcast any matches
    if (matches.length > 0) {
      // this.orderBookGateway.broadcastMatches(createOrderDto.product_id, matches);
    }

    return savedOrder;
  }

  async cancelOrder(orderId: string, userId: string): Promise<OrderBookEntry> {
    const order = await this.orderRepository.findOne({
      where: { id: orderId, user_id: userId, status: OrderStatus.ACTIVE },
    });

    if (!order) {
      throw new NotFoundException('Order not found or cannot be cancelled');
    }

    order.status = OrderStatus.CANCELLED;
    const savedOrder = await this.orderRepository.save(order);

    // Broadcast order book updates
    await this.broadcastOrderBookUpdate(order.product_id);

    return savedOrder;
  }

  async getOrderBook(productId: string): Promise<MarketDepth> {
    const [bids, asks] = await Promise.all([
      this.getAggregatedOrders(productId, OrderType.BID),
      this.getAggregatedOrders(productId, OrderType.ASK),
    ]);

    return { bids, asks };
  }

  async getUserOrders(userId: string, status?: OrderStatus): Promise<OrderBookEntry[]> {
    const whereCondition: any = { user_id: userId };
    if (status) {
      whereCondition.status = status;
    }

    return await this.orderRepository.find({
      where: whereCondition,
      relations: ['product'],
      order: { created_at: 'DESC' },
    });
  }

  async getOrderHistory(productId: string, limit: number = 50): Promise<OrderBookEntry[]> {
    return await this.orderRepository.find({
      where: {
        product_id: productId,
        status: OrderStatus.FILLED,
      },
      order: { filled_at: 'DESC' },
      take: limit,
      relations: ['product'],
    });
  }

  private async matchOrder(newOrder: OrderBookEntry): Promise<OrderMatch[]> {
    const matches: OrderMatch[] = [];
    let remainingQuantity = newOrder.remaining_quantity;

    // Find potential matches based on order type
    const potentialMatches = await this.findPotentialMatches(newOrder);

    for (const matchOrder of potentialMatches) {
      if (remainingQuantity <= 0) break;

      // Determine if orders can match
      if (!this.canOrdersMatch(newOrder, matchOrder)) continue;

      // Calculate match quantity and price
      const matchQuantity = Math.min(remainingQuantity, matchOrder.remaining_quantity);
      const matchPrice = this.determineMatchPrice(newOrder, matchOrder);

      // Execute the match
      await this.executeMath(newOrder, matchOrder, matchQuantity, matchPrice);

      // Record the match
      matches.push({
        buyOrderId: newOrder.order_type === OrderType.BID ? newOrder.id : matchOrder.id,
        sellOrderId: newOrder.order_type === OrderType.ASK ? newOrder.id : matchOrder.id,
        matchedQuantity: matchQuantity,
        matchedPrice: matchPrice,
        timestamp: new Date(),
      });

      remainingQuantity -= matchQuantity;
    }

    return matches;
  }

  private async findPotentialMatches(order: OrderBookEntry): Promise<OrderBookEntry[]> {
    const oppositeType = order.order_type === OrderType.BID ? OrderType.ASK : OrderType.BID;
    
    const query = this.orderRepository.createQueryBuilder('order')
      .where('order.product_id = :productId', { productId: order.product_id })
      .andWhere('order.order_type = :orderType', { orderType: oppositeType })
      .andWhere('order.status = :status', { status: OrderStatus.ACTIVE })
      .andWhere('order.remaining_quantity > 0')
      .andWhere('order.user_id != :userId', { userId: order.user_id }); // Can't match with own orders

    // Price filtering based on order type
    if (order.order_type === OrderType.BID) {
      // For bids, find asks at or below bid price
      query.andWhere('order.price <= :price', { price: order.price });
      query.orderBy('order.price', 'ASC'); // Best price first
    } else {
      // For asks, find bids at or above ask price
      query.andWhere('order.price >= :price', { price: order.price });
      query.orderBy('order.price', 'DESC'); // Best price first
    }

    // Secondary sort by time priority
    query.addOrderBy('order.created_at', 'ASC');

    return await query.getMany();
  }

  private canOrdersMatch(order1: OrderBookEntry, order2: OrderBookEntry): boolean {
    // Orders must be opposite types
    if (order1.order_type === order2.order_type) return false;

    // Both must be active
    if (order1.status !== OrderStatus.ACTIVE || order2.status !== OrderStatus.ACTIVE) return false;

    // Must have remaining quantity
    if (order1.remaining_quantity <= 0 || order2.remaining_quantity <= 0) return false;

    // Price compatibility check
    const bid = order1.order_type === OrderType.BID ? order1 : order2;
    const ask = order1.order_type === OrderType.ASK ? order1 : order2;
    
    return bid.price >= ask.price;
  }

  private determineMatchPrice(order1: OrderBookEntry, order2: OrderBookEntry): number {
    // Use the price of the earlier order (time priority)
    return order1.created_at <= order2.created_at ? order1.price : order2.price;
  }

  private async executeMath(
    order1: OrderBookEntry,
    order2: OrderBookEntry,
    quantity: number,
    price: number,
  ): Promise<void> {
    // Update both orders
    order1.filled_quantity += quantity;
    order1.remaining_quantity -= quantity;
    order2.filled_quantity += quantity;
    order2.remaining_quantity -= quantity;

    // Update status if fully filled
    if (order1.remaining_quantity === 0) {
      order1.status = OrderStatus.FILLED;
      order1.filled_at = new Date();
      order1.average_fill_price = this.calculateAverageFillPrice(order1, quantity, price);
    } else if (order1.filled_quantity > 0) {
      order1.status = OrderStatus.PARTIALLY_FILLED;
      order1.average_fill_price = this.calculateAverageFillPrice(order1, quantity, price);
    }

    if (order2.remaining_quantity === 0) {
      order2.status = OrderStatus.FILLED;
      order2.filled_at = new Date();
      order2.average_fill_price = this.calculateAverageFillPrice(order2, quantity, price);
    } else if (order2.filled_quantity > 0) {
      order2.status = OrderStatus.PARTIALLY_FILLED;
      order2.average_fill_price = this.calculateAverageFillPrice(order2, quantity, price);
    }

    // Save both orders
    await Promise.all([
      this.orderRepository.save(order1),
      this.orderRepository.save(order2),
    ]);
  }

  private calculateAverageFillPrice(order: OrderBookEntry, newQuantity: number, newPrice: number): number {
    const previousValue = (order.average_fill_price || 0) * (order.filled_quantity - newQuantity);
    const newValue = newQuantity * newPrice;
    return (previousValue + newValue) / order.filled_quantity;
  }

  private async getAggregatedOrders(
    productId: string,
    orderType: OrderType,
  ): Promise<Array<{ price: number; quantity: number; orders: number }>> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('order.price', 'price')
      .addSelect('SUM(order.remaining_quantity)', 'quantity')
      .addSelect('COUNT(*)', 'orders')
      .where('order.product_id = :productId', { productId })
      .andWhere('order.order_type = :orderType', { orderType })
      .andWhere('order.status = :status', { status: OrderStatus.ACTIVE })
      .andWhere('order.remaining_quantity > 0')
      .groupBy('order.price')
      .orderBy('order.price', orderType === OrderType.BID ? 'DESC' : 'ASC')
      .getRawMany();

    return result.map(row => ({
      price: parseFloat(row.price),
      quantity: parseInt(row.quantity),
      orders: parseInt(row.orders),
    }));
  }

  private validateOrder(createOrderDto: CreateOrderDto, product: Product): void {
    if (createOrderDto.quantity <= 0) {
      throw new BadRequestException('Order quantity must be positive');
    }

    if (createOrderDto.price <= 0) {
      throw new BadRequestException('Order price must be positive');
    }

    // Check inventory for ask orders
    if (createOrderDto.order_type === OrderType.ASK) {
      if (createOrderDto.quantity > product.inventory_count) {
        throw new BadRequestException('Insufficient inventory for ask order');
      }
    }

    // Validate reasonable price ranges (e.g., within 50% of base price)
    const minPrice = product.base_price * 0.5;
    const maxPrice = product.base_price * 2.0;
    
    if (createOrderDto.price < minPrice || createOrderDto.price > maxPrice) {
      throw new BadRequestException(
        `Order price must be between $${minPrice.toFixed(2)} and $${maxPrice.toFixed(2)}`
      );
    }
  }

  private async broadcastOrderBookUpdate(productId: string): Promise<void> {
    const orderBook = await this.getOrderBook(productId);
    // this.orderBookGateway.broadcastOrderBook(productId, orderBook);
  }
} 