import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { MarketDepth, OrderMatch } from './order-book.service';

interface ClientSubscription {
  productIds: Set<string>;
  userId?: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/order-book',
})
export class OrderBookGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(OrderBookGateway.name);
  private clientSubscriptions = new Map<string, ClientSubscription>();

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clientSubscriptions.set(client.id, {
      productIds: new Set(),
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clientSubscriptions.delete(client.id);
  }

  @SubscribeMessage('subscribe_product')
  handleSubscribeProduct(
    @MessageBody() data: { productId: string; userId?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const subscription = this.clientSubscriptions.get(client.id);
    if (subscription) {
      subscription.productIds.add(data.productId);
      subscription.userId = data.userId;
      
      // Join the product-specific room
      client.join(`product_${data.productId}`);
      
      this.logger.log(`Client ${client.id} subscribed to product ${data.productId}`);
      
      return {
        success: true,
        message: `Subscribed to product ${data.productId}`,
      };
    }
    
    return {
      success: false,
      message: 'Subscription failed',
    };
  }

  @SubscribeMessage('unsubscribe_product')
  handleUnsubscribeProduct(
    @MessageBody() data: { productId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const subscription = this.clientSubscriptions.get(client.id);
    if (subscription) {
      subscription.productIds.delete(data.productId);
      
      // Leave the product-specific room
      client.leave(`product_${data.productId}`);
      
      this.logger.log(`Client ${client.id} unsubscribed from product ${data.productId}`);
      
      return {
        success: true,
        message: `Unsubscribed from product ${data.productId}`,
      };
    }
    
    return {
      success: false,
      message: 'Unsubscription failed',
    };
  }

  @SubscribeMessage('get_order_book')
  handleGetOrderBook(
    @MessageBody() data: { productId: string },
    @ConnectedSocket() client: Socket,
  ) {
    // This would typically call the OrderBookService to get current data
    // For now, return a placeholder response
    client.emit('order_book_snapshot', {
      productId: data.productId,
      timestamp: new Date().toISOString(),
      bids: [],
      asks: [],
    });
  }

  // Broadcast methods called by OrderBookService
  broadcastOrderBook(productId: string, orderBook: MarketDepth) {
    this.server.to(`product_${productId}`).emit('order_book_update', {
      productId,
      timestamp: new Date().toISOString(),
      ...orderBook,
    });
    
    this.logger.debug(`Broadcasted order book update for product ${productId}`);
  }

  broadcastMatches(productId: string, matches: OrderMatch[]) {
    this.server.to(`product_${productId}`).emit('order_matches', {
      productId,
      timestamp: new Date().toISOString(),
      matches,
    });
    
    this.logger.debug(`Broadcasted ${matches.length} matches for product ${productId}`);
  }

  broadcastTrade(productId: string, trade: {
    price: number;
    quantity: number;
    timestamp: Date;
  }) {
    this.server.to(`product_${productId}`).emit('trade_executed', {
      productId,
      ...trade,
    });
    
    this.logger.debug(`Broadcasted trade for product ${productId}: ${trade.quantity} @ $${trade.price}`);
  }

  broadcastPriceUpdate(productId: string, priceData: {
    lastPrice: number;
    bestBid: number;
    bestAsk: number;
    spread: number;
    change24h: number;
    volume24h: number;
  }) {
    this.server.to(`product_${productId}`).emit('price_update', {
      productId,
      timestamp: new Date().toISOString(),
      ...priceData,
    });
    
    this.logger.debug(`Broadcasted price update for product ${productId}: $${priceData.lastPrice}`);
  }

  // Send private order updates to specific users
  sendOrderUpdate(userId: string, orderData: any) {
    // Find all sockets for this user
    const userSockets = Array.from(this.clientSubscriptions.entries())
      .filter(([socketId, subscription]) => subscription.userId === userId)
      .map(([socketId]) => socketId);

    userSockets.forEach(socketId => {
      this.server.to(socketId).emit('order_update', orderData);
    });
    
    this.logger.debug(`Sent private order update to user ${userId}`);
  }

  // Broadcast market statistics
  broadcastMarketStats(stats: {
    totalProducts: number;
    activeOrders: number;
    totalVolume24h: number;
    topGainers: Array<{ productId: string; change: number }>;
    topLosers: Array<{ productId: string; change: number }>;
  }) {
    this.server.emit('market_stats', {
      timestamp: new Date().toISOString(),
      ...stats,
    });
    
    this.logger.debug('Broadcasted market statistics');
  }

  // Send notifications to specific users
  sendNotification(userId: string, notification: {
    type: 'order_filled' | 'order_cancelled' | 'price_alert' | 'system';
    title: string;
    message: string;
    data?: any;
  }) {
    const userSockets = Array.from(this.clientSubscriptions.entries())
      .filter(([socketId, subscription]) => subscription.userId === userId)
      .map(([socketId]) => socketId);

    userSockets.forEach(socketId => {
      this.server.to(socketId).emit('notification', {
        timestamp: new Date().toISOString(),
        ...notification,
      });
    });
    
    this.logger.debug(`Sent notification to user ${userId}: ${notification.type}`);
  }
} 